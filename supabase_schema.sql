-- =============================================================
-- Advisor Review Board — Supabase schema
-- Paste into: Supabase Dashboard → SQL Editor → New query → Run
-- =============================================================

-- 1. Comments (flat; parent_id gives the tree)
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  advisor_key text not null,                                   -- "<Name>|<University>"
  parent_id   uuid references comments(id) on delete cascade,
  author      text not null default '匿名',
  body        text not null,
  op          boolean not null default false,                  -- self-declared advisor/student
  score       int not null default 0,                          -- denormalized for sort
  created_at  timestamptz not null default now()
);
create index if not exists comments_advisor_idx on comments(advisor_key);
create index if not exists comments_parent_idx  on comments(parent_id);
create index if not exists comments_created_idx on comments(created_at);

-- 2. Votes (one row per browser-voter per comment)
create table if not exists votes (
  voter_id   text not null,                                    -- browser-generated UUID
  comment_id uuid not null references comments(id) on delete cascade,
  dir        smallint not null check (dir in (-1, 1)),
  primary key (voter_id, comment_id)
);

-- 3. Atomic vote RPC: insert/toggle/flip and keep score in sync.
create or replace function cast_vote(p_comment uuid, p_voter text, p_dir smallint)
returns int language plpgsql security definer as $$
declare old_dir smallint; new_score int;
begin
  if p_dir not in (-1, 1) then raise exception 'dir must be -1 or 1'; end if;

  select dir into old_dir from votes where comment_id = p_comment and voter_id = p_voter;

  if old_dir is null then
    insert into votes(comment_id, voter_id, dir) values (p_comment, p_voter, p_dir);
    update comments set score = score + p_dir where id = p_comment returning score into new_score;
  elsif old_dir = p_dir then
    delete from votes where comment_id = p_comment and voter_id = p_voter;
    update comments set score = score - old_dir where id = p_comment returning score into new_score;
  else
    update votes set dir = p_dir where comment_id = p_comment and voter_id = p_voter;
    update comments set score = score - old_dir + p_dir where id = p_comment returning score into new_score;
  end if;

  return new_score;
end $$;

-- 4. Row-Level Security
alter table comments enable row level security;
alter table votes    enable row level security;

-- Anyone can read.
drop policy if exists "comments_read"  on comments;
drop policy if exists "comments_write" on comments;
drop policy if exists "votes_read"     on votes;

create policy "comments_read"  on comments for select using (true);
-- Anyone can insert, but with basic length constraints to deter abuse.
create policy "comments_write" on comments for insert with check (
  length(body) between 1 and 5000 and
  length(author) between 1 and 80 and
  length(advisor_key) between 1 and 200
);
-- No direct updates/deletes from the anon key — use the dashboard for moderation.
create policy "votes_read" on votes for select using (true);
-- Votes are modified only via the cast_vote() RPC; no direct insert/update policy.

-- 5. (Optional) simple reports table so users can flag content
create table if not exists reports (
  id         uuid primary key default gen_random_uuid(),
  comment_id uuid references comments(id) on delete cascade,
  reason     text,
  reporter   text,
  created_at timestamptz not null default now()
);
alter table reports enable row level security;
drop policy if exists "reports_write" on reports;
create policy "reports_write" on reports for insert with check (length(coalesce(reason,'')) <= 1000);

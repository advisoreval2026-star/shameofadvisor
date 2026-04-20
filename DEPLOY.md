# Deploy guide — Advisor Review Board

## Step 1 — Create a Supabase project (5 min, free)

1. Go to https://supabase.com → **Start your project** → sign in with GitHub.
2. **New project**:
   - Name: `advisor-review`
   - Database password: generate & save it (you won't need it for the site, but Supabase requires one)
   - Region: pick one near your users (e.g. `West US` or `Southeast Asia`)
   - Pricing: **Free**
3. Wait ~1 minute for the project to provision.

## Step 2 — Run the schema

1. In the Supabase dashboard, left sidebar → **SQL Editor** → **+ New query**.
2. Open `supabase_schema.sql` from this repo, copy the whole file, paste into the editor.
3. Click **Run**. You should see `Success. No rows returned`.

This creates the `comments`, `votes`, and `reports` tables + the `cast_vote` RPC + RLS policies.

## Step 3 — Grab your project credentials

1. Left sidebar → **Project Settings** (gear icon) → **API**.
2. Copy two values:
   - **Project URL** (e.g. `https://abcdxyz.supabase.co`)
   - **anon / public** key (the long JWT starting with `eyJ…`)
3. These are **safe to expose** in the client — they're protected by the RLS policies you just installed.

## Step 4 — Wire them into the site

```bash
cd advisor_ranking
cp config.example.js config.js
```

Edit `config.js`:

```js
window.SUPABASE_URL      = "https://abcdxyz.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGci...";
```

Open `index.html` locally to sanity-check — you should see a green `☁ Supabase` badge in the toolbar. Post a comment; check the `comments` table in the Supabase dashboard to confirm it landed.

> If you see `💾 Local (per-browser)` instead, your config isn't being loaded. Check the file is named `config.js` (not `.example.js`) and sits in the same folder as `index.html`.

## Step 5 — Push to GitHub & enable Pages

```bash
cd advisor_ranking
git init
git add .
git commit -m "Initial"
gh repo create hallofshameadvisor --public --source=. --remote=origin --push
```

Then: repo → **Settings → Pages** → Source `Deploy from a branch` → branch `main` → folder `/ (root)` → **Save**.

## Step 6 — Custom domain

In repo **Settings → Pages → Custom domain**, enter `hallofshameadvisor.com` → Save.

At your domain registrar's DNS panel add:

```
A     @    185.199.108.153
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  <YOUR-GH-USERNAME>.github.io
```

Wait 5–30 min for SSL cert, then tick **Enforce HTTPS** on the Pages page.

---

## Moderation (what you'll actually need)

Because RLS allows anyone to insert, you **will** get spam/abuse. Options:

1. **Dashboard moderation** — Supabase **Table Editor → comments** → delete rows as needed.
2. **Rate limiting** — in Supabase → **Database → Policies**, you can tighten `comments_write` with `rate_limit_per_ip()` extensions.
3. **Banned-IP list / captcha** — you'd need a Supabase Edge Function in front of inserts. Let me know if you want that wired in.
4. **Reports** — the `reports` table is already in the schema; add a UI button later to let users flag content.

### Emergency: wipe all comments for one advisor
```sql
delete from comments where advisor_key = 'Yufei Ding|UCSD';
```

### See top-posted advisors
```sql
select advisor_key, count(*) from comments group by 1 order by 2 desc limit 20;
```

---

## Rollback to local-only

Delete `config.js` (or rename it) and reload — the site falls back to localStorage mode with a `💾 Local` badge. Your Supabase data is untouched.

---

## What you still need before going live

- [ ] A privacy policy + terms (claims are UGC, unverified)
- [ ] A DMCA/takedown contact email linked from the footer
- [ ] Decide whether to require login (Supabase Auth is a 20-line addition if you want GitHub/Google OAuth)
- [ ] Domain WHOIS privacy enabled at your registrar
- [ ] Rate-limiting before the URL circulates (anon posting = spam magnet)

Ask if you want help with any of the above.

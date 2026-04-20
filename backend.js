/* =============================================================
 * Storage backend for Advisor Review Board.
 *
 * Exports a single global `Storage` with an async API:
 *   Storage.mode                           — "supabase" | "local"
 *   Storage.getVoterId()                   — stable per-browser UUID
 *   Storage.loadThread(advisorKey)         — Promise<Comment[]> (tree)
 *   Storage.loadCounts()                   — Promise<{ [advisorKey]: number }>
 *   Storage.addComment(advisorKey, { author, body, op, parentId }) — Promise<void>
 *   Storage.castVote(advisorKey, commentId, dir)  dir ∈ {1,-1}   — Promise<void>
 *   Storage.getMyVote(commentId)           — 1 | -1 | null       (local cache)
 *
 * If window.SUPABASE_URL + SUPABASE_ANON_KEY are present, Supabase is used;
 * otherwise everything is stored in localStorage (per-browser only).
 * ============================================================= */
(function () {
  const LS = {
    COMMENTS: "advisor_comments_v2",
    VOTES:    "advisor_votes_v2",
    VOTER:    "advisor_voter_id"
  };

  function loadJSON(k, f) { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(f)); } catch { return f; } }
  function saveJSON(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  function getVoterId() {
    let id = localStorage.getItem(LS.VOTER);
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) ||
           (Math.random().toString(36).slice(2) + Date.now().toString(36));
      localStorage.setItem(LS.VOTER, id);
    }
    return id;
  }

  function newId() { return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4); }

  /* ---------- LOCAL backend (per-browser, no network) ---------- */
  function buildLocalStorage() {
    function getAll()  { return loadJSON(LS.COMMENTS, {}); }
    function saveAll(c){ saveJSON(LS.COMMENTS, c); }
    function getVotes(){ return loadJSON(LS.VOTES, {}); }
    function saveVotes(v){ saveJSON(LS.VOTES, v); }

    function countTree(nodes) { let n = 0; for (const c of nodes||[]) n += 1 + countTree(c.replies); return n; }

    async function loadThread(key) {
      return getAll()[key] || [];
    }
    async function loadCounts() {
      const all = getAll(); const out = {};
      for (const k of Object.keys(all)) out[k] = countTree(all[k]);
      return out;
    }
    function findAndModify(list, id, fn) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) { fn(list, i); return true; }
        if (list[i].replies && findAndModify(list[i].replies, id, fn)) return true;
      }
      return false;
    }
    async function addComment(key, { author, body, op, parentId }) {
      const all = getAll(); all[key] = all[key] || [];
      const node = { id: newId(), author: author || "匿名", body, ts: Date.now(),
                     op: !!op, up: 0, down: 0, score: 0, replies: [] };
      if (!parentId) all[key].unshift(node);
      else findAndModify(all[key], parentId, (list, i) => { list[i].replies = list[i].replies || []; list[i].replies.push(node); });
      saveAll(all);
    }
    async function castVote(key, commentId, dir) {
      const all = getAll(); const votes = getVotes();
      const vkey = `${key}::${commentId}`;
      const prev = votes[vkey] || 0;
      findAndModify(all[key] || [], commentId, (list, i) => {
        const c = list[i];
        let next = dir;
        if (prev === dir) next = 0;           // toggle off
        c.score = (c.score || 0) - prev + next;
        if (next === 0) delete votes[vkey]; else votes[vkey] = next;
      });
      saveAll(all); saveVotes(votes);
    }
    function getMyVote(commentId) {
      // local mode: we need the current key; but openModal sets it on Storage. Fallback: scan.
      const v = getVotes();
      for (const k of Object.keys(v)) if (k.endsWith("::" + commentId)) return v[k];
      return 0;
    }

    return { mode: "local", getVoterId, loadThread, loadCounts, addComment, castVote, getMyVote };
  }

  /* ---------- SUPABASE backend ---------- */
  async function buildSupabaseStorage(url, key) {
    if (!window.supabase || !window.supabase.createClient) {
      throw new Error("supabase-js library not loaded. Add <script src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'></script> before backend.js.");
    }
    const sb = window.supabase.createClient(url, key, { auth: { persistSession: false } });

    // Cache of my votes per comment_id (so UI can highlight arrows).
    const myVotes = new Map();
    // Prime myVotes on first call (lazy by advisor).
    const primed = new Set();

    async function primeVotesForAdvisor(advisorKey) {
      if (primed.has(advisorKey)) return;
      const { data, error } = await sb.rpc('exec_noop').catch(() => ({ data: null, error: null }));
      // The RPC above is a no-op fallback; we actually just query the votes table filtered via join.
      // Simpler: fetch all vote rows for this voter and all comments on this advisor.
      const { data: cmts } = await sb.from('comments').select('id').eq('advisor_key', advisorKey);
      if (!cmts || !cmts.length) { primed.add(advisorKey); return; }
      const ids = cmts.map(c => c.id);
      const { data: vs } = await sb.from('votes').select('comment_id, dir')
        .eq('voter_id', getVoterId())
        .in('comment_id', ids);
      (vs || []).forEach(v => myVotes.set(v.comment_id, v.dir));
      primed.add(advisorKey);
    }

    function buildTree(rows) {
      const byId = new Map(); const roots = [];
      rows.forEach(r => { r.replies = []; byId.set(r.id, r); });
      rows.forEach(r => {
        if (r.parent_id && byId.has(r.parent_id)) byId.get(r.parent_id).replies.push(r);
        else if (!r.parent_id) roots.push(r);
      });
      // Sort roots by created_at desc, replies by created_at asc
      roots.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
      function sortReplies(n) { n.replies.sort((a,b) => new Date(a.created_at) - new Date(b.created_at)); n.replies.forEach(sortReplies); }
      roots.forEach(sortReplies);
      // Normalize field names expected by UI
      function normalize(n) {
        n.ts = new Date(n.created_at).getTime();
        n.replies.forEach(normalize);
      }
      roots.forEach(normalize);
      return roots;
    }

    async function loadThread(advisorKey) {
      await primeVotesForAdvisor(advisorKey);
      const { data, error } = await sb.from('comments').select('*').eq('advisor_key', advisorKey);
      if (error) { console.error(error); return []; }
      return buildTree(data || []);
    }

    async function loadCounts() {
      // One round trip: fetch all advisor_keys & group by (small table assumed).
      const { data, error } = await sb.from('comments').select('advisor_key');
      if (error) { console.error(error); return {}; }
      const out = {};
      (data || []).forEach(r => { out[r.advisor_key] = (out[r.advisor_key] || 0) + 1; });
      return out;
    }

    async function addComment(advisorKey, { author, body, op, parentId }) {
      const row = {
        advisor_key: advisorKey,
        parent_id: parentId || null,
        author: (author || "匿名").slice(0, 80),
        body: body.slice(0, 5000),
        op: !!op
      };
      const { error } = await sb.from('comments').insert(row);
      if (error) throw error;
    }

    async function castVote(advisorKey, commentId, dir) {
      const { error } = await sb.rpc('cast_vote', {
        p_comment: commentId,
        p_voter: getVoterId(),
        p_dir: dir
      });
      if (error) throw error;
      // Update local cache to match server logic.
      const prev = myVotes.get(commentId) || 0;
      let next = dir;
      if (prev === dir) next = 0;
      if (next === 0) myVotes.delete(commentId); else myVotes.set(commentId, next);
    }

    function getMyVote(commentId) {
      return myVotes.get(commentId) || 0;
    }

    return { mode: "supabase", getVoterId, loadThread, loadCounts, addComment, castVote, getMyVote };
  }

  /* ---------- Bootstrap ---------- */
  async function init() {
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && !/YOUR-PROJECT/.test(window.SUPABASE_URL)) {
      try {
        window.Storage = await buildSupabaseStorage(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
        console.log("[advisor] backend: Supabase");
        return;
      } catch (e) {
        console.warn("[advisor] Supabase init failed, falling back to local:", e);
      }
    }
    window.Storage = buildLocalStorage();
    console.log("[advisor] backend: local (per-browser)");
  }

  window.__advisorReady = init();
})();

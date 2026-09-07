# Supabase Backend for Posts Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dead `dev.codeleap.co.uk/careers/` API with a Supabase-backed implementation of `server/api.ts`, so the posts feed (list/create/edit/delete) works again, with no changes required to any component or page.

**Architecture:** A new `server/supabaseClient.ts` creates a single Supabase client from two Vite env vars. `server/api.ts` is rewritten to implement `getPosts`/`createPost`/`updatePost`/`deletePost` against a `posts` table via that client, keeping the exact same function signatures and return shapes the app already calls.

**Tech Stack:** Vite + React + TypeScript (existing), `@supabase/supabase-js` (new dependency), Supabase Postgres + PostgREST (external, project ref `cbgtqhutozoemjlezbfe`).

---

## Prerequisites (manual, one-time, done by the user — not part of the tasks below)

1. Supabase project created: `https://cbgtqhutozoemjlezbfe.supabase.co`.
2. The following SQL run in that project's SQL Editor (creates the `posts` table with fully open policies, per the approved design spec `docs/superpowers/specs/2026-09-03-supabase-backend-design.md`):

```sql
create table posts (
  id bigint generated always as identity primary key,
  username text not null,
  title text not null,
  content text not null,
  created_datetime timestamptz not null default now()
);

alter table posts enable row level security;
create policy "public read"   on posts for select using (true);
create policy "public insert" on posts for insert with check (true);
create policy "public update" on posts for update using (true);
create policy "public delete" on posts for delete using (true);
```

Task 1, Step 1 below verifies this was done before any code changes are made.

---

### Task 1: Verify Supabase table is reachable

**Files:** none (verification only)

- [ ] **Step 1: Confirm the `posts` table exists and is queryable via REST**

Run (uses the anon key already shared for this project):

```bash
curl -s -o /dev/null -w "HTTP_STATUS:%{http_code}\n" "https://cbgtqhutozoemjlezbfe.supabase.co/rest/v1/posts?select=*" -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZ3RxaHV0b3pvZW1qbGV6YmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MjIwMzMsImV4cCI6MjEwNDA5ODAzM30.8EtPc3rfQQzL6sdVy3jIhCbT_3Gbp9NSLZfRypVMioE"
```

Expected: `HTTP_STATUS:200` (an empty table still returns 200 with `[]`, not 404).

If it returns `404`: the SQL from the Prerequisites section has not been run yet in the Supabase SQL Editor — stop and run it before continuing.

If it returns `401`/`403`: the RLS policies from the Prerequisites SQL are missing — re-run that SQL.

---

### Task 2: Add the Supabase client dependency and env files

**Files:**
- Modify: `package.json` (via `yarn add`)
- Create: `.env.local` (gitignored — matches existing `*.local` glob in `.gitignore`)
- Create: `.env.example`

- [ ] **Step 1: Install the Supabase client**

```bash
yarn add @supabase/supabase-js
```

Expected: `package.json` gains `@supabase/supabase-js` under `dependencies`, `yarn.lock` updates, command exits 0.

- [ ] **Step 2: Create `.env.local` with the real project credentials**

File: `.env.local`

```
VITE_SUPABASE_URL=https://cbgtqhutozoemjlezbfe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNiZ3RxaHV0b3pvZW1qbGV6YmZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MjIwMzMsImV4cCI6MjEwNDA5ODAzM30.8EtPc3rfQQzL6sdVy3jIhCbT_3Gbp9NSLZfRypVMioE
```

- [ ] **Step 3: Confirm `.env.local` is ignored by git**

```bash
git check-ignore -v .env.local
```

Expected: prints a match against the `*.local` line in `.gitignore` (exit code 0). If it prints nothing (exit code 1), stop — do not proceed until this file is confirmed ignored, since it holds a real (if low-privilege) API key.

- [ ] **Step 4: Create `.env.example`**

File: `.env.example`

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- [ ] **Step 5: Commit**

```bash
git add package.json yarn.lock .env.example
git commit -m "Add Supabase client dependency and env template"
```

(`.env.local` is intentionally not staged — it's gitignored and holds real credentials.)

---

### Task 3: Create the Supabase client module

**Files:**
- Create: `server/supabaseClient.ts`

- [ ] **Step 1: Write the client module**

File: `server/supabaseClient.ts`

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 2: Type-check**

```bash
npx tsc -b
```

Expected: exits 0, no errors. (`import.meta.env` is typed via the ambient `vite/client` types already listed in `tsconfig.app.json`'s `"types"` array, so no new type declarations are needed.)

- [ ] **Step 3: Commit**

```bash
git add server/supabaseClient.ts
git commit -m "Add Supabase client module"
```

---

### Task 4: Rewrite `server/api.ts` to use Supabase

**Files:**
- Modify: `server/api.ts` (full rewrite of its contents)

- [ ] **Step 1: Replace the file contents**

File: `server/api.ts`

```ts
import { supabase } from "./supabaseClient";

export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_datetime", { ascending: false });

  if (error) throw new Error(error.message);

  return { results: data };
};

export const createPost = async (
  username: string,
  title: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from("posts")
    .insert({ username, title, content })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const updatePost = async (
  id: number,
  title: string,
  content: string,
) => {
  const { data, error } = await supabase
    .from("posts")
    .update({ title, content })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const deletePost = async (id: number) => {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  return !error;
};
```

This keeps the exact function names, parameter lists, and return shapes `src/pages/home.tsx` already relies on (`data.results` in `getPosts`, a single post object from `createPost`, a boolean from `deletePost`), so no caller changes are needed.

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc -b
npm run lint
```

Expected: both exit 0 with no errors.

- [ ] **Step 3: Commit**

```bash
git add server/api.ts
git commit -m "Replace dead CodeLeap API with Supabase in server/api.ts"
```

---

### Task 5: Manual verification against the real backend

**Files:** none (manual browser verification)

- [ ] **Step 1: Start the dev server**

```bash
yarn dev
```

- [ ] **Step 2: Verify the full CRUD flow in the browser**

Open the printed local URL and, in order:
1. Load the home page — the feed should load with no posts (empty state) and no console errors about failed fetches to `dev.codeleap.co.uk`.
2. Create a post (title + content) — it should appear at the top of the feed immediately, and the Create button should show its loading spinner briefly while the request is in flight.
3. Refresh the page — the created post should still be there (proves it's persisted in Supabase, not just local state).
4. Edit the post — save the change, confirm it updates in the list.
5. Refresh again — confirm the edit persisted.
6. Delete the post — confirm it disappears and stays gone after another refresh.

Expected: all six steps behave as described, with no errors in the browser console.

- [ ] **Step 3: Production build check**

```bash
yarn build
```

Expected: exits 0 (mirrors what Vercel runs).

---

### Task 6: Configure Vercel and deploy

**Files:** none (Vercel dashboard configuration)

- [ ] **Step 1: Add the environment variables in the Vercel project dashboard**

In the Vercel project's Settings → Environment Variables, add for the Production (and Preview, if used) environment:
- `VITE_SUPABASE_URL` = `https://cbgtqhutozoemjlezbfe.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = (the same anon key used in `.env.local`)

- [ ] **Step 2: Push and confirm the deploy**

```bash
git push
```

Expected: Vercel picks up the push, builds successfully, and the deployed URL shows a working feed — repeat the same manual checks from Task 5, Step 2 against the live URL.

---

## Self-review notes

- Spec coverage: every section of `docs/superpowers/specs/2026-09-03-supabase-backend-design.md` (architecture, data model, data flow, error handling, config, testing) maps to a task above (Tasks 2–3 = architecture/config, Task 4 = data flow/error handling, Task 1 = data model verification, Task 5 = testing, Task 6 = deployment).
- No placeholders: every code step above is complete, runnable code — nothing marked TBD.
- Type/signature consistency: `getPosts`/`createPost`/`updatePost`/`deletePost` names and shapes in Task 4 match what `src/pages/home.tsx` already calls (verified against the current file during design).

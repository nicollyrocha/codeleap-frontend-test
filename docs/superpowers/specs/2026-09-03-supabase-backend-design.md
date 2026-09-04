# Supabase backend for the posts feed

## Context

This project depends on a public third-party test API (`https://dev.codeleap.co.uk/careers/`) for CRUD on posts. That API has been decommissioned: it now returns 404, and Django's own debug page confirms the `careers/` route no longer exists in the backend's URL configuration (a renamed `crudexample/` route exists but requires authentication we don't have).

Since the deployed app depends entirely on this endpoint for its feed (list/create/edit/delete posts), the app is broken on Vercel with no code-level fix possible against the old API. This spec replaces the dead API with a self-managed Supabase backend, keeping the rest of the app unchanged.

## Goals

- Restore full CRUD functionality for the posts feed (list, create, edit, delete) using Supabase as the data store.
- Keep the change isolated to the API layer — no changes to components, pages, or the `Post` type.
- Keep the same non-goals as the original app: no real authentication (username is a local-only convention, exactly as before), likes remain client-side only (not persisted).

## Non-goals

- No RLS enforcement of "only the owning username can edit/delete" — matches the original API's behavior (also had no such enforcement). Table policies are fully open.
- No persistence of likes.
- No new error-surfacing UI (toasts/banners). Errors are thrown from the API layer so they aren't silently swallowed, but no new UI is added to display them.

## Architecture

The existing module `server/api.ts` is the sole integration point used by `src/pages/home.tsx`. It exports four functions: `getPosts`, `createPost`, `updatePost`, `deletePost`. These signatures and return shapes stay the same so no caller needs to change:

- `getPosts()` → `Promise<{ results: Post[] }>`
- `createPost(username, title, content)` → `Promise<Post>` (the created row)
- `updatePost(id, title, content)` → `Promise<Post>` (the updated row)
- `deletePost(id)` → `Promise<boolean>`

A new module `server/supabaseClient.ts` creates and exports a single Supabase client instance, configured from two Vite env vars:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

`server/api.ts` is rewritten to use this client (`@supabase/supabase-js`) instead of `fetch` against `dev.codeleap.co.uk`.

## Data model

Supabase table `posts`, mirroring the existing `Post` type (`src/types/post.ts`):

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

This SQL is run once by the user in the Supabase SQL editor as part of project setup (outside the scope of code changes in this repo).

## Data flow

- **List**: `getPosts()` runs `select('*').order('created_datetime', { ascending: false })` and returns `{ results: data }`.
- **Create**: `createPost(username, title, content)` runs `insert({ username, title, content }).select().single()` and returns the inserted row.
- **Update**: `updatePost(id, title, content)` runs `update({ title, content }).eq('id', id)`.
- **Delete**: `deletePost(id)` runs `delete().eq('id', id)` and returns `true` on success, `false` if Supabase reports an error.

## Error handling

Each function checks the `error` field Supabase returns and throws (`throw new Error(error.message)`) instead of silently continuing. This ensures failures surface (at minimum, to the console and to already-existing loading-state resets in `home.tsx`, e.g. the `finally` block added around `handleCreatePost`) rather than failing silently as the previous implementation did.

## Configuration / environment

- Local dev: `.env.local` (gitignored) holding `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. A `.env.example` is added to the repo documenting the required variable names without values.
- Production: the same two variables are added to the Vercel project's Environment Variables settings, then the project is redeployed.

## Testing / verification

1. `yarn build` (`tsc -b && vite build`) passes with no type errors.
2. `yarn lint` passes.
3. Manual verification in the browser (`yarn dev`): create a post, confirm it appears; refresh, confirm it persists; edit a post, confirm changes persist after refresh; delete a post, confirm it's removed and stays removed after refresh.
4. After deploying to Vercel with the env vars set, repeat step 3 against the live URL.

## Out of scope / follow-ups (not part of this change)

- Persisting likes.
- Enforcing per-username edit/delete permissions server-side.
- User-facing error UI (toasts/banners) for failed requests.

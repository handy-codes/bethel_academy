# Clerk Authentication Flow – Bethel Academy

This document describes how authentication with Clerk is set up in this project: which routes are public, which are protected, and how role-based access is enforced.

---

## 1. Overview

- **Auth provider:** [Clerk](https://clerk.com) (`@clerk/nextjs`).
- **App shell:** Root layout wraps the app in `ClerkProvider` so all pages and API routes can use Clerk.
- **Protection layers:**
  1. **Middleware** – route-level public vs protected and (when enabled) role-based redirects.
  2. **Layouts** – dashboard layouts (`/admin`, `/student`, `/lecturer`) enforce “signed in” and (for admin) role.
  3. **API routes** – some routes use `auth()` and return 401 when unauthenticated.
- **Roles:** Stored in Clerk `publicMetadata.role` (and sometimes `privateMetadata`). Values: `admin`, `student`, `lecturer`, `parent`. Role can be synced/fixed via `/api/fix-role` and admin user-creation/sync flows.

---

## 2. Root Setup

### 2.1 `app/layout.tsx`

- Wraps the app in `<ClerkProvider>`.
- All pages and API routes run under Clerk’s context.

### 2.2 `app/components/LayoutWrapper.tsx`

- Wraps `children` and decides **UI only** (navbar/footer), not auth:
  - **Auth routes** (`/sign-in`, `/sign-up`): no navbar, no footer; only `RoleSync` + children.
  - **Dashboard routes** (`/admin`, `/student`, `/lecturer`, `/parent`): navbar (with dashboard-specific props), no footer, plus `RoleSync`.
  - **All other routes** (e.g. `/`, `/college`, `/tutorials`): navbar + footer + `RoleSync`.

So “public” in this file means “which layout to show,” not “who can access the route.” Access control is in middleware and layouts.

---

## 3. Middleware – Public vs Protected Routes

**File:** `middleware.ts` (project root)

### 3.1 Route matchers

- **Public (no sign-in required):**
  - `/`
  - `/college`, `/tutorials`, `/tech`, `/externals`
  - `/sign-in(.*)` (e.g. `/sign-in`, `/sign-in/factor-one`)
  - `/sign-up(.*)`

- **Protected by path (require sign-in when middleware is active):**
  - `/admin(.*)`
  - `/student(.*)`
  - `/lecturer(.*)`
  - `/parent(.*)`

Anything not matching the public matcher is treated as protected when the middleware runs.

### 3.2 Current behavior (important)

The middleware **currently returns early** and skips all protection and role logic:

```ts
// TEMPORARILY DISABLE ALL MIDDLEWARE PROTECTION FOR TESTING
return;
```

So **at the moment:**

- No route is actually protected or redirected by middleware.
- All protection is done in **layouts** and **API routes**.

### 3.3 Intended behavior (when the early `return` is removed)

1. **Non-public routes:** Call `auth().protect()` so unauthenticated users are redirected to sign-in (per Clerk config).
2. **If user is signed in:** Read role from `auth().sessionClaims` (e.g. `publicMetadata.role`) and:
   - **Role-based access:** If the path is `/admin/*`, `/student/*`, `/lecturer/*`, or `/parent/*`, redirect to the correct dashboard when the role doesn’t match (e.g. student on `/admin` → `/student`).
   - **Root redirect:** On `/`, redirect to the dashboard for that role (`/admin`, `/lecturer`, `/student`, or `/parent`).

So when re-enabled, the middleware will:

- Enforce “signed in” on all non-public routes.
- Enforce “correct role” on dashboard paths.
- Redirect signed-in users from `/` to their dashboard.

---

## 4. Sign-in and Sign-up (public)

- **Sign-in:** `app/(auth)/sign-in/[[...sign-in]]/page.tsx`  
  - Renders Clerk’s `<SignIn />` with `fallbackRedirectUrl="/"` and custom appearance (logo, colors).
- **Sign-up:** `app/(auth)/sign-up/[[...sign-up]]/page.tsx`  
  - Renders Clerk’s `<SignUp />` with `fallbackRedirectUrl="/"`.

These paths are in the middleware’s **public** list, so they are accessible without being signed in. Redirects after sign-in/sign-up are controlled by Clerk env vars (e.g. `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`).

---

## 5. Dashboard Layouts – Who Can See What

Each dashboard segment has a layout that runs **after** the request gets past middleware (when middleware is enabled). These layouts add a second layer: “must be signed in” and, for admin, “must be admin.”

### 5.1 Admin – `app/admin/layout.tsx`

- Uses `useUser()` from Clerk.
- **Not loaded:** Shows a loading spinner.
- **No user:** Redirects to `/sign-in`.
- **User exists but `publicMetadata.role !== 'admin'`:**
  - Redirects: `student` → `/student`, `lecturer` → `/lecturer`, otherwise → `/`.
- **Admin role:** Renders sidebar + children (admin dashboard pages).

So `/admin/*` is **protected and admin-only** at the layout level.

### 5.2 Student – `app/student/layout.tsx`

- Uses `useUser()`.
- **Not loaded:** Loading spinner.
- **No user:** Redirects to `/sign-in` and shows “Redirecting...” (no role check).
- **User exists:** Renders sidebar + children.

So `/student/*` is **protected** (must be signed in) but **not** restricted by role in the layout (any signed-in user can reach it unless middleware is re-enabled to enforce role).

### 5.3 Lecturer – `app/lecturer/layout.tsx`

- Same pattern as student: redirect to `/sign-in` if no user; no role check in layout.
- **Protected:** yes (must be signed in). **Role:** only enforced when middleware role logic is on.

### 5.4 Parent – `app/parent/layout.tsx`

- **Does not use Clerk.** Only handles sidebar toggle and layout.
- So **parent route protection** currently relies on:
  - Middleware (when re-enabled) for “signed in” + “parent” role, and/or
  - The fact that `/api/parent/dashboard` and `/api/parent/results` require auth (see below). If a non-parent hits the parent UI, they’ll get errors from the API.

So parent pages are **not** protected by a layout auth check; they depend on middleware and API auth.

---

## 6. Role Sync and “Fix role”

### 6.1 `app/components/RoleSync.tsx`

- Client component; runs when a user is signed in.
- If the user has **no role** or role is empty or `"student"`, it calls `POST /api/fix-role` once (guarded by a ref so it doesn’t run repeatedly).
- If the API responds with `updated: true`, it reloads the page so the new role is reflected (e.g. in navbar and layouts).

This helps when a user is created in Clerk without a role or when a parent is in the DB but not yet marked as `parent` in Clerk.

### 6.2 `app/api/fix-role/route.ts`

- **Auth:** Uses `auth()`; returns 401 if no `userId`.
- **Logic:**
  - Loads Clerk user and primary email.
  - If the user exists in the **Parent** table (by email), sets Clerk `publicMetadata.role` and `privateMetadata.role` to `'parent'`.
  - Otherwise, derives role from email (e.g. emails containing “admin” or certain allowlisted emails → `admin`; “lecturer”/“teacher” → `lecturer`; else `student`) and updates Clerk metadata.
- Used by `RoleSync` to align Clerk role with DB and email rules.

---

## 7. API Routes – Which Use Auth

| Route | Auth | Notes |
|-------|------|--------|
| `GET /api/parent/dashboard` | Yes | `auth()`; 401 if no `userId`. Uses Clerk user email to find Parent in DB. |
| `GET /api/parent/results` | Yes | Same pattern: `auth()`, 401, then Clerk user → email → Parent. |
| `POST /api/fix-role` | Yes | `auth()`; 401 if no `userId`. Updates current user’s role in Clerk. |
| `POST /api/admin/create-user` | No | Creates/updates user in Clerk and DB. No `auth()` check in route. |
| `POST /api/admin/users/sync-from-clerk` | No | Syncs Clerk users to DB. No `auth()` check. |
| `POST /api/admin/update-role` | No | Expects `userId` in body; updates that user’s role in Clerk. No `auth()` check. |

So:

- **Protected APIs:** parent dashboard/results and fix-role (all require a signed-in user).
- **Admin APIs (create-user, sync-from-clerk, update-role):** no Clerk auth in the route; if you need to restrict them to admins, that would need to be added (e.g. `auth()` + check `publicMetadata.role === 'admin'`).

---

## 8. Navbar – Signed-in vs Public

**File:** `app/components/Navbar.tsx`

- Uses `useUser()` to know if someone is signed in.
- **Signed out:** Shows “Login” linking to `/sign-in`.
- **Signed in:** Shows Clerk `UserButton` (with `afterSignOutUrl="/"`) and, based on `user.publicMetadata.role`, one of:
  - “Admin Dashboard” → `/admin`
  - “Student Dashboard” → `/student`
  - “Lecturer Dashboard” → `/lecturer`
  - “Parent Dashboard” → `/parent`

So the navbar doesn’t enforce access; it only shows the right link for the current user’s role.

---

## 9. Step-by-step Flow Summary

### 9.1 Anonymous user visits the site

1. **Public path** (e.g. `/`, `/college`, `/tutorials`, `/sign-in`, `/sign-up`):  
   Middleware (when enabled) does nothing for public routes. User sees the page. For `/sign-in` or `/sign-up`, they can sign in/up via Clerk.

2. **Protected path** (e.g. `/admin`, `/student`):  
   With middleware disabled (current state), the request reaches the app. Dashboard layouts run:
   - **Admin:** No user → redirect to `/sign-in`.
   - **Student/Lecturer:** No user → redirect to `/sign-in`.
   - **Parent:** No layout check; page may load but parent APIs will return 401 if not signed in.

### 9.2 User signs in (e.g. via `/sign-in`)

1. Clerk handles sign-in and sets session.
2. Redirect is per Clerk config (e.g. `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`), often `/`.
3. `RoleSync` may run and call `POST /api/fix-role`; if role was missing/wrong, Clerk metadata is updated and the page reloads.
4. Navbar shows the dashboard link for their role (admin/student/lecturer/parent).

### 9.3 Signed-in user opens a dashboard

1. **Admin:** Layout ensures user exists and `role === 'admin'`; otherwise redirects to `/sign-in` or the right dashboard/`/`.
2. **Student/Lecturer:** Layout ensures user exists; otherwise redirects to `/sign-in`. No role check in layout (middleware would enforce role when re-enabled).
3. **Parent:** Layout does not check auth; middleware (when on) and parent APIs enforce “signed in” and “parent” data.

### 9.4 Calling protected APIs

- **Parent dashboard/results:** Request must include Clerk session. `auth()` returns `userId`; then route uses Clerk + DB. No `userId` → 401.
- **Fix-role:** Same: must be signed in; 401 otherwise.

---

## 10. Environment variables (Clerk)

Typical env vars (see README and `.env.example` if present):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/`

These control where Clerk sends users for sign-in, sign-up, and after auth.

---

## 11. Summary table

| Area | Public | Protected | Role-enforced |
|------|--------|-----------|----------------|
| Middleware | `/`, `/college`, `/tutorials`, `/tech`, `/externals`, `/sign-in(.*)`, `/sign-up(.*)` | All other routes (when middleware not disabled) | `/admin`, `/student`, `/lecturer`, `/parent` (when middleware is on) |
| Admin layout | — | `/admin/*` (must be signed in) | Yes: only `role === 'admin'` |
| Student layout | — | `/student/*` (must be signed in) | No (intended in middleware when on) |
| Lecturer layout | — | `/lecturer/*` (must be signed in) | No (intended in middleware when on) |
| Parent layout | — | No layout check | No layout check (middleware + API when on) |
| Sign-in / Sign-up | Yes | — | — |
| APIs: parent dashboard/results, fix-role | — | Yes (401 if not signed in) | No (role used only for data) |
| APIs: admin create-user, sync-from-clerk, update-role | — | No auth in route | No |

**Note:** With the current early `return` in `middleware.ts`, **all** protection is from dashboard layouts and API `auth()` checks. Re-enable the middleware to restore route-level protection and role-based redirects.

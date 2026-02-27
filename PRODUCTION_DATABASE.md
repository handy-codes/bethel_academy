# Production database (Neon) checklist

If **development** works but **production** returns 500/503 on `/api/admin/users` or "Failed to load users" / "Cannot create users":

## "URL must start with postgresql:// or postgres://"

This means **DATABASE_URL** in production is wrong: it's either empty, has extra quotes/spaces, or is not the real connection string.

- In **Vercel:** Project → **Settings** → **Environment Variables**
- **Name:** `DATABASE_URL` (exactly)
- **Value:** Your full Neon URL, e.g. `postgresql://user:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
  - Must start with `postgresql://` or `postgres://`
  - No quotes around the value in the UI (Vercel adds them when needed)
  - No leading/trailing spaces
- Save, then **redeploy** the project.

## 1. Set `DATABASE_URL` in production

- **Vercel:** Project → Settings → Environment Variables  
  Add `DATABASE_URL` with the **same** value as in `.env` (your Neon pooled URL).  
  Apply to **Production** (and Preview if you use it).
- **Other hosts:** Add `DATABASE_URL` to the production environment so the API can connect to Neon.

## 2. Use the pooled connection string

Your URL should look like:

- Host contains **`-pooler`** (e.g. `ep-holy-bar-ahomo9eb-pooler...neon.tech`).
- Query string includes `?sslmode=require`.

Example (replace with your real password):

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
```

## 3. Redeploy after changing env vars

After adding or changing `DATABASE_URL`, redeploy the app so the new value is used.

## 4. Check the real error in production

- Open DevTools → **Network** tab.
- Trigger the failing request (e.g. open Admin → Users).
- Click the red request to **`/api/admin/users`**.
- Open the **Response** tab.

If the body is JSON with an `error` field, that message is from our API (e.g. "DATABASE_URL is not set..." or "Database unreachable..."). Use it to fix:

- **"DATABASE_URL is not set"** → Add the variable in the hosting dashboard and redeploy.
- **"Database unreachable"** → Neon project may be suspended; restore it in [Neon Console](https://console.neon.tech). Ensure the URL is correct and the DB is running.

## 5. Neon project not suspended

In [Neon Console](https://console.neon.tech), open your project. If it shows as **Suspended**, click **Restore** so production can connect again.

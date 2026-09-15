# Convex Auth environment variables

Sign-in runs on the Convex deployment, not in the Next.js files. Pushing `convex/` is not enough. Convex Auth will crash with `Missing environment variable JWT_PRIVATE_KEY` until the three variables below exist **on that Convex**.

Official: [Convex Auth](https://labs.convex.dev/auth). Convex env: [Environment variables](https://docs.convex.dev/production/environment-variables).

## What to set

Set these on the Convex deployment (dashboard → Environment Variables, or `npx convex env set`). Do not put them in Git, in `ACCESS-LIST.md`, or in a chat.

- `JWT_PRIVATE_KEY` — private key used to sign a login session
- `JWKS` — the matching public key
- `SITE_URL` — the website origin for this deployment (local is `http://localhost:3001`)

`CONVEX_URL` / `NEXT_PUBLIC_CONVEX_URL` only tell the website **which** Convex to call. They are not these keys.

## How to set them

From the `ridgeway` repo root, after `npx convex login`, the CLI uses the deployment in root `.env.local` (`CONVEX_DEPLOYMENT`). Confirm that is the **dev** deployment you mean before you write secrets.

Do not run the interactive `npx @convex-dev/auth` wizard from an agent session. It hangs without a TTY.

Generate a key pair with `jose` (already in this repo), then set each value as one argument so a key that starts with `-----BEGIN` is not parsed as a CLI flag:

```bash
npx convex env set "JWT_PRIVATE_KEY=-----BEGIN PRIVATE KEY----- …"
npx convex env set "JWKS={…}"
npx convex env set "SITE_URL=http://localhost:3001"
```

Delete any local file that held the keys (for example `.auth-keys.json`). That filename is gitignored.

`npx convex env list` prints the private key. Do not paste that output into chat or a ticket.

## Local site and Vercel preview

This project’s Vercel preview uses the same Convex **dev** URL as local (`NEXT_PUBLIC_CONVEX_URL`). Once the keys exist on that Convex, email-and-password sign-in works on both. You do not set the keys on Vercel.

`SITE_URL` on this dev Convex is the local site. Email and password do not redirect through `SITE_URL`. Google sign-in (later) will. Do not point this shared `SITE_URL` at a Vercel preview URL that changes on every pull request.

## Last remaining staff lockout

There is no forgot-password email. Staff set a new password on an owner or tenant from those forms ([RIDGE-30](https://linear.app/dm-studios/issue/RIDGE-30/staff-can-set-a-new-password-on-an-existing-owner-or-tenant-login)). Another office person can set a password after [RIDGE-31](https://linear.app/dm-studios/issue/RIDGE-31/staff-can-add-another-office-person).

If the last remaining staff cannot sign in, do not edit `authAccounts` in the Convex dashboard. The stored secret is hashed; typing a plaintext password there will not work. Re-running `seed:run` wipes the development database and writes the seed passwords again.

From the `ridgeway` repo root, after Convex has pushed:

```bash
npx convex run auth:setPassword '{"email":"ama.boateng@ridgeway.gh","password":"…"}'
```

Only someone with Convex access can run this. Do not put the new password in Git, `STATUS.md`, `ACCESS-LIST.md`, or a chat. The website cannot call this action.

## Production

Production Convex is a **different** deployment. When it exists, set `JWT_PRIVATE_KEY`, `JWKS`, and `SITE_URL` there too. `SITE_URL` on production is the stable production website URL, not localhost.

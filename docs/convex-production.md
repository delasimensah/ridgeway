# Production database and preview links

The live website and the preview links can use two different databases in the same Convex project. A deployment is one database plus the code running on it. You already have the dev deployment. Production is a second one. Pushing code does not copy rows from one to the other.

## What each address uses

- Your laptop, every Vercel preview link, and (if this app has a phone) the Expo development and preview builds talk to the **dev** deployment. Demo data stays there.
- The production website, and the production phone build if there is one, talk to the **production** deployment. It starts empty.

Every preview link shares that one dev database. A row you add on your laptop shows up on the preview link. A preview link is not its own copy of the data, and it is not a frozen copy of an old commit.

Vercel and Expo build the app. They do not push `convex/`.

- `yarn dev:backend` updates the dev deployment. Leave it running while you work. If it is stopped, `yarn dev:backend:once` pushes once and exits.
- `yarn deploy:backend` updates production. Do not use it to refresh a preview link.

Root `.env.local` stays pointed at the dev deployment, so daily work keeps the demo data.

## One-time setup

From the repo root, after `npx convex login`.

1. Run `yarn deploy:backend`. The first run creates the production deployment and prints its URL (`https://….convex.cloud`). It pushes the schema and functions only.
2. Do not load the demo onto production. The seed command (often `npx convex run seed:run`) uses the deployment in root `.env.local` unless you pass `--prod`. Do not pass `--prod` on the demo seed. That fills the live database with sample people and sample history.
3. If this app uses Convex Auth, generate a **new** key pair for production. Do not copy the dev private key. From the repo root:

```bash
npx convex env set --prod "JWT_PRIVATE_KEY=…"
npx convex env set --prod "JWKS=…"
npx convex env set --prod "SITE_URL=https://the-production-website"
```

Leave the dev `SITE_URL` as the local website. Do not paste `npx convex env list`. Do not commit the keys. How to generate the pair is in `docs/convex-auth-env.md`.

4. On Vercel, edit the existing **Production** value of `NEXT_PUBLIC_CONVEX_URL` to the new production URL. Leave the **Preview** value on the dev URL. Do not delete the Production row. If this app has a phone, set `EXPO_PUBLIC_CONVEX_URL` on the EAS **production** environment to that same production URL. Leave development and preview on the dev URL.
5. Redeploy the production website. The Convex address is baked in when the site builds, so saving the variable is not enough. A phone binary also has to be built again before it picks up a new URL. An update push cannot change it.
6. Check: a preview link still shows the demo data. The production website talks to the empty database.

A pipeline can run the same production push later. The first time, run it from your machine while you are logged in.

## The first account

Nobody can sign in on an empty production database. If the app also requires a settings row, it refuses to run until that row exists.

Do not point the live site at the dev database so the demo logins keep working. Do not run the demo seed.

Write a one-off command in this repo that creates only the real administrator and any required blank rows. Run it against production:

```bash
npx convex run --prod theFunction:name '{…}'
```

That command must not copy the demo rows. On `ACCESS-LIST.md`, note that auth env is set on the production Convex and that the first account exists. No secret values.

Until that command has been run, the production website cannot be used.

## Each later update

1. Build it locally. Leave `yarn dev:backend` running so the dev deployment stays in step. Localhost and preview links show the new screens on the demo data. A preview link does not push Convex by itself.
2. From the repo root, on the commit you are about to ship, run `yarn deploy:backend`. That updates production code. The live rows stay where they are.
3. Push `main`. The host rebuilds the production website against the production database.
4. Run `yarn deploy:backend` before people open the new website, or in the same sitting. A new screen that calls a function production does not have yet fails until that command finishes.
5. A change that only touches the website needs the website deploy. A change under `convex/` needs both.
6. If a schema change does not fit documents already stored in production, `yarn deploy:backend` stops and production keeps the previous code. You can reseed the dev database. You cannot treat the live database that way.

You know a later update worked when a preview link still has the demo data and the new behaviour, and the production website has the new behaviour with the live rows.

## Usage

Dev and production are two deployments on the same Convex team. Free plan caps are the team total, not one bucket per deployment. From the repo root:

```bash
npx convex deployment usage
npx convex deployment usage --prod
```

See `docs/convex-usage.md`.

## Do not

- Use `yarn deploy:backend` to refresh a preview link.
- Point Preview at the production URL.
- Point root `.env.local` at production.
- Run the demo seed with `--prod`.
- Copy the dev auth keys onto production.
- Delete the Vercel Production env row and leave it empty.

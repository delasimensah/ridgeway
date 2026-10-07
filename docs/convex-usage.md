# Convex usage (Free plan)

How Convex Free resources work across a **team**, what usually burns the budget on demo apps, and how to stay under the caps without upgrading.

Official: [Convex limits](https://docs.convex.dev/production/state/limits), [Convex pricing](https://www.convex.dev/pricing), [Pricing FAQ](https://www.convex.dev/pricing/faq) (usage is the sum of all projects on the team).

**Egress** means bytes leaving Convex when someone (or a function) downloads a stored file. Streaming an MP3 or downloading a large photo from Convex file storage is egress. Uploading a file into Convex is not egress.

---

## Free plan caps that matter for demos

Built-in Free amounts (hard caps; the app can start failing if you stay over). Starter shares the same included amounts but can pay for overages.

- **File data egress:** 1 GB per month (team total)
- **File storage on disk:** 1 GB total (team total)
- **Database storage:** 0.5 GB total (rows and indexes; not files). Each index is priced like another copy of the table.
- **Database I/O:** 1 GB per month
- **Function calls:** 1,000,000 per month (client calls, scheduled runs, subscription updates, and file accesses count)
- **Action compute:** 20 GB-hours per month
- **Deployments:** 40 per team

On rehearsal and portfolio demos, **file data egress is usually the scarce resource** once you store and stream audio or large media from Convex. Function calls and small form/list apps almost never hit the Free call cap at solo scale.

Convex Free is still the right default when you need **many projects**. Many projects do **not** give you many isolated egress buckets — they share one team meter.

---

## How to check usage

From this repo root (after `npx convex login`):

```bash
npx convex deployment usage
```

- That command is **per deployment**. Run it in each Convex project on the team.
- Use `--prod` when you care about the production deployment. Dev and production share this team's Free caps. Opening production, and later updates to it, are in `docs/convex-production.md`.
- Team roll-up: Convex dashboard → team settings / usage.

Also useful:

```bash
npx convex run --inline-query 'const files = await ctx.db.system.query("_storage").collect(); let bytes = 0; for (const f of files) bytes += f.size; return { count: files.length, mb: Math.round(bytes / 1024 / 1024 * 10) / 10 };'
```

That shows **file storage on disk** for this deployment (not the monthly egress meter).

Monthly meters (egress, function calls, database I/O) reset on the **1st of the month (UTC)**. Storage on disk does not reset.

---

## What usually burns the Free plan

1. **Serving media from Convex file storage** — music, voice notes, video, large PDFs. Every play or download counts toward **file data egress**.
2. **Replaying the same file from the network** — without a phone/browser cache, each listen counts again.
3. **Several demos on one team** — heavy media in a sibling project plus this app’s file downloads share the same 1 GB/month egress.
4. **Leaving a player or large download loop running** against cloud Convex overnight.

What usually does **not** trip Free first:

- Reactive queries / `yarn dev` function-call volume at solo scale
- Hundreds of small database rows relative to streaming multi‑MB media
- Light photo uploads for forms unless you also stream them constantly

---

## What to do without upgrading

These stack. Prefer earlier steps before object storage.

### 1. Watch the meter

Check `npx convex deployment usage` before a heavy demo week. Treat **Data egress** as the shared team budget.

### 2. Demo discipline

- Do not leave media downloads running against cloud Convex when you are not testing.
- Prefer short seeks over full plays when checking media UI.
- Prefer one or two media files when testing craft, not binge playback of a whole seed catalog.

### 3. Keep seed media small

- **What:** Shorter clips and/or lower bitrate for unique seed files. Reuse the same blobs across many rows if you need long lists.
- **Where from:** Same licensed sources you already chose for seed.
- **Rights:** Unchanged.
- **How:** Replace assets, regenerate any derived data, wipe + re-seed so Convex holds the smaller blobs.
- **Out:** Deleting filler **rows** to “save egress.” Rows are cheap; **bytes served** are not.

Rule of thumb for frequent demos on Free: keep total unique heavy media well under ~50 MB when you can still prove the product.

### 4. Cache on the client after first fetch

After a successful access-checked URL, keep a local copy so the second fetch does not hit Convex again.

- **Out:** Prefetching an entire catalog (that burns egress up front).

### 5. Move heavy bytes off Convex (escape hatch)

Store large media in object storage you own (for example Cloudflare R2) and return a short-lived URL from the same access-checked Convex function. Keep metadata, entitlements, and small images on Convex if they stay small.

- **Out:** Moving the database or auth off Convex; changing who is allowed to see the file.

### 6. Pause idle deployments

If you are only working on one product this week, pause sibling Convex deployments you are not demoing (confirm in the dashboard). Bring them back before a demo day.

### 7. Do not upgrade solely for demo media

Upgrade when a paying product needs it. For demos, prefer smaller files, client cache, or object storage for heavy bytes. Convex Free remains valuable for **many projects**, not for acting as a CDN.

---

## Related docs in this repo

- `docs/convex-auth-env.md` — Auth env (unrelated to egress; required for sign-in)

---

## This project (Ridgeway)

Ridgeway stores occasional repair photos, not a music catalog. In September 2026 team measurements, Ridgeway’s file egress was about **0.006 GB** for the month — not what tripped Free. Sibling apps that stream audio can still exhaust the **shared** team egress meter and affect this deployment. Check usage here before a heavy week on any project on the same Convex team.

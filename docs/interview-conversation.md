# Talking about Ridgeway in an interview

Read this before an interview where Ridgeway comes up. The first section is the 60-to-90-second version you lead with. The rest is a bank of real questions interviewers ask about a project, each paired with an answer grounded in how Ridgeway is actually built. The last section is the honest-limits list, so you raise the gaps yourself instead of getting caught by them.

What "tell me about a project" is really testing is not the feature list. It's whether you understand the problem, can defend your decisions, know what they cost, and can say what you'd change. Depth beats polish. Property software sounds dull on the surface, so your job is to move the conversation to the part that isn't CRUD. Making sure the wrong person can never see the wrong building, repair, or rent, even when they call the backend directly.

One framing note. This is a portfolio build of a real product shape, with a seeded world of about ten buildings and three owners in Accra. It is not a live firm with real tenants and an on-call rotation. Say that plainly. It reads as honest, not weak.

---

## The opener (60 to 90 seconds)

Ridgeway is operations software for a small property manager. Staff run the office, each owner sees only their own buildings, tenants file repairs and track rent, and caretakers update jobs from a phone.

The real engineering isn't the screens. It's authorization. An owner must never see another owner's buildings or rent. A saved repair must never disappear when it's marked done. And a tenant whose lease has ended can still sign in but can't see the unit they left. Those three rules shape almost every technical decision.

It's one Next.js website serving staff, owners, and tenants. One Expo app serving tenants and caretakers. And one Convex backend that is the database, auth, file storage, and the functions that decide who may see what. One backend was a deliberate choice. If the same permission rule lived in two services, the copy I forgot to update would be the breach.

---

## Questions they actually ask

### "So walk me through the project. What is it and what problem does it solve?"

Ridgeway manages about ten buildings in Accra for three owners. Before software, the office tracked repairs and rent across spreadsheets and WhatsApp, so things landed on the wrong building and owners couldn't see their own numbers without someone exporting a sheet.

So it's one system with four audiences. Staff run the whole portfolio. Each owner sees only their buildings, with occupancy, open repairs, and rent collected versus outstanding. Tenants file a repair, optionally with a photo, and watch it move. Caretakers open the jobs assigned to them and update status on site.

I designed and built all of it. The website, the phone app, the backend, the permission model, and the seed data that makes a demo feel like Accra rather than a tutorial. It's a complete first version with believable data, not a system with production users, and I'd rather state that than imply there's an operations team depending on it.

### "Who are the users, and what can each of them do?"

Four roles. Staff see everything in their organization and do all the data entry. They add a building, unit, owner, tenant, office colleague, or caretaker, correct those fields later, and end a lease when someone moves out. Owners see only their own buildings, read-only, with the money view scoped to them. Tenants see their own unit, their repairs, and their rent, and can report a payment, which is a claim, not a confirmation. Caretakers see the jobs assigned to them and can move status and attach a completion photo, and they never see rent.

### "Draw me the architecture. What talks to what?"

Four audiences, two apps, one backend.

The website is a single Next.js app on Vercel. Staff, owners, and tenants are route sections of the same deployment, sharing sign-in, layout, and components. Three separate sites would have tripled release work and changed nothing about safety, because what a person can open is decided by the backend, not by which URL they hit.

The phone app is a single Expo app serving tenants and caretakers, who see different screens after sign-in, again decided server-side.

Convex is the backend. Database, email-and-password auth via Convex Auth, file storage for photos, and the functions. A screen calls a query to read or a mutation to write. The function first resolves who's calling, then works out what they're allowed to do from the database, not from anything the screen sent, and only then touches rows. Queries stay subscribed, so the repairs list updates live when a colleague changes a ticket, which is exactly the screen people used to chase on WhatsApp. On the client, Zustand holds only session extras like the selected filter. There's no second cache for buildings or tickets.

### "Why one backend instead of Postgres plus an auth service plus storage?"

Because the product is small and the rules that matter are all authorization rules, which are easiest to get right in one place. Ten buildings, three owners, office-hours traffic. I don't need a cache, a queue, read replicas, or a second region, so adding services would add places to get the permission check wrong without buying anything.

The cost is real, and I name it. It's vendor lock-in. If I had to leave, I'd rewrite the functions rather than lift-and-shift them. At this size that's a fair trade. I also keep the design describable in plain cloud terms so it travels. Managed login, document database with indexes, object storage for photos, a scheduler I barely need, static hosting, secrets in environment variables. The one unusual thing is that the database doesn't do row-level filtering, so my functions are the only line of defence, which is why the access model is so deliberate.

### "Why Convex specifically? Why not Firebase, Supabase, or a plain Node API on Postgres?"

I weighed those directly. The deciding factor for Ridgeway is that the whole product is authorization, and Convex lets me write the data access, the permission check, and the transaction in one TypeScript function, with live-updating reads for free.

Take Firebase. Firestore does real-time well, but its security rules are a separate rule language, and my checks aren't simple per-row predicates. They walk a chain from repair to unit to building to owner and compare against the caller's membership. That's awkward in rules and usually ends up in Cloud Functions, at which point you've left the real-time path. One place that's already both suits me better.

Take Supabase. Postgres plus row-level security is actually a strong fit for the owner wall, maybe the strongest alternative here, because "owner sees only their rows" is close to what row-level security is designed for. I didn't pick it because I'd still write a lot of Edge Functions for the transitions and the derived rent logic, and I preferred keeping every access decision in one function layer rather than splitting it between SQL policies and application code, where the two can disagree.

Take plain Node plus Postgres. Most portable, and what I'd choose on a team already running it. The cost solo is that I'd hand-build the live-updating reads, file storage, and the auth wiring that Convex ships. And the live repairs list, where two staff watch the same ticket, is a real feature here, not a nice-to-have.

The downside I own is lock-in, and that it isn't SQL. I keep the model relational in spirit and the access rules in plain TypeScript, so a port is "reimplement these functions," not a rewrite of tangled logic.

### "If you couldn't use Convex, how would you rebuild Ridgeway?"

This one ports cleanly to Postgres, and the owner wall would actually map to row-level security as a second line of defence under the function checks. The tables are already relational. Organizations, owners, buildings, units, leases, work orders, events, rent periods. The access helpers are plain TypeScript, so they move with little change. The live repairs list becomes Postgres logical replication or a small pub/sub. File storage becomes S3 or R2 with signed URLs minted after a permission check. The scheduler, which I barely use, becomes a cron. The invariant I'd carry through untouched is that permission is enforced in the backend, never derived on the client.

### "Why React Native and Expo for the phone app, instead of native or Flutter?"

One codebase, one language, and shared types with the web app and backend, for one developer. The tenant app and the caretaker app are both fairly standard screens. Lists, a form, a status timeline, a photo upload. So I don't need platform-specific craft that would justify two native codebases. Expo adds EAS build and over-the-air updates, so I can push JavaScript fixes without a store round-trip. Flutter is a fine single-codebase alternative, but Dart wouldn't share the types and Zod validation I keep in `packages/shared`, and that sharing is a correctness win when the same rent and status rules run on web, phone, and server.

### "Why Next.js for three different audiences in one app?"

Because staff, owners, and tenants share sign-in, layout, and components, and the difference between them is which data the backend returns, not which framework renders it. Next.js route groups let me keep them as sections of one deployment, so I ship and maintain one site. App Router also gives me server components for the mostly-read dashboards. Three separate apps, or a heavier single-page app, would multiply release work for no safety gain, because the backend is what decides access regardless of which URL loads.

### "What was the hardest or most important modelling decision?"

Tenancy is not a stored role. Whether someone is a tenant right now is answered by looking for a lease that names them and hasn't ended.

The tempting alternative is a "this person is a tenant" row. But then ending a lease means remembering to also remove that row, and the instant those two facts disagree, someone who moved out still sees their old unit, which is the one thing the spec says must never happen. Deriving tenancy from the lease means there's a single fact. Ending a lease writes one date, and access follows. The cost is an indexed lease lookup on every tenant request, which is nothing at this scale, and it deletes an entire category of bug.

Owner access, by contrast, I did store as a role, because it isn't time-bounded or derived from anything. The firm grants it and it stays until they change it. There's no second fact for it to contradict. And I kept the login separate from the person. Convex Auth owns email and password, while our `profiles` table owns display name and phone and points at the login, so if auth changes I rewrite one link and the buildings, leases, and repairs don't move.

### "Be concrete: how do you stop an owner seeing another owner's building if they already have the id?"

The list query doesn't take an owner id as an argument. It resolves the caller and, if they're an owner, returns only buildings whose owner matches the one on their own membership. There's no argument they can pass to widen it.

For a single record, the function walks up the chain. A repair belongs to a unit, a unit to a building, a building names its owner and organization. It loads the record, walks up, and compares against the caller. If it doesn't match, the refusal is identical to "not found," so a "no" doesn't leak that the other building exists.

I split this into two mechanisms on purpose. Resolving who's calling is identical everywhere and catastrophic to forget, so public functions aren't plain Convex queries. They're wrappers in `convex/lib/functions.ts` that resolve the caller first, and a staff-only function is declared with the staff wrapper so the role check is part of the declaration. Deciding whether this caller may touch this specific building differs per function and is the interesting part, so it stays as an explicit check in the body. I rejected leaving both to memory, because a missing identity check doesn't crash. It just answers everyone. I'd rather a broken build than an owner reading another owner's rent. There's a test that signs in as one owner, requests another's building by id, and requires refusal.

### "Tell me about the repair ticket. It sounds like the core."

The status is a stored value with a fixed set of received, assigned, scheduled, and done, plus a transition map in `convex/workOrders.ts`. Received can only go to assigned, assigned to scheduled, scheduled to done, and done nowhere. A tenant creates a ticket at received and can't create it already done.

The move is validated against the database, not against what the screen believed, because a caretaker's phone might have shown a stale screen for ten minutes, and without that read a tap on an old screen could move a ticket backwards. Every move writes a history row in the same transaction as the status change, so either both land or neither does. Nothing deletes a ticket. Finishing it sets status to done, and the list shows open by default with a done filter, because to a worried staff member a hidden record and a deleted one look identical.

Two staff acting at once can't produce two tickets, because mutations are serializable. The second either applies on top of the first or is refused as an illegal move. One ticket stays the record. The ticket also copies its building and organization ids alongside the unit, which is denormalized on purpose so "open repairs in this building" is one indexed read and a permission check on fifty tickets doesn't load fifty buildings. That's safe only because a unit never moves buildings, and I wrote that promise down, so if it ever changes, moving a unit becomes a deliberate migration.

### "Tenants can say they paid. How do you stop that from marking it paid?"

Two different statements, two different fields, two different functions. Staff record what they've confirmed, which is unpaid, partial, or paid. A tenant can only set a "reported a payment" timestamp. I deliberately didn't write one function that takes a status and decides from the caller's role what they may set, because that's where a role check goes wrong quietly. Two narrow functions are easier to read and test, and there's a test that the tenant function can't touch the confirmed field.

"Late" is never stored. It's derived by comparing the due date to today on anything not fully paid, because a stored "late" needs a nightly job, and a nightly job can fail, double-run, or run in the wrong time zone, and when it misbehaves the screen is quietly wrong about money in front of an owner. The comparison uses the server's clock, not the device's. The query returns the backend's current time, and `getRentDisplayStatus` in the shared package takes that time as an argument, so a laptop in another time zone can't decide rent is late. What's stored and what's shown even have different names, `RentConfirmedStatus` versus `RentStatus`, because sharing one name is how a derived value ends up written to the database by accident. And money is stored as whole minor units with the currency beside it, so 1,250.75 cedis is `125075`, not a float that loses a pesewa.

### "Where do the repair photos go, and who can fetch them?"

The browser or phone uploads straight to Convex file storage using a short-lived upload URL the backend only hands out after checking the caller. Then a mutation attaches the file to the work order, which is where I verify this person may add a photo to this ticket. The bytes never pass through my own function.

Here's the honest limitation. Once a storage URL exists, anyone holding it can fetch the bytes, because the URL isn't tied to a logged-in user. So I only mint those URLs inside a query that has already confirmed the caller may see the ticket, and I never put them anywhere shareable. That's fine for a photo of a broken tap. If this ever stored something like identity documents, I'd serve the bytes through a permission-checked function instead.

### "How do you know the rules actually hold?"

The three never-fail rules each have a backend test. The owner wall, the ended lease still blocking unit access while sign-in still works, and a finished ticket still findable with its history intact. Rent has its own. A caretaker can't read it, and a tenant can't set the confirmed field. Those backend tests run in Vitest, because that's what Convex's test tooling expects, while the web and mobile apps stay on Jest. Two runners is a cost I accept rather than converting three working suites for tidiness, and the root script runs both. I also test the screen states people actually hit, which are empty, loading, failed, and not-permitted, with skeletons that stand in only for values still loading while the title, search, and buttons stay real.

### "What breaks first if this firm grew to hundreds of buildings?"

The model holds. The owner wall, lease-derived tenancy, and the repair transitions don't change. The first pressure is the lists that grow forever, repairs and rent periods, which are already paginated and indexed, because retrofitting pagination after screens assume they get everything is painful. The next is any report that sums rent across many buildings, which today is computed on read. At real scale I'd maintain a running total updated when a period is confirmed, trading a cheap extra write for a cheap read. I wouldn't add a cache or split services because a slide said "scale." I'd do it when a measured read was actually slow.

### "What did you deliberately leave out?"

No public listings site, no connection to a marketing site, no double-entry accounting or bank payouts, no offline field app, and no self-service password reset. Those are accounts the firm issues, so staff set a new password rather than running an email flow. Three features were wanted but first to drop if the date slipped. A house-rules chat that answers only from that building's rules, an AI-suggested category and urgency on new tickets, and a draft monthly owner summary staff edit before it counts as sent. All three are the same shape, a backend action calling a language model with the key only on the server, and none of them touch the repair or rent model, so they're additive later.

### "Walk me through your data model."

An organization owns everything. Under it are owners, buildings, and units. Each building has an Accra address, house-rules text, an owner, and an organization, and units live inside buildings. A lease ties one tenant's profile to one unit with a start date and an optional end date. A work order is a repair ticket on a unit, carrying its status, category, urgency, the assigned caretaker, and copies of its building and organization ids. Work-order events are the history rows, one per status change. Rent periods belong to a lease. Files are photos attached to a work order. Login is separate. Convex Auth owns the account, and a `profiles` row holds our display name and phone and points at it, with a `memberships` row granting staff, caretaker, or owner within an organization.

Two modelling calls I'd point at. Tenancy is not a stored role, it's derived from a current lease, so there's one fact to keep straight. And the work order denormalizes its building and organization ids so the staff screens and permission checks are one indexed read instead of walking the chain every time.

### "How does this actually get tested and shipped?"

CI is GitHub Actions. Every pull request runs ESLint, Prettier, TypeScript type-check, and the test suites on Node 22 with a frozen lockfile, and merge protection blocks a merge if any fail. Backend tests run in Vitest with Convex's harness. The web and mobile apps run in Jest. The tests I protect hardest are the three never-fail rules. The owner wall, the ended lease, and the finished-ticket-still-there.

Shipping is two paths. Web is Vercel, with previews per branch and production on merge. Mobile is EAS, with a preview workflow that cooks real-device builds, and TestFlight distribution is the remaining launch step. There's no formal migration tool, because Convex applies the schema on push, so a shape change is a schema edit plus a one-off backfill function. On a team with a live database I'd want a stricter migration process, and would say so.

### "What was the hardest bug you had to track down?"

Rent status disagreeing with itself. A period would read "late" in one place and "due" in another, and worse, two people in different time zones could see different answers for the same rent.

The root cause was that "late" was being decided against whatever clock was handy, sometimes the device's. A phone or laptop set to another time zone, or just a wrong date, would decide on its own whether rent was overdue, which is unacceptable when the thing on screen is money in front of an owner.

The fix had two parts. First, "late" isn't stored or computed ad hoc anymore. It's derived in one shared function from the confirmed status plus the due date. Second, that function takes the server's current time as an argument, and the query returns the backend's clock, so no client decides what "today" is. To stop the derived value from ever leaking back into storage, I gave the stored and displayed types different names, `RentConfirmedStatus` versus `RentStatus`, so you can't accidentally write a computed "late" into the database. Prevention is baked into the type system rather than relying on remembering.

### "Beyond login, how did you think about security?"

Authorization first, and it's entirely server-side. Every function resolves the caller, then checks the specific record, and forbidden data is absent from the response rather than hidden by the UI. Refusals look identical whether a record is missing or forbidden, so a "no" doesn't confirm another owner's building exists. Input validation is at the boundary, since every Convex function declares validators for its arguments. Photo uploads go straight to storage via a short-lived URL handed out only after a permission check, and because a storage URL isn't tied to a user, I only mint it inside a query that already confirmed access and never put it somewhere shareable. Secrets live in environment variables on Convex, Vercel, and EAS, never in Git or the client.

Here's the honest gap. There's no rate limiting, which is lower-risk here than in a consumer app, because the users are staff, owners, and tenants the firm issued accounts to, not the open internet. If tenant-facing endpoints like filing a repair were exposed more broadly, that's where I'd add a limiter first.

### "How would you know if something broke in production?"

Convex's dashboard for function logs, errors, and performance, Vercel's logs for the web app, and EAS plus store crash reporting for mobile. For a firm actually depending on this, I'd add alerting on the failures that matter most here. A permission check throwing, a work-order transition being rejected unexpectedly, or a rent write failing. I have the logs and dashboards, not a paged on-call rotation, which is the right level for a portfolio build and the wrong level for a live firm, and I'd scope that up before real users.

### "You built this solo. How did you handle code review, and how would you work on a team?"

The discipline stayed even without a second reviewer. A branch per ticket, a pull request with a fixed Why/What/How/Testing description, and CI gates on every one, so each change carries a written rationale. The system-design docs are my stand-in for the design review a team would do up front, and they record not just the decision but the cost of it.

For automated review I used the AI assistance I already had in my editor to check diffs before opening a PR. The tool I'd actually reach for is a dedicated PR reviewer like CodeRabbit that reads the full diff in context on the pull request. I've deliberately held off paying for it on a solo portfolio build. It's a recurring per-seat cost I'd put on a funded project, not this one. That's a conscious prioritization rather than an oversight, and I'd turn it on at the start of a client job, because a bug caught in review is far cheaper than one caught in production.

On a team, or with that reviewer, the place I'd most want extra eyes is the authorization code, because the scariest bug in this product is a quiet permission mistake that doesn't crash. It just answers the wrong person. So I'd ask for focused review on the access wrappers and the per-record checks, and as a reviewer I'd push on "what does another owner see here" and "what happens if two staff act at once."

### "How did you decide what to cut under the deadline?"

By ranking against the three promises that can't break. The owner wall, a saved repair never vanishing, and an ended lease losing access. Everything serving those shipped first. The three AI-flavoured features, which are the house-rules chat, the suggested ticket category, and the drafted owner summary, were explicitly the first to drop, because they're additive, they don't touch the repair or rent model, and each needs a language-model integration I didn't want to half-build. The rule was to cut features whole, with a note, not ship everything at eighty percent.

### "What would you do differently?"

I'd get the phone build into testers' hands earlier. It's far enough along to click through, and TestFlight distribution is the remaining step, not a missing feature. A caretaker on a real phone would have surfaced the awkward taps sooner. I'd also treat seed data as product from day one even more strictly, because the Accra addresses, the dual currency, and two years of rent are what make an owner demo believable. What I wouldn't change is the tenancy decision or the split between "tenant reported" and "staff confirmed."

---

## If they push harder

- **"What happens on a request, in order?"** The screen calls Convex. The wrapper resolves the user, profile, organization, role, which owner they act for, and their current leases. Then the function checks this specific record. Forbidden data is absent from the response, not hidden by the UI.
- **"Why copy the building id onto the repair?"** So "open repairs in this building" is one indexed read, and a check on fifty tickets doesn't load fifty buildings. Safe only because a unit never moves buildings.
- **"Why store lease dates as `YYYY-MM-DD` strings?"** A tenancy ends on a day, not an instant, so a timestamp would force a time-zone call on every read, and the string sorts correctly anyway.
- **"Why `organizationId` on everything when there's one firm?"** So a second management company later is another row and a membership check, not a rewrite. That only works if the column is there from day one and every query uses it.
- **"Where does permission logic live?"** Only in `convex/`. A route guard that redirects a signed-out person is a courtesy. The backend assumes it never ran.
- **"What's live versus pull-to-refresh?"** The staff repairs list, the caretaker's jobs, and the tenant's own repair update live via Convex subscriptions. The phone also has pull-to-refresh, because a building site loses signal.
- **"Explain the stack to someone who's never used Convex."** Managed login, a document database with indexes, object storage for photos, a scheduler I barely use, web hosting, a phone build service, and secrets in environment variables. The functions are the permission layer, because the database doesn't filter rows for me.

---

## Raise these yourself before they find them

- It's a portfolio build with seed data for an Accra portfolio, not production with real tenants.
- House-rules chat, AI ticket suggestions, and the drafted owner summary aren't in this version.
- There's no self-service password reset. Staff set passwords on accounts they issue.
- Repair photos are protected by minting the URL only after a permission check. The URL itself isn't tied to the user.
- TestFlight distribution is the remaining launch step, not a missing product rule.
- I won't quote user counts, latency percentiles, or revenue, because I don't have them. I designed for about ten buildings.

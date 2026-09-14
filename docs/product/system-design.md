# System design — Ridgeway

This document says **how** we build the product that [product-requirements.md](./product-requirements.md) describes. The requirements document says what the product must do; this one says how the pieces fit together, where each rule is enforced, and what we decided not to do. It is a plan a developer can follow, not the code itself. Field-by-field table shapes, indexes, and the exact list of backend functions live in [convex-design.md](./convex-design.md).

Every decision below is written with the reason next to it. If a reason does not convince you, that section is the one to change.

---

## 1. What has to be true, in priority order

The requirements document lists a lot of behaviour. Not all of it shapes the architecture. These are the qualities that actually decide how the system is built, listed from the one we protect hardest to the one we accept as good enough.

1. **Each person sees only what belongs to them.** An owner must not see another owner's buildings, tenants, or rent. A tenant must not see another tenant's repairs. A caretaker must not see what an owner is collecting in rent. A person whose lease has ended must not see the unit they used to live in. This is the requirement that shapes almost every technical choice in this document.
2. **A saved repair ticket is still there later.** Once a tenant files a repair, that record exists until someone deliberately changes it, and marking it finished does not remove it. If two staff members act on the same ticket at the same moment, one ticket remains, not two half-updated copies.
3. **A rent period says only what staff confirmed.** A tenant can say they have paid. Only a staff member can record that the money arrived. The system must keep those two statements separate.
4. **The product feels like a normal website and phone app.** Pages load in well under a second on a normal Accra connection. We are not chasing a latency budget beyond that.
5. **It stays up during working hours.** Staff use it in the office, and tenants file repairs in the evening. Overnight maintenance is acceptable if we tell Ridgeway first.
6. **It stays small.** There are about ten buildings, three owners, a handful of office staff and caretakers, and the tenants of those buildings. That is a low enough volume that one managed backend handles all of it without caching layers, read replicas, or queues.

The last point is worth saying plainly, because it is a decision and not an accident. A system for ten buildings and a system for ten thousand buildings do not look the same. Building the second one now would cost weeks and would make every bug harder to find. If Ridgeway ever manages hundreds of buildings, the parts that would need to change are named in section 12.

---

## 2. The shape of the system

There are four surfaces that people use, and one backend that all of them talk to.

- The **staff website** shows the whole portfolio that Ridgeway manages: every building, unit, tenant, repair, and rent period, plus the forms that create them.
- The **owner website** shows one owner their own buildings, the occupancy of those buildings, the repairs still open in them, and how much rent has come in against how much is still outstanding.
- The **tenant website and light tenant phone app** show one person their unit, the repairs they have filed, the progress of each repair, and their rent reminders.
- The **field worker phone app** shows a caretaker or technician the jobs staff assigned to them, lets them move a job forward, and lets them attach a photo when the work is finished.

The staff, owner, and tenant websites are all served by the Next.js application in `apps/web-app`. They are one deployment with different sections, not three separate websites, because they share sign-in, layout, and components, and because three deployments would triple the hosting and release work for no benefit. What each person can reach inside that one application is decided by the backend, not by which section of the site they happen to open.

The tenant and field worker phone apps are both served by the Expo application in `apps/mobile-app`, for the same reason. A caretaker and a tenant see completely different screens after signing in, and which set of screens they get is decided by what the backend says about them.

The backend is **Convex**. It holds the database, the functions that read and write it, the photo storage, and the sign-in system. There is one backend, and it is the only thing that decides who may see what.

**Why one Convex backend rather than a separate database, a separate file store, and a separate permissions service.** The three rules in section 1 are all authorization rules, and authorization is easiest to get right when there is exactly one place that enforces it. Splitting the data across services would mean writing the same permission check more than once, in more than one language, and the version we forgot to update would be the security hole. Convex also gives us transactions, live-updating reads, file storage, and scheduled work in the same place, so nothing in the first version needs a second piece of infrastructure. The cost of this choice is that we are tied to one vendor's model, and if we ever needed to leave, the functions would be rewritten rather than moved. At this size that is a trade we are making knowingly.

**Sign-in is Convex Auth with an email and password.** The repository already has this wired in `convex/auth.ts` using the Password provider, and the requirements document asks for email and password sign-in. Convex Auth is currently a beta library, which is the one real risk in this choice, and section 4 explains how we keep that risk from spreading into the product tables. See the [Convex Auth documentation](https://labs.convex.dev/auth) for the current state of the library.

**Staff issue logins and set passwords.** Owners, tenants, and office people use an account Ridgeway created for them. Staff type the first password when they grant the login, and they type a new password on that person later. There is no self-service forgot-password and no email reset. A last remaining staff lockout is recovered with an internal Convex action run from the CLI, not with an admin role in the app. Do not edit the hashed secret in the Convex dashboard. See [convex-auth-env.md](../convex-auth-env.md).

---

## 3. How a request actually flows

Every read and every write follows the same five steps. This is the single most important paragraph in the document, because the security of the product is this sequence being followed without exception.

1. A screen on the website or the phone app calls a Convex **query** to read data, or a Convex **mutation** to change data.
2. The function's first job is to find out who is calling. It reads the signed-in identity from the request, and refuses if there is nobody signed in.
3. The function then works out what that person is allowed to do right now, by reading it from the database rather than trusting anything the screen sent.
4. Only then does the function read or write the tables, and it only touches rows that step 3 permitted.
5. The screen receives the result. Screens that use a query stay subscribed to it, so when the underlying data changes the screen updates without anyone pressing refresh.

Two things follow from this that are easy to get wrong.

**Hiding a button is not a permission.** If the owner website simply does not render a link to another owner's building, that owner can still ask the backend for that building directly. Every check that matters happens in step 3, inside the backend function. The user interface hides things for tidiness, never for safety.

**An identifier that arrives from a screen is a request, not a fact.** When a screen asks for "building `abc123`", that identifier proves nothing about who may see it. The function looks up who is calling first, then decides whether that person may see that building. Section 5 describes exactly how.

---

## 4. Working out who the caller is

Convex has no database-level row filtering, so "who is this and what may they touch" is something we compute in our own code from our own tables. Getting that model right is what makes every later permission check short.

We keep four things separate.

- The **login** is what Convex Auth owns. It is an email address, a password, and an identifier for that account.
- The **profile** is our own record of that person: the name we display, and a phone number. It points at the login.
- **Membership** records the roles the firm has granted a person: office staff, field worker, or owner. A membership belongs to one organization, and when the role is owner it also names which owner that person acts for.
- **Tenancy is not recorded as a role at all.** Whether someone is a tenant right now is answered by looking for a lease that names their profile and has not ended.

**Why the profile is a separate record instead of extra fields on the sign-in account.** Convex Auth is a beta library and owns the shape of its own account table. If we store the person's display name and phone number inside that table, then a change in the library, or a later decision to move sign-in to a different provider, reaches into our product data. Keeping our fields in our own `profiles` record means a change of sign-in provider rewrites one link and leaves every building, lease, and repair untouched. The price is one extra document read per request to get from the login to the profile, which at this size is not measurable.

**Why tenancy is derived from the lease rather than stored as a role.** This is the most important modelling decision in the document, so it is worth being slow about. We could give each tenant a membership row saying "this person is a tenant." Then, when staff end a lease, we would have to remember to remove that row as well. The moment those two facts disagree — the lease has ended but the role row is still there — a person who has moved out can still see their old unit, which the requirements list as something that must never happen. Deriving tenancy from the lease means there is exactly one fact in the system about whether someone currently rents a unit, so there is nothing to keep in step and nothing to forget. The cost is that answering "is this person a tenant" is a small indexed lookup against leases instead of a role read, and that the lease is now on the hot path for tenant screens. That is a good trade for removing a whole category of bug.

**Why owner access is a granted role but tenancy is not.** Being an owner is not time-bounded and is not derived from anything else: Ridgeway decides that a person may act for an owner, and that stays true until Ridgeway changes it. There is no second fact it could contradict, so recording it directly is safe.

Every organization-owned record carries an `organizationId`, including now, while there is only one firm in the data. The requirements document is explicit that a second management company later should be another row rather than a rewrite, and that only holds if the column is there from the first migration and every query uses it. Adding it later would mean touching every table and every function at once.

The result is a small piece of context, resolved once at the start of every function, that answers: which login is this, which profile, which organization, is this person staff, are they a field worker, which owner do they act for if any, and which leases are currently theirs. Every permission decision in the system is a comparison against that context.

---

## 5. The owner wall, concretely

"An owner must not see another owner's buildings" is a sentence in a requirements document. This section is what it means in code.

**Lists are built from the caller downward, never filtered from a client argument.** The query that lists buildings does not accept an owner identifier as an argument. It resolves the caller, and if that caller is an owner it returns the buildings whose `ownerId` matches the one on their own membership. There is no argument an owner could pass that would widen the result, because the scope came from the database record of who they are. A staff caller gets the buildings in their organization by the same mechanism.

**Reads of a single record walk up to the owner and compare.** A repair ticket belongs to a unit, a unit belongs to a building, and a building names its organization and its owner. When someone asks for one repair, the function loads the repair, walks up that chain, and compares the organization and owner it found against the caller's context. If they do not match, the function refuses in the same way whether the record is missing or merely forbidden, so that a refusal does not quietly confirm that some other owner's building exists.

**Some of that chain is copied onto the repair record on purpose.** A repair ticket stores its `organizationId` and its `buildingId` alongside the unit it belongs to. This is duplicated information, which is normally something to avoid, and there are two reasons it earns its place here. The staff home screen needs "the open repairs in this building" as a direct indexed read, which is not possible if the building is only reachable by loading every unit first. And the permission check on a list of fifty repairs would otherwise load fifty units and fifty buildings to answer a question the repair could have answered itself. The invariant that makes the copy safe is that a unit never moves to a different building. If that ever changes, moving a unit becomes a migration that rewrites these fields on every affected repair, and this document is where that promise is recorded.

**Finding out who the caller is cannot be forgotten, and the record-level checks stay visible.** These are two different jobs and they get two different mechanisms, which is the decision that most affects how safe this codebase is to work in.

Resolving the caller is mechanical, identical in every function, and catastrophic to omit, so it is not left to whoever is typing. Public functions are not declared with Convex's plain `query` and `mutation`. They are declared with our own wrapped versions, which resolve the caller first and hand the function a verified description of who they are. A function written with the wrapper cannot run without that having happened, and a function that needs staff rights is declared with the staff wrapper, so the role check is part of the declaration rather than a line someone might delete.

Deciding whether this particular caller may touch this particular building or ticket is not mechanical. It differs per function, it is the interesting part, and it is what a reader needs to see. Those checks stay as explicit calls on the first lines of the function body.

We considered leaving both jobs to explicit calls, which reads more plainly and adds nothing to the project. It was rejected because it makes the most important line in the system a matter of memory, and the failure it produces is silent: a function with no identity check does not crash, it simply answers everyone. Between a mistake that shows up as a broken build and a mistake that shows up as an owner reading another owner's rent, we take the broken build.

The wrappers do not replace tests. No backend function reaches the main branch without a test that a wrong caller is refused, and the three never-optional rules from the requirements each have a test of their own, described in section 11.

**Refusals are not shaped like errors the screen can misread.** A function that refuses does so by raising an error the client cannot mistake for empty data, and the screens have a dedicated "you do not have permission to see this" state, which the requirements document already lists as a screen we owe.

---

## 6. The things the system stores

These are the records the product needs, in the same words the requirements document uses. Exact fields and indexes are in [convex-design.md](./convex-design.md).

- An **organization** is a management company. The data seeds one, Ridgeway Property Group, and everything the firm owns points at it.
- A **profile** is our record of one person who can sign in, holding the name we show and a phone number.
- A **membership** grants one profile a role inside one organization: office staff, field worker, or owner acting for a named owner.
- An **owner** is the person or company whose buildings Ridgeway manages, with the name and contact details staff need.
- A **building** has an Accra address, the house-rules text for that building, an owner, and an organization.
- A **unit** is rentable space inside one building.
- A **lease** ties one tenant's profile to one unit, with a start date and an end date that staff set when the person moves out.
- A **work order** is a repair ticket. It records which unit it concerns, who filed it, its current step, its category and urgency, the caretaker staff assigned, and the building and organization it belongs to.
- A **work order event** records one change to a ticket: who made it, when, what the step was before and after, and an optional note.
- A **rent period** is one month for one lease, with an amount, a due date, what staff have confirmed about payment, and whether the tenant has said they paid.
- A **file** is one photo, either the photo a tenant attached when reporting a problem or the photo a caretaker attached when finishing the work, linked to the work order it belongs to.

House rules are text on the building rather than a table of their own, because in the first version there is one body of rules per building and nothing needs to reference a rule individually. If the house-rules chat feature later needs rules split into passages for retrieval, that becomes its own table then, and nothing about buildings has to change.

---

## 7. The repair ticket, which is the heart of the product

The requirements document is specific: a repair starts as received, then staff assign it, then it is scheduled, then it is marked done, and those steps happen in that order. Two of the three never-optional rules are about this record. So this is the part of the design that gets the most care.

**The step is a stored value with a fixed set of allowed values**, and the moves between them are checked in the backend. A tenant filing a repair creates it at received and cannot create it at any other step. Staff move it from received to assigned, and from assigned to scheduled. A caretaker, or a staff member, moves a scheduled job to done. Nothing jumps from received straight to done in the first version.

**The move is validated against what is in the database, not against what the screen believed.** The mutation reads the ticket's current step and refuses a move that is not allowed from that step. This matters because a caretaker's phone may have been showing a stale screen for ten minutes. Without this read, a tap on an old screen could move a ticket backwards.

**Every move writes a history row in the same transaction as the change.** Convex runs each mutation as a single transaction, so either the ticket's new step and its history row both exist, or neither does. There is no window in which a ticket has changed but nobody knows who changed it.

**Nothing deletes a ticket.** Finishing a repair sets its step to done. The staff list shows open tickets by default and offers done as a filter, because a hidden record and a deleted record look identical to a worried member of staff, and the requirements name that specific fear.

**Two staff members acting at once cannot produce two tickets.** Convex mutations are serializable transactions: if two run against the same record at the same moment, the system resolves them one after the other rather than letting both write over each other. Combined with the previous point about validating against stored state, the second person's action either applies on top of the first or is refused as an illegal move. One ticket remains the record. This is the behaviour the requirements ask for when they say two staff members must not each save a separate copy.

---

## 8. Rent, where two different statements must not blur together

A rent period holds two separate things: what staff have confirmed about the money, and what the tenant has said about the money. They are separate fields, and they are written by separate functions with separate permission checks.

Staff can record that a period is paid, or partly paid, or still unpaid. A tenant can record that they have reported a payment, and that is all they can touch. We are deliberately not building one function that takes a status and decides from the caller's role what they are allowed to set, because that kind of function is where a role check goes wrong quietly. Two narrow functions, each with one job and one permission rule, are easier to read and easier to test.

**Lateness is worked out when the data is read, and is never stored.** The requirements document says a rent period has a status of paid, late, or partial, and the screens do show exactly that. But only two of those three are facts a staff member confirms. Late is not a fact anyone enters: it is what you get by comparing the due date to today on a period that is not fully paid. So the backend stores what staff confirmed, which is unpaid, partly paid, or paid, and the displayed status is worked out from that plus the due date. The same comparison gives a fourth displayed value the requirements do not name: an unpaid period whose due date has not arrived reads as due rather than late, because calling a tenant late while they still have days to pay is simply wrong.

The reason is that a stored "late" has to be maintained by a nightly job, and a nightly job is a thing that can fail to run, run twice, or run in the wrong time zone. When it misbehaves the screens are not obviously broken, they are quietly wrong, in front of an owner, about money. Deriving the value cannot drift and needs no scheduled job at all. The cost is that we cannot index or search directly on lateness, which does not matter for ten buildings' worth of monthly periods, and if it ever did the fix is a stored field added deliberately at that point.

**The comparison uses the server's clock, not the device's.** This is the part that makes the derivation trustworthy. A phone with a wrong date set, or a laptop in another time zone, would otherwise decide on its own what "overdue" means. So the query that returns rent periods also returns the backend's current time, and the function that produces the displayed status takes that time as an argument rather than reading the clock itself. A device cannot then disagree with the office about whether rent is late.

**Stored facts and displayed values are separate types with separate names.** `RentConfirmedStatus` is what the backend stores. `RentStatus` is what a person sees. Both live in `packages/shared`, and one function converts the first into the second. Giving them one shared name is how a codebase ends up writing a derived value into the database by accident.

Field workers never see rent. Owners see rent as totals across their own buildings, collected against outstanding, which is a read scoped exactly the way section 5 describes.

---

## 9. Photos

A photo is uploaded straight to Convex file storage from the browser or the phone, using a short-lived upload address the backend hands out to a caller it has already checked. The file's storage identifier is then attached to the work order through a mutation, which is where we check that this person is allowed to add a photo to this ticket. The photo bytes never travel through our own function, which keeps large uploads from occupying backend time.

There is one honest limitation to record. A storage URL, once produced, can be fetched by anyone who has that URL. We therefore only ever produce those URLs inside a query that has already established that the caller may see the ticket the photo belongs to, and we do not put them anywhere they can be shared. This is adequate for repair photos of a corridor or a broken tap. If Ridgeway ever wanted to store something genuinely sensitive, such as identity documents, we would need to look at serving those bytes through a permission-checked function instead, and that would be a change to this section.

---

## 10. Where the code lives, and where state lives

- `apps/web-app` holds the Next.js application that serves the staff, owner, and tenant websites, with sections per audience behind sign-in.
- `apps/mobile-app` holds the Expo application that serves the field worker app and the light tenant app.
- `packages/shared` holds the things the website and the phone app must agree on: the value sets the product uses, such as the four steps of a repair and the two kinds of rent status, the validation rules behind the forms, and the formatting and derivation helpers. It does not hold backend logic and it does not restate the shape of the database records, because Convex generates those from the schema and two definitions of one record would drift apart.
- `convex/` holds the schema, the queries, mutations, and actions, the permission helpers, the scheduled work, and the seed data.

**Permission logic exists only in `convex/`.** Not in the shared package, not in a React component, not in a route guard. A route guard that redirects a signed-out person to the sign-in page is a courtesy, and the backend still assumes it never ran.

**The backend returns facts, and the screens work out how to present them.** A rent period comes back as what staff confirmed plus a due date plus the server's current time, and the shared helper turns that into the paid, due, late, or partial that a person reads. The alternative, having the backend compute display values, sounds convenient and costs us the ability to change how something reads without a backend deployment. The rule has one hard limit: presentation may be derived on the client, but permission never is. Anything a person is not allowed to see must not be in the response at all.

**Server data comes from Convex queries and nothing else caches it.** Convex keeps query results current and pushes changes to the screens that are subscribed, which removes the entire problem of deciding when cached data has gone stale. Zustand holds only things that belong to one person's current session on one device, such as which filter they picked on the repairs list. There is no second place where buildings or tickets are stored on the client.

**Which screens should feel live.** The staff repairs list, the caretaker's job list, and the tenant's view of their own repair should update without a refresh, because those are the screens where two people are looking at the same thing at once and where the requirements complain about chasing updates on WhatsApp. This costs us nothing extra to build, since it is how Convex queries already behave. The field worker app also keeps a pull-to-refresh gesture, because a phone on a building site loses its connection and a person needs a way to ask again.

**Long lists are paginated.** Repairs and rent periods are the two lists that grow forever, and both are read in pages rather than whole. This is cheap to do at the start and awkward to add once screens assume they receive everything.

---

## 11. What could go wrong, and what proves it did not

Each risk here is paired with the thing that would catch it. The three that the requirements call never-optional get a test that runs on every change, written when the feature is built rather than in the week before launch.

- **A permission check is written wrongly, or forgotten, and an owner sees another owner's buildings.** This is the worst thing that can happen to this product, because it is the promise Ridgeway makes to the three people paying them. The proof is a test that signs in as the first owner, asks for the second owner's building directly by its identifier, and requires a refusal. A second test signs in as staff belonging to one organization, asks for a building in another organization that exists only in the test data, and requires a refusal.
- **A person whose lease has ended keeps access.** The proof is a test that ends a lease and then, as that same person, requires that reading the unit is refused and filing a repair is refused, while signing in still succeeds. Signing in must keep working, because the requirements say that person can still sign in and simply has no access to the unit.
- **A repair ticket appears to be lost.** The two ways this happens are a delete that should have been a status change, and a default filter that hides finished tickets so completely that staff believe they vanished. The proof is a test that finishes a ticket and then finds it again through the done filter, with its history rows intact.
- **A caretaker sees rent, or an owner sees another owner's money.** The proof is a test per role against the rent reads.
- **A tenant marks their own rent as paid.** The proof is a test that the tenant function cannot set the staff-confirmed field at all, which follows from those being two different functions.
- **Convex Auth is a beta library and changes under us.** The mitigation is the separation in section 4: our product tables do not depend on the shape of the sign-in tables, so an upgrade or a move to a different provider touches the link and the sign-in screens rather than the data.
- **The product looks like a tutorial.** The requirements are explicit that the screens must look expensive and that the seed data must be believable Accra data with no user called "test user". The mitigation is that the screen design phase happens before build tickets are written, and that the seed data is treated as part of the product rather than as an afterthought.

---

## 12. What we are not building, and what would change if we did

From the requirements document, the first version does not include a public page where strangers search or apply for empty units, any connection to Ridgeway's existing listings and booking website, double-entry accounting or paying money out of a bank, a marketplace, short-stay operations, use of the field app with no network, sign-in by a code sent over WhatsApp, a one-click import of the old spreadsheet, or a second management company visible in the product with self-serve signup and billing.

The house-rules chat, the suggested category and urgency on a new ticket, and the drafted monthly owner summary are wanted but are the first things to drop if the date slips. All three are the same technical shape: work that talks to a language model, which in Convex belongs in an action rather than a query or a mutation, because actions are the only function type allowed to call the outside world. The provider's API key lives in the backend's environment variables and never reaches the website or the phone. The chat may answer only from the house-rules text of the building in question, and when the rules do not cover the question it says so and points the person at the office rather than inventing a policy. The owner summary is presented as a draft that a staff member edits before it counts as sent.

We are also not building infrastructure the current size does not need: no separate cache, no message queue, no second region, no splitting the backend into services. If Ridgeway grew to hundreds of buildings, the parts that would need attention first are the repair and rent lists, which is why they are paginated and indexed from the start, and any report that adds up rent across many buildings, which would move from being calculated on read to being maintained as a running total. Nothing in this design has to be thrown away to get there.

---

## 13. The same design in generic cloud terms

This is written so the design travels, and so it can be discussed with someone who has never used Convex.

- Identity, which on a generic cloud stack would be a managed user directory, is Convex Auth here.
- The database, which would be a managed relational service, is Convex's document tables with indexes here. Records are documents rather than rows, and the joins are lookups we write.
- Object storage for photos, which would be a bucket service, is Convex file storage here.
- Deferred or background work, which would be a message queue, is Convex's scheduler here. The first version needs almost none of it.
- Static hosting and content delivery for the website is Vercel here, and the phone builds are produced and distributed by Expo Application Services.
- Secrets, which would be a managed secret store, are environment variables on Convex, Vercel, and Expo Application Services here, and they are never committed to the repository.

The one genuinely unusual thing about this stack, compared to that generic picture, is that there is no permission layer inside the database. On a relational service you can push row-level rules down into the database as a second line of defence. Here the functions are the only line of defence, which is exactly why section 5 is written the way it is.

---

## 14. The order we build it in

Each item is a large outcome rather than a task, and each one ends with something a person can sign into and use. Detailed tickets come after the screens are designed.

1. **Sign in and identity.** A person can sign in and out, we can resolve who they are, and staff and field roles exist. Seed the organization and the first memberships. Staff issue owner, tenant, and office logins and can set a new password on those accounts.
2. **The portfolio staff maintain.** Staff can create an owner, a building, a unit, a tenant, another office person, a field worker, and a lease, and can end a lease. Staff can list every tenant (current lease or none) and every owner without opening a building. Plain screens are fine at this stage.
3. **The owner wall.** The owner website exists and shows only that owner's buildings, with the tests from section 11 written as part of this step rather than after it.
4. **Repairs end to end.** A tenant files a repair with a photo, staff assign and schedule it, a caretaker finishes it with a photo, and every step leaves history. This includes the field worker screens on the phone.
5. **Rent.** Staff confirm what was paid, tenants see reminders and can report a payment, and owners see collected against outstanding.
6. **The finish.** Empty, loading, failed, and not-permitted states everywhere, believable seed data, and builds distributed to Ridgeway for testing.
7. **The optional three, if the date allows.** House-rules chat, the suggested category and urgency, and the drafted owner summary, in that order.

---

## 15. The decisions, and why they went that way

These are the choices that were open rather than dictated by the requirements. They are settled, and this section is the record of what was decided and what it cost. If one of them turns out to be wrong, change it here first and then change the code, so this document never describes a system we do not have.

A pattern runs through most of them. Where two facts could disagree with each other, we keep one fact and work the other out. Where a mistake could be silent, we arrange for it to be loud instead.

1. **Tenancy is derived from the lease and is not a stored role.** Ending a lease writes one field, and access follows from it. Storing a tenant role as well would mean two facts to keep in step, and the moment they disagree a person who moved out still sees their old unit, which the requirements say must never happen. The cost is a small indexed lookup against leases on every tenant request. Section 4.
2. **Lateness on a rent period is derived, and the comparison uses the server's clock.** A stored "late" needs a nightly job that can fail quietly and be wrong about money in front of an owner. Deriving it cannot drift. Taking the time from the server rather than the device stops a phone with a wrong date from deciding what overdue means. The cost is that lateness cannot be indexed, which does not matter at this size. Section 8.
3. **Stored facts and displayed values are different types with different names.** `RentConfirmedStatus` is stored, `RentStatus` is displayed, and one function in `packages/shared` converts between them. One shared name is how a derived value ends up written into the database by accident. Section 8.
4. **The backend returns facts and the screens derive presentation, but permission is never derived on the client.** How something reads can change without a backend deployment. What a person is allowed to see cannot be a client decision, so forbidden data is absent from the response rather than hidden by the interface. Section 10.
5. **Resolving the caller is enforced by wrapped function declarations, and record-level checks stay explicit.** Omitting an identity check produces no crash, just a function that answers everyone, so that job is taken away from memory and given to the declaration. Deciding whether this caller may touch this building differs per function and is the part a reader needs to see, so it stays written out. Section 5.
6. **The repair ticket keeps a copy of its building and organization.** It makes the staff screens' reads directly indexable and stops a permission check on fifty tickets from loading fifty units and buildings. It is safe only because a unit never moves between buildings, and that promise is recorded so that if it ever changes, moving a unit becomes a migration. Section 5.
7. **Money is stored as a whole number in the currency's smallest unit, with the currency beside it.** Storing 1250.75 as a decimal invites arithmetic that loses a pesewa somewhere and cannot be explained to a client. A number of pesewas cannot. Section 6 of [convex-design.md](./convex-design.md).
8. **Calendar dates are stored as `YYYY-MM-DD` strings, and only true instants are timestamps.** A tenancy ends on a day, not at a moment, and storing a day as a timestamp forces a time-zone decision every time it is read. That format also sorts correctly as text. Section 3 of [convex-design.md](./convex-design.md).
9. **The `convex/` folder gets Vitest, and the three existing workspaces keep Jest.** Convex's testing library expects Vitest, and the tests in section 11 are what make the never-optional rules real, so they are not postponed for tooling tidiness. Converting three working test suites to a different runner is a large change that buys nothing for this product. The cost is two test runners in one repository, which is why the root test script runs both and neither is optional in review. Section 10 of [convex-design.md](./convex-design.md).
10. **One Next.js application serves staff, owners, and tenants, and one Expo application serves tenants and field workers.** They share sign-in, layout, and components, and separate deployments would multiply the release work while changing nothing about safety, because what a person can reach is decided by the backend rather than by which application they opened. Section 2.
11. **House rules are text on the building rather than their own table.** In the first version there is one body of rules per building and nothing refers to a single rule. If the house-rules chat later needs rules split into passages, that becomes its own table then and buildings do not change. Section 6.

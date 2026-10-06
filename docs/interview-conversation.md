# Talking about Ridgeway in an interview

Read this when you need to explain Ridgeway to someone who was not in the room while it was built. The short answer is for the first two minutes. The conversation is what happens when they keep asking. The last section is what to say before they find a gap themselves.

Interviewers are not scoring a feature list. They are checking whether you understand the problem, the decisions you made, the cost of those decisions, and what you would change. A clean demo is not enough. They want to hear you reason.

This is a portfolio product: operations software for a small property manager in Accra, with a seeded world of about ten buildings and three owners. It is not a live firm with real tenants on an on-call rotation. Say that early. Hiring managers trust the honest version more than a polished one.

---

## The two-minute answer

I built Ridgeway, operations software for a small property manager. Staff run the office. Each owner sees only their own buildings. Tenants file repairs and see rent. Caretakers update jobs on a phone.

The hard part was not the screens. It was making sure the wrong person can never see the wrong building, the wrong repair, or the wrong rent, even if they call the backend directly. Hiding a button is not a permission.

It is one Next.js website for staff, owners, and tenants, one Expo phone app for tenants and caretakers, and one Convex backend. Convex holds the database, sign-in, photo storage, and the functions that decide who may see what. I chose one backend on purpose. If the same rule lived in two services, the copy I forgot to update would be the leak.

Three rules I will not trade away: an owner never sees another owner’s buildings, a saved repair never disappears when someone marks it done, and a tenant whose lease has ended can still sign in but cannot see that unit.

---

## The conversation

### Tell me about something you built.

**Interviewer:** Pick a project you are proud of. What was it, who was it for, and what did you actually do?

**You:** Ridgeway is operations software for a property manager. The firm looks after about ten buildings in Accra for three owners. Before this, the office was tracking repairs and rent in spreadsheets and WhatsApp. Staff needed one place to run the portfolio. Owners needed to see their own buildings without opening Excel. Tenants needed to file a repair and watch it move. Caretakers needed to update the job they were sent to do.

I designed it and built it. Website, phone app, backend, permissions, and the seed data that makes a demo feel like Accra rather than a tutorial. Staff, owners, and tenants use the website. Tenants also get a light phone app for the same journeys. Caretakers use the phone app for today’s jobs.

It is a complete first version of that product, with believable seed data. It is not in production with real tenants. I would rather say that than imply there is an operations team waiting on it.

### What does a person actually do in it?

**Interviewer:** Walk me through one day, not the architecture.

**You:** A staff member signs in and sees buildings, units, tenants, open repairs, and rent marked paid, late, or partial. They can add a building, a unit, an owner, a tenant, another office person, or a caretaker, and they can correct those fields later. When someone moves out, staff set an end date on the lease.

An owner signs in and sees only their buildings: occupancy, open repairs, and rent collected against what is still outstanding.

A tenant files a repair, optionally with a photo. The ticket starts as received. Staff assign it, then schedule it, then it is marked done. The tenant watches that timeline. They can also say “I paid,” but that does not mark the month paid. Staff still confirm the money.

A caretaker opens the jobs assigned to them, moves the status, and attaches a photo when the work is finished.

### How is it built?

**Interviewer:** Draw the system. What talks to what?

**You:** Four audiences, two apps, one backend.

The website is one Next.js app. Staff, owners, and tenants are different sections of the same deployment. They share sign-in, layout, and components. Three separate websites would have tripled the release work and changed nothing about safety, because what a person can open is decided by the backend, not by which URL they typed.

The phone app is one Expo app. After sign-in, a tenant and a caretaker see different screens. Again, the backend decides which set.

Convex is the backend. It is the database, the sign-in system (email and password through Convex Auth), the photo storage, and the functions. The website is hosted on Vercel. Phone builds go through Expo’s build service.

A screen calls a query to read or a mutation to change something. The function’s first job is to find out who is calling. Then it works out what that person is allowed to do, from the database, not from anything the screen sent. Only then does it touch rows. Queries stay subscribed, so the repairs list updates when someone else changes a ticket. That matters on the screens where two people are looking at the same repair and used to chase each other on WhatsApp.

Zustand on the client holds only session extras, such as which filter is selected. Buildings and tickets are not cached in a second store. Convex already keeps those reads current.

### Why one backend? Why not Postgres and a separate auth service?

**Interviewer:** A lot of teams would split this. Why didn’t you?

**You:** The product is small. About ten buildings, three owners, a few staff, some caretakers, and the tenants of those buildings. Traffic is office hours plus the occasional evening repair. I did not need a cache, a queue, read replicas, or a second region.

The rules that matter are all authorization rules. Those are easiest to get right in one place. Splitting the data would mean writing the same check twice, and the version I forgot would be the hole.

The cost is real. I am tied to one vendor’s model. If I had to leave, I would rewrite the functions rather than move them. At this size I am making that trade on purpose. I also wrote the design in ordinary cloud words so I can talk about it without the product name: identity is a managed login, the database is document tables with indexes, photos are object storage, the website is static hosting, secrets are environment variables. The unusual part is that the database itself does not filter rows. The functions are the only line of defence. That is why the permission wrappers exist.

### What was the hardest modelling decision?

**Interviewer:** If I only let you defend one decision, which one?

**You:** Tenancy is not a role. Whether someone is a tenant right now is answered by looking for a lease that names them and has not ended.

I could have stored a membership row that says “this person is a tenant.” Then, when staff end a lease, I would also have to remember to remove that row. The moment those two facts disagree, a person who has moved out still sees their old unit. The requirements say that must never happen. They can still sign in. They just have no access to that unit.

Deriving tenancy from the lease means there is one fact. Ending a lease writes one date. Access follows from it. The cost is an indexed lookup on leases for every tenant request. That is cheap at this size, and it removes a whole category of bug.

Owner access is different, and I stored that as a role on purpose. Being an owner is not time-bounded and is not derived from anything else. The firm grants it, and it stays until the firm changes it. There is no second fact it could contradict.

Sign-in and the person are also separate. Convex Auth owns the email and password. Our `profiles` table owns the display name and phone, and points at that login. Auth here is still a beta library. If it changes, or if I later move sign-in somewhere else, I rewrite one link. Buildings, leases, and repairs stay put.

### How do you stop an owner seeing another owner’s buildings?

**Interviewer:** Be concrete. What happens if they already know the other building’s id?

**You:** The list of buildings does not take an owner id as an argument. The query resolves the caller. If they are an owner, it returns buildings whose owner matches the owner on their own membership. There is no argument they can pass to widen that.

A single record walks up the chain. A repair belongs to a unit, a unit belongs to a building, a building names its organization and its owner. The function loads the repair, walks up, and compares. If it does not match, the refusal looks the same as a missing record, so a “no” does not quietly confirm that some other owner’s building exists.

Two mechanisms, on purpose. Finding out who is calling is identical in every function and catastrophic to forget, so public functions are not plain Convex queries. They are wrappers, in `convex/lib/functions.ts`, that resolve the caller first. A staff function is declared with the staff wrapper, so the role check is part of the declaration. Deciding whether this caller may touch this particular building stays as an explicit check in the function body, because that part differs and a reader needs to see it.

I rejected leaving both jobs to memory. A missing identity check does not crash. It answers everyone. I would rather a broken build than an owner reading another owner’s rent.

There is also a test that signs in as the first owner and asks for the second owner’s building by id, and requires a refusal. The same idea covers a staff member from one organization asking for a building in another.

### Tell me about the repair ticket.

**Interviewer:** This sounds like the heart of the product. How does a ticket move?

**You:** The status is a stored value with a fixed set: received, assigned, scheduled, done. The allowed moves are a map in `convex/workOrders.ts`. Received can only go to assigned. Assigned can only go to scheduled. Scheduled can only go to done. Done goes nowhere.

A tenant creates the ticket at received. They cannot create it already done. The mutation reads the current status from the database and refuses a move that is not allowed from that status. That matters because a caretaker’s phone may have been showing a stale screen for ten minutes. Without that read, a tap on an old screen could move a ticket backwards.

Every move writes a history row in the same transaction as the status change. Convex runs a mutation as one transaction, so either the new status and the history both exist, or neither does. Finishing a ticket sets it to done. Nothing deletes it. The staff list shows open tickets by default and offers done as a filter, because a hidden record and a deleted record look the same to a worried member of staff.

Two staff members acting at once cannot produce two copies. Mutations are serializable. The second action either applies on top of the first or is refused as an illegal move. One ticket remains the record.

The ticket also stores a copy of its building and organization, not only the unit. That is duplicated data, which I usually avoid. It earns its place because the staff home screen needs “open repairs in this building” as a direct indexed read, and a permission check on fifty tickets should not load fifty units and fifty buildings. The copy is safe only because a unit never moves to another building. If that ever changes, moving a unit becomes a migration that rewrites those fields. I wrote that promise down so it is not a surprise later.

### How does rent work? I heard tenants can say they paid.

**Interviewer:** How do you stop “I paid” from becoming “it is paid”?

**You:** Those are two different statements, stored as two different fields, written by two different functions.

Staff record what they have confirmed: unpaid, partly paid, or paid. A tenant can only set a “I reported a payment” timestamp. I did not write one function that takes a status and then decides from the role what they are allowed to set. That is where a role check goes wrong quietly. Two narrow functions are easier to read and easier to test. There is a test that the tenant function cannot set the staff-confirmed field.

Late is not stored. Late is what you get by comparing the due date to today on a period that is not fully paid. A stored “late” needs a nightly job, and a nightly job can fail, run twice, or run in the wrong time zone. When it misbehaves the screens are not obviously broken. They are quietly wrong, in front of an owner, about money. Deriving it cannot drift.

The comparison uses the server’s clock, not the phone’s. The query returns the backend’s current time, and `getRentDisplayStatus` in the shared package takes that time as an argument. A laptop in another time zone cannot decide on its own that rent is late. An unpaid period whose due date has not arrived reads as due, not late.

What is stored and what is shown have different names. `RentConfirmedStatus` is unpaid, partial, or paid. `RentStatus` is what a person reads, including due and late. One function converts the first into the second. Sharing one name is how a derived value ends up written into the database by accident.

Money is a whole number of the currency’s smallest unit, with the currency beside it. One thousand two hundred and fifty cedis and seventy-five pesewas is `125075`, not `1250.75`. A decimal loses a pesewa in a way I cannot explain. Formatting back into cedis happens once, in the shared package. Caretakers never see rent. Owners see totals for their own buildings only.

### What about photos?

**Interviewer:** Where do the repair photos go, and who can fetch them?

**You:** The browser or the phone uploads straight to Convex file storage, using a short-lived upload address the backend hands out after it has already checked the caller. A mutation then attaches that file to the work order, and that is where I check that this person may add a photo to this ticket. The bytes do not travel through our own function.

There is an honest limit. Once a storage URL exists, anyone who has that URL can fetch the bytes. I only produce those URLs inside a query that has already decided the caller may see the ticket, and I do not put them somewhere they can be shared. That is enough for a photo of a broken tap. If the product ever stored identity documents, I would serve those bytes through a permission-checked function instead.

### How do you know the rules hold?

**Interviewer:** What do you test, and what do you refuse to leave to a click-through?

**You:** The three rules that must never fail each have a backend test: the owner wall, the ended lease, and a finished ticket that is still there with its history. Rent has its own: a caretaker cannot read it, and a tenant cannot mark a period paid.

The backend tests run in Vitest, because that is what Convex’s test library expects. The website and the phone app stay on Jest. Two runners in one repo is a cost. Converting three working suites to chase one runner would have bought nothing. The root test script runs both.

I also test the screens for the states a person actually hits: empty, loading, failed, and not allowed. A skeleton stands in for a value that has not arrived. The title, the search box, and the buttons stay as real controls.

### What would break first if this firm grew?

**Interviewer:** Ten buildings is comfortable. What happens at a hundred, or a thousand?

**You:** I would not throw the model away. The owner wall, the lease-derived tenancy, and the repair transitions still hold.

The first pressure is the lists that grow forever: repairs and rent periods. They are already paginated and indexed, because adding pagination after screens assume they received everything is awkward. The next pressure is any report that adds rent across many buildings. Today that total is calculated when you read it. At a much larger portfolio I would keep a running total, updated when a period is confirmed, and accept the extra write in exchange for a cheap read.

I would not add a cache or a second service because a slide said “scale.” I would add them when a measured read was actually slow.

### What did you leave out, and why?

**Interviewer:** Scope is a decision. What did you cut?

**You:** No public listings site, no connection to a marketing website, no double-entry accounting, no bank payouts, no offline field app, no self-service password reset. Staff issue the logins and set a new password. A forgotten password is an office problem, not an email flow, because these are accounts the firm created.

Three things were wanted and dropped when the date mattered more: a house-rules chat that answers only from that building’s rules, a suggested category and urgency on a new ticket, and a draft monthly owner summary that staff edit before it counts as sent. All three are the same shape. They call a language model from a backend action, with the key only on the server. I can add them later without changing the repair or rent model. I would rather ship the three rules that must never fail than ship a chatbot on top of a leaky permission check.

### What would you do differently?

**Interviewer:** Looking back, what would you change?

**You:** I would put the phone build in testers’ hands earlier. The product is far enough along to click through, and TestFlight is the remaining distribution step, not a missing feature. I waited until the screens were in good shape. A caretaker on a real phone would have found the awkward taps sooner.

I would also be even stricter about seed data as part of the product. The Accra addresses, the cedis and dollars, and the two years of rent are what make an owner demo believable. Treating that as an afterthought is how a portfolio piece looks like a tutorial.

I would not change the tenancy decision or the split between “I reported a payment” and “staff confirmed it.” Those are the ones I would defend again.

---

## If they keep pushing

**What happens on a request, in order?** The screen calls Convex. The wrapper resolves the signed-in user, their profile, their organization, whether they are staff or a caretaker, which owner they act for, and which leases are still current. The function then checks this record. Forbidden data is absent from the response. The screen may derive how something reads. It may not decide what someone is allowed to see.

**Why copy the building id onto the repair?** So “open repairs in this building” is one indexed read, and so a list of fifty tickets does not load fifty buildings to check permission. Safe only because a unit does not move buildings.

**Why `YYYY-MM-DD` for lease dates?** A tenancy ends on a day, not at an instant. A timestamp forces a time-zone decision every time you read it. That string also sorts correctly.

**Why `organizationId` on everything when there is only one firm?** A second management company later should be another row and a membership check, not a rewrite. That only works if the column is there from the first schema and every query uses it.

**Where does permission logic live?** Only in `convex/`. A route guard that sends a signed-out person to sign-in is a courtesy. The backend assumes it never ran.

**What is live versus pull to refresh?** The staff repairs list, the caretaker’s jobs, and the tenant’s own repair update without a refresh, because Convex subscriptions already do that. The phone also has pull to refresh, because a building site loses signal and the person needs a way to ask again.

**How do you talk about this stack to someone who has never used Convex?** Login directory, document database with indexes, object storage for photos, scheduled work if I need it, website hosting, phone build service, secrets in environment variables. The functions are the permission layer, because the database does not filter rows for me.

---

## Say this before they ask

- This is a portfolio build of a real product shape, with seed data for an Accra portfolio. It does not have production users.
- House-rules chat, suggested ticket category, and the drafted owner summary are not in this version.
- There is no self-service password reset. Staff set passwords on accounts they issued.
- Photos are protected by only minting the URL after a permission check. The URL itself is not tied to the signed-in person.
- TestFlight distribution of the phone app is the remaining launch step, not a missing product rule.
- I would not quote user counts, latency percentiles, or revenue. I do not have them. The scale I designed for is about ten buildings.

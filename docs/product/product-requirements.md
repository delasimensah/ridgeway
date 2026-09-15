# Product requirements — Ridgeway Property Group

This file is the source of truth for what we are building. Linear tickets come from here. The AI does not invent features that are not in this file.

**Project:** Ridgeway Property Group (customized build, practice client)  
**Date:** 14 Aug 2026 (simulated)  
**Owner / stakeholder:** Ama Boateng (operations), for three building owners

Read this before tickets or code.

---

## 1. Goal (one sentence)

Give Ridgeway Property Group one system where staff run the office, each owner sees only their own buildings, tenants report repairs and see rent, and caretakers update jobs on a phone, without rebuilding the public website where people look at empty units or book them.

---

## 2. Users and platforms

- **Users:**
  - Staff. Office people who manage every building Ridgeway runs.
  - Owners. Three people or companies whose buildings Ridgeway manages. Each owner sees only their own buildings.
  - Tenants. People who live in a unit, report repairs, and see rent reminders.
  - Field workers. Caretakers and technicians who work on site.
- **Platforms for the first version:** Staff, owners, and tenants use the website. Field workers use a phone app built with Expo. Tenants also get a light phone app for the same journeys they have on the website.
- **Notes:** The firm is in Accra. There are about ten buildings, mostly apartments, with a few small shops. Seed data can show prices in cedis and dollars where that helps a demo. This is not full accounting software. The look must feel premium: calm type, real Ghana addresses, and no user named “test user”.

---

## 3. Core flows (first version)

1. Staff sign in and open a home screen that shows buildings, units, tenants, open repairs, and rent marked paid, late, or partial.
2. Staff add a building, a unit, an owner, a tenant, another office person, or a field worker by typing it in. After save, they can correct those typed fields. Staff set a new password on an owner, tenant, office, or field login they issued. When a tenant moves out, staff set an end date on that lease.
3. An owner signs in and sees only their buildings. For those buildings they see occupancy, open repairs, and rent collected versus still outstanding.
4. A tenant files a repair and can attach a photo. The ticket starts as received, then staff assign it, then it is scheduled, then it is marked done. Those steps happen in that order. After the lease end date, that person may still sign in, but they cannot see that unit, file a repair, or see rent.
5. A tenant sees rent reminders and can mark a payment as reported. Staff still confirm the money. This is not a full accounts ledger.
6. A field worker opens the jobs staff assigned to them, updates the status, and attaches a photo when the work is finished.
7. A tenant or staff member asks a house-rules question. Answers come only from that building’s approved house rules. Drop this first if the date slips.
8. When a repair is filed, the product may suggest a category and urgency. A person can change that suggestion. Drop this first if the date slips.
9. Staff can generate a plain-language monthly owner summary from that month’s data and edit it before it is treated as sent. Drop this first if the date slips.

**Not in the first version:**

- A public page where strangers search empty units, apply to rent them, or book them
- Replacing the firm’s existing marketing or booking website
- Full double-entry accounting, payroll, paying money out of a bank, or connecting Ridgeway’s bank
- Marketplace features, meaning a place where many firms or many tenants buy and sell through this app
- Guest short-stay operations. That would be a different product.
- Using the field app with no network
- Sign in by receiving a code in WhatsApp
- Self-service forgot-password or email reset. Staff set a new password on an account they issued.
- Importing the old Excel as a one-click migration. Staff enter records by hand. The demo uses seed data.
- A second management company in the product, self-serve signup for other firms, or billing so many firms can subscribe. Buildings, owners, and members still belong to an organization, so a second firm later is another row and a membership check, not a rewrite.

**Screens the product needs** so design and tickets have a list:

- Sign in and sign out. Staff set a new password on an existing login. There is no self-service forgot-password.
- Staff website: a home command center, lists and detail pages for buildings, units, tenants, owners, field workers, repairs, and rent, forms to add or correct a building, unit, owner, tenant, office person, or field worker, a way to end a lease, and later a draft monthly owner summary. Tenants and owners have their own lists (current lease or none for tenants), not only nested under a building. The field-worker page lists the open jobs assigned to that person. The staff repairs list shows who each open job is assigned to.
- Owner website: a home for their buildings only, a snapshot of each building, a list of open issues, and rent collected versus outstanding.
- Tenant website and light phone app: a home, a form to file a repair, a timeline for that repair, a rent reminder, and later house-rules chat. After a lease ends, those screens show that the person has no permission for that unit. They do not show the old home as if they still lived there.
- Field phone app: today’s jobs, job detail, a status update, and a completion photo.
- Shared screens for when a list is empty, while something is loading, when something fails, and when the person is not allowed to see that page.

---

## 4. Core entities

- **Organization.** A management company. This rehearsal seeds one: Ridgeway Property Group. The data model allows more than one. A second firm later is another organization, not a new app.
- **Profile.** The login for one person. That person has a role: staff, owner, tenant, or field worker. One person should not casually hold owner access to two different owners’ buildings.
- **Owner.** A person or company that owns buildings, inside one organization. Linked to a profile so they can open the owner website.
- **Building.** A property with an Accra address, house-rules text, and many units. It belongs to an organization and to an owner.
- **Unit.** Rentable space inside a building.
- **Lease.** Ties a tenant to a unit for a period. Demo leases already started before this product existed. Staff set an end date when the person moves out. After that date the tenant login has no access to that unit.
- **Work order.** A repair ticket. It has a status, a category, an urgency, photos, and the field worker staff assigned. It must not disappear when someone marks it done.
- **Work order event.** A history row for each status change: who changed it, when, and an optional note.
- **Rent period.** A month or other period for a lease. It has an amount, a due date, a status of paid, late, or partial, and an optional flag that the tenant reported a payment.
- **House rules.** Text that belongs to one building, used later to answer chat questions.
- **File.** A repair photo or a completion photo.

Relations. An organization has many owners, buildings, staff, and field workers. An owner has many buildings. A building has many units. A lease links one unit and one tenant profile. A work order belongs to a unit, and therefore to a building, an owner, and an organization. A rent period belongs to a lease.

---

## 5. Integrations and external systems

- **Convex Auth** (or Clerk Hobby if you are rehearsing phone login). People sign in with email and a password. This lives on your Convex project.
- **Convex database.** This is the source of truth for the entities above. It lives on your Convex project.
- **Convex file storage.** Repair and completion photos. It lives on your Convex project.
- **Vercel.** Hosts the staff, owner, and tenant websites. It lives on your Vercel account.
- **Expo / EAS.** Builds the phone apps and submits them to the stores. It lives on your Expo account.
- **Apple App Store Connect / TestFlight.** iOS testing and later the App Store. It lives on your Apple Developer account.
- **Google Play Console.** Android testing and later the Play Store. It lives on your Play account.
- **Language model (later).** House-rules answers, a suggested category and urgency on a ticket, and the owner-summary draft. API keys live only in server secrets, never in the phone or website. You do not need this to prove the first slices a client can tap.
- **Existing listings and booking website.** Do not connect it in this version. Ridgeway owns that site. There is no API access in this phase.

---

## 6. Rules and compliance

- **Permissions.** Staff see all buildings in their organization. They do not see another organization’s buildings. An owner sees only buildings linked to them, inside that same organization. A tenant sees only their lease, their tickets, and their rent reminders, and only while that lease has not ended. After the lease end date they can sign in but cannot see the unit, file a repair, or see rent. In the first version a field worker sees jobs staff assigned to them. If you later choose a shared pool of jobs instead, write that rule once and enforce it the same way everywhere. Field workers do not see owner money screens. The server enforces all of this. Hiding a button on the phone or website is not enough.
- **Compliance.** The client did not name a statute. Treat names, phones, emails, addresses, rent, and photos as private. Do not invent whether GDPR applies. Ask a lawyer before a real launch privacy page.
- **Special rules.** A repair starts as received, then staff assign it, then it is scheduled, then it is marked done. Those steps happen in that order. Do not delete a work order when it is done. A tenant saying they paid does not mark the period paid until staff confirm. An owner must not see another owner’s buildings, tenants, or rent. Two staff members must not each save a separate copy of the same repair in a way that one copy is lost. One work order is the record. After a lease ends, that person can still sign in, but they cannot see that unit. Typed fields a person is allowed to create, they may later correct, under the same permission rules as create. That includes building name and address, unit labels, owner and tenant details staff typed, a tenant’s repair description while the ticket is still received, and category or urgency. Do not rewrite work-order history rows, a confirmed rent period, or a ticket’s status as free text. Do not add delete in the first version. Later, staff may remove a building or unit added by mistake only when it has no lease and no work order. Work orders, confirmed rent, and leases are never hard-deleted.

---

## 7. Non-functional requirements (summary)

- **Scale.** This is a small internal tool. About ten buildings, three owners, office staff, some caretakers, and the tenants of those buildings. Traffic is low. Do not design the architecture for millions of users.
- **Availability and latency.** Staff use it during office hours. Tenants may file a repair in the evening. Pages and the phone app should feel like a normal website. Ama did not ask for the app to stay up every minute of every day. Overnight maintenance is allowed if you tell them first.
- **Offline and realtime.** For the first version the phone needs a network connection. Live updates that appear without refresh are nice. They are not what makes the product useful. Field workers can pull to refresh.
- **Reliability.** An owner must not see another owner’s buildings. A work order that was saved must still be there after a refresh, after another staff member looks, and after a field worker updates it.
- **Look.** The screens should look expensive, not like a tutorial. Seed data uses Ghana addresses and plausible rent. No user is named “test user”.

---

## 8. Success and priorities

- **Success for the first version.** Ama can show an owner their buildings without opening Excel. A tenant can see a repair go from received, to assigned, to scheduled, to done, without chasing it on WhatsApp. A caretaker updates the job for the right building. Staff stop putting a ticket on the wrong building.
- **Must-have versus nice-to-have.** Flows 1 through 6 are must-have. Flows 7 through 9 are nice-to-have if the date slips. These three are never optional: an owner must not see another owner’s buildings; a saved work order must not disappear; a tenant whose lease has ended must not keep seeing that unit.

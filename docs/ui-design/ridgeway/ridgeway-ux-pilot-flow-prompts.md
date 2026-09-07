# UX Pilot flow prompts — Ridgeway

Locked design system: [design-system.md](./design-system.md). Screen list: [product-requirements.md](../../product/product-requirements.md). Layout language from [reference-map.md](./reference-map.md).

Demo people (never “test user”): Ama Boateng (staff), Kwesi Mensah (owner of Ridge Court), Akosua Darko (tenant, Unit B12), Kojo Asante (field). Address: 14 Ridge Road, Cantonments, Accra. Money: GH₵.

---

## Design system (locked)

- **Palette source:** https://colorhunt.co/palette/1a363640534c677d6ad6bd98
- **Primary:** `#1A3636` (hover `#40534C`)
- **Neutrals:** page `#FFFFFF`, sidebar `#F7F5F0`, cards `#FFFFFF`, text `#1A3636`, secondary `#40534C`, grey `#677D6A`, border `#E8E4DA`
- **Accent only:** `#D6BD98` — money, scheduled chips. Never the page fill.
- **Status:** received `#677D6A`, assigned `#40534C`, scheduled `#D6BD98`, done `#1A3636`, overdue `#7F2020`
- **Typography (mobile):** Instrument Sans — Regular 400, Medium 500, SemiBold 600, Bold 700. Titles 20–24px, body 16px, meta 13–14px
- **Typography (web):** Instrument Sans — same weights. Titles 28–32px Bold, sections 18–20px SemiBold, body 15–16px, tables 13–14px
- **Layout:** Web generous 16–24px / 24–32px sections; 8px cards and buttons; 6px inputs; light shadow + 1px `#D6BD98` border. Phone compact 8–12px in cards, 16px between cards, 44px targets
- **Differentiator:** Generous whitespace and strong type on the websites. Field phone stays compact.
- **Anti-style:** No Jobber lime, no purple/lavender/gradients, no glassmorphism, no 3D illustrations, no social login, no “test user”, no marketplace cards, no quotes/invoices pipeline
- **Product-specific:** GH₵, Accra addresses, Ridge Court, English. Wordmark “Ridgeway”. Web: sidebar + main. Field: jobs only, no owner money.

---

## Shared context (paste once per flow)

**For mobile flows (field + tenant light), paste this:**

Ridgeway Property Group — Accra property office on a phone. Field caretakers update today’s jobs; tenants file a repair and see rent. Brand: calm, premium, trustworthy. Design system: Primary `#1A3636` (CTAs, active states). Hover `#40534C`. Page `#FFFFFF`, surfaces `#FFFFFF`, text `#1A3636`, secondary `#40534C`, grey `#677D6A`, border `#E8E4DA`, accent sand `#D6BD98` only. Repair chips: received `#677D6A`, assigned `#40534C`, scheduled `#D6BD98`, done `#1A3636`, overdue `#7F2020`. Typography: Instrument Sans 400/500/600/700. Body 16px, titles 20–24px, meta 13–14px. Layout: compact job rows 8–12px inside cards, 16px between cards, 8px radius, 6px inputs, light shadow plus 1px border, 44px targets. Field: one bottom tab bar with 2 tabs — Jobs (list), Account (sign out). Active tab `#1A3636`, inactive `#677D6A`, white bar. Tenant light: 3 tabs — Home, Repairs, Rent. No extra top nav unless the screen needs a title or back. Currency GH₵. Accra addresses. Wordmark Ridgeway. No social login, no maps marketplace, no owner money on field screens, no lime green, no purple, no 3D art.

**For web flows, paste this:**

Ridgeway Property Group — Accra property office on the web. Staff run all buildings; each owner sees only theirs; tenants file repairs and see rent. Brand: calm, premium, expensive, not a tutorial. Design system: Primary `#1A3636`. Hover `#40534C`. Page `#FFFFFF`, sidebar `#F7F5F0`, cards `#FFFFFF`, text `#1A3636`, secondary `#40534C`, grey `#677D6A`, border `#E8E4DA`. Accent sand `#D6BD98` for money and scheduled chips only — never fill the page with sand. Status chips as above. Typography: Instrument Sans. Page titles 28–32px Bold, sections 18–20px SemiBold, body 15–16px, tables 13–14px. Layout: left sidebar plus main (AppShell). Generous 16–24px inside, 24–32px between sections. 8px cards and buttons, 6px inputs, 1px `#E8E4DA` border, very light shadow. Desktop 1280px+; usable at 1024px. Large greeting and metric numbers, then quiet tables. Ghana copy, GH₵, Ridge Court at 14 Ridge Road, Cantonments. People: Ama Boateng, Kwesi Mensah, Akosua Darko. No social login, no purple, no lime, no marketplace listing cards, no quotes/invoices pipeline, no “test user”.

---

## Web flow — Auth

### Screen: Sign in (web)

Centered white card on a white page `#FFFFFF`. Wordmark “Ridgeway” Bold, then “Sign in”. Stacked fields: Email address, Password (Forgot? link inside the password row). Primary full-width button `#1A3636` white text “Sign in”. Helper line: “Office, owners, and tenants use this site.” No Google, Apple, or other social buttons. No sidebar. Layout like Ghost’s quiet email-and-password form.

### Screen: Forgot password (web)

Same chrome as Sign in. Title “Reset password”. One field: Email address. Primary “Send reset link”. Text link “Back to sign in”. No sidebar. No social.

### Screen: Sign out (web)

Not a full page. On any signed-in screen, the top-right avatar menu shows Ama Boateng, role Staff, and “Sign out”. Choosing it returns to Sign in.

---

## Web flow — Staff

Staff sidebar (every staff screen except auth): wordmark Ridgeway; links Home, Buildings, Repairs, Rent; footer avatar Ama Boateng / Staff. Active item `#1A3636`. White page, warm off-white sidebar `#F7F5F0`, white main cards. Units and tenants live under a building — no separate Units or Tenants nav.

### Screen: Staff home

Sidebar with Home selected. Main: “Good afternoon, Ama” in 32px Bold. Four metric cards in a row with large numbers: Buildings 10, Open repairs 7, Rent late 4, Units empty 3. Then “Today at Ridge Court” — three repair rows (Unit B12 leak — Assigned; Shop 2 AC — Received; Unit A4 lock — Scheduled) with status pills. Then a quiet rent strip: collected GH₵ 86,400 vs outstanding GH₵ 12,150 this month. Primary text buttons, not lime. Generous space. No charts, no quotes pipeline, no purple header.

### Screen: Building list

Sidebar Buildings. Title “Buildings”. Primary button “Add building”. Table columns: Name, Address, Owner, Units, Open repairs. First row: Ridge Court, 14 Ridge Road, Cantonments, Kwesi Mensah, 24, 4. Second row: a Labone walk-up. Row action “Open”. Empty state if needed: “No buildings yet” plus “Add building” (Attio-short).

### Screen: Building detail

Back to Buildings. Title “Ridge Court”. Address 14 Ridge Road, Cantonments, Accra. Owner Kwesi Mensah. Tabs or sections: Units, Repairs, House rules. Units table: Unit, Tenant, Rent, Lease. B12 — Akosua Darko — GH₵ 4,500 — ends 31 Dec 2027. Primary “Add unit”. House rules section has the approved text plus a text button “Ask house rules”. No marketplace photos grid.

### Screen: Staff house-rules chat

Staff sidebar with Buildings selected. Back to Ridge Court. Title “House rules · Ridge Court”. Same citation chat as the tenant screen, but Ama is asking. Example: “Do shops share the generator with the apartments?” Answer from the rules, or “The house rules for Ridge Court do not cover that. Please handle this in the office.” Citation chip. Composer “Ask about Ridge Court house rules”. No inbox list.

### Screen: Unit list

Sidebar Units. Title “Units”. Filter by building (Ridge Court selected). Table: Building, Unit, Tenant, Status (Occupied / Empty), Rent GH₵. Add unit. Same density as the building list.

### Screen: Unit detail

Title “Ridge Court · B12”. Tenant Akosua Darko. Rent GH₵ 4,500 due the 5th. Lease start and end. Open repairs list with chips. Buttons: “End lease”, “Add repair”. Not a listing page.

### Screen: Tenant list

Sidebar Tenants. Table: Name, Unit, Building, Phone, Lease. Akosua Darko, B12, Ridge Court, 024 555 0192. “Add tenant”.

### Screen: Tenant detail

Title “Akosua Darko”. Unit B12, Ridge Court. Phone, email. Lease dates. Rent status this month: Paid / Late / Partial. Open repairs. “End lease”.

### Screen: Repair list

Sidebar Repairs. Title “Repairs”. Filters: status chips Received, Assigned, Scheduled, Done. Table: Ticket, Building, Unit, Title, Status, Assigned to. Example: WO-184, Ridge Court, B12, Kitchen tap leak, Assigned, Kojo Asante. Status pills use the locked status hexes. “Add repair”.

### Screen: Repair detail

Title “Kitchen tap leak”. Ridge Court · B12 · Akosua Darko. Status chip Assigned `#40534C`. Timeline (Plain/Zendesk): Received yesterday 4:12pm Ama; Assigned today 8:01am to Kojo Asante. Photo thumbnail of a tap. Category Plumbing. Urgency Normal. Actions: “Mark scheduled”, “Mark done” (order only: received → assigned → scheduled → done). Ticket does not disappear when done.

### Screen: Rent list

Sidebar Rent. Title “Rent”. Month September 2026. Snapshot: collected GH₵ 86,400, outstanding GH₵ 12,150, late 4 (Origin-style numbers, not a ledger). Table: Tenant, Unit, Amount, Due, Status (Paid, Late, Partial), Tenant reported (Yes/No). Staff confirm is a row action “Mark paid”. Sand accent on the collected number, overdue `#7F2020` on Late.

### Screen: Add building

Title “Add building”. Stacked form (Jobber add): Name, Street address, Area (Cantonments), City Accra, Owner (select Kwesi Mensah), House rules (textarea). Primary “Save building”. Cancel. No map picker.

### Screen: Add unit

Title “Add unit”. Building (Ridge Court), Unit label (B12), Notes. Save. Cancel.

### Screen: Add owner

Title “Add owner”. Full name, Email, Phone. Save. Cancel. Copy: this person will see only buildings linked to them.

### Screen: Add tenant

Title “Add tenant”. Name, Email, Phone, Building, Unit, Lease start, Monthly rent GH₵, Currency GHS. Save. Cancel.

### Screen: End lease

Title “End lease”. Ridge Court · B12 · Akosua Darko. Date field “Move-out date”. Warning: after this date she can sign in but cannot see this unit, file a repair, or see rent. Primary `#1A3636` “End lease”. Cancel.

### Screen: Monthly owner summary

Staff sidebar with Rent selected (no new nav item). Back to Rent. Title “September 2026 · Kwesi Mensah”. Subline: draft for his buildings only. Three quiet figures: occupancy 22 of 24, open repairs 4, collected GH₵ 41,200 vs outstanding GH₵ 4,500. Then a large editable draft (textarea, Instrument Sans, 16px) of the plain-language letter, already filled:

“Kwesi, Ridge Court finished September with 22 of 24 units occupied. Rent collected GH₵ 41,200, outstanding GH₵ 4,500. Four repairs are still open, including the kitchen tap leak in B12 assigned to Kojo Asante.”

Helper under the draft: “This is a draft until you mark it sent. Staff still edit the wording.” Primary `#1A3636` “Mark as sent”. Secondary “Back to rent”. Not an email client, not a PDF builder, no charts.

---

## Web flow — Owner

Owner sidebar: Home, Buildings, Issues, Rent. Footer Kwesi Mensah / Owner. Never show another owner’s buildings.

### Screen: Owner home

“Good afternoon, Kwesi”. Subline “Your buildings with Ridgeway”. Three building cards only (Ridge Court and two others he owns). Each card: name, Cantonments address, occupancy 22 of 24, open issues 4, rent this month collected vs outstanding. No staff add buttons. No other owners.

### Screen: Owner building snapshot

Title “Ridge Court”. Occupancy, open repairs count, next due rents. Short issue list (not the staff workbench). Back to Home.

### Screen: Owner open issues

Title “Open issues”. List: B12 tap leak Assigned; Shop 2 AC Received. Status chips. No assign controls.

### Screen: Owner rent

Title “Rent”. Collected GH₵ 41,200 vs outstanding GH₵ 4,500 for his buildings this month. Building breakdown. Origin snapshot, not invoices.

---

## Web flow — Tenant

No staff sidebar. Top bar: Ridgeway, Akosua Darko, Sign out. Simple.

### Screen: Tenant home (web)

Unit B12, Ridge Court, 14 Ridge Road, Cantonments. Next rent: GH₵ 4,500 due 5 Sep, status Late or Paid. Open repairs: Kitchen tap leak — Assigned. Buttons: “File a repair”, “Rent”, “Ask house rules”. Not a marketplace. Not the staff dashboard.

### Screen: Tenant file repair (web)

Title “File a repair”. Building and unit shown, not editable. Fields: What’s wrong (textarea), Category (select), Urgency (select). Photo drop zone “Add a photo”. Primary “Submit repair”. Starts as Received.

### Screen: Tenant repair timeline (web)

Title “Kitchen tap leak”. Status Assigned. Timeline only: received, assigned, scheduled, done. Photo she uploaded. She cannot reassign. Back to Home.

### Screen: Tenant rent reminder (web)

Title “Rent”. September 2026, GH₵ 4,500, due 5 Sep, Late. Button “I have paid” (reported, not confirmed). Note: Ridgeway staff still confirm. Bonsai-like invoice row, not a pay-now wallet.

### Screen: Tenant lease ended (web)

Full page, no old home. Wordmark Ridgeway. Title “You no longer have access to this unit”. Body: the lease for Ridge Court B12 has ended. Sign out. Whop-style no-permission, calm, not an error 401.

### Screen: Tenant house-rules chat (web)

Tenant top bar (Ridgeway, Akosua Darko, Sign out). No staff sidebar. Title “House rules · Ridge Court”. Subline B12. One thread, not an inbox of conversations. Short note: “Answers come only from this building’s approved house rules.”

Thread already has two turns:

- Akosua (right, `#1A3636` bubble, white text): “Can I keep a small dog in B12?”
- Reply (left, white bubble, `#E8E4DA` border): “Ridge Court house rules allow one small pet with written office approval. Dogs and cats under 10 kg. No pets in the shops.” Citation chip under the reply: “Answer based on: Ridge Court house rules”.
- Akosua: “What about generator hours?”
- Reply: “The house rules for Ridge Court do not cover generator hours. Please contact the office.”

Composer at the bottom: placeholder “Ask about Ridge Court house rules”, Send `#1A3636`. No attachments, no live-agent handoff, no marketplace listing card.

---

## Web flow — Shared states

### Screen: Empty list (web)

Inside staff Buildings table chrome. Short copy “No buildings yet.” One primary “Add building”. No illustration.

### Screen: Loading (web)

Same staff list chrome. Quiet skeleton rows, no spinner circus.

### Screen: Failed to load (web)

Same chrome. “Couldn’t load repairs.” Button “Try again”. Short. No branded 401 art.

### Screen: Not allowed (web)

Same as tenant lease ended: “You don’t have permission to see this page.” Sign out.

---

## Mobile flow — Auth

### Screen: Sign in (phone)

Full screen. Wordmark Ridgeway. Email, password, Forgot?, Sign in `#1A3636`. No social. No tab bar.

### Screen: Forgot password (phone)

Email field, Send reset link, Back to sign in. No tab bar.

---

## Mobile flow — Tenant light

### Screen: Tenant home (tab)

Header Ridgeway. B12 · Ridge Court. Next rent GH₵ 4,500 due 5 Sep. One open repair card. Text link “Ask house rules”. Tab bar visible with Home selected.

### Screen: Tenant file repair (phone)

From Repairs. What’s wrong, photo, Submit. No tab bar.

### Screen: Tenant repair timeline (phone)

Back, title, status chip, timeline. No tab bar.

### Screen: Tenant rent (tab)

September GH₵ 4,500, I have paid. Tab bar visible with Rent selected.

### Screen: Tenant lease ended (phone)

No old home, no tab bar. Same copy as web lease ended.

### Screen: Tenant house-rules chat (phone)

From Home. Back. Title “House rules”. Subtitle Ridge Court · B12. No tab bar. Same two-turn example as tenant web (dog allowed with approval; generator hours not covered — contact the office). Citation under answers. Composer “Ask about house rules”, 44px Send. Not a fourth tab.

---

## Mobile flow — Field

Field workers never see rent totals or owner names as money.

### Screen: Today’s jobs (tab)

Header “Wednesday, 5 Sep”. Title “Today’s jobs”. Cards, compact: Ridge Court · B12, Kitchen tap leak, Assigned, 14 Ridge Road, Cantonments. Second card Shop 2 AC. No map. No FAB to create quotes. Tab bar visible with Jobs selected.

### Screen: Job detail

Back. Title “Kitchen tap leak”. Ridge Court · B12. Address. Status Assigned. Instructions: “Confirm the leak with the tenant before starting.” Primary “Update status”. No tab bar.

### Screen: Update status

Sheet or full screen from job detail. Options in order only: Assigned (current), Scheduled, Done. Primary “Save status”. No tab bar.

### Screen: Completion photo

From Done. Camera area “Add completion photo”. Caption optional. Primary “Save photo”. Angi-style photo first, then save. No tab bar.

### Screen: Field account (tab)

Kojo Asante, Field. Sign out. No money. Tab bar visible with Account selected.

---

## Mobile flow — Shared states

### Screen: Empty jobs (phone)

Today’s jobs chrome. “No jobs assigned today.” No add button (field cannot create office records). Tab bar visible with Jobs selected.

### Screen: Loading (phone)

Skeleton job cards. Tab bar visible with Jobs selected.

### Screen: Failed (phone)

“Couldn’t load jobs.” Try again. Tab bar visible with Jobs selected.

### Screen: Not allowed (phone)

Lease ended or wrong role. No tab bar.

---

## Notes

Only tab roots say “Tab bar visible with [Tab] selected.” Everything else: “No tab bar.”

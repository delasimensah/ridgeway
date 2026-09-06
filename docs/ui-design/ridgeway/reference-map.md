# Screen reference map — Ridgeway

Maps each product screen in [product-requirements.md](../../product/product-requirements.md) to kept Mobbin references. Web screens will later be rebuilt with Mantine. Phone screens use Expo and NativeWind.

These are layout and pattern references. Do not copy brand, color, extra features, or copy from the source apps.

**Take:** dense calm lists, status chips, stacked forms, job cards, short empty copy, a clear no-permission page.

**Do not copy:** Jobber green, Ghost or Literal branding, quotes or invoices as a pipeline, marketplace listing UIs, social login, or any screen not in the product requirements.

---

## Auth (web and phone)

**Sign in**

- [Ghost sign in](https://mobbin.com/screens/9d2596b0-aeee-43ef-aeaf-580c4cc3bd9f) — email and password only, no social buttons.
- [Literal sign in](https://mobbin.com/screens/02370aed-59f0-4472-b011-5dde59c6a0fc) — quieter second read of the same pattern.

**Sign out**

- No dedicated reference. Use a menu action on the signed-in chrome from the staff and owner homes below.

**Forgot password**

- No dedicated reference. Reuse the sign-in form chrome with a short email field and a send-reset action.

---

## Staff website

**Home command center**

- [Jobber home / workflow](https://mobbin.com/screens/020cee8e-7bb3-4e9a-a26d-0de6f61b06bb) — counts, today’s work, money at a glance.
- [Deel dashboard](https://mobbin.com/screens/9f5af254-f966-4810-adbb-c428854523e3) — dense, calm admin density.

**Building list**

- [Jobber list](https://mobbin.com/screens/a96589e2-e854-4524-b3b9-58d4000f2562) — rows plus an add action.

**Building detail, unit list, tenant list**

- Same [Jobber list](https://mobbin.com/screens/a96589e2-e854-4524-b3b9-58d4000f2562) for nested lists.
- No dedicated unit or tenant detail reference. Reuse list density plus the ticket screens for a single-record page.

**Repair list and repair detail**

- [Plain ticket](https://mobbin.com/screens/bfd38f18-8817-4724-a0e3-8d2abdfde0fa) — timeline and status.
- [Zendesk ticket](https://mobbin.com/screens/79d37466-1a49-4a4d-a286-75f77c1bc7c1) — more status chips.

**Rent list**

- [Origin money snapshot](https://mobbin.com/screens/bbeb85f3-15da-4e7d-aeef-1ca7e223e01e) — collected versus outstanding (reported, not a ledger).

**Add building, unit, owner, or tenant**

- [Jobber add form](https://mobbin.com/screens/63cc5393-0f50-4de4-bb90-9c329d2f75c6) — stacked fields, one primary save.

**End lease**

- [Jobber add form](https://mobbin.com/screens/63cc5393-0f50-4de4-bb90-9c329d2f75c6) — confirm with a date and a clear primary action.
- After the lease ends, the tenant sees [Whop no permission](https://mobbin.com/screens/0c058329-261f-4b41-b8a9-90048a268f69), not the old home.

**Monthly owner summary**

- [Steep editable report](https://mobbin.com/screens/41e38f07-e5db-43a4-9762-44b29206c161) — a draft document staff edit, not a report builder.
- [Jobber home with receivables](https://mobbin.com/screens/4180c32c-84d6-4126-876a-d4f2894bd47d) and [Origin money snapshot](https://mobbin.com/screens/bbeb85f3-15da-4e7d-aeef-1ca7e223e01e) — occupancy and collected vs outstanding figures above the draft.

---

## Owner website

**Home (their buildings only)**

- [Jobber home with receivables](https://mobbin.com/screens/4180c32c-84d6-4126-876a-d4f2894bd47d) — my buildings plus money owed. Layout must not suggest other owners’ data.

**Building snapshot and open issues**

- Same Jobber home for the building card.
- Open issues reuse [Plain ticket](https://mobbin.com/screens/bfd38f18-8817-4724-a0e3-8d2abdfde0fa) as a short list, not a staff workbench.

**Rent collected versus outstanding**

- [Origin money snapshot](https://mobbin.com/screens/bbeb85f3-15da-4e7d-aeef-1ca7e223e01e).

---

## Tenant website and light phone app

**Home**

- No dedicated tenant-home reference. Compose from the repair request and rent reminder screens: unit name, open repairs, next rent due. Not a marketplace.

**File a repair (photo)**

- [Jobber request](https://mobbin.com/screens/79fec6e5-9bd9-4452-a9e3-999c7a47688a).

**Repair timeline**

- [Plain ticket](https://mobbin.com/screens/bfd38f18-8817-4724-a0e3-8d2abdfde0fa) — received, assigned, scheduled, done. Tenant cannot reassign.

**Rent reminder**

- [Bonsai invoices](https://mobbin.com/screens/34d0f00d-1ca1-4c73-b388-14b96f0b88a9) — paid versus due. Tenant report-of-payment is not staff confirmation.

**House-rules chat**

- [ManyChat citation chat](https://mobbin.com/screens/cc5b730b-7f0d-4b09-a1f4-62d627903c86) — one question, one answer, source chip (“Answer based on”).
- Phone: [Agoda property Q&A](https://mobbin.com/screens/c8656b88-010b-4ff9-8881-f183dc11ca78) and [Ask Redfin](https://mobbin.com/screens/509fe2b4-8e77-4922-b10e-22995b9594c4) — building in the header, composer at the bottom. Not an inbox of threads.

**Lease ended / no permission**

- [Whop no permission](https://mobbin.com/screens/0c058329-261f-4b41-b8a9-90048a268f69) — can still sign in; cannot see the old unit home.

---

## Field phone app

**Today’s jobs**

- [Jobber job list](https://mobbin.com/screens/1717a0a9-386f-4bfc-a4f6-3d9550db0778).

**Job detail and status update**

- [Jobber job detail](https://mobbin.com/screens/536351e7-656d-444e-867d-38eb7f48e146).
- [Jobber complete task](https://mobbin.com/screens/9b0b8867-bb54-490a-a96c-bbaa1bbdb70a).

**Completion photo**

- [Angi photos](https://mobbin.com/screens/1714fa96-f811-4650-b44a-13fc5fe424a7).

Field workers do not see owner money screens.

---

## Shared states

**Empty list**

- [Attio empty list](https://mobbin.com/screens/73c69573-7aa5-468b-accb-96e66de4ce24) — short copy and one add action where the person is allowed to add.

**Not allowed**

- [Whop no permission](https://mobbin.com/screens/0c058329-261f-4b41-b8a9-90048a268f69).

**Loading**

- No dedicated reference. Use a quiet skeleton or spinner in the same chrome as the list and detail screens.

**Something failed**

- No dedicated reference. Use a short error message and a retry action in the same chrome. Do not invent a branded 401 page.

---

## Gaps (no extra Mobbin yet)

- Forgot-password screen (reuse sign-in chrome).
- Dedicated tenant home.
- Dedicated unit and tenant detail.
- Loading and fail states.

Design system is locked in [design-system.md](./design-system.md). UX Pilot prompts: [ridgeway-ux-pilot-flow-prompts.md](./ridgeway-ux-pilot-flow-prompts.md).

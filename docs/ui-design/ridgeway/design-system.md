# Design system — Ridgeway (locked)

Locked 5 Sep 2026. Do not change these values for the first version unless a new ticket says so.

Web later uses Mantine with these tokens. Phone uses the same colors and type in NativeWind.

Screen prompts: [ridgeway-ux-pilot-flow-prompts.md](./ridgeway-ux-pilot-flow-prompts.md). References: [reference-map.md](./reference-map.md).

---

## Colors

Source: [Color Hunt — #1A3636 #40534C #677D6A #D6BD98](https://colorhunt.co/palette/1a363640534c677d6ad6bd98). Roles mapped for this product. Cards use white so tables stay readable.

- **Primary:** `#1A3636` — buttons, links, active nav, headline text
- **Primary hover:** `#40534C` (second swatch)
- **Accent:** `#D6BD98` — chip fills, highlights, initials marks. Not for text on white, and not the page fill.
- **Accent ink:** `#8A6B3A` — money and other accent text on white.
- **Neutrals:**
  - Page background `#FFFFFF` (Jobber/Ghost canvas)
  - Surface `#FFFFFF`
  - Sidebar `#F7F5F0` (warm off-white, not sand)
  - Text `#1A3636`
  - Secondary text `#40534C`
  - Grey `#677D6A`
  - Border `#E8E4DA`
- **Status (repairs):** received `#677D6A`, assigned `#40534C`, scheduled `#D6BD98`, done `#1A3636`, overdue `#7F2020` from [Color Hunt — #F6F3EB #C9CAAC #869B7E #7F2020](https://colorhunt.co/palette/f6f3ebc9caac869b7e7f2020)
- **Status dots** (the small mark on a chip, brighter than the brand inks): paid and done `#2BA86A`, due and received `#3B82F6`, partial and scheduled `#E2A325`, late `#E24B4A`, assigned `#14A3A0`

---

## Typography

- **Family (web and phone):** Instrument Sans
- **Weights:** Regular 400, Medium 500, SemiBold 600, Bold 700
- **Web:** page titles ~28–32px Bold; section titles 18–20px SemiBold; body 15–16px Regular; table and meta 13–14px Medium
- **Phone:** titles 20–24px Bold; body 16px Regular; job meta 13–14px Medium

---

## Layout

- **Web spacing:** generous — 16–24px between elements, 24–32px between sections.
- **Phone spacing:** compact rows — 8–12px inside a job card, 16px between cards. Thumb targets at least 44px.
- **Corner radius:** 8px cards and buttons; 6px inputs.
- **Shadows:** a soft two-layer card shadow plus the warm 1px border. Cards may lift slightly on hover. No heavy drop shadows.

---

## Differentiator (one)

**Generous whitespace and strong type on the websites.** Large greeting and metric numbers, then quiet lists. Field phone stays compact because it is a job list, not a second dashboard.

---

## Anti-style

- No Jobber lime or grass green.
- No purple, lavender, or gradients.
- No glassmorphism, no generic 3D illustrations, no cookie-cutter SaaS hero.
- No social login. No “test user”. No marketplace listing cards.
- No quotes/invoices pipeline. Rent is reported status, not a ledger.

---

## Product-specific

- Currency GH₵. Accra addresses. Ridge Court is the busy building.
- English copy. Roles: staff, owner, tenant, field worker.
- Web chrome: sidebar + main (Mantine `AppShell`), lists as tables, status as badges, forms stacked.
- Web viewports: mockups are desktop-first (1280+, usable at 1024). The website still has to work in phone and tablet browsers. Collapse the sidebar below about 992px. Do not wait for separate mobile web mockups.
- Field phone: today’s jobs, detail, status, completion photo. No owner money screens.
- Logo: none yet. Wordmark “Ridgeway” in Bold.

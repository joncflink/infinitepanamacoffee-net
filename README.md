# Infinite Panama Coffee

Marketing site and Infinite Coffee Passport™ / My Infinite Cellar™ experience for Infinite Panama Coffee™ — specialty green coffee from Boquete, Panama.

Live at [infinitepanamacoffee.com](https://infinitepanamacoffee.com).

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

Requires a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-side only, label/admin scripts
AMAZON_LABEL_ID_MODE=            # optional — "passport" or "lot" (default); see ARCHITECTURE.md
```

Other scripts:

```bash
npm run build        # production build
npm run start         # serve a production build
npm run lint           # eslint
npm test                # vitest run
npm run test:watch       # vitest watch mode
npm run generate:qr       # regenerate passport QR assets (public/qr/)
```

## What this is

- **Infinite Coffee Passport™** (`/passport`, `/passport/[passportNumber]`) — customers look up a coffee by the Passport Number printed on the bag and see its full provenance record.
- **My Infinite Cellar™** (`/cellar`) — a private, per-browser collection of coffees a customer has saved, no account required.
- A physical label system (`/labels/*`, internal only) that generates Amazon-compliant packaging artwork from the same coffee data.

## Where to look next

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — how the Passport lookup and Cellar actually work, the route map, analytics events, Amazon compliance boundaries, and the future Supabase migration path. Start here for anything technical.
- **[PROJECT_STATE.md](./PROJECT_STATE.md)** — current status: what's live, what's pending, known limitations.
- **[NEXT_ACTIONS.md](./NEXT_ACTIONS.md)** — concrete pending action items.
- **[CHANGELOG.md](./CHANGELOG.md)** — what's shipped, in order.
- **[public/qr/README.md](./public/qr/README.md)**, **[public/labels/README.md](./public/labels/README.md)** — QR asset generation and the physical label system, respectively.

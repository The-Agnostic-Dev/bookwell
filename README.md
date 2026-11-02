# Bookwell

Online booking for Bookwell Salon, a hair, colour and nails studio in Toronto. Customers pick a
service, a stylist (or "any available") and a time; they can look up, move or cancel their
appointments from **My bookings**. Front-desk staff use the **Staff** page to see the day's diary.

Built with Next.js 15 (App Router) and TypeScript. Data lives in an in-memory store that is seeded
with demo bookings around today's date each time the server starts, so there is nothing to set up.

## Running it

Requirements: Node 22+.

```bash
npm install
npm run dev          # http://localhost:5102 with hot reload
```

Production build:

```bash
npm run build
npm start            # http://localhost:5102
```

With Docker:

```bash
docker compose up --build
```

Restarting the server resets all bookings to the seed data.

## Tests

```bash
npm test             # Vitest, runs in a couple of seconds
npm run lint         # type check
```

Tests live in `tests/` and exercise the pure modules in `src/lib` directly (no server needed).

## Project layout

```
src/
  app/
    page.tsx                     service menu (sortable)
    book/                        booking form (client component) for one service
    bookings/[ref]/              booking confirmation / details, reschedule flow
    my-bookings/                 customer lookup by email, cancel and reschedule links
    staff/                       day schedule per stylist with daily totals
    api/                         JSON route handlers used by the client components
  components/                    shared UI (slot picker, booking summary, sort select)
  lib/
    catalog.ts                   services, stylists and their working hours
    slots.ts                     availability: which start times are free
    slot-cache.ts                per-day cache of slot lists
    bookings.ts                  create / cancel / reschedule / customer lookup
    schedule.ts                  staff day view
    store.ts, seed.ts            in-memory data and demo bookings
    validation.ts, pricing.ts    input checks, HST
    dates.ts, format.ts          date helpers and display formatting
tests/                           Vitest suites
```

## API

| Method | Path | Notes |
| ------ | ---- | ----- |
| GET | `/api/services` | service menu |
| GET | `/api/stylists?serviceId=` | stylists, optionally only those offering a service |
| GET | `/api/slots?serviceId=&stylistId=&date=` | free start times (`stylistId=any` for everyone) |
| POST | `/api/bookings` | `{ serviceId, stylistId, date, startMin, name, email }` |
| GET | `/api/bookings?email=` | `{ upcoming, past }` for a customer |
| GET | `/api/bookings/:ref` | one booking |
| POST | `/api/bookings/:ref/cancel` | cancel |
| POST | `/api/bookings/:ref/reschedule` | `{ date, startMin }`, same stylist |

Times are minutes after midnight in the salon's local time; dates are `YYYY-MM-DD`.

## Business rules

- Appointments start on the half hour and must finish by the stylist's closing time.
- Customers can book up to 60 days ahead; the picker shows the next 14 days.
- Prices are shown before tax; 13% HST is added at the salon.
- "Any available stylist" assigns the first free stylist who offers the service.

## Demo customers

Use these on **My bookings**: `sofia.romero@example.com`, `dev.patel@example.com`,
`nina.kowalski@example.com`, `hannah.lewis@example.com`.

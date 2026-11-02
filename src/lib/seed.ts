import type { Booking, Service, Stylist } from "./types";
import { getService, stylists, stylistsForService } from "./catalog";
import { addDays, todayISO, weekdayOf } from "./dates";
import { priceWithTax } from "./pricing";

const customers: Array<[string, string]> = [
  ["Hannah Lewis", "hannah.lewis@example.com"],
  ["Omar Haddad", "omar.h@example.com"],
  ["Grace Chen", "gracechen@example.com"],
  ["Tomás Silva", "tomas.silva@example.com"],
  ["Aisha Bello", "aisha.bello@example.com"],
  ["Liam O'Connor", "liam.oconnor@example.com"],
  ["Mei Tanaka", "mei.t@example.com"],
  ["Chloe Martin", "chloe.martin@example.com"],
  ["Noah Williams", "noahw@example.com"],
  ["Fatima Khan", "fatima.khan@example.com"],
  ["Ethan Brooks", "ethan.brooks@example.com"],
  ["Isabelle Roy", "isabelle.roy@example.com"],
];

// Regulars whose bookings are referenced in the onboarding guide.
const regulars: Array<{ name: string; email: string; offset: number; time: number; serviceId: string }> = [
  { name: "Sofia Romero", email: "sofia.romero@example.com", offset: 3, time: 14 * 60, serviceId: "wash-blow-dry" },
  { name: "Dev Patel", email: "dev.patel@example.com", offset: 0, time: 15 * 60, serviceId: "mens-cut" },
  { name: "Dev Patel", email: "dev.patel@example.com", offset: -12, time: 11 * 60, serviceId: "mens-cut" },
  { name: "Nina Kowalski", email: "nina.kowalski@example.com", offset: 2, time: 11 * 60, serviceId: "manicure" },
  { name: "Nina Kowalski", email: "nina.kowalski@example.com", offset: -20, time: 13 * 60, serviceId: "gel-pedicure" },
];

function makeRef(n: number): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let x = (n * 2654435761) >>> 0;
  let ref = "";
  for (let i = 0; i < 6; i++) {
    ref += alphabet[x % alphabet.length];
    x = Math.floor(x / alphabet.length) + n * 7 + i;
  }
  return ref;
}

function fits(list: Booking[], stylist: Stylist, date: string, start: number, end: number): boolean {
  const hours = stylist.hours[weekdayOf(date)];
  if (!hours || start < hours.start || end > hours.end) return false;
  return !list.some(
    (b) => b.status === "confirmed" && b.stylistId === stylist.id && b.date === date && start < b.endMin && b.startMin < end,
  );
}

function build(list: Booking[], service: Service, stylist: Stylist, date: string, start: number, who: [string, string]): Booking {
  const n = list.length + 1;
  const stamp = new Date(`${addDays(date, -7)}T12:00:00Z`).toISOString();
  return {
    id: n,
    ref: makeRef(n),
    serviceId: service.id,
    stylistId: stylist.id,
    date,
    startMin: start,
    endMin: start + service.durationMin,
    customerName: who[0],
    customerEmail: who[1],
    ...priceWithTax(service.priceCents),
    status: "confirmed",
    createdAt: stamp,
    updatedAt: stamp,
  };
}

export function seedBookings(today: string = todayISO()): Booking[] {
  const list: Booking[] = [];

  for (const r of regulars) {
    const service = getService(r.serviceId)!;
    // Nudge to the next open day/time if the usual stylist is off.
    placing: for (let shift = 0; shift < 3; shift++) {
      const date = addDays(today, r.offset + shift);
      for (const tryStart of [r.time, r.time + 60, r.time - 120, r.time + 120]) {
        const stylist = stylistsForService(service.id).find((s) =>
          fits(list, s, date, tryStart, tryStart + service.durationMin),
        );
        if (stylist) {
          list.push(build(list, service, stylist, date, tryStart, [r.name, r.email]));
          break placing;
        }
      }
    }
  }

  let customer = 0;
  for (let offset = -14; offset <= 7; offset++) {
    const date = addDays(today, offset);
    stylists.forEach((stylist, i) => {
      const hours = stylist.hours[weekdayOf(date)];
      if (!hours) return;
      let cursor = hours.start + ((offset + i + 20) % 3) * 30;
      for (let k = 0; k < 3; k++) {
        const service = getService(stylist.serviceIds[(offset + 20 + i * 2 + k) % stylist.serviceIds.length])!;
        if (cursor + service.durationMin > hours.end) break;
        if (fits(list, stylist, date, cursor, cursor + service.durationMin)) {
          const booking = build(list, service, stylist, date, cursor, customers[customer++ % customers.length]);
          if ((offset + i + k) % 9 === 0) booking.status = "cancelled";
          list.push(booking);
        }
        cursor += service.durationMin + 60 + ((offset + k + 20) % 2) * 30;
      }
    });
  }

  return list;
}

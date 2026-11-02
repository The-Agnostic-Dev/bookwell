import type { Booking, Service, Slot, Stylist } from "./types";
import { getService, getStylist, stylistsForService } from "./catalog";
import { minutesNow, todayISO, weekdayOf } from "./dates";
import { allBookings } from "./store";
import { readSlots, writeSlots } from "./slot-cache";

export const SLOT_STEP_MIN = 30;

export function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function isStylistFree(
  stylistId: string,
  date: string,
  startMin: number,
  endMin: number,
  bookings: Booking[] = allBookings(),
  ignoreBookingId?: number,
): boolean {
  return !bookings.some(
    (b) =>
      b.id !== ignoreBookingId &&
      b.status === "confirmed" &&
      b.stylistId === stylistId &&
      b.date === date &&
      overlaps(startMin, endMin, b.startMin, b.endMin),
  );
}

/** Start times (minutes after midnight) a stylist can take this service on a date. */
export function stylistSlots(
  service: Service,
  stylist: Stylist,
  date: string,
  bookings: Booking[] = allBookings(),
  now: Date = new Date(),
): number[] {
  const hours = stylist.hours[weekdayOf(date)];
  if (!hours) return [];
  const isToday = date === todayISO(now);
  const cutoff = isToday ? minutesNow(now) : -1;

  const starts: number[] = [];
  for (let start = hours.start; start + service.durationMin < hours.end; start += SLOT_STEP_MIN) {
    if (start <= cutoff) continue;
    if (isStylistFree(stylist.id, date, start, start + service.durationMin, bookings)) {
      starts.push(start);
    }
  }
  return starts;
}

export function computeSlots(serviceId: string, stylistId: string, date: string, now: Date = new Date()): Slot[] {
  const service = getService(serviceId);
  if (!service) return [];
  const candidates =
    stylistId === "any" ? stylistsForService(serviceId) : [getStylist(stylistId)].filter((s): s is Stylist => !!s);

  const byStart = new Map<number, string[]>();
  for (const stylist of candidates) {
    if (!stylist.serviceIds.includes(serviceId)) continue;
    for (const start of stylistSlots(service, stylist, date, allBookings(), now)) {
      byStart.set(start, [...(byStart.get(start) ?? []), stylist.id]);
    }
  }
  return [...byStart.entries()]
    .sort(([a], [b]) => a - b)
    .map(([startMin, stylistIds]) => ({ startMin, stylistIds }));
}

export function getAvailableSlots(serviceId: string, stylistId: string, date: string): Slot[] {
  const cached = readSlots(date, serviceId, stylistId);
  if (cached) return cached;
  const slots = computeSlots(serviceId, stylistId, date);
  writeSlots(date, serviceId, stylistId, slots);
  return slots;
}

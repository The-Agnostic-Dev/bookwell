import type { Slot } from "./types";

// Slot lists are requested every time a customer taps a day in the picker,
// and "any stylist" means scanning every stylist's diary. Cache per date and
// drop the entries whenever bookings on that date change.
const cache = new Map<string, Slot[]>();

const keyFor = (date: string, serviceId: string, stylistId: string) => `${date}|${serviceId}|${stylistId}`;

export function readSlots(date: string, serviceId: string, stylistId: string): Slot[] | undefined {
  return cache.get(keyFor(date, serviceId, stylistId));
}

export function writeSlots(date: string, serviceId: string, stylistId: string, slots: Slot[]): void {
  cache.set(keyFor(date, serviceId, stylistId), slots);
}

export function invalidateDate(date: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(`${date}|`)) cache.delete(key);
  }
}

export function clearSlotCache(): void {
  cache.clear();
}

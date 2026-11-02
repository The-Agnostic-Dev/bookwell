import type { Booking } from "./types";
import { clearSlotCache, invalidateDate } from "./slot-cache";
import { seedBookings } from "./seed";

interface StoreState {
  bookings: Booking[];
  nextId: number;
}

// Kept on globalThis so route handlers and server components share one copy,
// and so dev-mode hot reloads don't wipe the demo data.
const globalStore = globalThis as unknown as { __bookwell?: StoreState };

function state(): StoreState {
  if (!globalStore.__bookwell) {
    const bookings = seedBookings();
    globalStore.__bookwell = { bookings, nextId: bookings.length + 1 };
  }
  return globalStore.__bookwell;
}

export function allBookings(): Booking[] {
  return state().bookings;
}

export function findByRef(ref: string): Booking | undefined {
  return state().bookings.find((b) => b.ref === ref.toUpperCase());
}

export function insertBooking(data: Omit<Booking, "id">): Booking {
  const s = state();
  const booking: Booking = { ...data, id: s.nextId++ };
  s.bookings.push(booking);
  invalidateDate(booking.date);
  return booking;
}

export function updateBooking(ref: string, patch: Partial<Omit<Booking, "id" | "ref">>): Booking | undefined {
  const booking = findByRef(ref);
  if (!booking) return undefined;
  const previousDate = booking.date;
  Object.assign(booking, patch, { updatedAt: new Date().toISOString() });
  invalidateDate(previousDate);
  invalidateDate(booking.date);
  return booking;
}

/** Test helper: reset to a fresh seeded state. */
export function resetStore(bookings: Booking[] = seedBookings()): void {
  clearSlotCache();
  globalStore.__bookwell = { bookings, nextId: bookings.length + 1 };
}

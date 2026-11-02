import { randomBytes } from "node:crypto";
import type { Booking, BookingView } from "./types";
import { getService, getStylist, stylistsForService } from "./catalog";
import { todayISO } from "./dates";
import { priceWithTax } from "./pricing";
import { isStylistFree, stylistSlots } from "./slots";
import { allBookings, findByRef, insertBooking, updateBooking } from "./store";
import { validateBookingInput, validateDate, type FieldErrors } from "./validation";

export class BookingError extends Error {
  constructor(
    message: string,
    public readonly status: number = 400,
    public readonly fields: FieldErrors = {},
  ) {
    super(message);
    this.name = "BookingError";
  }
}

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function newRef(): string {
  for (;;) {
    const bytes = randomBytes(6);
    const ref = Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
    if (!findByRef(ref)) return ref;
  }
}

export function toView(booking: Booking): BookingView {
  return {
    ...booking,
    serviceName: getService(booking.serviceId)?.name ?? "Service",
    stylistName: getStylist(booking.stylistId)?.name ?? "Any stylist",
  };
}

export function getBooking(ref: string): BookingView | undefined {
  const booking = findByRef(ref);
  return booking ? toView(booking) : undefined;
}

export function createBooking(raw: Record<string, unknown>): BookingView {
  const { input, errors } = validateBookingInput(raw);
  if (!input) throw new BookingError("Please check the highlighted fields.", 422, errors);

  const service = getService(input.serviceId);
  if (!service) throw new BookingError("That service is no longer offered.", 404);
  const endMin = input.startMin + service.durationMin;

  const candidates =
    input.stylistId === "any"
      ? stylistsForService(service.id)
      : stylistsForService(service.id).filter((s) => s.id === input.stylistId);
  if (candidates.length === 0) throw new BookingError("That stylist doesn't offer this service.", 404);

  const stylist = candidates.find(
    (s) => stylistSlots(service, s, input.date).includes(input.startMin) && isStylistFree(s.id, input.date, input.startMin, endMin),
  );
  if (!stylist) throw new BookingError("Sorry, that time has just been taken. Please pick another slot.", 409);

  const now = new Date().toISOString();
  const booking = insertBooking({
    ref: newRef(),
    serviceId: service.id,
    stylistId: stylist.id,
    date: input.date,
    startMin: input.startMin,
    endMin,
    customerName: input.name,
    customerEmail: input.email.toLowerCase(),
    ...priceWithTax(service.priceCents),
    status: "confirmed",
    createdAt: now,
    updatedAt: now,
  });
  return toView(booking);
}

export function listCustomerBookings(email: string): { upcoming: BookingView[]; past: BookingView[] } {
  const today = todayISO();
  const mine = allBookings()
    .filter((b) => b.customerEmail === email.trim())
    .map(toView);

  const byTime = (a: Booking, b: Booking) => a.date.localeCompare(b.date) || a.startMin - b.startMin;
  return {
    upcoming: mine.filter((b) => b.status === "confirmed" && b.date > today).sort(byTime),
    past: mine
      .filter((b) => b.status === "cancelled" || b.date < today)
      .sort(byTime)
      .reverse(),
  };
}

export function cancelBooking(ref: string): BookingView {
  const booking = findByRef(ref);
  if (!booking) throw new BookingError("We couldn't find that booking.", 404);
  if (booking.status === "cancelled") throw new BookingError("This booking was already cancelled.", 409);
  if (booking.date < todayISO()) throw new BookingError("Past appointments can't be cancelled.", 409);

  booking.status = "cancelled";
  booking.updatedAt = new Date().toISOString();
  return toView(booking);
}

export function rescheduleBooking(ref: string, raw: Record<string, unknown>): BookingView {
  const booking = findByRef(ref);
  if (!booking) throw new BookingError("We couldn't find that booking.", 404);
  if (booking.status === "cancelled") throw new BookingError("Cancelled bookings can't be moved.", 409);

  const dateError = validateDate(raw.date);
  if (dateError) throw new BookingError(dateError, 422, { date: dateError });
  const date = raw.date as string;
  const startMin = Number(raw.startMin);

  const service = getService(booking.serviceId)!;
  const stylist = getStylist(booking.stylistId)!;
  const others = allBookings().filter((b) => b.id !== booking.id);
  if (!stylistSlots(service, stylist, date, others).includes(startMin)) {
    throw new BookingError("Sorry, that time isn't available. Please pick another slot.", 409);
  }

  const updated = updateBooking(booking.ref, { date, startMin });
  return toView(updated!);
}

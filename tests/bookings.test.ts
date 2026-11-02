import { beforeEach, describe, expect, it } from "vitest";
import { addDays, todayISO, weekdayOf } from "@/lib/dates";
import { createBooking, getBooking, BookingError } from "@/lib/bookings";
import { computeSlots } from "@/lib/slots";
import { resetStore } from "@/lib/store";
import { priceWithTax } from "@/lib/pricing";

/** Next date (from tomorrow) that falls on the given weekday. */
function nextWeekday(day: number): string {
  let date = addDays(todayISO(), 1);
  while (weekdayOf(date) !== day) date = addDays(date, 1);
  return date;
}

describe("pricing", () => {
  it("adds 13% HST rounded to the cent", () => {
    expect(priceWithTax(6500)).toEqual({ priceCents: 6500, taxCents: 845, totalCents: 7345 });
    expect(priceWithTax(3800)).toEqual({ priceCents: 3800, taxCents: 494, totalCents: 4294 });
  });
});

describe("slots", () => {
  beforeEach(() => resetStore([]));

  it("offers half-hourly start times inside working hours", () => {
    const tuesday = nextWeekday(2);
    const starts = computeSlots("mens-cut", "amara", tuesday).map((s) => s.startMin);
    expect(starts[0]).toBe(9 * 60);
    expect(starts[1]).toBe(9 * 60 + 30);
    expect(starts.every((s) => s >= 9 * 60 && s < 17 * 60)).toBe(true);
  });

  it("returns nothing on a stylist's day off", () => {
    const sunday = nextWeekday(0);
    expect(computeSlots("mens-cut", "amara", sunday)).toEqual([]);
  });

  it("removes times that overlap an existing booking", () => {
    const tuesday = nextWeekday(2);
    createBooking({ serviceId: "womens-cut", stylistId: "amara", date: tuesday, startMin: 600, name: "Sam", email: "sam@example.com" });
    const starts = computeSlots("mens-cut", "amara", tuesday).map((s) => s.startMin);
    expect(starts).not.toContain(600);
    expect(starts).not.toContain(630);
    expect(starts).toContain(660);
    expect(starts).toContain(570);
  });

  it("lists which stylists are free for any-stylist searches", () => {
    const thursday = nextWeekday(4);
    const slot = computeSlots("wash-blow-dry", "any", thursday).find((s) => s.startMin === 12 * 60);
    expect(slot?.stylistIds.sort()).toEqual(["amara", "jordan", "marco", "priya"]);
  });
});

describe("createBooking", () => {
  beforeEach(() => resetStore([]));

  it("creates a confirmed booking with tax and a reference", () => {
    const date = nextWeekday(3);
    const booking = createBooking({ serviceId: "manicure", stylistId: "lena", date, startMin: 600, name: "Ana", email: "ana@example.com" });
    expect(booking.ref).toMatch(/^[A-Z2-9]{6}$/);
    expect(booking.endMin).toBe(645);
    expect(booking.totalCents).toBe(4294);
    expect(booking.status).toBe("confirmed");
    expect(getBooking(booking.ref)?.stylistName).toBe("Lena Fischer");
  });

  it("refuses a slot that is already taken", () => {
    const date = nextWeekday(3);
    const input = { serviceId: "manicure", stylistId: "lena", date, startMin: 600, name: "Ana", email: "ana@example.com" };
    createBooking(input);
    expect(() => createBooking({ ...input, email: "bo@example.com" })).toThrow(BookingError);
  });

  it("refuses dates in the past", () => {
    expect(() =>
      createBooking({ serviceId: "manicure", stylistId: "lena", date: addDays(todayISO(), -1), startMin: 600, name: "Ana", email: "ana@example.com" }),
    ).toThrow(/check the highlighted fields/);
  });
});

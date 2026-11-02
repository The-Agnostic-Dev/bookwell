import type { BookingView, Stylist } from "./types";
import { stylists } from "./catalog";
import { weekdayOf } from "./dates";
import { toView } from "./bookings";
import { allBookings } from "./store";

export interface StylistDay {
  stylist: Stylist;
  working: boolean;
  start?: number;
  end?: number;
  bookings: BookingView[];
}

export interface DaySchedule {
  date: string;
  columns: StylistDay[];
  bookingCount: number;
  revenueCents: number;
}

export function getDaySchedule(date: string): DaySchedule {
  const day = allBookings().filter((b) => b.date === date && b.status === "confirmed");
  const weekday = weekdayOf(date);

  const columns = stylists.map((stylist) => {
    const hours = stylist.hours[weekday];
    return {
      stylist,
      working: !!hours,
      start: hours?.start,
      end: hours?.end,
      bookings: day
        .filter((b) => b.stylistId === stylist.id)
        .sort((a, b) => a.startMin - b.startMin)
        .map(toView),
    };
  });

  return {
    date,
    columns,
    bookingCount: day.length,
    revenueCents: day.reduce((sum, b) => sum + b.priceCents, 0),
  };
}

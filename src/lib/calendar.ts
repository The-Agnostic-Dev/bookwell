import { addDays, todayISO } from "./dates";
import { formatDayChip } from "./format";

export const BOOKING_WINDOW_DAYS = 14;

/** Day options for the date picker, starting today. */
export function upcomingDays(count: number = BOOKING_WINDOW_DAYS, from: string = todayISO()) {
  return Array.from({ length: count }, (_, i) => {
    const date = addDays(from, i);
    return { date, ...formatDayChip(date) };
  });
}

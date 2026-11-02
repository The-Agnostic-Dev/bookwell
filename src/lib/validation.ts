import { daysBetween, isISODate, todayISO } from "./dates";

export const MAX_DAYS_AHEAD = 60;

const EMAIL_PATTERN = /^[a-z0-9_+-]+@[a-z0-9-]+\.[a-z]{2,}$/i;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export interface BookingInput {
  serviceId: string;
  stylistId: string;
  date: string;
  startMin: number;
  name: string;
  email: string;
}

export type FieldErrors = Partial<Record<keyof BookingInput, string>>;

export function validateDate(date: unknown, today: string = todayISO()): string | null {
  if (!isISODate(date)) return "Please choose a valid date.";
  const ahead = daysBetween(today, date);
  if (ahead < 0) return "That date is in the past.";
  if (ahead > MAX_DAYS_AHEAD) return `Bookings open ${MAX_DAYS_AHEAD} days ahead.`;
  return null;
}

export function validateBookingInput(raw: Record<string, unknown>): { input?: BookingInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const startMin = Number(raw.startMin);

  if (typeof raw.serviceId !== "string" || !raw.serviceId) errors.serviceId = "Please choose a service.";
  if (typeof raw.stylistId !== "string" || !raw.stylistId) errors.stylistId = "Please choose a stylist.";
  const dateError = validateDate(raw.date);
  if (dateError) errors.date = dateError;
  if (!Number.isInteger(startMin) || startMin < 0 || startMin >= 24 * 60) errors.startMin = "Please choose a time.";
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    input: {
      serviceId: raw.serviceId as string,
      stylistId: raw.stylistId as string,
      date: raw.date as string,
      startMin,
      name,
      email,
    },
  };
}

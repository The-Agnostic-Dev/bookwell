const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

export function formatMoney(cents: number): string {
  return money.format(cents / 100);
}

export function formatTime(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const mm = String(minutes % 60).padStart(2, "0");
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm} ${suffix}`;
}

export function formatTimeRange(start: number, end: number): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

/** "Tue, Nov 4" style label for a YYYY-MM-DD date. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Two-part label used by the date picker chips. */
export function formatDayChip(iso: string): { weekday: string; day: string } {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    weekday: date.toLocaleDateString("en-CA", { weekday: "short", timeZone: "UTC" }),
    day: date.toLocaleDateString("en-CA", { month: "short", day: "numeric", timeZone: "UTC" }),
  };
}

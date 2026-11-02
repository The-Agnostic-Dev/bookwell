import type { Metadata } from "next";
import Link from "next/link";
import { addDays, isISODate, todayISO } from "@/lib/dates";
import { formatDayChip, formatMoney, formatTime, formatTimeRange } from "@/lib/format";
import { getDaySchedule } from "@/lib/schedule";

export const metadata: Metadata = { title: "Staff schedule | Bookwell" };
export const dynamic = "force-dynamic";

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: requested } = await searchParams;
  const date = isISODate(requested) ? requested : todayISO();
  const schedule = getDaySchedule(date);
  const label = formatDayChip(date);

  return (
    <>
      <div className="toolbar">
        <h1>
          Schedule for {label.weekday}, {label.day}
        </h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link className="btn small" href={`/staff?date=${addDays(date, -1)}`}>
            &larr; Previous day
          </Link>
          <Link className="btn small" href="/staff">
            Today
          </Link>
          <Link className="btn small" href={`/staff?date=${addDays(date, 1)}`}>
            Next day &rarr;
          </Link>
        </div>
      </div>

      <div className="stats">
        <div>
          <span className="muted">Appointments</span>
          <strong>{schedule.bookingCount}</strong>
        </div>
        <div>
          <span className="muted">Expected takings (before HST)</span>
          <strong>{formatMoney(schedule.revenueCents)}</strong>
        </div>
      </div>

      <div className="schedule">
        {schedule.columns.map((col) => (
          <section key={col.stylist.id} className="card column">
            <h3>{col.stylist.name}</h3>
            <div className="muted" style={{ fontSize: "0.85rem" }}>
              {col.working ? `${formatTime(col.start!)} to ${formatTime(col.end!)}` : "Day off"}
            </div>
            {col.working && col.bookings.length === 0 && <p className="muted">No appointments</p>}
            {col.bookings.map((b) => (
              <div key={b.ref} className="appt">
                <strong>{formatTimeRange(b.startMin, b.endMin)}</strong>
                <div>{b.serviceName}</div>
                <div className="muted">
                  {b.customerName} · <Link href={`/bookings/${b.ref}`}>{b.ref}</Link>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { formatDate, formatTimeRange } from "@/lib/format";
import type { BookingView } from "@/lib/types";

const STORAGE_KEY = "bookwell.email";

interface Lists {
  upcoming: BookingView[];
  past: BookingView[];
}

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [lists, setLists] = useState<Lists | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyRef, setBusyRef] = useState<string | null>(null);

  const load = useCallback(async (address: string) => {
    setError(null);
    const res = await fetch(`/api/bookings?email=${encodeURIComponent(address)}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "We couldn't load your bookings.");
      return;
    }
    setLists(data);
    localStorage.setItem(STORAGE_KEY, address);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEmail(saved);
      void load(saved);
    }
  }, [load]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void load(email);
  }

  async function cancel(booking: BookingView) {
    if (!window.confirm(`Cancel your ${booking.serviceName} on ${formatDate(booking.date)}?`)) return;
    setBusyRef(booking.ref);
    const res = await fetch(`/api/booking/${booking.ref}/cancel`, { method: "POST" });
    setBusyRef(null);
    if (res.ok) await load(email);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="card" style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}>
          <label htmlFor="lookup-email">Email</label>
          <input
            id="lookup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <button type="submit" className="btn primary">
          Find my bookings
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      {lists && (
        <>
          <h2>Upcoming</h2>
          {lists.upcoming.length === 0 ? (
            <p className="muted">
              No upcoming appointments. <Link href="/">Book one now</Link>.
            </p>
          ) : (
            <ul className="booking-list">
              {lists.upcoming.map((b) => (
                <li key={b.ref} className="card booking-item">
                  <div>
                    <strong>{b.serviceName}</strong> with {b.stylistName}
                    <div className="muted">
                      {formatDate(b.date)} · {formatTimeRange(b.startMin, b.endMin)}
                    </div>
                  </div>
                  <div className="actions">
                    <Link className="btn small" href={`/bookings/${b.ref}`}>
                      View
                    </Link>
                    <Link className="btn small" href={`/bookings/${b.ref}/reschedule`}>
                      Reschedule
                    </Link>
                    <button
                      type="button"
                      className="btn small danger"
                      disabled={busyRef === b.ref}
                      onClick={() => cancel(b)}
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h2>Past &amp; cancelled</h2>
          {lists.past.length === 0 ? (
            <p className="muted">Nothing here yet.</p>
          ) : (
            <ul className="booking-list">
              {lists.past.map((b) => (
                <li key={b.ref} className="card booking-item">
                  <div>
                    <strong>{b.serviceName}</strong> with {b.stylistName}{" "}
                    {b.status === "cancelled" && <span className="badge cancelled">Cancelled</span>}
                    <div className="muted">
                      {formatDate(b.date)} · {formatTimeRange(b.startMin, b.endMin)}
                    </div>
                  </div>
                  <Link className="btn small" href={`/bookings/${b.ref}`}>
                    View
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

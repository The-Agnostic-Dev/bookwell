"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/format";
import type { Slot } from "@/lib/types";

export interface DayOption {
  date: string;
  weekday: string;
  day: string;
}

interface Props {
  serviceId: string;
  stylistId: string;
  days: DayOption[];
  date: string;
  startMin: number | null;
  onDateChange: (date: string) => void;
  onSlotChange: (startMin: number | null) => void;
}

export default function SlotPicker({ serviceId, stylistId, days, date, startMin, onDateChange, onSlotChange }: Props) {
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setSlots(null);
    setError(null);
    const qs = new URLSearchParams({ serviceId, stylistId, date });
    fetch(`/api/slots?${qs}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Could not load times"))))
      .then((data: { slots: Slot[] }) => active && setSlots(data.slots))
      .catch(() => active && setError("We couldn't load available times. Please try again."));
    return () => {
      active = false;
    };
  }, [serviceId, stylistId, date]);

  return (
    <div>
      <div className="day-strip" role="group" aria-label="Choose a day">
        {days.map((d) => (
          <button
            key={d.date}
            type="button"
            className="day-chip"
            data-date={d.date}
            aria-pressed={d.date === date}
            onClick={() => {
              onDateChange(d.date);
              onSlotChange(null);
            }}
          >
            <small>{d.weekday}</small>
            <span>{d.day}</span>
          </button>
        ))}
      </div>

      {error && <p className="form-error">{error}</p>}
      {!error && slots === null && <p className="muted">Loading times…</p>}
      {slots && slots.length === 0 && <p className="muted">No times available on this day. Try another day or stylist.</p>}
      {slots && slots.length > 0 && (
        <div className="slot-grid" role="group" aria-label="Choose a time">
          {slots.map((slot) => (
            <button
              key={slot.startMin}
              type="button"
              className="slot"
              aria-pressed={slot.startMin === startMin}
              onClick={() => onSlotChange(slot.startMin)}
            >
              {formatTime(slot.startMin)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

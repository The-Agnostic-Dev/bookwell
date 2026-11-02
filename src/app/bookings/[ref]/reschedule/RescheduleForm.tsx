"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SlotPicker, { type DayOption } from "@/components/SlotPicker";

interface Props {
  bookingRef: string;
  serviceId: string;
  stylistId: string;
  days: DayOption[];
  initialDate: string;
}

export default function RescheduleForm({ bookingRef, serviceId, stylistId, days, initialDate }: Props) {
  const router = useRouter();
  const [date, setDate] = useState(days.some((d) => d.date === initialDate) ? initialDate : days[0].date);
  const [startMin, setStartMin] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (startMin === null) return;
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/bookings/${bookingRef}/reschedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, startMin }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "We couldn't move your appointment.");
      setSaving(false);
      return;
    }
    router.push(`/bookings/${bookingRef}?moved=1`);
    router.refresh();
  }

  return (
    <div className="card">
      <SlotPicker
        serviceId={serviceId}
        stylistId={stylistId}
        days={days}
        date={date}
        startMin={startMin}
        onDateChange={setDate}
        onSlotChange={setStartMin}
      />
      {error && <p className="form-error">{error}</p>}
      <button type="button" className="btn primary" disabled={startMin === null || saving} onClick={save}>
        {saving ? "Saving…" : "Move appointment"}
      </button>
    </div>
  );
}

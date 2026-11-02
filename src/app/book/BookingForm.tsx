"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SlotPicker, { type DayOption } from "@/components/SlotPicker";

interface Props {
  service: { id: string; name: string };
  stylists: { id: string; name: string; title: string }[];
  days: DayOption[];
}

type Errors = Partial<Record<"name" | "email" | "date" | "startMin", string>>;

export default function BookingForm({ service, stylists, days }: Props) {
  const router = useRouter();
  const [stylistId, setStylistId] = useState("any");
  const [date, setDate] = useState(days[0].date);
  const [startMin, setStartMin] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (startMin === null) return;
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: service.id, stylistId, date, startMin, name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "We couldn't complete your booking.");
        setFieldErrors(data.fields ?? {});
        setSubmitting(false);
        return;
      }
      router.push(`/bookings/${data.booking.ref}?new=1`);
    } catch {
      setError("We couldn't reach the salon. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card">
      <div className="field">
        <label htmlFor="stylist">Stylist</label>
        <select
          id="stylist"
          value={stylistId}
          onChange={(e) => {
            setStylistId(e.target.value);
            setStartMin(null);
          }}
        >
          <option value="any">Any available stylist</option>
          {stylists.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.title})
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Date &amp; time</label>
        <SlotPicker
          serviceId={service.id}
          stylistId={stylistId}
          days={days}
          date={date}
          startMin={startMin}
          onDateChange={setDate}
          onSlotChange={setStartMin}
        />
        {fieldErrors.date && <span className="error">{fieldErrors.date}</span>}
      </div>

      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        {fieldErrors.name && <span className="error">{fieldErrors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        {fieldErrors.email && <span className="error">{fieldErrors.email}</span>}
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn primary" disabled={startMin === null}>
        {submitting ? "Booking…" : "Confirm booking"}
      </button>
    </form>
  );
}

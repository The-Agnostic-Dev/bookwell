"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelBookingButton({ bookingRef }: { bookingRef: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel() {
    if (!window.confirm("Cancel this appointment?")) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/bookings/${bookingRef}/cancel`, { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "We couldn't cancel this booking.");
      return;
    }
    router.refresh();
  }

  return (
    <>
      <button type="button" className="btn danger" onClick={cancel} disabled={busy}>
        {busy ? "Cancelling…" : "Cancel booking"}
      </button>
      {error && <span className="form-error">{error}</span>}
    </>
  );
}

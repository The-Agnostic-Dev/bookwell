import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { todayISO } from "@/lib/dates";
import BookingSummary from "@/components/BookingSummary";
import CancelBookingButton from "@/components/CancelBookingButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ new?: string; moved?: string }>;
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { ref } = await params;
  const flags = await searchParams;
  const booking = getBooking(ref);
  if (!booking) notFound();

  const editable = booking.status === "confirmed" && booking.date >= todayISO();

  return (
    <>
      {flags.new && <p className="notice">You&apos;re booked! A confirmation has been sent to {booking.customerEmail}.</p>}
      {flags.moved && <p className="notice">Your appointment has been moved.</p>}
      <h1>
        Booking {booking.ref}{" "}
        {booking.status === "cancelled" && <span className="badge cancelled">Cancelled</span>}
      </h1>
      <div className="card">
        <p>
          Hi {booking.customerName}, here are your appointment details. Please arrive 5 minutes early.
        </p>
        <BookingSummary booking={booking} />
      </div>
      <p style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        {editable && (
          <>
            <Link className="btn" href={`/bookings/${booking.ref}/reschedule`}>
              Reschedule
            </Link>
            <CancelBookingButton bookingRef={booking.ref} />
          </>
        )}
        <Link className="btn" href="/my-bookings">
          My bookings
        </Link>
      </p>
    </>
  );
}

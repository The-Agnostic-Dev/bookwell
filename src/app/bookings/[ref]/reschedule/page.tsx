import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/bookings";
import { upcomingDays } from "@/lib/calendar";
import { formatDate, formatTimeRange } from "@/lib/format";
import RescheduleForm from "./RescheduleForm";

export const dynamic = "force-dynamic";

export default async function ReschedulePage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const booking = getBooking(ref);
  if (!booking || booking.status === "cancelled") notFound();

  return (
    <>
      <p>
        <Link href={`/bookings/${booking.ref}`}>&larr; Back to booking</Link>
      </p>
      <h1>Reschedule {booking.serviceName}</h1>
      <p className="muted">
        Currently {formatDate(booking.date)}, {formatTimeRange(booking.startMin, booking.endMin)} with{" "}
        {booking.stylistName}.
      </p>
      <RescheduleForm
        bookingRef={booking.ref}
        serviceId={booking.serviceId}
        stylistId={booking.stylistId}
        days={upcomingDays()}
        initialDate={booking.date}
      />
    </>
  );
}

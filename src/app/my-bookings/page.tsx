import type { Metadata } from "next";
import MyBookings from "./MyBookings";

export const metadata: Metadata = { title: "My bookings | Bookwell" };

export default function MyBookingsPage() {
  return (
    <>
      <h1>My bookings</h1>
      <p className="muted">Enter the email you booked with to see, move or cancel your appointments.</p>
      <MyBookings />
    </>
  );
}

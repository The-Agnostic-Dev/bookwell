import { formatDate, formatMoney, formatTimeRange } from "@/lib/format";
import type { BookingView } from "@/lib/types";

export default function BookingSummary({ booking }: { booking: BookingView }) {
  return (
    <table className="summary">
      <tbody>
        <tr>
          <td>Service</td>
          <td>{booking.serviceName}</td>
        </tr>
        <tr>
          <td>Stylist</td>
          <td>{booking.stylistName}</td>
        </tr>
        <tr>
          <td>Date</td>
          <td>{formatDate(booking.date)}</td>
        </tr>
        <tr>
          <td>Time</td>
          <td>{formatTimeRange(booking.startMin, booking.endMin)}</td>
        </tr>
        <tr>
          <td>Subtotal</td>
          <td>{formatMoney(booking.priceCents)}</td>
        </tr>
        <tr>
          <td>HST (13%)</td>
          <td>{formatMoney(booking.taxCents)}</td>
        </tr>
        <tr className="total">
          <td>Total due at the salon</td>
          <td>{formatMoney(booking.priceCents)}</td>
        </tr>
      </tbody>
    </table>
  );
}

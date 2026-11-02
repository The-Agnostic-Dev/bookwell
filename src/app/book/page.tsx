import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, stylistsForService } from "@/lib/catalog";
import { upcomingDays } from "@/lib/calendar";
import { formatDuration, formatMoney } from "@/lib/format";
import BookingForm from "./BookingForm";

export const dynamic = "force-dynamic";

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service: serviceId } = await searchParams;
  const service = serviceId ? getService(serviceId) : undefined;
  if (!service) notFound();

  const stylists = stylistsForService(service.id).map(({ id, name, title }) => ({ id, name, title }));

  return (
    <>
      <p>
        <Link href="/">&larr; All services</Link>
      </p>
      <h1>{service.name}</h1>
      <p className="muted">
        {formatDuration(service.durationMin)} · {formatMoney(service.priceCents)} + HST
      </p>
      <BookingForm service={{ id: service.id, name: service.name }} stylists={stylists} days={upcomingDays()} />
    </>
  );
}

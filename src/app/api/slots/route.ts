import { NextResponse } from "next/server";
import { getService } from "@/lib/catalog";
import { isISODate } from "@/lib/dates";
import { getAvailableSlots } from "@/lib/slots";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const serviceId = params.get("serviceId") ?? "";
  const stylistId = params.get("stylistId") || "any";
  const date = params.get("date");

  if (!getService(serviceId)) {
    return NextResponse.json({ error: "Unknown service." }, { status: 404 });
  }
  if (!isISODate(date)) {
    return NextResponse.json({ error: "Please choose a valid date." }, { status: 400 });
  }
  return NextResponse.json({ date, slots: getAvailableSlots(serviceId, stylistId, date) });
}

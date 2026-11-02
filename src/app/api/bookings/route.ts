import { NextResponse } from "next/server";
import { createBooking, listCustomerBookings } from "@/lib/bookings";
import { errorResponse, readJson } from "@/lib/http";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const email = new URL(request.url).searchParams.get("email") ?? "";
  if (!email.trim()) {
    return NextResponse.json({ error: "Please enter the email you booked with." }, { status: 400 });
  }
  return NextResponse.json(listCustomerBookings(email));
}

export async function POST(request: Request) {
  try {
    const booking = createBooking(await readJson(request));
    return NextResponse.json({ booking }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

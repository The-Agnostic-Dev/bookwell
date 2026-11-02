import { NextResponse } from "next/server";
import { getBooking } from "@/lib/bookings";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const booking = getBooking(ref);
  if (!booking) return NextResponse.json({ error: "We couldn't find that booking." }, { status: 404 });
  return NextResponse.json({ booking });
}

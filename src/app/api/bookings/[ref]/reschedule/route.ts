import { NextResponse } from "next/server";
import { rescheduleBooking } from "@/lib/bookings";
import { errorResponse, readJson } from "@/lib/http";

export async function POST(request: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  try {
    return NextResponse.json({ booking: rescheduleBooking(ref, await readJson(request)) });
  } catch (err) {
    return errorResponse(err);
  }
}

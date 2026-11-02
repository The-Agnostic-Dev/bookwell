import { NextResponse } from "next/server";
import { cancelBooking } from "@/lib/bookings";
import { errorResponse } from "@/lib/http";

export async function POST(_request: Request, { params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  try {
    return NextResponse.json({ booking: cancelBooking(ref) });
  } catch (err) {
    return errorResponse(err);
  }
}

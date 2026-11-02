import { NextResponse } from "next/server";
import { BookingError } from "./bookings";

export function errorResponse(err: unknown) {
  if (err instanceof BookingError) {
    return NextResponse.json({ error: err.message, fields: err.fields }, { status: err.status });
  }
  console.error(err);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

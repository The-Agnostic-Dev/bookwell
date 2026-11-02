import { NextResponse } from "next/server";
import { stylists, stylistsForService } from "@/lib/catalog";

export function GET(request: Request) {
  const serviceId = new URL(request.url).searchParams.get("serviceId");
  return NextResponse.json({ stylists: serviceId ? stylistsForService(serviceId) : stylists });
}

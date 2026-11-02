import { NextResponse } from "next/server";
import { services } from "@/lib/catalog";

export function GET() {
  return NextResponse.json({ services });
}

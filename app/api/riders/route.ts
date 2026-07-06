import { NextResponse } from "next/server"

import { getRiders } from "@/lib/data-store"

export async function GET() {
  const riders = await getRiders()
  return NextResponse.json({ riders })
}

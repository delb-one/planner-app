import { NextResponse } from "next/server"

import { RIDERS } from "@/lib/riders"

export async function GET() {
  return NextResponse.json({ riders: RIDERS })
}

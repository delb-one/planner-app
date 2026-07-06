import { NextResponse } from "next/server"

import { getRiders } from "@/lib/data-store"

export const runtime = "nodejs"

export async function GET() {
  try {
    const riders = await getRiders()
    return NextResponse.json({ riders })
  } catch (error) {
    return NextResponse.json(
      {
        riders: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

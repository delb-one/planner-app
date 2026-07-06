import { NextResponse, type NextRequest } from "next/server"

import {
  getAvailabilityForMonth,
  upsertAvailability,
} from "@/lib/data-store"
import type { AvailabilityStatus } from "@/types"

const VALID_STATUSES: AvailabilityStatus[] = [
  "available",
  "unsure",
  "unavailable",
]

const MONTH_RE = /^\d{4}-\d{2}$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month")

  if (!month || !MONTH_RE.test(month)) {
    return NextResponse.json(
      { error: "A valid `month` query param (yyyy-MM) is required." },
      { status: 400 },
    )
  }

  const records = await getAvailabilityForMonth(month)
  return NextResponse.json({ records })
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { riderId, date, status } = (body ?? {}) as {
    riderId?: string
    date?: string
    status?: AvailabilityStatus
  }

  if (!riderId || typeof riderId !== "string") {
    return NextResponse.json({ error: "`riderId` is required." }, { status: 400 })
  }
  if (!date || !DATE_RE.test(date)) {
    return NextResponse.json(
      { error: "`date` must be a yyyy-MM-dd string." },
      { status: 400 },
    )
  }
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "`status` must be available, unsure, or unavailable." },
      { status: 400 },
    )
  }

  const record = await upsertAvailability(riderId, date, status)
  return NextResponse.json({ record })
}

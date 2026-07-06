import "server-only"

import type { AvailabilityRecord, AvailabilityStatus } from "@/types"

/**
 * Simple in-memory availability store that mirrors the `availability` table
 * (id, rider_id, date, status) with a unique constraint on (rider_id, date).
 *
 * This keeps the app fully functional without a database connected. To move to
 * Supabase, swap the bodies of these functions for SQL queries — the shapes are
 * intentionally identical to the requested schema.
 *
 * A module-level global is used so the data survives hot reloads in dev.
 */
type Store = Map<string, AvailabilityRecord>

const globalForStore = globalThis as unknown as {
  __availabilityStore?: Store
}

const store: Store = globalForStore.__availabilityStore ?? new Map()
if (!globalForStore.__availabilityStore) {
  globalForStore.__availabilityStore = store
}

function key(riderId: string, date: string): string {
  return `${riderId}:${date}`
}

/** Return every record whose date falls within the given "yyyy-MM" month. */
export function getAvailabilityForMonth(month: string): AvailabilityRecord[] {
  const records: AvailabilityRecord[] = []
  for (const record of store.values()) {
    if (record.date.startsWith(month)) {
      records.push(record)
    }
  }
  return records
}

/** Insert or update the status for a single rider/day. */
export function upsertAvailability(
  riderId: string,
  date: string,
  status: AvailabilityStatus,
): AvailabilityRecord {
  const id = key(riderId, date)
  const record: AvailabilityRecord = {
    id,
    rider_id: riderId,
    date,
    status,
  }
  store.set(id, record)
  return record
}

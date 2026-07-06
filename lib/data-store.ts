import "server-only"

import { RIDERS } from "@/lib/riders"
import { getFirestoreDb } from "@/lib/firebase-admin"
import type { AvailabilityRecord, AvailabilityStatus, Rider } from "@/types"

const AVAILABILITY_COLLECTION = "availability"
const RIDERS_COLLECTION = "riders"

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

function toMonth(date: string): string {
  return date.slice(0, 7)
}

function toRecord(
  riderId: string,
  date: string,
  status: AvailabilityStatus,
): AvailabilityRecord {
  return {
    id: key(riderId, date),
    rider_id: riderId,
    date,
    month: toMonth(date),
    status,
  }
}

function normalizeAvailabilityRecord(
  data: Record<string, unknown>,
  fallbackId: string,
): AvailabilityRecord | null {
  const riderId = typeof data.rider_id === "string" ? data.rider_id : null
  const date = typeof data.date === "string" ? data.date : null
  const status =
    data.status === "available" ||
    data.status === "unsure" ||
    data.status === "unavailable"
      ? data.status
      : null

  if (!riderId || !date || !status) {
    return null
  }

  return {
    id: typeof data.id === "string" ? data.id : fallbackId,
    rider_id: riderId,
    date,
    month:
      typeof data.month === "string" && data.month
        ? data.month
        : toMonth(date),
    status,
  }
}

/**
 * Firestore-backed storage when credentials are available, with a local
 * in-memory fallback for development without Firebase configured.
 */
export async function getRiders(): Promise<Rider[]> {
  const db = getFirestoreDb()
  if (!db) {
    return RIDERS
  }

  try {
    const snapshot = await db.collection(RIDERS_COLLECTION).get()

    if (snapshot.empty) {
      const batch = db.batch()
      for (const rider of RIDERS) {
        batch.set(db.collection(RIDERS_COLLECTION).doc(rider.id), rider)
      }
      await batch.commit()
      return RIDERS
    }

    const seedById = new Map(RIDERS.map((rider) => [rider.id, rider]))

    const riders = snapshot.docs
      .map((doc) => {
        const data = doc.data()
        const seed = seedById.get(doc.id)
        const id =
          typeof data.id === "string" && data.id ? data.id : doc.id
        const name =
          typeof data.name === "string" && data.name
            ? data.name
            : seed?.name ?? id
        const color =
          typeof data.color === "string" && data.color
            ? data.color
            : seed?.color ?? "#71717a"

        return {
          id,
          name,
          color,
        }
      })
      .filter((rider): rider is Rider => Boolean(rider.id && rider.name))

    if (riders.length > 0) {
      return riders
    }

    return RIDERS
  } catch (error) {
    console.error("[data-store] getRiders failed", error)
    return RIDERS
  }
}

/** Return every record whose date falls within the given "yyyy-MM" month. */
export async function getAvailabilityForMonth(
  month: string,
): Promise<AvailabilityRecord[]> {
  const db = getFirestoreDb()
  if (!db) {
    const records: AvailabilityRecord[] = []
    for (const record of store.values()) {
      if (record.date.startsWith(month)) {
        records.push(record)
      }
    }
    return records
  }

  try {
    const snapshot = await db
      .collection(AVAILABILITY_COLLECTION)
      .where("month", "==", month)
      .get()

    return snapshot.docs
      .map((doc) =>
        normalizeAvailabilityRecord(
          doc.data() as Record<string, unknown>,
          doc.id,
        ),
      )
      .filter((record): record is AvailabilityRecord => record !== null)
  } catch (error) {
    console.error("[data-store] getAvailabilityForMonth failed", error)
    const records: AvailabilityRecord[] = []
    for (const record of store.values()) {
      if (record.date.startsWith(month)) {
        records.push(record)
      }
    }
    return records
  }
}

/** Insert or update the status for a single rider/day. */
export async function upsertAvailability(
  riderId: string,
  date: string,
  status: AvailabilityStatus,
): Promise<AvailabilityRecord> {
  const record = toRecord(riderId, date, status)
  const db = getFirestoreDb()

  if (!db) {
    store.set(record.id, record)
    return record
  }

  try {
    await db.collection(AVAILABILITY_COLLECTION).doc(record.id).set(record, {
      merge: true,
    })
  } catch (error) {
    console.error("[data-store] upsertAvailability failed", error)
    store.set(record.id, record)
  }

  return record
}

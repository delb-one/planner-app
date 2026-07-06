export type AvailabilityStatus = "available" | "unsure" | "unavailable"

export interface Rider {
  id: string
  name: string
  color: string
}

export interface AvailabilityRecord {
  id: string
  rider_id: string
  /** ISO date string, format: yyyy-MM-dd */
  date: string
  /** Month bucket string, format: yyyy-MM */
  month: string
  status: AvailabilityStatus
}

/** Map of `${rider_id}:${date}` -> status for fast lookups on the client. */
export type AvailabilityMap = Record<string, AvailabilityStatus>

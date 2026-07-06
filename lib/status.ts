import type { AvailabilityStatus } from "@/types"

export interface StatusMeta {
  value: AvailabilityStatus
  label: string
  /** Solid swatch background used in the matrix and calendar. */
  swatch: string
  /** Soft tinted surface used inside the calendar day cell. */
  surface: string
  /** Ring color used when a status is active. */
  ring: string
  dot: string
}

export const STATUS_META: Record<AvailabilityStatus, StatusMeta> = {
  available: {
    value: "available",
    label: "Available",
    swatch: "bg-emerald-500",
    surface: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    ring: "ring-emerald-500/60",
    dot: "bg-emerald-500",
  },
  unsure: {
    value: "unsure",
    label: "Unsure",
    swatch: "bg-amber-500",
    surface: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    ring: "ring-amber-500/60",
    dot: "bg-amber-500",
  },
  unavailable: {
    value: "unavailable",
    label: "Not Available",
    swatch: "bg-red-500",
    surface: "bg-red-500/15 text-red-300 border-red-500/30",
    ring: "ring-red-500/60",
    dot: "bg-red-500",
  },
}

export const STATUS_ORDER: AvailabilityStatus[] = [
  "available",
  "unsure",
  "unavailable",
]

/** Neutral styling used when a rider has not responded for a given day. */
export const EMPTY_SWATCH = "bg-zinc-700"
export const EMPTY_SURFACE =
  "bg-transparent text-muted-foreground border-border"

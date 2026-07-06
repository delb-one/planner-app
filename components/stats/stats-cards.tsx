"use client"

import { useMemo } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { toDateKey, daysInMonth } from "@/lib/date-utils"
import { cellKey } from "@/hooks/use-availability"
import { STATUS_META } from "@/lib/status"
import type { AvailabilityMap, AvailabilityStatus } from "@/types"

interface StatsCardsProps {
  month: Date
  riderId: string
  availability: AvailabilityMap
  isLoading: boolean
}

const CARDS: AvailabilityStatus[] = ["available", "unsure", "unavailable"]

export function StatsCards({
  month,
  riderId,
  availability,
  isLoading,
}: StatsCardsProps) {
  const counts = useMemo(() => {
    const result: Record<AvailabilityStatus, number> = {
      available: 0,
      unsure: 0,
      unavailable: 0,
    }
    for (const date of daysInMonth(month)) {
      const status = availability[cellKey(riderId, toDateKey(date))]
      if (status) result[status] += 1
    }
    return result
  }, [month, riderId, availability])

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {CARDS.map((status) => {
        const meta = STATUS_META[status]
        return (
          <Card key={status}>
            <CardContent className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg",
                  meta.surface,
                )}
                aria-hidden="true"
              >
                <span className={cn("size-3 rounded-full", meta.swatch)} />
              </span>
              <div className="flex flex-col">
                {isLoading ? (
                  <Skeleton className="h-7 w-10" />
                ) : (
                  <span className="text-2xl font-semibold tabular-nums leading-none">
                    {counts[status]}
                  </span>
                )}
                <span className="mt-1 text-xs text-muted-foreground">
                  {meta.label} {counts[status] === 1 ? "day" : "days"}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

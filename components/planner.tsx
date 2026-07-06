"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { toast } from "sonner"

import { Separator } from "@/components/ui/separator"
import { MonthCalendar } from "@/components/calendar/month-calendar"
import { MonthSelector } from "@/components/layout/month-selector"
import { RiderSelector } from "@/components/layout/rider-selector"
import { StatsCards } from "@/components/stats/stats-cards"
import { TeamMatrix } from "@/components/team/team-matrix"
import { monthKey, shiftMonth } from "@/lib/date-utils"
import { STATUS_META } from "@/lib/status"
import { useMonthAvailability, useRiders } from "@/hooks/use-availability"
import type { AvailabilityStatus } from "@/types"

export function Planner() {
  const { riders, isLoading: ridersLoading } = useRiders()
  const [riderId, setRiderId] = useState<string>("")
  const [month, setMonth] = useState<Date>(() => new Date())

  // Default the rider selection to the first rider once loaded.
  useEffect(() => {
    if (!riderId && riders.length > 0) {
      setRiderId(riders[0].id)
    }
  }, [riders, riderId])

  const { map, isLoading, setStatus } = useMonthAvailability(monthKey(month))

  const handleSetStatus = async (date: string, status: AvailabilityStatus) => {
    if (!riderId) return
    try {
      await setStatus(riderId, date, status)
      toast.success("Availability saved", {
        description: `${format(new Date(date), "EEE d MMM")} — ${
          STATUS_META[status].label
        }`,
      })
    } catch {
      toast.error("Could not save. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <MonthSelector
            month={month}
            onPrev={() => setMonth((m) => shiftMonth(m, -1))}
            onNext={() => setMonth((m) => shiftMonth(m, 1))}
          />
        </div>
        <RiderSelector
          riders={riders}
          value={riderId}
          onChange={setRiderId}
          isLoading={ridersLoading}
        />
      </div>

      <StatsCards
        month={month}
        riderId={riderId}
        availability={map}
        isLoading={isLoading || ridersLoading}
      />

      <MonthCalendar
        month={month}
        riderId={riderId}
        availability={map}
        isLoading={isLoading || ridersLoading}
        onSetStatus={handleSetStatus}
      />

      <Separator />

      <TeamMatrix
        month={month}
        riders={riders}
        availability={map}
        isLoading={isLoading || ridersLoading}
      />
    </div>
  )
}

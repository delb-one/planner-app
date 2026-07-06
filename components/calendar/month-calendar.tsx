"use client"

import { useMemo } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  daysInMonth,
  isSameDay,
  mondayFirstWeekday,
  toDateKey,
} from "@/lib/date-utils"
import { cellKey } from "@/hooks/use-availability"
import type { AvailabilityMap, AvailabilityStatus } from "@/types"
import { DayCell } from "./day-cell"

const WEEKDAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]

interface MonthCalendarProps {
  month: Date
  riderId: string
  availability: AvailabilityMap
  isLoading: boolean
  onSetStatus: (date: string, status: AvailabilityStatus) => void
}

export function MonthCalendar({
  month,
  riderId,
  availability,
  isLoading,
  onSetStatus,
}: MonthCalendarProps) {
  const days = useMemo(() => daysInMonth(month), [month])
  const leadingBlanks = days.length ? mondayFirstWeekday(days[0]) : 0
  const today = new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="pb-1 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {isLoading
            ? Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-xl" />
              ))
            : (
                <>
                  {Array.from({ length: leadingBlanks }).map((_, i) => (
                    <div key={`blank-${i}`} aria-hidden="true" />
                  ))}
                  {days.map((date) => {
                    const key = toDateKey(date)
                    const status = availability[cellKey(riderId, key)]
                    return (
                      <DayCell
                        key={key}
                        date={date}
                        status={status}
                        isToday={isSameDay(date, today)}
                        onSelect={(next) => onSetStatus(key, next)}
                      />
                    )
                  })}
                </>
              )}
        </div>

        <div className={cn("mt-4 flex flex-wrap items-center gap-x-4 gap-y-2")}>
          <LegendItem className="bg-emerald-500" label="Available" />
          <LegendItem className="bg-amber-500" label="Unsure" />
          <LegendItem className="bg-red-500" label="Not Available" />
          <LegendItem className="bg-zinc-700" label="No response" />
        </div>
      </CardContent>
    </Card>
  )
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn("size-2.5 rounded-full", className)}
        aria-hidden="true"
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

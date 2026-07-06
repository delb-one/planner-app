"use client"

import { useMemo } from "react"
import { format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { daysInMonth, isSameDay, isWeekend, toDateKey } from "@/lib/date-utils"
import { cellKey } from "@/hooks/use-availability"
import { EMPTY_SWATCH, STATUS_META } from "@/lib/status"
import type { AvailabilityMap, Rider } from "@/types"

interface TeamMatrixProps {
  month: Date
  riders: Rider[]
  availability: AvailabilityMap
  isLoading: boolean
}

export function TeamMatrix({
  month,
  riders,
  availability,
  isLoading,
}: TeamMatrixProps) {
  const days = useMemo(() => daysInMonth(month), [month])
  const today = new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Availability</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <TooltipProvider delay={150}>
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Header row: day numbers */}
                <div className="flex">
                  <div className="sticky left-0 z-10 w-28 shrink-0 bg-card" />
                  {days.map((date) => (
                    <div
                      key={toDateKey(date)}
                      className={cn(
                        "w-7 shrink-0 pb-1 text-center text-[10px] font-medium text-muted-foreground",
                        isSameDay(date, today) && "text-primary",
                      )}
                    >
                      {format(date, "d")}
                    </div>
                  ))}
                </div>

                {/* Rider rows */}
                <div className="flex flex-col gap-1">
                  {riders.map((rider) => (
                    <div key={rider.id} className="flex items-center">
                      <div className="sticky left-0 z-10 flex w-28 shrink-0 items-center gap-2 bg-card pr-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: rider.color }}
                          aria-hidden="true"
                        />
                        <span className="truncate text-sm">{rider.name}</span>
                      </div>
                      {days.map((date) => {
                        const key = toDateKey(date)
                        const status =
                          availability[cellKey(rider.id, key)]
                        const meta = status ? STATUS_META[status] : null
                        return (
                          <div
                            key={key}
                            className="flex w-7 shrink-0 justify-center px-0.5"
                          >
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <div
                                    className={cn(
                                      "size-6 rounded-md ring-1 ring-inset ring-black/20 transition-colors duration-200",
                                      meta ? meta.swatch : EMPTY_SWATCH,
                                      isWeekend(date) && "opacity-90",
                                    )}
                                  />
                                }
                              />
                              <TooltipContent>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium">
                                    {rider.name}
                                  </span>
                                  <span>{format(date, "EEE d MMM")}</span>
                                  <span className="text-background/70">
                                    {meta ? meta.label : "No response"}
                                  </span>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Check } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { isWeekend } from "@/lib/date-utils"
import { EMPTY_SURFACE, STATUS_META, STATUS_ORDER } from "@/lib/status"
import type { AvailabilityStatus } from "@/types"

interface DayCellProps {
  date: Date
  status?: AvailabilityStatus
  isToday: boolean
  onSelect: (status: AvailabilityStatus) => void
}

export function DayCell({ date, status, isToday, onSelect }: DayCellProps) {
  const [open, setOpen] = useState(false)
  const weekend = isWeekend(date)
  const meta = status ? STATUS_META[status] : null
  const dayNumber = format(date, "d")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={`${format(date, "EEEE d MMMM")}${
          meta ? `, ${meta.label}` : ", no response"
        }`}
        className={cn(
          "group relative flex aspect-square w-full flex-col items-center justify-between rounded-xl border p-1.5 text-left outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring sm:p-2",
          "hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20",
          meta ? cn(meta.surface) : EMPTY_SURFACE,
          weekend && !meta && "bg-muted/40",
          isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        )}
      >
        <span
          className={cn(
            "text-xs font-medium sm:text-sm",
            isToday && "font-bold text-primary",
          )}
        >
          {dayNumber}
        </span>
        <span
          className={cn(
            "size-2 rounded-full transition-colors duration-200 sm:size-2.5",
            meta ? meta.dot : "bg-zinc-700",
          )}
          aria-hidden="true"
        />
      </PopoverTrigger>
      <PopoverContent align="center" className="w-60">
        <PopoverHeader>
          <PopoverTitle>{format(date, "EEEE d MMMM")}</PopoverTitle>
          <PopoverDescription>Set availability for this day</PopoverDescription>
        </PopoverHeader>
        <div className="flex flex-col gap-1.5">
          {STATUS_ORDER.map((value) => {
            const statusMeta = STATUS_META[value]
            const active = status === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  onSelect(value)
                  setOpen(false)
                }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-sm font-medium outline-none transition-colors duration-150",
                  "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
                  active && cn("border-transparent ring-2", statusMeta.ring),
                  active && statusMeta.surface,
                )}
              >
                <span
                  className={cn(
                    "size-3.5 rounded-full",
                    statusMeta.swatch,
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1 text-left">{statusMeta.label}</span>
                {active && <Check className="size-4" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

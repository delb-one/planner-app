"use client"

import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface MonthSelectorProps {
  month: Date
  onPrev: () => void
  onNext: () => void
}

export function MonthSelector({ month, onPrev, onNext }: MonthSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        aria-label="Previous month"
      >
        <ChevronLeft data-icon="inline-start" />
      </Button>
      <h1 className="min-w-40 text-center text-lg font-semibold tracking-tight text-balance sm:text-xl">
        {format(month, "MMMM yyyy")}
      </h1>
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        aria-label="Next month"
      >
        <ChevronRight data-icon="inline-end" />
      </Button>
    </div>
  )
}

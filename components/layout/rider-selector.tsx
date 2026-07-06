"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { Rider } from "@/types"

interface RiderSelectorProps {
  riders: Rider[]
  value: string
  onChange: (riderId: string) => void
  isLoading?: boolean
}

export function RiderSelector({
  riders,
  value,
  onChange,
  isLoading,
}: RiderSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">
        Current Rider
      </label>
      {isLoading ? (
        <Skeleton className="h-9 w-44 rounded-lg" />
      ) : (
        <Select value={value} onValueChange={(v) => onChange(v as string)}>
          <SelectTrigger className="h-9 w-44" aria-label="Select current rider">
            <SelectValue placeholder="Select rider">
              {(value: string) => {
                const rider = riders.find((r) => r.id === value)
                if (!rider) return "Select rider"
                return (
                  <>
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: rider.color }}
                      aria-hidden="true"
                    />
                    {rider.name}
                  </>
                )
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {riders.map((rider) => (
                <SelectItem key={rider.id} value={rider.id}>
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: rider.color }}
                    aria-hidden="true"
                  />
                  {rider.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}

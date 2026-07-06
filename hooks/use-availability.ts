"use client"

import { useCallback, useMemo } from "react"
import useSWR from "swr"

import type {
  AvailabilityMap,
  AvailabilityRecord,
  AvailabilityStatus,
  Rider,
} from "@/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Request failed")
  return res.json()
}

export function cellKey(riderId: string, date: string): string {
  return `${riderId}:${date}`
}

export function useRiders() {
  const { data, isLoading } = useSWR<{ riders: Rider[] }>(
    "/api/riders",
    fetcher,
  )
  return { riders: data?.riders ?? [], isLoading }
}

export function useMonthAvailability(month: string) {
  const swrKey = `/api/availability?month=${month}`

  const { data, isLoading, mutate } = useSWR<{ records: AvailabilityRecord[] }>(
    swrKey,
    fetcher,
    { keepPreviousData: true },
  )

  const map = useMemo<AvailabilityMap>(() => {
    const result: AvailabilityMap = {}
    for (const record of data?.records ?? []) {
      result[cellKey(record.rider_id, record.date)] = record.status
    }
    return result
  }, [data])

  const setStatus = useCallback(
    async (riderId: string, date: string, status: AvailabilityStatus) => {
      const optimistic: AvailabilityRecord = {
        id: cellKey(riderId, date),
        rider_id: riderId,
        date,
        status,
      }

      // Build the optimistic record list, replacing any existing entry.
      const buildNext = (records: AvailabilityRecord[]) => {
        const filtered = records.filter((r) => r.id !== optimistic.id)
        return [...filtered, optimistic]
      }

      await mutate(
        async (current) => {
          const res = await fetch("/api/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ riderId, date, status }),
          })
          if (!res.ok) throw new Error("Failed to save")
          const { record } = (await res.json()) as {
            record: AvailabilityRecord
          }
          const base = current?.records ?? []
          return { records: [...base.filter((r) => r.id !== record.id), record] }
        },
        {
          optimisticData: (current) => ({
            records: buildNext(current?.records ?? []),
          }),
          rollbackOnError: true,
          revalidate: false,
        },
      )
    },
    [mutate],
  )

  return { map, isLoading, setStatus }
}

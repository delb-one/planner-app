import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
} from "date-fns"

/** Month key format used across the app and API, e.g. "2026-07". */
export function monthKey(date: Date): string {
  return format(date, "yyyy-MM")
}

/** Parse a "yyyy-MM" key into a Date at the first day of that month. */
export function parseMonthKey(key: string): Date {
  const [year, month] = key.split("-").map(Number)
  return new Date(year, month - 1, 1)
}

export function shiftMonth(date: Date, amount: number): Date {
  return addMonths(date, amount)
}

/** All days within the given month as Date objects. */
export function daysInMonth(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  })
}

export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

/** Weekday index with Monday as the first day of the week (0 = Mon .. 6 = Sun). */
export function mondayFirstWeekday(date: Date): number {
  return (date.getDay() + 6) % 7
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b)
}

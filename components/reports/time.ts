import { addDays, getDay, isBefore, set } from "date-fns"
import { fromZonedTime } from "date-fns-tz"

export const getNextFriday8pm = (): Date => {
  const now = new Date()
  const today8pm = set(now, { hours: 20, minutes: 0, seconds: 0, milliseconds: 0 })

  if (getDay(now) === 5 && isBefore(now, today8pm)) {
    // Today is Friday and before 8pm → countdown to today 8pm
    return fromZonedTime(today8pm, "America/Los_Angeles")
  }

  // Otherwise, find the next Friday
  const daysUntilFriday = (5 + 7 - getDay(now)) % 7 || 7 // days until next Friday
  const nextFridayDate = addDays(today8pm, daysUntilFriday)
  return fromZonedTime(nextFridayDate, "America/Los_Angeles")
}

export const getNextMonday630am = (): Date => {
  const now = new Date()
  const today630am = set(now, { hours: 6, minutes: 30, seconds: 0, milliseconds: 0 })

  if (getDay(now) === 1 && isBefore(now, today630am)) {
    // Today is Monday and before 6:30am → countdown to today
    return fromZonedTime(today630am, "America/Los_Angeles")
  }

  // Otherwise, find next Monday
  const daysUntilMonday = (1 + 7 - getDay(now)) % 7 || 7
  const nextMondayDate = addDays(today630am, daysUntilMonday)
  return fromZonedTime(nextMondayDate, "America/Los_Angeles")
}

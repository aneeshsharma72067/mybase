import { format, isValid } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

export function generateId(): string {
  return uuidv4()
}

export function formatDate(date: string | Date, fmt = 'yyyy-MM-dd'): string {
  const resolvedDate = date instanceof Date ? date : new Date(date)

  if (!isValid(resolvedDate)) {
    return ''
  }

  return format(resolvedDate, fmt)
}

export function getTodayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}
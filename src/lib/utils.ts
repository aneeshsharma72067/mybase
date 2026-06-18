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

export const MAX_AVATAR_BYTES = 2 * 1024 * 1024

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
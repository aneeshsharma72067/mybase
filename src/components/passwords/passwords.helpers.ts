import { Mail, Shield, ShoppingCart, Trees, type LucideIcon } from 'lucide-react'

export type PasswordStrength = 'strong' | 'fair' | 'weak'

export interface PasswordGeneratorOptions {
  length: number
  includeUpper: boolean
  includeLower: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export interface DraftPasswordEntry {
  label: string
  username: string
  password: string
  url: string
  notes: string
}

export const initialDraftEntry: DraftPasswordEntry = {
  label: '',
  username: '',
  password: '',
  url: '',
  notes: '',
}

export function scorePassword(password: string): PasswordStrength {
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNum = /\d/.test(password)
  const hasSymbol = /[^a-zA-Z0-9]/.test(password)
  const lengthScore = password.length >= 12 ? 1 : password.length >= 8 ? 0 : -1
  const varietyScore = [hasUpper, hasLower, hasNum, hasSymbol].filter(Boolean).length
  const total = lengthScore + varietyScore

  if (total >= 4) {
    return 'strong'
  }

  if (total >= 2) {
    return 'fair'
  }

  return 'weak'
}

export function generatePassword(options: PasswordGeneratorOptions): string {
  const charsets = [
    options.includeUpper ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '',
    options.includeLower ? 'abcdefghijklmnopqrstuvwxyz' : '',
    options.includeNumbers ? '0123456789' : '',
    options.includeSymbols ? '!@#$%^&*()-_=+[]{};:,.?' : '',
  ]

  const pool = charsets.join('')

  if (pool.length === 0) {
    return ''
  }

  let next = ''

  for (let i = 0; i < options.length; i += 1) {
    const random = Math.floor(Math.random() * pool.length)
    next += pool[random]
  }

  return next
}

export function resolvePasswordIcon(label: string): LucideIcon {
  const normalized = label.toLowerCase()

  if (normalized.includes('mail') || normalized.includes('proton')) {
    return Mail
  }

  if (normalized.includes('cloud') || normalized.includes('digital')) {
    return Shield
  }

  if (normalized.includes('amazon') || normalized.includes('shop')) {
    return ShoppingCart
  }

  return Trees
}
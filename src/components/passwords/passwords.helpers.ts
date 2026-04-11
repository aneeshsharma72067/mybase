import { Mail, Shield, ShoppingCart, Trees, type LucideIcon } from 'lucide-react'
import type { PasswordEntry } from '../../types/password.types'

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

export const seedVault: Array<Omit<PasswordEntry, 'id' | 'createdAt'>> = [
  {
    label: 'ProtonMail',
    username: 'alara.woods@proton.me',
    encryptedPassword: 'F0rest!Bloom#2026',
    url: 'https://mail.proton.me',
    notes: 'Secure email',
  },
  {
    label: 'DigitalOcean',
    username: 'dev_admin_root',
    encryptedPassword: 'Dock3r_Cloud_9',
    url: 'https://cloud.digitalocean.com',
    notes: 'Infrastructure',
  },
  {
    label: 'Amazon',
    username: 'alara.woods@gmail.com',
    encryptedPassword: 'amaz0n',
    url: 'https://amazon.com',
    notes: 'Shopping',
  },
  {
    label: 'Outdoor Inc.',
    username: 'hiking_pro_2024',
    encryptedPassword: 'Moss&Trail_88#',
    url: 'https://example.com/outdoor',
    notes: 'Gear portal',
  },
]

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
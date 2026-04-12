import type { SettingsAccent, SettingsBorderStyle, SettingsThemeMode } from '../types/settings.types'

export function applyTheme(mode: SettingsThemeMode): void {
  if (typeof window === 'undefined') {
    return
  }

  const root = document.documentElement

  if (mode === 'light') {
    root.classList.remove('dark')
    return
  }

  if (mode === 'dark') {
    root.classList.add('dark')
    return
  }

  const media = window.matchMedia('(prefers-color-scheme: dark)')
  root.classList.toggle('dark', media.matches)
}

export function applyAccent(accent: SettingsAccent): void {
  if (typeof window === 'undefined') {
    return
  }

  const root = document.documentElement

  if (accent === 'primary') {
    root.style.setProperty('--color-primary', '#3f6754')
    root.style.setProperty('--color-primary-dim', '#335b48')
    root.style.setProperty('--color-primary-container', '#c1ecd4')
    root.style.setProperty('--color-on-primary', '#e6ffef')
    root.style.setProperty('--color-on-primary-container', '#325947')
    return
  }

  if (accent === 'secondary') {
    root.style.setProperty('--color-primary', 'var(--color-secondary)')
    root.style.setProperty('--color-primary-dim', 'var(--color-secondary-dim)')
    root.style.setProperty('--color-primary-container', 'var(--color-secondary-container)')
    root.style.setProperty('--color-on-primary', 'var(--color-on-secondary)')
    root.style.setProperty('--color-on-primary-container', 'var(--color-on-secondary-container)')
    return
  }

  if (accent === 'orange') {
    root.style.setProperty('--color-primary', '#b76a2d')
    root.style.setProperty('--color-primary-dim', '#9f5922')
    root.style.setProperty('--color-primary-container', '#f8d8bd')
    root.style.setProperty('--color-on-primary', '#fff4ea')
    root.style.setProperty('--color-on-primary-container', '#6b3b16')
    return
  }

  if (accent === 'blue') {
    root.style.setProperty('--color-primary', '#2f5fa8')
    root.style.setProperty('--color-primary-dim', '#264f90')
    root.style.setProperty('--color-primary-container', '#cde0ff')
    root.style.setProperty('--color-on-primary', '#eef4ff')
    root.style.setProperty('--color-on-primary-container', '#1d3f73')
    return
  }

  root.style.setProperty('--color-primary', 'var(--color-tertiary)')
  root.style.setProperty('--color-primary-dim', 'var(--color-tertiary-dim)')
  root.style.setProperty('--color-primary-container', 'var(--color-tertiary-container)')
  root.style.setProperty('--color-on-primary', 'var(--color-on-tertiary)')
  root.style.setProperty('--color-on-primary-container', 'var(--color-on-tertiary-container)')
}

export function applyBorderStyle(borderStyle: SettingsBorderStyle): void {
  if (typeof window === 'undefined') {
    return
  }

  document.documentElement.dataset.uiRadius = borderStyle
}

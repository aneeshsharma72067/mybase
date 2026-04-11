import { KeyRound, Palette, Shield, SlidersHorizontal, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { SettingsHeader } from '../components/settings/SettingsHeader'
import { SettingsSection } from '../components/settings/SettingsSection'
import { SettingsSwitchRow } from '../components/settings/SettingsSwitchRow'
import { useSettingsStore } from '../store/useSettingsStore'
import type { SettingsAccent, SettingsBorderStyle, SettingsLandingPage, SettingsThemeMode, UserSettings } from '../types/settings.types'

const accentMap: Record<SettingsAccent, { label: string; swatch: string }> = {
  primary: { label: 'Forest Green', swatch: 'bg-primary' },
  secondary: { label: 'Earthy Teal', swatch: 'bg-secondary' },
  tertiary: { label: 'Soft Botanical', swatch: 'bg-tertiary' },
}

const landingOptions: Array<{ value: SettingsLandingPage; label: string }> = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'thoughts', label: 'Thoughts' },
  { value: 'goals', label: 'Goals' },
  { value: 'todos', label: 'Todo List' },
  { value: 'bookmarks', label: 'Bookmarks' },
  { value: 'passwords', label: 'Passwords' },
  { value: 'income', label: 'Income' },
  { value: 'settings', label: 'Settings' },
]

const autoLockOptions: Array<{ label: string; value: UserSettings['autoLockMinutes'] }> = [
  { label: '5 Minutes', value: 5 },
  { label: '15 Minutes', value: 15 },
  { label: '1 Hour', value: 60 },
  { label: 'Never', value: 0 },
]

function applyTheme(mode: SettingsThemeMode) {
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

function applyAccent(accent: SettingsAccent) {
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

  root.style.setProperty('--color-primary', 'var(--color-tertiary)')
  root.style.setProperty('--color-primary-dim', 'var(--color-tertiary-dim)')
  root.style.setProperty('--color-primary-container', 'var(--color-tertiary-container)')
  root.style.setProperty('--color-on-primary', 'var(--color-on-tertiary)')
  root.style.setProperty('--color-on-primary-container', 'var(--color-on-tertiary-container)')
}

export function SettingsPage() {
  const savedSettings = useSettingsStore((state) => state.settings)
  const setSettings = useSettingsStore((state) => state.setSettings)
  const [draft, setDraft] = useState(savedSettings)
  const [statusText, setStatusText] = useState('Adjust your setup and save when ready')

  useEffect(() => {
    setDraft(savedSettings)
  }, [savedSettings])

  useEffect(() => {
    applyTheme(savedSettings.themeMode)
    applyAccent(savedSettings.accent)
    document.documentElement.dataset.uiRadius = savedSettings.borderStyle
  }, [savedSettings])

  useEffect(() => {
    if (draft.themeMode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('auto')
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [draft.themeMode])

  const hasChanges = useMemo(() => JSON.stringify(draft) !== JSON.stringify(savedSettings), [draft, savedSettings])

  function updateDraft(patch: Partial<UserSettings>) {
    setDraft((current) => ({ ...current, ...patch }))
  }

  function handleSave() {
    setSettings(draft)
    setStatusText('Changes saved')
  }

  function handleDiscard() {
    setDraft(savedSettings)
    setStatusText('Changes discarded')
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl pb-24">
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-64 w-64 rounded-full bg-primary-container/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 left-0 -z-10 h-56 w-56 rounded-full bg-secondary-container/40 blur-3xl" />

      <SettingsHeader statusText={statusText} />

      <div className="mx-auto w-full max-w-5xl space-y-8">
        <SettingsSection title="Profile" icon={User} tone="primary">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="flex flex-col items-center justify-center gap-4 md:col-span-4 md:border-r md:border-outline-variant/20 md:pr-8">
              <img
                src={draft.avatarUrl}
                alt="Profile avatar"
                className="h-28 w-28 rounded-full border-4 border-surface-container-lowest object-cover shadow-lg"
              />
              <button
                type="button"
                className="rounded-full bg-surface-container px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container-high"
                onClick={() => setStatusText('Avatar uploads will be added in the next iteration')}
              >
                Change Avatar
              </button>
            </div>
            <div className="space-y-5 md:col-span-8">
              <label className="block space-y-2">
                <span className="px-1 text-sm font-bold text-on-surface-variant">Display Name</span>
                <input
                  type="text"
                  value={draft.displayName}
                  onChange={(event) => updateDraft({ displayName: event.target.value })}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                />
              </label>
              <label className="block space-y-2">
                <span className="px-1 text-sm font-bold text-on-surface-variant">Email Address</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(event) => updateDraft({ email: event.target.value })}
                  className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
                />
              </label>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance" icon={Palette} tone="secondary">
          <div className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">Color Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {([['light', 'Light'], ['dark', 'Dark'], ['auto', 'Auto']] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateDraft({ themeMode: value })}
                    className={[
                      'rounded-xl border-2 px-4 py-4 text-xs font-bold transition-colors',
                      draft.themeMode === value
                        ? 'border-primary bg-surface-container-lowest text-primary'
                        : 'border-transparent bg-surface-container-high text-on-surface-variant hover:border-outline-variant',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">Accent Color</h3>
              <div className="flex flex-wrap gap-4">
                {(Object.keys(accentMap) as SettingsAccent[]).map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    onClick={() => updateDraft({ accent })}
                    className="inline-flex items-center gap-3"
                  >
                    <span
                      className={[
                        'inline-flex h-10 w-10 items-center justify-center rounded-full text-on-primary transition-all',
                        accentMap[accent].swatch,
                        draft.accent === accent ? 'ring-4 ring-primary/20' : '',
                      ].join(' ')}
                    >
                      {draft.accent === accent ? '✓' : ''}
                    </span>
                    <span className="text-xs font-semibold text-on-surface-variant">{accentMap[accent].label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface p-4">
              <div>
                <p className="font-bold text-on-surface">Border Style</p>
                <p className="text-xs text-on-surface-variant">Choose the visual corner style for settings surfaces.</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-secondary-container/30 p-1">
                {([['smooth', 'Smooth'], ['sharp', 'Sharp']] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateDraft({ borderStyle: value as SettingsBorderStyle })}
                    className={[
                      'rounded-full px-4 py-1.5 text-xs font-bold transition-colors',
                      draft.borderStyle === value
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Preferences" icon={SlidersHorizontal} tone="tertiary">
          <div className="space-y-6">
            <SettingsSwitchRow
              title="Enable Notifications"
              description="Get alerts for goals and upcoming todo items"
              checked={draft.notificationsEnabled}
              onChange={(checked) => updateDraft({ notificationsEnabled: checked })}
            />

            <div className="border-t border-outline-variant/20 pt-6">
              <label className="mb-3 block text-sm font-bold text-on-surface-variant">Default Landing Page</label>
              <select
                value={draft.defaultLandingPage}
                onChange={(event) => updateDraft({ defaultLandingPage: event.target.value as SettingsLandingPage })}
                className="w-full rounded-xl border border-outline-variant/50 bg-surface px-4 py-3 text-on-surface outline-none transition-colors focus:border-primary"
              >
                {landingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Security" icon={Shield} tone="error">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-[200px] flex-1">
                <p className="font-bold text-on-surface">Master Password</p>
                <p className="text-sm text-on-surface-variant">Update the key that protects your private data.</p>
              </div>
              <button
                type="button"
                onClick={() => setStatusText('Password rotation flow opened')}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-6 py-3 font-bold text-on-surface hover:bg-surface-container"
              >
                <KeyRound size={16} />
                Change Master Password
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/20 pt-6">
              <div className="min-w-[200px] flex-1">
                <p className="font-bold text-on-surface">Auto-lock vault</p>
                <p className="text-sm text-on-surface-variant">Automatically secure your base after inactivity.</p>
              </div>
              <select
                value={String(draft.autoLockMinutes)}
                onChange={(event) => updateDraft({ autoLockMinutes: Number(event.target.value) as UserSettings['autoLockMinutes'] })}
                className="rounded-xl border border-outline-variant/50 bg-surface px-4 py-2 font-bold text-on-surface outline-none transition-colors focus:border-primary"
              >
                {autoLockOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </SettingsSection>

        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="px-6 py-3 font-bold text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
            disabled={!hasChanges}
          >
            Discard changes
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-on-primary shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            disabled={!hasChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

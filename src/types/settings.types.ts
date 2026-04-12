export type SettingsThemeMode = 'light' | 'dark' | 'auto'
export type SettingsAccent = 'primary' | 'secondary' | 'tertiary' | 'orange' | 'blue'
export type SettingsBorderStyle = 'smooth' | 'sharp'
export type SettingsLandingPage =
  | 'dashboard'
  | 'thoughts'
  | 'goals'
  | 'todos'
  | 'bookmarks'
  | 'passwords'
  | 'income'
  | 'settings'

export interface UserSettings {
  displayName: string
  email: string
  avatarUrl: string
  themeMode: SettingsThemeMode
  accent: SettingsAccent
  borderStyle: SettingsBorderStyle
  notificationsEnabled: boolean
  defaultLandingPage: SettingsLandingPage
  autoLockMinutes: 5 | 15 | 60 | 0
}

export interface SettingsStoreState {
  settings: UserSettings
}

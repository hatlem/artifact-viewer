import type { Strings } from './strings'

export interface Theme {
  brandColor: string
  accentColor: string
  logoUrl?: string
  fontFamily: string
  /**
   * Optional per-key overrides on top of the locale-resolved string pack.
   * Leave undefined to use the package's built-in English/Norwegian packs
   * (selected automatically from `artifact.locale`).
   */
  strings?: Partial<Strings>
}

export const defaultTheme: Theme = {
  brandColor: '#0a0a0a',
  accentColor: '#2563eb',
  fontFamily: 'system-ui, -apple-system, sans-serif',
}

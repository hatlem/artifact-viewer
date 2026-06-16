import type { ReactNode } from 'react'
import type { Theme } from './theme'
import { defaultTheme } from './theme'
import type { PublicPayload, RespondInput, RespondResult } from './types'
import { selectSurface } from './logic'
import { SlideDeck } from './SlideDeck'
import { OfferView } from './OfferView'
import { AgreementView } from './AgreementView'

export function ArtifactViewer({ payload, theme = defaultTheme, onRespond }: {
  payload: PublicPayload
  theme?: Theme
  onRespond: (input: RespondInput) => Promise<RespondResult>
}) {
  const surface = selectSurface(payload)
  const a = payload.artifact
  const wrap = (children: ReactNode) => (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: 24, fontFamily: theme.fontFamily, color: theme.brandColor }}>
      {theme.logoUrl && <img src={theme.logoUrl} alt="" style={{ height: 28, marginBottom: 24 }} />}
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>{a.title}</h1>
      {children}
    </div>
  )

  if (surface === 'unavailable') return wrap(<p style={{ color: '#6b7280' }}>{theme.strings.unavailable}</p>)
  if (surface === 'expired') return wrap(<div><p style={{ color: '#b45309' }}>{theme.strings.expired}</p></div>)
  if (surface === 'signed') return wrap(<div style={{ padding: 16, background: '#f0fdf4', color: '#166534', borderRadius: 8 }}>✓ {theme.strings.signed}{payload.signedAt ? ` — ${new Date(payload.signedAt).toLocaleString('nb-NO')}` : ''}</div>)
  if (surface === 'presentation') {
    const slides = ((a.content as { slides?: unknown[] })?.slides ?? []) as never[]
    return wrap(<SlideDeck slides={slides} theme={theme} />)
  }
  if (surface === 'offer') return wrap(<OfferView content={(a.content ?? {}) as never} lines={a.lines ?? []} theme={theme} />)
  return wrap(<AgreementView content={(a.content ?? {}) as never} theme={theme} onRespond={onRespond} />)
}

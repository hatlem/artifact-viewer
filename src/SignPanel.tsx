import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Theme } from './theme'
import type { Strings } from './strings'
import type { RespondInput, RespondResult, SignInitiateResult } from './types'
import { validateSign } from './logic'

export interface SignPanelProps {
  theme: Theme
  strings: Strings
  loc: string
  onRespond: (input: RespondInput) => Promise<RespondResult>
  available?: ('bankid' | 'vipps')[]
  onSignInitiate?: (provider: 'bankid' | 'vipps', signerEmail: string) => Promise<SignInitiateResult>
}

export function SignPanel({ theme, strings, loc, onRespond, available, onSignInitiate }: SignPanelProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<RespondResult | null>(null)
  const [error, setError] = useState('')

  // Provider-aware state
  const [providerEmail, setProviderEmail] = useState('')
  const [providerError, setProviderError] = useState('')
  const [providerBusy, setProviderBusy] = useState<'bankid' | 'vipps' | null>(null)

  const v = validateSign({ signerName: name, signerEmail: email, consent })

  const useFormal = !!(available && available.length > 0 && onSignInitiate)

  async function submit(outcome: 'accepted' | 'declined') {
    setError(''); setBusy(true)
    const res = await onRespond({ outcome, signerName: name, signerEmail: email, signerTitle: title || undefined, consent })
    setBusy(false)
    if (res.ok) setDone(res)
    else setError(res.error ?? strings.errorGeneric)
  }

  async function initiateProvider(provider: 'bankid' | 'vipps') {
    setProviderError('')
    const trimmed = providerEmail.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setProviderError(strings.invalidEmail)
      return
    }
    setProviderBusy(provider)
    const res = await onSignInitiate!(provider, trimmed)
    setProviderBusy(null)
    if (res.signingUrl) {
      window.location.assign(res.signingUrl)
    } else {
      setProviderError(res.error ?? strings.errorGeneric)
    }
  }

  if (done) {
    return <div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: '#f0fdf4', color: '#166534' }}>
      ✓ {strings.signed} — {done.signedAt ? new Date(done.signedAt).toLocaleString(loc) : ''}
    </div>
  }

  return (
    <div style={{ marginTop: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      {useFormal && (
        <div style={{ marginBottom: 20 }}>
          <input
            aria-label={strings.signerEmail}
            placeholder={strings.signerEmail}
            value={providerEmail}
            onChange={(e) => setProviderEmail(e.target.value)}
            style={inp}
          />
          {providerError && <p style={{ color: '#dc2626', fontSize: 14, margin: '4px 0 8px' }}>{providerError}</p>}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {available!.map((provider) => (
              <button
                key={provider}
                disabled={providerBusy !== null}
                onClick={() => initiateProvider(provider)}
                style={{
                  ...btn,
                  background: provider === 'bankid' ? '#002776' : '#FF5B24',
                  color: '#fff',
                  opacity: providerBusy !== null ? 0.6 : 1,
                }}
              >
                {providerBusy === provider ? '...' : provider === 'bankid' ? strings.signWithBankId : strings.signWithVipps}
              </button>
            ))}
          </div>
          <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{strings.orSignWithEmail}</p>
        </div>
      )}
      <input aria-label={strings.signerName} placeholder={strings.signerName} value={name} onChange={(e) => setName(e.target.value)} style={inp} />
      <input aria-label={strings.signerEmail} placeholder={strings.signerEmail} value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
      <input aria-label={strings.signerTitle} placeholder={strings.signerTitle} value={title} onChange={(e) => setTitle(e.target.value)} style={inp} />
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0' }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        {strings.consent}
      </label>
      {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button disabled={!v.ok || busy} onClick={() => submit('accepted')} style={{ ...btn, background: theme.accentColor, color: '#fff', opacity: !v.ok || busy ? 0.5 : 1 }}>{strings.accept}</button>
        <button disabled={busy} onClick={() => submit('declined')} style={{ ...btn, background: '#fff', color: theme.brandColor, border: '1px solid #e5e7eb' }}>{strings.decline}</button>
      </div>
    </div>
  )
}

const inp: CSSProperties = { display: 'block', width: '100%', padding: '8px 12px', margin: '6px 0', border: '1px solid #e5e7eb', borderRadius: 6 }
const btn: CSSProperties = { padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14 }

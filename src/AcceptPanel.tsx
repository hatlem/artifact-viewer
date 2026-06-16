import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Theme } from './theme'
import type { RespondInput, RespondResult, PayInitiateResult } from './types'

export interface AcceptPanelProps {
  theme: Theme
  available: ('stripe' | 'vipps' | 'fiken')[]
  onPayInitiate?: (method: 'stripe' | 'vipps' | 'fiken', email: string) => Promise<PayInitiateResult>
  onRespond: (input: RespondInput) => Promise<RespondResult>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const METHOD_LABELS: Record<'stripe' | 'vipps' | 'fiken', string> = {
  stripe: 'Betal med kort',
  vipps: 'Betal med Vipps',
  fiken: 'Faktura (EHF)',
}

const METHOD_COLORS: Record<'stripe' | 'vipps' | 'fiken', string> = {
  stripe: '#635bff',
  vipps: '#FF5B24',
  fiken: '#1a5276',
}

export function AcceptPanel({ theme, available, onPayInitiate, onRespond }: AcceptPanelProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [busy, setBusy] = useState<'stripe' | 'vipps' | 'fiken' | 'accept' | null>(null)
  const [error, setError] = useState('')
  const [done, setDone] = useState<'paid' | 'invoiced' | 'accepted' | null>(null)

  const hasPayment = available.length > 0 && onPayInitiate != null

  function validateEmail(): boolean {
    const trimmed = email.trim()
    if (!trimmed || !EMAIL.test(trimmed)) {
      setEmailError('Oppgi en gyldig e-postadresse for å fortsette')
      return false
    }
    setEmailError('')
    return true
  }

  async function initiatePayment(method: 'stripe' | 'vipps' | 'fiken') {
    if (!validateEmail()) return
    setError('')
    setBusy(method)
    const res = await onPayInitiate!(method, email.trim())
    setBusy(null)
    if (res.hostedUrl) {
      window.location.assign(res.hostedUrl)
    } else if (res.error) {
      setError(res.error)
    } else {
      // No hostedUrl and no error = invoice sent (fiken / async flow)
      setDone('invoiced')
    }
  }

  async function acceptWithoutPayment() {
    if (!validateEmail()) return
    setError('')
    setBusy('accept')
    const trimmed = email.trim()
    const res = await onRespond({
      outcome: 'accepted',
      signerName: trimmed,
      signerEmail: trimmed,
      consent: true,
    })
    setBusy(null)
    if (res.ok) {
      setDone('accepted')
    } else {
      setError(res.error ?? 'Noe gikk galt')
    }
  }

  if (done === 'paid' || done === 'accepted') {
    return (
      <div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: '#f0fdf4', color: '#166534' }}>
        ✓ Takk!
      </div>
    )
  }

  if (done === 'invoiced') {
    return (
      <div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: '#eff6ff', color: '#1e40af' }}>
        ✓ Faktura sendt — vi tar kontakt med betalingsinformasjon.
      </div>
    )
  }

  return (
    <div style={{ marginTop: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <input
        aria-label="E-postadresse"
        placeholder="Din e-postadresse"
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
        style={inp}
      />
      {emailError && <p style={{ color: '#dc2626', fontSize: 14, margin: '4px 0 8px' }}>{emailError}</p>}

      {hasPayment ? (
        <>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            {available.map((method) => (
              <button
                key={method}
                disabled={busy !== null}
                onClick={() => initiatePayment(method)}
                style={{
                  ...btn,
                  background: METHOD_COLORS[method],
                  color: '#fff',
                  opacity: busy !== null ? 0.6 : 1,
                }}
              >
                {busy === method ? '...' : METHOD_LABELS[method]}
              </button>
            ))}
          </div>
          <hr style={{ margin: '16px 0', borderColor: '#e5e7eb' }} />
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>Eller aksepter uten betaling nå:</p>
          <button
            disabled={busy !== null}
            onClick={acceptWithoutPayment}
            style={{ ...btn, background: theme.accentColor, color: '#fff', opacity: busy !== null ? 0.5 : 1 }}
          >
            {busy === 'accept' ? '...' : 'Aksepter tilbud'}
          </button>
        </>
      ) : (
        <button
          disabled={busy !== null}
          onClick={acceptWithoutPayment}
          style={{ ...btn, background: theme.accentColor, color: '#fff', marginTop: 8, opacity: busy !== null ? 0.5 : 1 }}
        >
          {busy === 'accept' ? '...' : 'Aksepter tilbud'}
        </button>
      )}

      {error && <p style={{ color: '#dc2626', fontSize: 14, marginTop: 8 }}>{error}</p>}
    </div>
  )
}

const inp: CSSProperties = { display: 'block', width: '100%', padding: '8px 12px', margin: '6px 0', border: '1px solid #e5e7eb', borderRadius: 6 }
const btn: CSSProperties = { padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14 }

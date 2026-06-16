import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { Theme } from './theme'
import type { RespondInput, RespondResult } from './types'
import { validateSign } from './logic'

export function SignPanel({ theme, onRespond }: { theme: Theme; onRespond: (input: RespondInput) => Promise<RespondResult> }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<RespondResult | null>(null)
  const [error, setError] = useState('')

  const v = validateSign({ signerName: name, signerEmail: email, consent })

  async function submit(outcome: 'accepted' | 'declined') {
    setError(''); setBusy(true)
    const res = await onRespond({ outcome, signerName: name, signerEmail: email, signerTitle: title || undefined, consent })
    setBusy(false)
    if (res.ok) setDone(res)
    else setError(res.error ?? 'Noe gikk galt')
  }

  if (done) {
    return <div style={{ marginTop: 24, padding: 16, borderRadius: 8, background: '#f0fdf4', color: '#166534' }}>
      ✓ {theme.strings.signed} — {done.signedAt ? new Date(done.signedAt).toLocaleString('nb-NO') : ''}
    </div>
  }

  return (
    <div style={{ marginTop: 24, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <input aria-label={theme.strings.signerName} placeholder={theme.strings.signerName} value={name} onChange={(e) => setName(e.target.value)} style={inp} />
      <input aria-label={theme.strings.signerEmail} placeholder={theme.strings.signerEmail} value={email} onChange={(e) => setEmail(e.target.value)} style={inp} />
      <input aria-label={theme.strings.signerTitle} placeholder={theme.strings.signerTitle} value={title} onChange={(e) => setTitle(e.target.value)} style={inp} />
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0' }}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        {theme.strings.consent}
      </label>
      {error && <p style={{ color: '#dc2626', fontSize: 14 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button disabled={!v.ok || busy} onClick={() => submit('accepted')} style={{ ...btn, background: theme.accentColor, color: '#fff', opacity: !v.ok || busy ? 0.5 : 1 }}>{theme.strings.accept}</button>
        <button disabled={busy} onClick={() => submit('declined')} style={{ ...btn, background: '#fff', color: theme.brandColor, border: '1px solid #e5e7eb' }}>{theme.strings.decline}</button>
      </div>
    </div>
  )
}

const inp: CSSProperties = { display: 'block', width: '100%', padding: '8px 12px', margin: '6px 0', border: '1px solid #e5e7eb', borderRadius: 6 }
const btn: CSSProperties = { padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14 }

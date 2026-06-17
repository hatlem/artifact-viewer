import type { Theme } from './theme'
import type { Strings } from './strings'
import type { RespondInput, RespondResult, SignInitiateResult } from './types'
import { SignPanel } from './SignPanel'

interface AgreementContent { bodyMarkdown?: string; snapshotLines?: { name: string; quantity: number; unit_price_ore: number; vat_rate: number }[] }

export function AgreementView({
  content,
  theme,
  strings,
  loc,
  onRespond,
  available,
  onSignInitiate,
}: {
  content: AgreementContent
  theme: Theme
  strings: Strings
  loc: string
  onRespond: (i: RespondInput) => Promise<RespondResult>
  available?: ('bankid' | 'vipps')[]
  onSignInitiate?: (provider: 'bankid' | 'vipps', signerEmail: string) => Promise<SignInitiateResult>
}) {
  return (
    <div style={{ fontFamily: theme.fontFamily }}>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 15, lineHeight: 1.6 }}>{content.bodyMarkdown ?? ''}</pre>
      <SignPanel theme={theme} strings={strings} loc={loc} onRespond={onRespond} available={available} onSignInitiate={onSignInitiate} />
    </div>
  )
}

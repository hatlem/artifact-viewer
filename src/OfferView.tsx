import type { Theme } from './theme'
import type { Strings } from './strings'
import type { PublicLine, RespondInput, RespondResult, PayInitiateResult } from './types'
import { formatOre } from './logic'
import { AcceptPanel } from './AcceptPanel'

interface OfferContent { currency?: string; introSections?: { heading: string; body: string }[] }

export interface OfferViewProps {
  content: OfferContent
  lines: PublicLine[]
  theme: Theme
  strings: Strings
  loc: string
  available: ('stripe' | 'vipps' | 'fiken')[]
  onPayInitiate?: (method: 'stripe' | 'vipps' | 'fiken', email: string) => Promise<PayInitiateResult>
  onRespond: (input: RespondInput) => Promise<RespondResult>
}

export function OfferView({ content, lines, theme, strings, loc, available, onPayInitiate, onRespond }: OfferViewProps) {
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unit_price_ore, 0)
  const vat = lines.reduce((s, l) => s + Math.round((l.quantity * l.unit_price_ore * l.vat_rate) / 100), 0)
  // Show the currency code when supplied (e.g. "NOK", "EUR"); otherwise omit a currency suffix.
  const cur = content.currency ? ` ${content.currency}` : ''
  const money = (ore: number) => `${formatOre(ore, loc)}${cur}`
  return (
    <div style={{ fontFamily: theme.fontFamily }}>
      {(content.introSections ?? []).map((sec, k) => (
        <section key={k} style={{ marginBottom: 16 }}>
          <h3 style={{ color: theme.brandColor }}>{sec.heading}</h3>
          <p>{sec.body}</p>
        </section>
      ))}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead><tr style={{ textAlign: 'left', color: '#6b7280' }}><th>{strings.offerItem}</th><th>{strings.offerQty}</th><th style={{ textAlign: 'right' }}>{strings.offerPrice}</th></tr></thead>
        <tbody>
          {lines.map((l, k) => (
            <tr key={k} style={{ borderTop: '1px solid #e5e7eb' }}>
              <td style={{ padding: '6px 0' }}>{l.name}</td><td>{l.quantity}</td>
              <td style={{ textAlign: 'right' }}>{money(l.quantity * l.unit_price_ore)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: 12 }}>
        <div>{strings.subtotal} {money(subtotal)}</div>
        <div>{strings.vat} {money(vat)}</div>
        <div style={{ fontWeight: 600 }}>{strings.total} {money(subtotal + vat)}</div>
      </div>
      <AcceptPanel
        theme={theme}
        strings={strings}
        available={available}
        onPayInitiate={onPayInitiate}
        onRespond={onRespond}
      />
    </div>
  )
}

import type { Theme } from './theme'
import type { PublicLine } from './types'
import { formatOre } from './logic'

interface OfferContent { currency?: string; introSections?: { heading: string; body: string }[] }

export function OfferView({ content, lines, theme }: { content: OfferContent; lines: PublicLine[]; theme: Theme }) {
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unit_price_ore, 0)
  const vat = lines.reduce((s, l) => s + Math.round((l.quantity * l.unit_price_ore * l.vat_rate) / 100), 0)
  return (
    <div style={{ fontFamily: theme.fontFamily }}>
      {(content.introSections ?? []).map((sec, k) => (
        <section key={k} style={{ marginBottom: 16 }}>
          <h3 style={{ color: theme.brandColor }}>{sec.heading}</h3>
          <p>{sec.body}</p>
        </section>
      ))}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead><tr style={{ textAlign: 'left', color: '#6b7280' }}><th>Post</th><th>Ant.</th><th style={{ textAlign: 'right' }}>Pris</th></tr></thead>
        <tbody>
          {lines.map((l, k) => (
            <tr key={k} style={{ borderTop: '1px solid #e5e7eb' }}>
              <td style={{ padding: '6px 0' }}>{l.name}</td><td>{l.quantity}</td>
              <td style={{ textAlign: 'right' }}>{formatOre(l.quantity * l.unit_price_ore)} kr</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'right', marginTop: 12 }}>
        <div>Sum: {formatOre(subtotal)} kr</div>
        <div>MVA: {formatOre(vat)} kr</div>
        <div style={{ fontWeight: 600 }}>Totalt: {formatOre(subtotal + vat)} kr</div>
      </div>
    </div>
  )
}

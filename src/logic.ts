import type { PublicPayload } from './types'

/** øre → grouped NOK kroner string (no decimals; nb-NO grouping). */
export function formatOre(ore: number): string {
  return Math.round(ore / 100)
    .toLocaleString('nb-NO')
    .replace(/ /g, ' ')  // non-breaking space → regular space
    .replace(/ /g, ' ')  // narrow no-break space → regular space
}

/** Clamp a slide index into [0, count-1]; 0 when there are no slides. */
export function clampSlide(index: number, count: number): number {
  if (count <= 0) return 0
  if (index < 0) return 0
  if (index > count - 1) return count - 1
  return index
}

export type Surface = 'presentation' | 'offer' | 'agreement' | 'signed' | 'expired' | 'unavailable'

/** Decide which surface to render from the payload + state. */
export function selectSurface(payload: PublicPayload): Surface {
  if (payload.signed || payload.artifact.status === 'signed' || payload.artifact.status === 'accepted') return 'signed'
  if (payload.artifact.status === 'declined') return 'unavailable'
  if (payload.expired) return 'expired'
  const t = payload.artifact.type
  return t === 'presentation' || t === 'offer' || t === 'agreement' ? t : 'unavailable'
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSign(input: { signerName: string; signerEmail: string; consent: boolean }): { ok: boolean; reason?: string } {
  if (!input.signerName || input.signerName.trim().length === 0) return { ok: false, reason: 'name' }
  if (!EMAIL.test(input.signerEmail)) return { ok: false, reason: 'email' }
  if (!input.consent) return { ok: false, reason: 'consent' }
  return { ok: true }
}

export interface PublicArtifact {
  type: 'presentation' | 'offer' | 'agreement'
  title: string
  locale: string
  status: string
  content: unknown
  lines?: PublicLine[]
}

export interface PublicLine {
  name: string
  description?: string | null
  quantity: number
  unit_price_ore: number
  vat_rate: number
  discount_kind?: 'none' | 'pct' | 'amount'
  discount_value?: number
  duration_kind?: 'one_time' | 'monthly' | 'yearly'
  duration_days?: number | null
}

export interface PublicPayload {
  expired: boolean
  signed?: boolean
  signedAt?: string
  artifact: PublicArtifact
}

export interface RespondInput {
  outcome: 'accepted' | 'declined'
  signerName: string
  signerEmail: string
  signerTitle?: string
  consent: boolean
  message?: string
}

export interface RespondResult {
  ok: boolean
  status?: string
  signedAt?: string
  error?: string
}

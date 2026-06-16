export interface Theme {
  brandColor: string
  accentColor: string
  logoUrl?: string
  fontFamily: string
  strings: {
    accept: string
    decline: string
    consent: string
    signerName: string
    signerEmail: string
    signerTitle: string
    signed: string
    unavailable: string
    expired: string
  }
}

export const defaultTheme: Theme = {
  brandColor: '#0a0a0a',
  accentColor: '#2563eb',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  strings: {
    accept: 'Aksepter',
    decline: 'Avslå',
    consent: 'Jeg aksepterer vilkårene',
    signerName: 'Fullt navn',
    signerEmail: 'E-post',
    signerTitle: 'Tittel (valgfritt)',
    signed: 'Signert',
    unavailable: 'Dette dokumentet er ikke tilgjengelig.',
    expired: 'Dette dokumentet er utløpt.',
  },
}

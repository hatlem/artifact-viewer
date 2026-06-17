export interface Strings {
  // sign/accept actions
  accept: string; decline: string; consent: string
  signerName: string; signerEmail: string; signerTitle: string
  emailAddressLabel: string; emailAddressPlaceholder: string
  signWithBankId: string; signWithVipps: string; orSignWithEmail: string
  acceptOffer: string; orAcceptWithoutPayment: string
  payWithCard: string; payWithVipps: string; payByInvoice: string
  // statuses / confirmations
  signed: string; paid: string; refLabel: string; thanks: string
  invoiceSentMessage: string; downloadSignedAgreement: string
  unavailable: string; expired: string
  // offer table + totals
  offerItem: string; offerQty: string; offerPrice: string
  subtotal: string; vat: string; total: string
  // errors
  errorGeneric: string; invalidEmail: string
  // slide nav (aria)
  previousSlide: string; nextSlide: string
}

export const EN: Strings = {
  accept: 'Accept', decline: 'Decline', consent: 'I accept the terms',
  signerName: 'Full name', signerEmail: 'Email', signerTitle: 'Title (optional)',
  emailAddressLabel: 'Email address', emailAddressPlaceholder: 'Your email address',
  signWithBankId: 'Sign with BankID', signWithVipps: 'Sign with Vipps', orSignWithEmail: 'Or sign with name and email:',
  acceptOffer: 'Accept offer', orAcceptWithoutPayment: 'Or accept without payment now:',
  payWithCard: 'Pay with card', payWithVipps: 'Pay with Vipps', payByInvoice: 'Invoice (EHF)',
  signed: 'Signed', paid: 'Paid', refLabel: 'Ref:', thanks: 'Thank you!',
  invoiceSentMessage: 'Invoice sent — we will contact you with payment details.',
  downloadSignedAgreement: 'Download signed agreement (PDF)',
  unavailable: 'This document is not available.', expired: 'This document has expired.',
  offerItem: 'Item', offerQty: 'Qty.', offerPrice: 'Price',
  subtotal: 'Subtotal:', vat: 'VAT:', total: 'Total:',
  errorGeneric: 'Something went wrong', invalidEmail: 'Please enter a valid email address to continue',
  previousSlide: 'Previous', nextSlide: 'Next',
}

export const NB: Strings = {
  accept: 'Aksepter', decline: 'Avslå', consent: 'Jeg aksepterer vilkårene',
  signerName: 'Fullt navn', signerEmail: 'E-post', signerTitle: 'Tittel (valgfritt)',
  emailAddressLabel: 'E-postadresse', emailAddressPlaceholder: 'Din e-postadresse',
  signWithBankId: 'Signer med BankID', signWithVipps: 'Signer med Vipps', orSignWithEmail: 'Eller signer med navn og e-post:',
  acceptOffer: 'Aksepter tilbud', orAcceptWithoutPayment: 'Eller aksepter uten betaling nå:',
  payWithCard: 'Betal med kort', payWithVipps: 'Betal med Vipps', payByInvoice: 'Faktura (EHF)',
  signed: 'Signert', paid: 'Betalt', refLabel: 'Ref:', thanks: 'Takk!',
  invoiceSentMessage: 'Faktura sendt — vi tar kontakt med betalingsinformasjon.',
  downloadSignedAgreement: 'Last ned signert avtale (PDF)',
  unavailable: 'Dette dokumentet er ikke tilgjengelig.', expired: 'Dette dokumentet er utløpt.',
  offerItem: 'Post', offerQty: 'Ant.', offerPrice: 'Pris',
  subtotal: 'Sum:', vat: 'MVA:', total: 'Totalt:',
  errorGeneric: 'Noe gikk galt', invalidEmail: 'Oppgi en gyldig e-postadresse for å fortsette',
  previousSlide: 'Forrige', nextSlide: 'Neste',
}

/** nb/nn/no → Norwegian, everything else → English. */
export function isNorwegian(locale?: string): boolean {
  return ['nb', 'nn', 'no'].includes((locale || '').slice(0, 2).toLowerCase())
}

/** Resolve the active strings: locale pack (EN base, NB when Norwegian) with optional per-key theme overrides. */
export function resolveStrings(locale: string | undefined, overrides?: Partial<Strings>): Strings {
  const base = isNorwegian(locale) ? NB : EN
  return overrides ? { ...base, ...overrides } : base
}

/** Map an artifact locale to an Intl locale tag for number/date formatting. */
export function intlLocale(locale?: string): string {
  return isNorwegian(locale) ? 'nb-NO' : 'en-US'
}

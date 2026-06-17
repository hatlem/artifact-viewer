import * as react from 'react';

interface Strings {
    accept: string;
    decline: string;
    consent: string;
    signerName: string;
    signerEmail: string;
    signerTitle: string;
    emailAddressLabel: string;
    emailAddressPlaceholder: string;
    signWithBankId: string;
    signWithVipps: string;
    orSignWithEmail: string;
    acceptOffer: string;
    orAcceptWithoutPayment: string;
    payWithCard: string;
    payWithVipps: string;
    payByInvoice: string;
    signed: string;
    paid: string;
    refLabel: string;
    thanks: string;
    invoiceSentMessage: string;
    downloadSignedAgreement: string;
    unavailable: string;
    expired: string;
    offerItem: string;
    offerQty: string;
    offerPrice: string;
    subtotal: string;
    vat: string;
    total: string;
    errorGeneric: string;
    invalidEmail: string;
    previousSlide: string;
    nextSlide: string;
}
declare const EN: Strings;
declare const NB: Strings;
/** nb/nn/no → Norwegian, everything else → English. */
declare function isNorwegian(locale?: string): boolean;
/** Resolve the active strings: locale pack (EN base, NB when Norwegian) with optional per-key theme overrides. */
declare function resolveStrings(locale: string | undefined, overrides?: Partial<Strings>): Strings;
/** Map an artifact locale to an Intl locale tag for number/date formatting. */
declare function intlLocale(locale?: string): string;

interface Theme {
    brandColor: string;
    accentColor: string;
    logoUrl?: string;
    fontFamily: string;
    /**
     * Optional per-key overrides on top of the locale-resolved string pack.
     * Leave undefined to use the package's built-in English/Norwegian packs
     * (selected automatically from `artifact.locale`).
     */
    strings?: Partial<Strings>;
}
declare const defaultTheme: Theme;

interface PublicArtifact {
    type: 'presentation' | 'offer' | 'agreement';
    title: string;
    locale: string;
    status: string;
    content: unknown;
    lines?: PublicLine[];
}
interface PublicLine {
    name: string;
    description?: string | null;
    quantity: number;
    unit_price_ore: number;
    vat_rate: number;
    discount_kind?: 'none' | 'pct' | 'amount';
    discount_value?: number;
    duration_kind?: 'one_time' | 'monthly' | 'yearly';
    duration_days?: number | null;
}
interface PublicPayload {
    expired: boolean;
    signed?: boolean;
    signedAt?: string;
    artifact: PublicArtifact;
    signing?: {
        available: ('bankid' | 'vipps')[];
    };
    signedDocumentUrl?: string;
    payment?: {
        available: ('stripe' | 'vipps' | 'fiken')[];
    };
    paidAt?: string;
    paymentRef?: string;
}
interface SignInitiateResult {
    signingUrl?: string;
    error?: string;
}
interface PayInitiateResult {
    hostedUrl?: string;
    error?: string;
}
interface RespondInput {
    outcome: 'accepted' | 'declined';
    signerName: string;
    signerEmail: string;
    signerTitle?: string;
    consent: boolean;
    message?: string;
}
interface RespondResult {
    ok: boolean;
    status?: string;
    signedAt?: string;
    error?: string;
}

declare function ArtifactViewer({ payload, theme, onRespond, onSignInitiate, onPayInitiate }: {
    payload: PublicPayload;
    theme?: Theme;
    onRespond: (input: RespondInput) => Promise<RespondResult>;
    onSignInitiate?: (provider: 'bankid' | 'vipps', signerEmail: string) => Promise<SignInitiateResult>;
    onPayInitiate?: (method: 'stripe' | 'vipps' | 'fiken', email: string) => Promise<PayInitiateResult>;
}): react.JSX.Element;

interface AcceptPanelProps {
    theme: Theme;
    strings: Strings;
    available: ('stripe' | 'vipps' | 'fiken')[];
    onPayInitiate?: (method: 'stripe' | 'vipps' | 'fiken', email: string) => Promise<PayInitiateResult>;
    onRespond: (input: RespondInput) => Promise<RespondResult>;
}
declare function AcceptPanel({ theme, strings, available, onPayInitiate, onRespond }: AcceptPanelProps): react.JSX.Element;

declare function signingButtons(signing?: {
    available: ('bankid' | 'vipps')[];
}): ('bankid' | 'vipps')[];
declare function paymentButtons(payment?: {
    available: ('stripe' | 'vipps' | 'fiken')[];
}): ('stripe' | 'vipps' | 'fiken')[];

export { AcceptPanel, type AcceptPanelProps, ArtifactViewer, EN, NB, type PayInitiateResult, type PublicArtifact, type PublicLine, type PublicPayload, type RespondInput, type RespondResult, type SignInitiateResult, type Strings, type Theme, defaultTheme, intlLocale, isNorwegian, paymentButtons, resolveStrings, signingButtons };

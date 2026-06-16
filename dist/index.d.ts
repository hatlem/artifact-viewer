import * as react from 'react';

interface Theme {
    brandColor: string;
    accentColor: string;
    logoUrl?: string;
    fontFamily: string;
    strings: {
        accept: string;
        decline: string;
        consent: string;
        signerName: string;
        signerEmail: string;
        signerTitle: string;
        signed: string;
        unavailable: string;
        expired: string;
    };
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
}
interface SignInitiateResult {
    signingUrl?: string;
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

declare function ArtifactViewer({ payload, theme, onRespond, onSignInitiate }: {
    payload: PublicPayload;
    theme?: Theme;
    onRespond: (input: RespondInput) => Promise<RespondResult>;
    onSignInitiate?: (provider: 'bankid' | 'vipps', signerEmail: string) => Promise<SignInitiateResult>;
}): react.JSX.Element;

declare function signingButtons(signing?: {
    available: ('bankid' | 'vipps')[];
}): ('bankid' | 'vipps')[];

export { ArtifactViewer, type PublicArtifact, type PublicLine, type PublicPayload, type RespondInput, type RespondResult, type SignInitiateResult, type Theme, defaultTheme, signingButtons };

// src/theme.ts
var defaultTheme = {
  brandColor: "#0a0a0a",
  accentColor: "#2563eb",
  fontFamily: "system-ui, -apple-system, sans-serif"
};

// src/logic.ts
function formatOre(ore, locale = "en-US") {
  return Math.round(ore / 100).toLocaleString(locale).replace(/ /g, " ").replace(/ /g, " ");
}
function clampSlide(index, count) {
  if (count <= 0) return 0;
  if (index < 0) return 0;
  if (index > count - 1) return count - 1;
  return index;
}
function selectSurface(payload) {
  if (payload.signed || payload.artifact.status === "signed" || payload.artifact.status === "accepted") return "signed";
  if (payload.artifact.status === "declined") return "unavailable";
  if (payload.expired) return "expired";
  const t = payload.artifact.type;
  return t === "presentation" || t === "offer" || t === "agreement" ? t : "unavailable";
}
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateSign(input) {
  if (!input.signerName || input.signerName.trim().length === 0) return { ok: false, reason: "name" };
  if (!EMAIL.test(input.signerEmail)) return { ok: false, reason: "email" };
  if (!input.consent) return { ok: false, reason: "consent" };
  return { ok: true };
}
function signingButtons(signing) {
  return signing?.available ?? [];
}
function paymentButtons(payment) {
  return payment?.available ?? [];
}

// src/strings.ts
var EN = {
  accept: "Accept",
  decline: "Decline",
  consent: "I accept the terms",
  signerName: "Full name",
  signerEmail: "Email",
  signerTitle: "Title (optional)",
  emailAddressLabel: "Email address",
  emailAddressPlaceholder: "Your email address",
  signWithBankId: "Sign with BankID",
  signWithVipps: "Sign with Vipps",
  orSignWithEmail: "Or sign with name and email:",
  acceptOffer: "Accept offer",
  orAcceptWithoutPayment: "Or accept without payment now:",
  payWithCard: "Pay with card",
  payWithVipps: "Pay with Vipps",
  payByInvoice: "Invoice (EHF)",
  signed: "Signed",
  paid: "Paid",
  refLabel: "Ref:",
  thanks: "Thank you!",
  invoiceSentMessage: "Invoice sent \u2014 we will contact you with payment details.",
  downloadSignedAgreement: "Download signed agreement (PDF)",
  unavailable: "This document is not available.",
  expired: "This document has expired.",
  offerItem: "Item",
  offerQty: "Qty.",
  offerPrice: "Price",
  subtotal: "Subtotal:",
  vat: "VAT:",
  total: "Total:",
  errorGeneric: "Something went wrong",
  invalidEmail: "Please enter a valid email address to continue",
  previousSlide: "Previous",
  nextSlide: "Next"
};
var NB = {
  accept: "Aksepter",
  decline: "Avsl\xE5",
  consent: "Jeg aksepterer vilk\xE5rene",
  signerName: "Fullt navn",
  signerEmail: "E-post",
  signerTitle: "Tittel (valgfritt)",
  emailAddressLabel: "E-postadresse",
  emailAddressPlaceholder: "Din e-postadresse",
  signWithBankId: "Signer med BankID",
  signWithVipps: "Signer med Vipps",
  orSignWithEmail: "Eller signer med navn og e-post:",
  acceptOffer: "Aksepter tilbud",
  orAcceptWithoutPayment: "Eller aksepter uten betaling n\xE5:",
  payWithCard: "Betal med kort",
  payWithVipps: "Betal med Vipps",
  payByInvoice: "Faktura (EHF)",
  signed: "Signert",
  paid: "Betalt",
  refLabel: "Ref:",
  thanks: "Takk!",
  invoiceSentMessage: "Faktura sendt \u2014 vi tar kontakt med betalingsinformasjon.",
  downloadSignedAgreement: "Last ned signert avtale (PDF)",
  unavailable: "Dette dokumentet er ikke tilgjengelig.",
  expired: "Dette dokumentet er utl\xF8pt.",
  offerItem: "Post",
  offerQty: "Ant.",
  offerPrice: "Pris",
  subtotal: "Sum:",
  vat: "MVA:",
  total: "Totalt:",
  errorGeneric: "Noe gikk galt",
  invalidEmail: "Oppgi en gyldig e-postadresse for \xE5 fortsette",
  previousSlide: "Forrige",
  nextSlide: "Neste"
};
function isNorwegian(locale) {
  return ["nb", "nn", "no"].includes((locale || "").slice(0, 2).toLowerCase());
}
function resolveStrings(locale, overrides) {
  const base = isNorwegian(locale) ? NB : EN;
  return overrides ? { ...base, ...overrides } : base;
}
function intlLocale(locale) {
  return isNorwegian(locale) ? "nb-NO" : "en-US";
}

// src/SlideDeck.tsx
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function SlideDeck({ slides, theme, strings }) {
  const [i, setI] = useState(0);
  const go = (n) => setI((cur) => clampSlide(cur + n, slides.length));
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);
  if (slides.length === 0) return /* @__PURE__ */ jsx("p", { style: { color: "#6b7280" }, children: "\u2014" });
  const s = slides[clampSlide(i, slides.length)];
  return /* @__PURE__ */ jsxs("div", { style: { fontFamily: theme.fontFamily }, children: [
    /* @__PURE__ */ jsx("div", { style: { minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, padding: 32, transition: "opacity 0.3s" }, children: s.blocks.map((b, k) => {
      if (b.type === "heading") return /* @__PURE__ */ jsx("h2", { style: { color: theme.brandColor, fontSize: 32 }, children: b.text }, k);
      if (b.type === "bullets") return /* @__PURE__ */ jsx("ul", { children: (b.items ?? []).map((it, m) => /* @__PURE__ */ jsx("li", { children: it }, m)) }, k);
      if (b.type === "image" && b.url) return /* @__PURE__ */ jsx("img", { src: b.url, alt: "", style: { maxWidth: "100%" } }, k);
      return /* @__PURE__ */ jsx("p", { style: { fontSize: 18, lineHeight: 1.6 }, children: b.text }, k);
    }) }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }, children: [
      /* @__PURE__ */ jsx("button", { onClick: () => go(-1), disabled: i === 0, "aria-label": strings.previousSlide, style: navBtn, children: "\u2190" }),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: 13, color: "#6b7280" }, children: [
        i + 1,
        " / ",
        slides.length
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => go(1), disabled: i >= slides.length - 1, "aria-label": strings.nextSlide, style: navBtn, children: "\u2192" })
    ] }),
    /* @__PURE__ */ jsx("div", { style: { height: 3, background: "#e5e7eb", borderRadius: 2 }, children: /* @__PURE__ */ jsx("div", { style: { height: "100%", width: `${(i + 1) / slides.length * 100}%`, background: theme.accentColor, borderRadius: 2, transition: "width 0.3s" } }) })
  ] });
}
var navBtn = { padding: "6px 14px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" };

// src/AcceptPanel.tsx
import { useState as useState2 } from "react";
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var EMAIL2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var METHOD_COLORS = {
  stripe: "#635bff",
  vipps: "#FF5B24",
  fiken: "#1a5276"
};
function AcceptPanel({ theme, strings, available, onPayInitiate, onRespond }) {
  const methodLabels = {
    stripe: strings.payWithCard,
    vipps: strings.payWithVipps,
    fiken: strings.payByInvoice
  };
  const [email, setEmail] = useState2("");
  const [emailError, setEmailError] = useState2("");
  const [busy, setBusy] = useState2(null);
  const [error, setError] = useState2("");
  const [done, setDone] = useState2(null);
  const hasPayment = available.length > 0 && onPayInitiate != null;
  function validateEmail() {
    const trimmed = email.trim();
    if (!trimmed || !EMAIL2.test(trimmed)) {
      setEmailError(strings.invalidEmail);
      return false;
    }
    setEmailError("");
    return true;
  }
  async function initiatePayment(method) {
    if (!validateEmail()) return;
    setError("");
    setBusy(method);
    const res = await onPayInitiate(method, email.trim());
    setBusy(null);
    if (res.hostedUrl) {
      window.location.assign(res.hostedUrl);
    } else if (res.error) {
      setError(res.error);
    } else {
      setDone("invoiced");
    }
  }
  async function acceptWithoutPayment() {
    if (!validateEmail()) return;
    setError("");
    setBusy("accept");
    const trimmed = email.trim();
    const res = await onRespond({
      outcome: "accepted",
      signerName: trimmed,
      signerEmail: trimmed,
      consent: true
    });
    setBusy(null);
    if (res.ok) {
      setDone("accepted");
    } else {
      setError(res.error ?? strings.errorGeneric);
    }
  }
  if (done === "paid" || done === "accepted") {
    return /* @__PURE__ */ jsxs2("div", { style: { marginTop: 24, padding: 16, borderRadius: 8, background: "#f0fdf4", color: "#166534" }, children: [
      "\u2713 ",
      strings.thanks
    ] });
  }
  if (done === "invoiced") {
    return /* @__PURE__ */ jsxs2("div", { style: { marginTop: 24, padding: 16, borderRadius: 8, background: "#eff6ff", color: "#1e40af" }, children: [
      "\u2713 ",
      strings.invoiceSentMessage
    ] });
  }
  return /* @__PURE__ */ jsxs2("div", { style: { marginTop: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }, children: [
    /* @__PURE__ */ jsx2(
      "input",
      {
        "aria-label": strings.emailAddressLabel,
        placeholder: strings.emailAddressPlaceholder,
        type: "email",
        value: email,
        onChange: (e) => {
          setEmail(e.target.value);
          setEmailError("");
        },
        style: inp
      }
    ),
    emailError && /* @__PURE__ */ jsx2("p", { style: { color: "#dc2626", fontSize: 14, margin: "4px 0 8px" }, children: emailError }),
    hasPayment ? /* @__PURE__ */ jsxs2(Fragment, { children: [
      /* @__PURE__ */ jsx2("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }, children: available.map((method) => /* @__PURE__ */ jsx2(
        "button",
        {
          disabled: busy !== null,
          onClick: () => initiatePayment(method),
          style: {
            ...btn,
            background: METHOD_COLORS[method],
            color: "#fff",
            opacity: busy !== null ? 0.6 : 1
          },
          children: busy === method ? "..." : methodLabels[method]
        },
        method
      )) }),
      /* @__PURE__ */ jsx2("hr", { style: { margin: "16px 0", borderColor: "#e5e7eb" } }),
      /* @__PURE__ */ jsx2("p", { style: { fontSize: 13, color: "#6b7280", marginBottom: 8 }, children: strings.orAcceptWithoutPayment }),
      /* @__PURE__ */ jsx2(
        "button",
        {
          disabled: busy !== null,
          onClick: acceptWithoutPayment,
          style: { ...btn, background: theme.accentColor, color: "#fff", opacity: busy !== null ? 0.5 : 1 },
          children: busy === "accept" ? "..." : strings.acceptOffer
        }
      )
    ] }) : /* @__PURE__ */ jsx2(
      "button",
      {
        disabled: busy !== null,
        onClick: acceptWithoutPayment,
        style: { ...btn, background: theme.accentColor, color: "#fff", marginTop: 8, opacity: busy !== null ? 0.5 : 1 },
        children: busy === "accept" ? "..." : strings.acceptOffer
      }
    ),
    error && /* @__PURE__ */ jsx2("p", { style: { color: "#dc2626", fontSize: 14, marginTop: 8 }, children: error })
  ] });
}
var inp = { display: "block", width: "100%", padding: "8px 12px", margin: "6px 0", border: "1px solid #e5e7eb", borderRadius: 6 };
var btn = { padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14 };

// src/OfferView.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function OfferView({ content, lines, theme, strings, loc, available, onPayInitiate, onRespond }) {
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unit_price_ore, 0);
  const vat = lines.reduce((s, l) => s + Math.round(l.quantity * l.unit_price_ore * l.vat_rate / 100), 0);
  const cur = content.currency ? ` ${content.currency}` : "";
  const money = (ore) => `${formatOre(ore, loc)}${cur}`;
  return /* @__PURE__ */ jsxs3("div", { style: { fontFamily: theme.fontFamily }, children: [
    (content.introSections ?? []).map((sec, k) => /* @__PURE__ */ jsxs3("section", { style: { marginBottom: 16 }, children: [
      /* @__PURE__ */ jsx3("h3", { style: { color: theme.brandColor }, children: sec.heading }),
      /* @__PURE__ */ jsx3("p", { children: sec.body })
    ] }, k)),
    /* @__PURE__ */ jsxs3("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 14 }, children: [
      /* @__PURE__ */ jsx3("thead", { children: /* @__PURE__ */ jsxs3("tr", { style: { textAlign: "left", color: "#6b7280" }, children: [
        /* @__PURE__ */ jsx3("th", { children: strings.offerItem }),
        /* @__PURE__ */ jsx3("th", { children: strings.offerQty }),
        /* @__PURE__ */ jsx3("th", { style: { textAlign: "right" }, children: strings.offerPrice })
      ] }) }),
      /* @__PURE__ */ jsx3("tbody", { children: lines.map((l, k) => /* @__PURE__ */ jsxs3("tr", { style: { borderTop: "1px solid #e5e7eb" }, children: [
        /* @__PURE__ */ jsx3("td", { style: { padding: "6px 0" }, children: l.name }),
        /* @__PURE__ */ jsx3("td", { children: l.quantity }),
        /* @__PURE__ */ jsx3("td", { style: { textAlign: "right" }, children: money(l.quantity * l.unit_price_ore) })
      ] }, k)) })
    ] }),
    /* @__PURE__ */ jsxs3("div", { style: { textAlign: "right", marginTop: 12 }, children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        strings.subtotal,
        " ",
        money(subtotal)
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        strings.vat,
        " ",
        money(vat)
      ] }),
      /* @__PURE__ */ jsxs3("div", { style: { fontWeight: 600 }, children: [
        strings.total,
        " ",
        money(subtotal + vat)
      ] })
    ] }),
    /* @__PURE__ */ jsx3(
      AcceptPanel,
      {
        theme,
        strings,
        available,
        onPayInitiate,
        onRespond
      }
    )
  ] });
}

// src/SignPanel.tsx
import { useState as useState3 } from "react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function SignPanel({ theme, strings, loc, onRespond, available, onSignInitiate }) {
  const [name, setName] = useState3("");
  const [email, setEmail] = useState3("");
  const [title, setTitle] = useState3("");
  const [consent, setConsent] = useState3(false);
  const [busy, setBusy] = useState3(false);
  const [done, setDone] = useState3(null);
  const [error, setError] = useState3("");
  const [providerEmail, setProviderEmail] = useState3("");
  const [providerError, setProviderError] = useState3("");
  const [providerBusy, setProviderBusy] = useState3(null);
  const v = validateSign({ signerName: name, signerEmail: email, consent });
  const useFormal = !!(available && available.length > 0 && onSignInitiate);
  async function submit(outcome) {
    setError("");
    setBusy(true);
    const res = await onRespond({ outcome, signerName: name, signerEmail: email, signerTitle: title || void 0, consent });
    setBusy(false);
    if (res.ok) setDone(res);
    else setError(res.error ?? strings.errorGeneric);
  }
  async function initiateProvider(provider) {
    setProviderError("");
    const trimmed = providerEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setProviderError(strings.invalidEmail);
      return;
    }
    setProviderBusy(provider);
    const res = await onSignInitiate(provider, trimmed);
    setProviderBusy(null);
    if (res.signingUrl) {
      window.location.assign(res.signingUrl);
    } else {
      setProviderError(res.error ?? strings.errorGeneric);
    }
  }
  if (done) {
    return /* @__PURE__ */ jsxs4("div", { style: { marginTop: 24, padding: 16, borderRadius: 8, background: "#f0fdf4", color: "#166534" }, children: [
      "\u2713 ",
      strings.signed,
      " \u2014 ",
      done.signedAt ? new Date(done.signedAt).toLocaleString(loc) : ""
    ] });
  }
  return /* @__PURE__ */ jsxs4("div", { style: { marginTop: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }, children: [
    useFormal && /* @__PURE__ */ jsxs4("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ jsx4(
        "input",
        {
          "aria-label": strings.signerEmail,
          placeholder: strings.signerEmail,
          value: providerEmail,
          onChange: (e) => setProviderEmail(e.target.value),
          style: inp2
        }
      ),
      providerError && /* @__PURE__ */ jsx4("p", { style: { color: "#dc2626", fontSize: 14, margin: "4px 0 8px" }, children: providerError }),
      /* @__PURE__ */ jsx4("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: available.map((provider) => /* @__PURE__ */ jsx4(
        "button",
        {
          disabled: providerBusy !== null,
          onClick: () => initiateProvider(provider),
          style: {
            ...btn2,
            background: provider === "bankid" ? "#002776" : "#FF5B24",
            color: "#fff",
            opacity: providerBusy !== null ? 0.6 : 1
          },
          children: providerBusy === provider ? "..." : provider === "bankid" ? strings.signWithBankId : strings.signWithVipps
        },
        provider
      )) }),
      /* @__PURE__ */ jsx4("hr", { style: { margin: "16px 0", borderColor: "#e5e7eb" } }),
      /* @__PURE__ */ jsx4("p", { style: { fontSize: 13, color: "#6b7280", marginBottom: 8 }, children: strings.orSignWithEmail })
    ] }),
    /* @__PURE__ */ jsx4("input", { "aria-label": strings.signerName, placeholder: strings.signerName, value: name, onChange: (e) => setName(e.target.value), style: inp2 }),
    /* @__PURE__ */ jsx4("input", { "aria-label": strings.signerEmail, placeholder: strings.signerEmail, value: email, onChange: (e) => setEmail(e.target.value), style: inp2 }),
    /* @__PURE__ */ jsx4("input", { "aria-label": strings.signerTitle, placeholder: strings.signerTitle, value: title, onChange: (e) => setTitle(e.target.value), style: inp2 }),
    /* @__PURE__ */ jsxs4("label", { style: { display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }, children: [
      /* @__PURE__ */ jsx4("input", { type: "checkbox", checked: consent, onChange: (e) => setConsent(e.target.checked) }),
      strings.consent
    ] }),
    error && /* @__PURE__ */ jsx4("p", { style: { color: "#dc2626", fontSize: 14 }, children: error }),
    /* @__PURE__ */ jsxs4("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ jsx4("button", { disabled: !v.ok || busy, onClick: () => submit("accepted"), style: { ...btn2, background: theme.accentColor, color: "#fff", opacity: !v.ok || busy ? 0.5 : 1 }, children: strings.accept }),
      /* @__PURE__ */ jsx4("button", { disabled: busy, onClick: () => submit("declined"), style: { ...btn2, background: "#fff", color: theme.brandColor, border: "1px solid #e5e7eb" }, children: strings.decline })
    ] })
  ] });
}
var inp2 = { display: "block", width: "100%", padding: "8px 12px", margin: "6px 0", border: "1px solid #e5e7eb", borderRadius: 6 };
var btn2 = { padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14 };

// src/AgreementView.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function AgreementView({
  content,
  theme,
  strings,
  loc,
  onRespond,
  available,
  onSignInitiate
}) {
  return /* @__PURE__ */ jsxs5("div", { style: { fontFamily: theme.fontFamily }, children: [
    /* @__PURE__ */ jsx5("pre", { style: { whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 15, lineHeight: 1.6 }, children: content.bodyMarkdown ?? "" }),
    /* @__PURE__ */ jsx5(SignPanel, { theme, strings, loc, onRespond, available, onSignInitiate })
  ] });
}

// src/ArtifactViewer.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function ArtifactViewer({ payload, theme = defaultTheme, onRespond, onSignInitiate, onPayInitiate }) {
  const surface = selectSurface(payload);
  const a = payload.artifact;
  const strings = resolveStrings(a.locale, theme.strings);
  const loc = intlLocale(a.locale);
  const wrap = (children) => /* @__PURE__ */ jsxs6("div", { style: { maxWidth: 880, margin: "0 auto", padding: 24, fontFamily: theme.fontFamily, color: theme.brandColor }, children: [
    theme.logoUrl && /* @__PURE__ */ jsx6("img", { src: theme.logoUrl, alt: "", style: { height: 28, marginBottom: 24 } }),
    /* @__PURE__ */ jsx6("h1", { style: { fontSize: 24, marginBottom: 16 }, children: a.title }),
    children
  ] });
  if (surface === "unavailable") return wrap(/* @__PURE__ */ jsx6("p", { style: { color: "#6b7280" }, children: strings.unavailable }));
  if (surface === "expired") return wrap(/* @__PURE__ */ jsx6("div", { children: /* @__PURE__ */ jsx6("p", { style: { color: "#b45309" }, children: strings.expired }) }));
  if (surface === "signed") return wrap(
    /* @__PURE__ */ jsxs6("div", { children: [
      /* @__PURE__ */ jsxs6("div", { style: { padding: 16, background: "#f0fdf4", color: "#166534", borderRadius: 8 }, children: [
        "\u2713 ",
        strings.signed,
        payload.signedAt ? ` \u2014 ${new Date(payload.signedAt).toLocaleString(loc)}` : ""
      ] }),
      payload.signedDocumentUrl && /* @__PURE__ */ jsx6("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ jsx6("a", { href: payload.signedDocumentUrl, style: { color: theme.accentColor }, children: strings.downloadSignedAgreement }) })
    ] })
  );
  if (surface === "presentation") {
    const slides = a.content?.slides ?? [];
    return wrap(/* @__PURE__ */ jsx6(SlideDeck, { slides, theme, strings }));
  }
  if (surface === "offer") {
    if (payload.paidAt) {
      return wrap(
        /* @__PURE__ */ jsxs6("div", { style: { padding: 16, background: "#f0fdf4", color: "#166534", borderRadius: 8 }, children: [
          "\u2713 ",
          strings.paid,
          payload.paidAt ? ` \u2014 ${new Date(payload.paidAt).toLocaleString(loc)}` : "",
          payload.paymentRef && /* @__PURE__ */ jsxs6("span", { style: { marginLeft: 8, fontSize: 13, color: "#166534" }, children: [
            strings.refLabel,
            " ",
            payload.paymentRef
          ] })
        ] })
      );
    }
    return wrap(
      /* @__PURE__ */ jsx6(
        OfferView,
        {
          content: a.content ?? {},
          lines: a.lines ?? [],
          theme,
          strings,
          loc,
          available: payload.payment?.available ?? [],
          onPayInitiate,
          onRespond
        }
      )
    );
  }
  return wrap(
    /* @__PURE__ */ jsx6(
      AgreementView,
      {
        content: a.content ?? {},
        theme,
        strings,
        loc,
        onRespond,
        available: payload.signing?.available ?? [],
        onSignInitiate
      }
    )
  );
}
export {
  AcceptPanel,
  ArtifactViewer,
  EN,
  NB,
  defaultTheme,
  intlLocale,
  isNorwegian,
  paymentButtons,
  resolveStrings,
  signingButtons
};

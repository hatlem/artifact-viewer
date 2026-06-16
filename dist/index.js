"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AcceptPanel: () => AcceptPanel,
  ArtifactViewer: () => ArtifactViewer,
  defaultTheme: () => defaultTheme,
  paymentButtons: () => paymentButtons,
  signingButtons: () => signingButtons
});
module.exports = __toCommonJS(index_exports);

// src/theme.ts
var defaultTheme = {
  brandColor: "#0a0a0a",
  accentColor: "#2563eb",
  fontFamily: "system-ui, -apple-system, sans-serif",
  strings: {
    accept: "Aksepter",
    decline: "Avsl\xE5",
    consent: "Jeg aksepterer vilk\xE5rene",
    signerName: "Fullt navn",
    signerEmail: "E-post",
    signerTitle: "Tittel (valgfritt)",
    signed: "Signert",
    unavailable: "Dette dokumentet er ikke tilgjengelig.",
    expired: "Dette dokumentet er utl\xF8pt."
  }
};

// src/logic.ts
function formatOre(ore) {
  return Math.round(ore / 100).toLocaleString("nb-NO").replace(/ /g, " ").replace(/ /g, " ");
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

// src/SlideDeck.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
function SlideDeck({ slides, theme }) {
  const [i, setI] = (0, import_react.useState)(0);
  const go = (n) => setI((cur) => clampSlide(cur + n, slides.length));
  (0, import_react.useEffect)(() => {
    function onKey(e) {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);
  if (slides.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: "#6b7280" }, children: "\u2014" });
  const s = slides[clampSlide(i, slides.length)];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { fontFamily: theme.fontFamily }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16, padding: 32, transition: "opacity 0.3s" }, children: s.blocks.map((b, k) => {
      if (b.type === "heading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { style: { color: theme.brandColor, fontSize: 32 }, children: b.text }, k);
      if (b.type === "bullets") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: (b.items ?? []).map((it, m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: it }, m)) }, k);
      if (b.type === "image" && b.url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: b.url, alt: "", style: { maxWidth: "100%" } }, k);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { fontSize: 18, lineHeight: 1.6 }, children: b.text }, k);
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => go(-1), disabled: i === 0, "aria-label": "Forrige", style: navBtn, children: "\u2190" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { style: { fontSize: 13, color: "#6b7280" }, children: [
        i + 1,
        " / ",
        slides.length
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { onClick: () => go(1), disabled: i >= slides.length - 1, "aria-label": "Neste", style: navBtn, children: "\u2192" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: 3, background: "#e5e7eb", borderRadius: 2 }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { height: "100%", width: `${(i + 1) / slides.length * 100}%`, background: theme.accentColor, borderRadius: 2, transition: "width 0.3s" } }) })
  ] });
}
var navBtn = { padding: "6px 14px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" };

// src/AcceptPanel.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var EMAIL2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var METHOD_LABELS = {
  stripe: "Betal med kort",
  vipps: "Betal med Vipps",
  fiken: "Faktura (EHF)"
};
var METHOD_COLORS = {
  stripe: "#635bff",
  vipps: "#FF5B24",
  fiken: "#1a5276"
};
function AcceptPanel({ theme, available, onPayInitiate, onRespond }) {
  const [email, setEmail] = (0, import_react2.useState)("");
  const [emailError, setEmailError] = (0, import_react2.useState)("");
  const [busy, setBusy] = (0, import_react2.useState)(null);
  const [error, setError] = (0, import_react2.useState)("");
  const [done, setDone] = (0, import_react2.useState)(null);
  const hasPayment = available.length > 0 && onPayInitiate != null;
  function validateEmail() {
    const trimmed = email.trim();
    if (!trimmed || !EMAIL2.test(trimmed)) {
      setEmailError("Oppgi en gyldig e-postadresse for \xE5 fortsette");
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
      setError(res.error ?? "Noe gikk galt");
    }
  }
  if (done === "paid" || done === "accepted") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginTop: 24, padding: 16, borderRadius: 8, background: "#f0fdf4", color: "#166534" }, children: "\u2713 Takk!" });
  }
  if (done === "invoiced") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { marginTop: 24, padding: 16, borderRadius: 8, background: "#eff6ff", color: "#1e40af" }, children: "\u2713 Faktura sendt \u2014 vi tar kontakt med betalingsinformasjon." });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { style: { marginTop: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      {
        "aria-label": "E-postadresse",
        placeholder: "Din e-postadresse",
        type: "email",
        value: email,
        onChange: (e) => {
          setEmail(e.target.value);
          setEmailError("");
        },
        style: inp
      }
    ),
    emailError && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { color: "#dc2626", fontSize: 14, margin: "4px 0 8px" }, children: emailError }),
    hasPayment ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_jsx_runtime2.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }, children: available.map((method) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
          children: busy === method ? "..." : METHOD_LABELS[method]
        },
        method
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("hr", { style: { margin: "16px 0", borderColor: "#e5e7eb" } }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { fontSize: 13, color: "#6b7280", marginBottom: 8 }, children: "Eller aksepter uten betaling n\xE5:" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "button",
        {
          disabled: busy !== null,
          onClick: acceptWithoutPayment,
          style: { ...btn, background: theme.accentColor, color: "#fff", opacity: busy !== null ? 0.5 : 1 },
          children: busy === "accept" ? "..." : "Aksepter tilbud"
        }
      )
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "button",
      {
        disabled: busy !== null,
        onClick: acceptWithoutPayment,
        style: { ...btn, background: theme.accentColor, color: "#fff", marginTop: 8, opacity: busy !== null ? 0.5 : 1 },
        children: busy === "accept" ? "..." : "Aksepter tilbud"
      }
    ),
    error && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { style: { color: "#dc2626", fontSize: 14, marginTop: 8 }, children: error })
  ] });
}
var inp = { display: "block", width: "100%", padding: "8px 12px", margin: "6px 0", border: "1px solid #e5e7eb", borderRadius: 6 };
var btn = { padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14 };

// src/OfferView.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function OfferView({ content, lines, theme, available, onPayInitiate, onRespond }) {
  const subtotal = lines.reduce((s, l) => s + l.quantity * l.unit_price_ore, 0);
  const vat = lines.reduce((s, l) => s + Math.round(l.quantity * l.unit_price_ore * l.vat_rate / 100), 0);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { fontFamily: theme.fontFamily }, children: [
    (content.introSections ?? []).map((sec, k) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("section", { style: { marginBottom: 16 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h3", { style: { color: theme.brandColor }, children: sec.heading }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: sec.body })
    ] }, k)),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: 14 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { style: { textAlign: "left", color: "#6b7280" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: "Post" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { children: "Ant." }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("th", { style: { textAlign: "right" }, children: "Pris" })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("tbody", { children: lines.map((l, k) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("tr", { style: { borderTop: "1px solid #e5e7eb" }, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { style: { padding: "6px 0" }, children: l.name }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("td", { children: l.quantity }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("td", { style: { textAlign: "right" }, children: [
          formatOre(l.quantity * l.unit_price_ore),
          " kr"
        ] })
      ] }, k)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { textAlign: "right", marginTop: 12 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        "Sum: ",
        formatOre(subtotal),
        " kr"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
        "MVA: ",
        formatOre(vat),
        " kr"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { fontWeight: 600 }, children: [
        "Totalt: ",
        formatOre(subtotal + vat),
        " kr"
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      AcceptPanel,
      {
        theme,
        available,
        onPayInitiate,
        onRespond
      }
    )
  ] });
}

// src/SignPanel.tsx
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
function SignPanel({ theme, onRespond, available, onSignInitiate }) {
  const [name, setName] = (0, import_react3.useState)("");
  const [email, setEmail] = (0, import_react3.useState)("");
  const [title, setTitle] = (0, import_react3.useState)("");
  const [consent, setConsent] = (0, import_react3.useState)(false);
  const [busy, setBusy] = (0, import_react3.useState)(false);
  const [done, setDone] = (0, import_react3.useState)(null);
  const [error, setError] = (0, import_react3.useState)("");
  const [providerEmail, setProviderEmail] = (0, import_react3.useState)("");
  const [providerError, setProviderError] = (0, import_react3.useState)("");
  const [providerBusy, setProviderBusy] = (0, import_react3.useState)(null);
  const v = validateSign({ signerName: name, signerEmail: email, consent });
  const useFormal = !!(available && available.length > 0 && onSignInitiate);
  async function submit(outcome) {
    setError("");
    setBusy(true);
    const res = await onRespond({ outcome, signerName: name, signerEmail: email, signerTitle: title || void 0, consent });
    setBusy(false);
    if (res.ok) setDone(res);
    else setError(res.error ?? "Noe gikk galt");
  }
  async function initiateProvider(provider) {
    setProviderError("");
    const trimmed = providerEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setProviderError("Oppgi en gyldig e-postadresse for \xE5 fortsette");
      return;
    }
    setProviderBusy(provider);
    const res = await onSignInitiate(provider, trimmed);
    setProviderBusy(null);
    if (res.signingUrl) {
      window.location.assign(res.signingUrl);
    } else {
      setProviderError(res.error ?? "Noe gikk galt");
    }
  }
  if (done) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { marginTop: 24, padding: 16, borderRadius: 8, background: "#f0fdf4", color: "#166534" }, children: [
      "\u2713 ",
      theme.strings.signed,
      " \u2014 ",
      done.signedAt ? new Date(done.signedAt).toLocaleString("nb-NO") : ""
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { marginTop: 24, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }, children: [
    useFormal && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { marginBottom: 20 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "input",
        {
          "aria-label": theme.strings.signerEmail,
          placeholder: theme.strings.signerEmail,
          value: providerEmail,
          onChange: (e) => setProviderEmail(e.target.value),
          style: inp2
        }
      ),
      providerError && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { color: "#dc2626", fontSize: 14, margin: "4px 0 8px" }, children: providerError }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: available.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
          children: providerBusy === provider ? "..." : provider === "bankid" ? "Signer med BankID" : "Signer med Vipps"
        },
        provider
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("hr", { style: { margin: "16px 0", borderColor: "#e5e7eb" } }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { fontSize: 13, color: "#6b7280", marginBottom: 8 }, children: "Eller signer med navn og e-post:" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": theme.strings.signerName, placeholder: theme.strings.signerName, value: name, onChange: (e) => setName(e.target.value), style: inp2 }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": theme.strings.signerEmail, placeholder: theme.strings.signerEmail, value: email, onChange: (e) => setEmail(e.target.value), style: inp2 }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { "aria-label": theme.strings.signerTitle, placeholder: theme.strings.signerTitle, value: title, onChange: (e) => setTitle(e.target.value), style: inp2 }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("label", { style: { display: "flex", gap: 8, alignItems: "center", margin: "8px 0" }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "checkbox", checked: consent, onChange: (e) => setConsent(e.target.checked) }),
      theme.strings.consent
    ] }),
    error && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("p", { style: { color: "#dc2626", fontSize: 14 }, children: error }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", gap: 8 }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { disabled: !v.ok || busy, onClick: () => submit("accepted"), style: { ...btn2, background: theme.accentColor, color: "#fff", opacity: !v.ok || busy ? 0.5 : 1 }, children: theme.strings.accept }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { disabled: busy, onClick: () => submit("declined"), style: { ...btn2, background: "#fff", color: theme.brandColor, border: "1px solid #e5e7eb" }, children: theme.strings.decline })
    ] })
  ] });
}
var inp2 = { display: "block", width: "100%", padding: "8px 12px", margin: "6px 0", border: "1px solid #e5e7eb", borderRadius: 6 };
var btn2 = { padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 14 };

// src/AgreementView.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function AgreementView({
  content,
  theme,
  onRespond,
  available,
  onSignInitiate
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { style: { fontFamily: theme.fontFamily }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("pre", { style: { whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 15, lineHeight: 1.6 }, children: content.bodyMarkdown ?? "" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(SignPanel, { theme, onRespond, available, onSignInitiate })
  ] });
}

// src/ArtifactViewer.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function ArtifactViewer({ payload, theme = defaultTheme, onRespond, onSignInitiate, onPayInitiate }) {
  const surface = selectSurface(payload);
  const a = payload.artifact;
  const wrap = (children) => /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { maxWidth: 880, margin: "0 auto", padding: 24, fontFamily: theme.fontFamily, color: theme.brandColor }, children: [
    theme.logoUrl && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("img", { src: theme.logoUrl, alt: "", style: { height: 28, marginBottom: 24 } }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { style: { fontSize: 24, marginBottom: 16 }, children: a.title }),
    children
  ] });
  if (surface === "unavailable") return wrap(/* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { style: { color: "#6b7280" }, children: theme.strings.unavailable }));
  if (surface === "expired") return wrap(/* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { style: { color: "#b45309" }, children: theme.strings.expired }) }));
  if (surface === "signed") return wrap(
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { padding: 16, background: "#f0fdf4", color: "#166534", borderRadius: 8 }, children: [
        "\u2713 ",
        theme.strings.signed,
        payload.signedAt ? ` \u2014 ${new Date(payload.signedAt).toLocaleString("nb-NO")}` : ""
      ] }),
      payload.signedDocumentUrl && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { style: { marginTop: 12 }, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("a", { href: payload.signedDocumentUrl, style: { color: theme.accentColor }, children: "Last ned signert avtale (PDF)" }) })
    ] })
  );
  if (surface === "presentation") {
    const slides = a.content?.slides ?? [];
    return wrap(/* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SlideDeck, { slides, theme }));
  }
  if (surface === "offer") {
    if (payload.paidAt) {
      return wrap(
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { style: { padding: 16, background: "#f0fdf4", color: "#166534", borderRadius: 8 }, children: [
          "\u2713 Betalt",
          payload.paidAt ? ` \u2014 ${new Date(payload.paidAt).toLocaleString("nb-NO")}` : "",
          payload.paymentRef && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { style: { marginLeft: 8, fontSize: 13, color: "#166534" }, children: [
            "Ref: ",
            payload.paymentRef
          ] })
        ] })
      );
    }
    return wrap(
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        OfferView,
        {
          content: a.content ?? {},
          lines: a.lines ?? [],
          theme,
          available: payload.payment?.available ?? [],
          onPayInitiate,
          onRespond
        }
      )
    );
  }
  return wrap(
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      AgreementView,
      {
        content: a.content ?? {},
        theme,
        onRespond,
        available: payload.signing?.available ?? [],
        onSignInitiate
      }
    )
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AcceptPanel,
  ArtifactViewer,
  defaultTheme,
  paymentButtons,
  signingButtons
});

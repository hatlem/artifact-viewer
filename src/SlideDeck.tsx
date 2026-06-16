import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Theme } from './theme'
import { clampSlide } from './logic'

interface Block { type: string; text?: string; items?: string[]; url?: string }
interface Slide { layout: string; blocks: Block[] }

export function SlideDeck({ slides, theme }: { slides: Slide[]; theme: Theme }) {
  const [i, setI] = useState(0)
  const go = (n: number) => setI((cur) => clampSlide(cur + n, slides.length))

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length])

  if (slides.length === 0) return <p style={{ color: '#6b7280' }}>—</p>
  const s = slides[clampSlide(i, slides.length)]

  return (
    <div style={{ fontFamily: theme.fontFamily }}>
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16, padding: 32, transition: 'opacity 0.3s' }}>
        {s.blocks.map((b, k) => {
          if (b.type === 'heading') return <h2 key={k} style={{ color: theme.brandColor, fontSize: 32 }}>{b.text}</h2>
          if (b.type === 'bullets') return <ul key={k}>{(b.items ?? []).map((it, m) => <li key={m}>{it}</li>)}</ul>
          if (b.type === 'image' && b.url) return <img key={k} src={b.url} alt="" style={{ maxWidth: '100%' }} />
          return <p key={k} style={{ fontSize: 18, lineHeight: 1.6 }}>{b.text}</p>
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
        <button onClick={() => go(-1)} disabled={i === 0} aria-label="Forrige" style={navBtn}>←</button>
        <span style={{ fontSize: 13, color: '#6b7280' }}>{i + 1} / {slides.length}</span>
        <button onClick={() => go(1)} disabled={i >= slides.length - 1} aria-label="Neste" style={navBtn}>→</button>
      </div>
      <div style={{ height: 3, background: '#e5e7eb', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${((i + 1) / slides.length) * 100}%`, background: theme.accentColor, borderRadius: 2, transition: 'width 0.3s' }} />
      </div>
    </div>
  )
}

const navBtn: CSSProperties = { padding: '6px 14px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' }

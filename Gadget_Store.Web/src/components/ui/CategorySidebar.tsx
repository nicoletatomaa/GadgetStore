import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ── SVG icons ───────────────────────────────────────────────────────────── */
function IGrid()       { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] shrink-0"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg> }
function IApple()      { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> }
function IPhone()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><rect x="6.5" y="2" width="11" height="20" rx="2.5"/><circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none"/></svg> }
function ILaptop()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M1 20h22"/></svg> }
function ITablet()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none"/></svg> }
function IGamepad()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><rect x="2" y="6" width="20" height="12" rx="5"/><path d="M7 12h4M9 10v4M14.5 12h.01M17 10.5h.01"/></svg> }
function IWatch()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><circle cx="12" cy="12" r="6"/><polyline points="12 9 12 12 13.5 13"/><path d="M9.5 4.5 9 2h6l-.5 2.5M9.5 19.5 9 22h6l-.5-2.5"/></svg> }
function IHome()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function IActivity()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function ICamera()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg> }
function IHeadphones() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg> }
function IPackage()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> }
function IStore()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><line x1="2" y1="9" x2="22" y2="9"/></svg> }
function IPlug()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] shrink-0"><path d="M12 22v-5M7 7H5a1 1 0 00-1 1v4a5 5 0 0010 0V8a1 1 0 00-1-1h-2M9 3v4M15 3v4"/></svg> }

export function getCatSvgIcon(name: string) {
  const n = name.toLowerCase()
  if (n.includes('apple'))                                                    return <IApple />
  if (n.includes('telefon') || n.includes('mobil') || n.includes('smartphone')) return <IPhone />
  if (n.includes('laptop') || n.includes(' pc') || n.includes('calculator'))    return <ILaptop />
  if (n.includes('tablet'))                                                   return <ITablet />
  if (n.includes('gaming') || n.includes('jocuri') || n.includes('consol'))  return <IGamepad />
  if (n.includes('ceas') || n.includes('smartwatch') || n.includes('bratar')) return <IWatch />
  if (n.includes('acas') || n.includes('birou') || n.includes('casa'))       return <IHome />
  if (n.includes('sport') || n.includes('sanat') || n.includes('fitness'))   return <IActivity />
  if (n.includes('foto') || n.includes('camera') || n.includes('video') || n.includes('vlog')) return <ICamera />
  if (n.includes('audio') || n.includes('casti') || n.includes('headphone') || n.includes('muzic')) return <IHeadphones />
  if (n.includes('tv') || n.includes('televizor') || n.includes('multimedia')) return <IHeadphones />
  if (n.includes('accesor') || n.includes('cablu'))                          return <IPlug />
  return <IPackage />
}

export const CAT_ICONS: Record<string, string> = {
  'Telefoane': '📱', 'Laptopuri': '💻', 'Tablete': '📟',
  'Audio': '🎧', 'Gaming': '🎮', 'Accesorii': '🔌',
  'Camere': '📷', 'TV': '📺', 'Smartwatch': '⌚', 'default': '📦',
}

export interface CatNode {
  id: number
  name: string
  children?: CatNode[]
}

interface Props {
  categories: CatNode[]
  activeCategoryId?: string
}

/* ── Dark theme constants ─────────────────────────────────────────────────── */
const S = {
  bg:          '#111111',
  bgHover:     'rgba(255,255,255,0.04)',
  bgActive:    'rgba(189,255,0,0.07)',
  border:      'rgba(255,255,255,0.07)',
  textDefault: 'rgba(255,255,255,0.62)',
  textActive:  '#BDFF00',
  textMuted:   'rgba(255,255,255,0.28)',
  flyoutBg:    '#1A1A1A',
  flyoutShadow:'0 8px 48px rgba(0,0,0,0.85)',
}

const catLinkLabel: React.CSSProperties = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 500,
  fontSize: '0.95rem',
}

const SIDEBAR_W = 270

export default function CategorySidebar({ categories, activeCategoryId }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hovered = categories.find((c) => c.id === hoveredId)

  const startClose = () => { timer.current = setTimeout(() => setHoveredId(null), 120) }
  const cancelClose = () => { if (timer.current) clearTimeout(timer.current) }

  return (
    <div
      className="relative shrink-0 self-start sticky top-20"
      style={{ width: SIDEBAR_W }}
      onMouseLeave={startClose}
    >
      {/* ── Sidebar panel ─────────────────────────────────────────────── */}
      <div
        className="overflow-hidden"
        style={{
          background: S.bg,
          borderRight: `1px solid ${S.border}`,
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-2.5 px-5 py-5"
          style={{ borderBottom: `1px solid ${S.border}` }}
        >
          <span style={{ color: S.textMuted }}><IGrid /></span>
          <span style={{
            fontFamily: "'Barlow Condensed', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '0.65rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: S.textMuted,
          }}>
            Catalog
          </span>
        </div>

        {/* Toate produsele */}
        <Link
          to="/catalog"
          className="flex items-center gap-3 px-5 py-3.5 transition-colors"
          style={{
            borderLeft: `3px solid ${!activeCategoryId ? S.textActive : 'transparent'}`,
            background: !activeCategoryId ? S.bgActive : 'transparent',
            color: !activeCategoryId ? S.textActive : S.textDefault,
          }}
          onMouseEnter={(e) => {
            if (activeCategoryId) {
              e.currentTarget.style.background = S.bgHover
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategoryId) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = S.textDefault
            }
          }}
        >
          <IStore />
          <span style={catLinkLabel}>Toate produsele</span>
        </Link>

        {/* Category rows */}
        {categories.map((cat) => {
          const isActive  = String(activeCategoryId) === String(cat.id)
          const isHovered = hoveredId === cat.id
          const hasSubs   = (cat.children?.length ?? 0) > 0

          return (
            <div
              key={cat.id}
              onMouseEnter={() => { cancelClose(); setHoveredId(cat.id) }}
            >
              <Link
                to={`/catalog/${cat.id}`}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                style={{
                  borderLeft: `3px solid ${isActive ? S.textActive : isHovered ? 'rgba(189,255,0,0.4)' : 'transparent'}`,
                  background: isActive ? S.bgActive : isHovered ? S.bgHover : 'transparent',
                  color: isActive ? S.textActive : isHovered ? 'rgba(255,255,255,0.9)' : S.textDefault,
                }}
              >
                <span style={{ color: isActive || isHovered ? S.textActive : S.textMuted }}>
                  {getCatSvgIcon(cat.name)}
                </span>
                <span className="flex-1" style={catLinkLabel}>{cat.name}</span>
                {hasSubs && (
                  <svg
                    className="w-3.5 h-3.5 shrink-0 transition-transform"
                    style={{
                      color: isHovered ? S.textActive : S.textMuted,
                      transform: isHovered ? 'rotate(0deg)' : 'rotate(-90deg)',
                    }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            </div>
          )
        })}
      </div>

      {/* ── Flyout mega-menu ─────────────────────────────────────────── */}
      {hovered && (hovered.children?.length ?? 0) > 0 && (
        <div
          className="absolute top-0 z-50 overflow-hidden"
          style={{
            left: SIDEBAR_W,
            width: 400,
            background: S.flyoutBg,
            border: `1px solid ${S.border}`,
            borderLeft: 'none',
            boxShadow: S.flyoutShadow,
          }}
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
        >
          {/* Flyout header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: `1px solid ${S.border}` }}
          >
            <div className="flex items-center gap-2.5">
              <span style={{ color: S.textActive }}>{getCatSvgIcon(hovered.name)}</span>
              <span style={{
                fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: '#FFFFFF',
              }}>
                {hovered.name}
              </span>
            </div>
            <Link
              to={`/catalog/${hovered.id}`}
              onClick={() => setHoveredId(null)}
              style={{
                fontFamily: "'Barlow Condensed', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: S.textActive,
              }}
              className="flex items-center gap-1 transition-opacity hover:opacity-75"
            >
              VEZI TOATE
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Subcategory grid */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-0">
              {hovered.children!.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/catalog/${sub.id}`}
                  onClick={() => setHoveredId(null)}
                  className="flex items-center gap-2 py-2.5 transition-colors group"
                  style={{
                    borderBottom: `1px solid ${S.border}`,
                    color: S.textDefault,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = S.textActive)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = S.textDefault)}
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0 transition-colors"
                    style={{ background: S.textMuted }}
                  />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 500, fontSize: '0.875rem' }}>
                    {sub.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Flyout CTA */}
          <div
            className="px-6 py-4"
            style={{ borderTop: `1px solid ${S.border}` }}
          >
            <Link
              to={`/catalog/${hovered.id}`}
              onClick={() => setHoveredId(null)}
              className="btn-primary w-full justify-center py-2.5"
            >
              Toate produsele din {hovered.name}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

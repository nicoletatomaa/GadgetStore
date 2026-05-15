import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

/* ── SVG icon components ─────────────────────────────────────────── */
function IGrid()        { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0"><path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z"/></svg> }
function IApple()       { return <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> }
function IPhone()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><rect x="6.5" y="2" width="11" height="20" rx="2.5"/><circle cx="12" cy="18" r="0.9" fill="currentColor" stroke="none"/></svg> }
function ILaptop()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M1 20h22"/></svg> }
function ITablet()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none"/></svg> }
function IGamepad()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><rect x="2" y="6" width="20" height="12" rx="5"/><path d="M7 12h4M9 10v4M14.5 12h.01M17 10.5h.01"/></svg> }
function IWatch()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><circle cx="12" cy="12" r="6"/><polyline points="12 9 12 12 13.5 13"/><path d="M9.5 4.5 9 2h6l-.5 2.5M9.5 19.5 9 22h6l-.5-2.5"/></svg> }
function IHome()        { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function IActivity()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> }
function ICamera()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg> }
function IHeadphones()  { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg> }
function IPackage()     { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> }
function IStore()       { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><line x1="2" y1="9" x2="22" y2="9"/></svg> }
function IPlug()        { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0"><path d="M12 22v-5M7 7H5a1 1 0 00-1 1v4a5 5 0 0010 0V8a1 1 0 00-1-1h-2M9 3v4M15 3v4"/></svg> }

export function getCatSvgIcon(name: string) {
  const n = name.toLowerCase()
  if (n.includes('apple'))                                        return <IApple />
  if (n.includes('telefon') || n.includes('mobil') || n.includes('smartphone')) return <IPhone />
  if (n.includes('laptop') || n.includes(' pc') || n.includes('calculator'))    return <ILaptop />
  if (n.includes('tablet'))                                       return <ITablet />
  if (n.includes('gaming') || n.includes('jocuri') || n.includes('consol'))     return <IGamepad />
  if (n.includes('ceas') || n.includes('smartwatch') || n.includes('bratar'))   return <IWatch />
  if (n.includes('acas') || n.includes('birou') || n.includes('casa'))          return <IHome />
  if (n.includes('sport') || n.includes('sanat') || n.includes('fitness'))      return <IActivity />
  if (n.includes('foto') || n.includes('camera') || n.includes('video') || n.includes('vlog')) return <ICamera />
  if (n.includes('audio') || n.includes('casti') || n.includes('headphone') || n.includes('muzic')) return <IHeadphones />
  if (n.includes('tv') || n.includes('televizor') || n.includes('multimedia'))  return <IHeadphones />
  if (n.includes('accesor') || n.includes('cablu'))               return <IPlug />
  return <IPackage />
}

/* Legacy emoji map kept for backwards compat (admin page) */
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
  edgeLeft?: boolean
}

const SIDEBAR_W = 'w-72'
const FLYOUT_LEFT = 'left-72'

export default function CategorySidebar({ categories, activeCategoryId, edgeLeft }: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hovered = categories.find((c) => c.id === hoveredId)

  const startClose = () => { timer.current = setTimeout(() => setHoveredId(null), 130) }
  const cancelClose = () => { if (timer.current) clearTimeout(timer.current) }

  const borderRadius = edgeLeft ? 'rounded-r-2xl' : 'rounded-2xl'
  const borderClass  = edgeLeft ? 'border border-l-0 border-edge' : 'border border-edge'

  return (
    <div className="relative flex shrink-0" onMouseLeave={startClose}>

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={`${SIDEBAR_W} bg-surface ${borderClass} ${borderRadius} overflow-hidden self-start sticky top-24`}>

        {/* Catalog header */}
        <div className="px-5 py-4 border-b border-edge flex items-center gap-3 bg-surface-raised/60">
          <IGrid />
          <span className="text-xs font-mono font-bold text-ink-muted uppercase tracking-widest">Catalog</span>
        </div>

        {/* Toate produsele */}
        <Link
          to="/catalog"
          className={`flex items-center gap-3.5 px-5 py-3.5 border-l-[3px] transition-all duration-150 ${
            !activeCategoryId
              ? 'border-brand text-brand bg-brand/10 font-semibold'
              : 'border-transparent text-ink hover:bg-surface-raised hover:border-edge'
          }`}
        >
          <IStore />
          <span className="text-sm font-medium">Toate produsele</span>
        </Link>

        {categories.map((cat) => {
          const isActive  = String(activeCategoryId) === String(cat.id)
          const isHovered = hoveredId === cat.id
          const hasSubs   = (cat.children?.length ?? 0) > 0

          return (
            <div key={cat.id} onMouseEnter={() => { cancelClose(); setHoveredId(cat.id) }}>
              <Link
                to={`/catalog/${cat.id}`}
                className={`flex items-center gap-3.5 px-5 py-3.5 border-l-[3px] transition-all duration-150 ${
                  isActive
                    ? 'border-brand text-brand bg-brand/10 font-semibold'
                    : isHovered
                    ? 'border-brand/50 text-ink bg-surface-raised'
                    : 'border-transparent text-ink hover:bg-surface-raised hover:border-edge'
                }`}
              >
                {getCatSvgIcon(cat.name)}
                <span className="flex-1 text-sm font-medium">{cat.name}</span>
                {hasSubs && (
                  <svg
                    className={`w-4 h-4 shrink-0 transition-transform ${isHovered ? 'text-brand rotate-90' : 'text-ink-faint'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            </div>
          )
        })}
      </aside>

      {/* ── Flyout mega-menu ──────────────────────────────── */}
      {hovered && (hovered.children?.length ?? 0) > 0 && (
        <div
          className={`absolute ${FLYOUT_LEFT} top-0 z-50 w-[480px] bg-surface border border-edge rounded-2xl
                     shadow-[0_12px_60px_rgba(0,0,0,0.75)] overflow-hidden`}
          onMouseEnter={cancelClose}
          onMouseLeave={startClose}
        >
          <div className="px-6 py-4 border-b border-edge flex items-center justify-between bg-surface-raised/40">
            <div className="flex items-center gap-3">
              <span className="text-brand">{getCatSvgIcon(hovered.name)}</span>
              <span className="font-display font-bold text-ink text-lg">{hovered.name}</span>
            </div>
            <Link
              to={`/catalog/${hovered.id}`}
              onClick={() => setHoveredId(null)}
              className="text-xs font-mono text-brand hover:text-brand-light transition-colors flex items-center gap-1"
            >
              VEZI TOATE
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-0.5">
              {hovered.children!.map((sub) => (
                <Link
                  key={sub.id}
                  to={`/catalog/${sub.id}`}
                  onClick={() => setHoveredId(null)}
                  className="flex items-center gap-2.5 py-2.5 text-sm text-ink-muted hover:text-brand
                             transition-colors group border-b border-edge/30 last:border-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-ink-faint group-hover:bg-brand transition-colors shrink-0" />
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 bg-surface-raised border-t border-edge">
            <Link
              to={`/catalog/${hovered.id}`}
              onClick={() => setHoveredId(null)}
              className="btn-primary w-full py-2.5 justify-center"
            >
              Toate produsele din {hovered.name}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

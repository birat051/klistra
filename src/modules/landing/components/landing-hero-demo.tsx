'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ */
/*  Hero demo — collaboration loop; motion via Framer Motion          */
/* ------------------------------------------------------------------ */

interface INoteDef {
  id: string
  x: number
  y: number
  w: number
  rot: number
  color: string
  delay: number
  title?: string
  body?: string
  italic?: boolean
  typed?: boolean
}

const NOTES: INoteDef[] = [
  {
    id: 'n1',
    x: 8,
    y: 12,
    w: 200,
    rot: -2.4,
    color: 'var(--note-mist)',
    delay: 200,
    title: 'Workshop kickoff',
    body: 'Reframe the brief — what are we really solving?',
  },
  {
    id: 'n2',
    x: 38,
    y: 8,
    w: 210,
    rot: 1.6,
    color: 'var(--note-cream)',
    delay: 1100,
    title: 'Customer voice',
    body: '"It feels like we\'re duplicating effort across rooms."',
    italic: true,
  },
  {
    id: 'n3',
    x: 65,
    y: 16,
    w: 200,
    rot: -1.0,
    color: 'var(--note-sage)',
    delay: 2400,
    title: 'Hypothesis',
    body: 'If everyone writes in one canvas, alignment is faster.',
  },
  {
    id: 'n4',
    x: 14,
    y: 50,
    w: 220,
    rot: 1.2,
    color: 'var(--note-rose)',
    delay: 3300,
    title: 'Risk',
    body: "Network drops mid-session — we can't lose ideas.",
  },
  {
    id: 'n5',
    x: 44,
    y: 56,
    w: 210,
    rot: -1.5,
    color: 'var(--note-sand)',
    delay: 4200,
    typed: true,
    title: 'Next step',
  },
  {
    id: 'n6',
    x: 70,
    y: 60,
    w: 200,
    rot: 2.0,
    color: 'var(--note-slate)',
    delay: 5400,
    title: 'Owner',
    body: 'Anna — drafts the brief by Friday.',
  },
]

const PEER_A = {
  id: 'a',
  name: 'Anna',
  color: 'oklch(58% 0.13 245)',
}

const PEER_B = {
  id: 'b',
  name: 'Mikael',
  color: 'oklch(60% 0.13 28)',
}

interface IPathPoint {
  t: number
  x: number
  y: number
}

const PATH_A: IPathPoint[] = [
  { t: 0, x: 12, y: 80 },
  { t: 1500, x: 18, y: 22 },
  { t: 3000, x: 30, y: 30 },
  { t: 4500, x: 50, y: 60 },
  { t: 5500, x: 52, y: 62 },
  { t: 9500, x: 52, y: 62 },
  { t: 11000, x: 28, y: 42 },
]

const PATH_B: IPathPoint[] = [
  { t: 0, x: 90, y: 88 },
  { t: 1800, x: 75, y: 22 },
  { t: 3200, x: 80, y: 70 },
  { t: 5000, x: 56, y: 70 },
  { t: 7000, x: 30, y: 16 },
  { t: 9000, x: 22, y: 56 },
  { t: 11000, x: 80, y: 30 },
]

const TYPED_LINES = ['Prototype a shared canvas', 'test offline-first sync', 'ship by sprint end']

const cursorTransition = {
  duration: 0.45,
  ease: [0.45, 0.05, 0.4, 1] as [number, number, number, number],
}

function interpPath(path: IPathPoint[], time: number) {
  const last = path[path.length - 1]
  if (!last || time >= last.t) {
    return { x: last?.x ?? 0, y: last?.y ?? 0 }
  }
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]
    const b = path[i + 1]
    if (a && b && time >= a.t && time < b.t) {
      const k = (time - a.t) / (b.t - a.t)
      const eased: number = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      return {
        x: a.x + (b.x - a.x) * eased,
        y: a.y + (b.y - a.y) * eased,
      }
    }
  }
  const first = path[0]
  return { x: first?.x ?? 0, y: first?.y ?? 0 }
}

function Peer({ p }: { p: { name: string; color: string } }) {
  return (
    <span className="peer">
      <span className="peer__avatar" style={{ background: p.color }}>
        {p.name[0]}
      </span>
      <span className="peer__name">{p.name}</span>
    </span>
  )
}

function Cursor({
  peer,
  pos,
}: {
  peer: { name: string; color: string }
  pos: { x: number; y: number }
}) {
  return (
    <motion.div
      className="cursor"
      animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      transition={cursorTransition}
    >
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <path
          d="M2 2 L2 17 L7 13 L10 19 L13 18 L10 12 L17 11 Z"
          fill={peer.color}
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span className="cursor__label" style={{ background: peer.color }}>
        {peer.name}
      </span>
    </motion.div>
  )
}

export function LandingHeroDemo() {
  const [online, setOnline] = useState(true)
  const [tick, setTick] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    startRef.current = performance.now()
    const loop = () => {
      if (startRef.current != null) {
        setTick(performance.now() - startRef.current)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const LOOP = 12000
  const t = tick % LOOP

  const typingStart = 5500
  const typingEnd = 9500
  let typed = ''
  let caret = false
  if (t >= typingStart) {
    const total = TYPED_LINES.join('\n')
    const dur = typingEnd - typingStart
    const k = Math.min(1, (t - typingStart) / dur)
    const n = Math.floor(total.length * k)
    typed = total.slice(0, n)
    caret = t < typingEnd + 800
  }

  const a = interpPath(PATH_A, t)
  const b = interpPath(PATH_B, t)

  const noteAppearGlow = (delay: number) => {
    const since = t - delay
    if (since < 0) return 0
    if (since > 1200) return 0
    return 1 - since / 1200
  }

  const typedLinesSplit = typed.split('\n')

  return (
    <div className="herod">
      <div className="herod__grid" />

      <div className="herod__chrome">
        <div className="herod__filename">
          <span className="herod__doc">Q2 strategy retro</span>
          <span className="herod__path">/ rooms / klistra-ab8f</span>
        </div>
        <div className="herod__peers">
          <Peer p={PEER_A} />
          <Peer p={PEER_B} />
          <span className="herod__peercount">2 here</span>
        </div>
        <button
          type="button"
          className={`statepill ${online ? 'is-on' : 'is-off'}`}
          onClick={() => setOnline(!online)}
          aria-label={
            online
              ? 'Currently online — click to simulate going offline'
              : 'Currently offline — click to come back online'
          }
        >
          {online ? (
            <motion.span
              className="statepill__dot"
              aria-hidden
              animate={{
                boxShadow: [
                  '0 0 0 0 oklch(65% 0.13 145 / 0.5)',
                  '0 0 0 8px oklch(65% 0.13 145 / 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
          ) : (
            <span className="statepill__dot" />
          )}
          {online ? 'Online · synced' : 'Working offline'}
        </button>
      </div>

      <AnimatePresence>
        {!online && (
          <motion.div
            key="offline-banner"
            className="herod__offline-banner"
            initial={{ opacity: 0, y: -6, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -6, x: '-50%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            You&apos;re offline. Edits keep working — they&apos;ll sync when you reconnect.
          </motion.div>
        )}
      </AnimatePresence>

      {NOTES.map((n) => {
        const visible = t >= n.delay
        const glow = noteAppearGlow(n.delay)
        return (
          <motion.div
            key={n.id}
            className="herod__note note"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: n.w,
              background: n.color,
              position: 'absolute',
              boxShadow:
                glow > 0
                  ? `0 0 0 ${2 + glow * 4}px color-mix(in oklch, var(--brand) ${glow * 50}%, transparent), var(--shadow-note)`
                  : `var(--shadow-note)`,
            }}
            initial={false}
            animate={{
              opacity: visible ? 1 : 0,
              scale: visible ? 1 : 0.85,
              rotate: `${n.rot}deg`,
            }}
            transition={{
              opacity: { duration: 0.4, ease: 'easeOut' },
              scale: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
              rotate: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] },
            }}
          >
            {n.title != null && n.title !== '' && <div className="note__h">{n.title}</div>}
            {n.body != null && n.body !== '' && (
              <div className="note__b" style={n.italic ? { fontStyle: 'italic' } : undefined}>
                {n.body}
              </div>
            )}
            {n.typed === true && (
              <div className="note__b">
                <ul className="note__list">
                  {typedLinesSplit.map((line, i) => (
                    <li key={`${n.id}-line-${i}`}>
                      {line}
                      {caret === true && i === typedLinesSplit.length - 1 && (
                        <motion.span
                          className="note__caret"
                          aria-hidden
                          animate={{ opacity: [1, 0] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                            times: [0, 0.5],
                          }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )
      })}

      <Cursor peer={PEER_A} pos={a} />
      <Cursor peer={PEER_B} pos={b} />

      <div className="herod__save">
        <span className={`herod__save-dot ${online ? 'is-saved' : 'is-queued'}`} />
        {online ? 'Saved · 2s ago' : 'Queued · syncs when online'}
      </div>
    </div>
  )
}

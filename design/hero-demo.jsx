/* global React */
const { useEffect, useRef, useState } = React

/* ------------------------------------------------------------------ */
/*  HeroDemo — animated collaboration loop                             */
/*  Two peer cursors moving across the canvas, notes appearing,        */
/*  one note being typed into, plus a clickable online/offline pill.    */
/* ------------------------------------------------------------------ */

const NOTES = [
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
    /* this one is the "live edit" target */
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

/* peer A drives the typing */
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

/* keyframe paths for cursors. relative units (% of canvas). */
const PATH_A = [
  { t: 0, x: 12, y: 80 },
  { t: 1500, x: 18, y: 22 },
  { t: 3000, x: 30, y: 30 },
  { t: 4500, x: 50, y: 60 } /* arrives at note 5 */,
  { t: 5500, x: 52, y: 62 } /* sits and types */,
  { t: 9500, x: 52, y: 62 },
  { t: 11000, x: 28, y: 42 },
]
const PATH_B = [
  { t: 0, x: 90, y: 88 },
  { t: 1800, x: 75, y: 22 },
  { t: 3200, x: 80, y: 70 },
  { t: 5000, x: 56, y: 70 },
  { t: 7000, x: 30, y: 16 },
  { t: 9000, x: 22, y: 56 },
  { t: 11000, x: 80, y: 30 },
]

const TYPED_LINES = ['Prototype a shared canvas', 'test offline-first sync', 'ship by sprint end']

function interpPath(path, t) {
  const last = path[path.length - 1]
  if (t >= last.t) return { x: last.x, y: last.y }
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i],
      b = path[i + 1]
    if (t >= a.t && t < b.t) {
      const k = (t - a.t) / (b.t - a.t)
      const eased = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      return {
        x: a.x + (b.x - a.x) * eased,
        y: a.y + (b.y - a.y) * eased,
      }
    }
  }
  return { x: path[0].x, y: path[0].y }
}

function HeroDemo({ online, setOnline }) {
  const [tick, setTick] = useState(0)
  const startRef = useRef(performance.now())
  const rafRef = useRef(0)

  useEffect(() => {
    const loop = () => {
      setTick(performance.now() - startRef.current)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const LOOP = 12000
  const t = tick % LOOP

  /* compute typed text for note 5 */
  const note5VisibleAt = 4200
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

  /* sync ripple — when a note appears, briefly halo it */
  const noteAppearGlow = (delay) => {
    const since = t - delay
    if (since < 0) return 0
    if (since > 1200) return 0
    return 1 - since / 1200
  }

  return (
    <div className="herod">
      {/* canvas grid */}
      <div className="herod__grid" />

      {/* status bar overlaid on the canvas */}
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
          <span className="statepill__dot" />
          {online ? 'Online · synced' : 'Working offline'}
        </button>
      </div>

      {/* offline banner */}
      {!online && (
        <div className="herod__offline-banner">
          You're offline. Edits keep working — they'll sync when you reconnect.
        </div>
      )}

      {/* notes */}
      {NOTES.map((n) => {
        const visible = t >= n.delay
        const glow = noteAppearGlow(n.delay)
        return (
          <div
            key={n.id}
            className="herod__note note"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              width: n.w,
              background: n.color,
              transform: `translate(0,0) rotate(${n.rot}deg) scale(${visible ? 1 : 0.85})`,
              opacity: visible ? 1 : 0,
              boxShadow:
                glow > 0
                  ? `0 0 0 ${2 + glow * 4}px color-mix(in oklch, var(--brand) ${glow * 50}%, transparent), var(--shadow-note)`
                  : undefined,
            }}
          >
            {n.title && <div className="note__h">{n.title}</div>}
            {n.body && (
              <div className="note__b" style={n.italic ? { fontStyle: 'italic' } : undefined}>
                {n.body}
              </div>
            )}
            {n.typed && (
              <div className="note__b">
                <ul className="note__list">
                  {typed.split('\n').map((line, i) => (
                    <li key={i}>
                      {line}
                      {caret && i === typed.split('\n').length - 1 && (
                        <span className="note__caret" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}

      {/* cursors */}
      <Cursor peer={PEER_A} pos={a} />
      <Cursor peer={PEER_B} pos={b} />

      {/* save indicator */}
      <div className="herod__save">
        <span className={`herod__save-dot ${online ? 'is-saved' : 'is-queued'}`} />
        {online ? 'Saved · 2s ago' : 'Queued · syncs when online'}
      </div>
    </div>
  )
}

function Peer({ p }) {
  return (
    <span className="peer">
      <span className="peer__avatar" style={{ background: p.color }}>
        {p.name[0]}
      </span>
      <span className="peer__name">{p.name}</span>
    </span>
  )
}

function Cursor({ peer, pos }) {
  return (
    <div
      className="cursor"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
      }}
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
    </div>
  )
}

window.HeroDemo = HeroDemo

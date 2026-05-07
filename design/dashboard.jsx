/* global React */
const { useState, useEffect, useRef } = React

/* ---------- seed data ---------- */
const ME = {
  id: 'me',
  name: 'Anna Lindqvist',
  email: 'anna@klistra.io',
  color: 'oklch(58% 0.13 245)',
  initials: 'AL',
}

const PEOPLE = {
  me: ME,
  mikael: {
    id: 'mikael',
    name: 'Mikael Holm',
    email: 'mikael@klistra.io',
    color: 'oklch(60% 0.13 28)',
    initials: 'MH',
  },
  sara: {
    id: 'sara',
    name: 'Sara Berg',
    email: 'sara@klistra.io',
    color: 'oklch(60% 0.13 145)',
    initials: 'SB',
  },
  john: {
    id: 'john',
    name: 'John Park',
    email: 'john.park@figment.co',
    color: 'oklch(60% 0.13 305)',
    initials: 'JP',
  },
  linn: {
    id: 'linn',
    name: 'Linn Eriksson',
    email: 'linn@klistra.io',
    color: 'oklch(60% 0.13 80)',
    initials: 'LE',
  },
  oskar: {
    id: 'oskar',
    name: 'Oskar Sjö',
    email: 'oskar@nordlab.se',
    color: 'oklch(58% 0.13 200)',
    initials: 'OS',
  },
}

/* mini sample notes for canvas previews — rendered in a 280×170 frame */
const PREVIEW_LAYOUTS = {
  retro: [
    { x: 4, y: 8, w: 70, c: 'var(--note-mist)', r: -2, h: 'Kept', b: 'Async standups working' },
    { x: 36, y: 14, w: 78, c: 'var(--note-cream)', r: 1.5, h: 'Tried', b: 'Pair on infra debt' },
    { x: 70, y: 6, w: 70, c: 'var(--note-rose)', r: -1, h: 'Stuck', b: 'Onboarding flow' },
    { x: 14, y: 56, w: 80, c: 'var(--note-sage)', r: 1, h: 'Bet', b: 'Ship demo by Fri' },
    { x: 56, y: 60, w: 75, c: 'var(--note-sand)', r: -1.5, h: 'Owner', b: 'Anna' },
  ],
  workshop: [
    { x: 5, y: 10, w: 80, c: 'var(--note-mist)', r: -2, h: 'Brief', b: 'Reframe the problem' },
    {
      x: 50,
      y: 6,
      w: 80,
      c: 'var(--note-cream)',
      r: 2,
      h: 'Quote',
      b: '"Keep losing context"',
      italic: true,
    },
    { x: 5, y: 55, w: 70, c: 'var(--note-rose)', r: 1, h: 'Risk', b: 'Wifi drops mid-session' },
    { x: 42, y: 58, w: 70, c: 'var(--note-sage)', r: -1, h: 'Idea' },
    { x: 75, y: 60, w: 65, c: 'var(--note-slate)', r: 2, h: 'Next' },
  ],
  planning: [
    { x: 4, y: 6, w: 60, c: 'var(--note-slate)', r: -1, h: 'H1 themes' },
    { x: 4, y: 55, w: 62, c: 'var(--note-mist)', r: 1.5, h: 'Onboarding' },
    { x: 38, y: 8, w: 60, c: 'var(--note-sand)', r: 2, h: 'Activation' },
    { x: 38, y: 56, w: 60, c: 'var(--note-cream)', r: -1.5, h: 'Retention' },
    { x: 72, y: 12, w: 62, c: 'var(--note-rose)', r: -1, h: 'Bet · Live demos' },
  ],
  brainstorm: [
    { x: 6, y: 8, w: 65, c: 'var(--note-cream)', r: -2, h: 'Names', b: 'Klistra · Limma · Anslag' },
    { x: 50, y: 12, w: 65, c: 'var(--note-sage)', r: 1, h: 'Tagline', b: 'Think together' },
    { x: 18, y: 56, w: 70, c: 'var(--note-mist)', r: -1, h: 'Visual', b: 'Paper, soft tilt' },
    { x: 60, y: 60, w: 60, c: 'var(--note-rose)', r: 2, h: 'Out', b: 'Skip dark mode v1' },
  ],
  jobsmap: [
    { x: 5, y: 8, w: 75, c: 'var(--note-mist)', r: -1.5, h: 'When I…', b: 'join a workshop late' },
    { x: 55, y: 6, w: 75, c: 'var(--note-cream)', r: 2, h: 'I want to…', b: 'see what I missed' },
    { x: 5, y: 55, w: 75, c: 'var(--note-sand)', r: 1, h: 'So I can…', b: 'contribute right away' },
    {
      x: 55,
      y: 58,
      w: 75,
      c: 'var(--note-sage)',
      r: -1,
      h: 'Today I…',
      b: 'ask 3 people for context',
    },
  ],
  customer: [
    {
      x: 4,
      y: 8,
      w: 80,
      c: 'var(--note-rose)',
      r: -1.5,
      italic: true,
      h: 'Quote · Karin',
      b: '"It feels like I\'m always a step behind."',
    },
    {
      x: 50,
      y: 14,
      w: 70,
      c: 'var(--note-mist)',
      r: 1,
      h: 'Theme',
      b: 'Lost context across rooms',
    },
    {
      x: 14,
      y: 58,
      w: 70,
      c: 'var(--note-cream)',
      r: -1,
      h: 'Insight',
      b: 'Hand-off is the problem',
    },
    { x: 60, y: 56, w: 60, c: 'var(--note-sage)', r: 1.5 },
  ],
}

const SEED_DOCS = {
  yours: [
    {
      id: 'd1',
      name: 'Q2 strategy retro',
      layout: 'retro',
      updated: '2 min ago',
      live: true,
      collaborators: [
        { ...PEOPLE.mikael, role: 'editor', status: 'active' },
        { ...PEOPLE.sara, role: 'editor', status: 'active' },
        {
          id: 'pending1',
          name: 'John Park',
          email: 'john.park@figment.co',
          color: 'oklch(60% 0.13 305)',
          initials: 'JP',
          role: 'editor',
          status: 'pending',
        },
      ],
    },
    {
      id: 'd2',
      name: 'Onboarding workshop · v3',
      layout: 'workshop',
      updated: '3 hours ago',
      live: false,
      collaborators: [{ ...PEOPLE.linn, role: 'editor', status: 'active' }],
    },
    {
      id: 'd3',
      name: 'H1 2026 planning',
      layout: 'planning',
      updated: 'yesterday',
      live: false,
      collaborators: [
        { ...PEOPLE.mikael, role: 'editor', status: 'active' },
        { ...PEOPLE.sara, role: 'viewer', status: 'active' },
        { ...PEOPLE.linn, role: 'editor', status: 'active' },
      ],
    },
    {
      id: 'd4',
      name: 'Klistra brand brainstorm',
      layout: 'brainstorm',
      updated: '3 days ago',
      live: false,
      collaborators: [],
    },
  ],
  shared: [
    {
      id: 's1',
      name: 'Customer interviews · March',
      layout: 'customer',
      updated: '12 min ago',
      live: true,
      owner: PEOPLE.sara,
      collaborators: [
        { ...PEOPLE.sara, role: 'owner', status: 'active' },
        { ...PEOPLE.me, role: 'editor', status: 'active' },
        { ...PEOPLE.mikael, role: 'editor', status: 'active' },
      ],
    },
    {
      id: 's2',
      name: 'Jobs-to-be-done map',
      layout: 'jobsmap',
      updated: 'yesterday',
      live: false,
      owner: PEOPLE.oskar,
      collaborators: [
        { ...PEOPLE.oskar, role: 'owner', status: 'active' },
        { ...PEOPLE.me, role: 'viewer', status: 'active' },
      ],
    },
    {
      id: 's3',
      name: 'Ops sync · weekly',
      layout: 'retro',
      updated: '5 days ago',
      live: false,
      owner: PEOPLE.linn,
      collaborators: [
        { ...PEOPLE.linn, role: 'owner', status: 'active' },
        { ...PEOPLE.me, role: 'editor', status: 'active' },
      ],
    },
  ],
}

/* ---------- mini canvas preview ---------- */
function MiniCanvas({ layout }) {
  const notes = PREVIEW_LAYOUTS[layout] || PREVIEW_LAYOUTS.retro
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, oklch(92% 0.01 240) 1px, transparent 1px), linear-gradient(to bottom, oklch(92% 0.01 240) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          opacity: 0.5,
        }}
      />
      {notes.map((n, i) => (
        <div
          key={i}
          className="note"
          style={{
            position: 'absolute',
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: `${n.w}px`,
            background: n.c,
            transform: `rotate(${n.r}deg)`,
          }}
        >
          {n.h && <div className="h">{n.h}</div>}
          {n.b && (
            <div className="b" style={n.italic ? { fontStyle: 'italic' } : undefined}>
              {n.b}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ---------- invite popover ---------- */
function InvitePopover({ doc, onClose, onUpdate, t }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const ref = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  function add(e) {
    e.preventDefault()
    if (!email.includes('@')) return
    const initials = email.split('@')[0].slice(0, 2).toUpperCase()
    const hue = Math.floor(Math.random() * 360)
    const newC = {
      id: 'p' + Date.now(),
      name: email
        .split('@')[0]
        .replace(/\./g, ' ')
        .replace(/\b\w/g, (m) => m.toUpperCase()),
      email,
      color: `oklch(60% 0.13 ${hue})`,
      initials,
      role,
      status: 'pending',
    }
    onUpdate({ ...doc, collaborators: [...(doc.collaborators || []), newC] })
    setEmail('')
  }

  function remove(id) {
    onUpdate({ ...doc, collaborators: doc.collaborators.filter((c) => c.id !== id) })
  }

  return (
    <div className="invite-pop" ref={ref} onClick={(e) => e.stopPropagation()}>
      <div className="invite-pop__head">
        <div className="invite-pop__title">{t('invite_title')}</div>
        <button className="invite-pop__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <form className="invite-pop__form" onSubmit={add}>
        <input
          type="email"
          placeholder={t('invite_placeholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <button type="submit">{t('invite_send')}</button>
      </form>
      <div className="invite-pop__list">
        {(doc.collaborators || []).length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--ink-3)', padding: '8px 4px' }}>
            {t('invite_empty')}
          </div>
        )}
        {(doc.collaborators || []).map((c) => (
          <div className="invite-pop__row" key={c.id}>
            <span className="invite-pop__avatar" style={{ background: c.color }}>
              {c.initials}
            </span>
            <div className="invite-pop__id">
              <span className="invite-pop__name">{c.name}</span>
              <span className="invite-pop__email">{c.email}</span>
            </div>
            {c.status === 'pending' ? (
              <span className="chip-pending">{t('invite_pending')}</span>
            ) : (
              <span className="invite-pop__role">{t('role_' + c.role) || c.role}</span>
            )}
            {c.role !== 'owner' && (
              <button
                className="invite-pop__remove"
                onClick={() => remove(c.id)}
                aria-label="Remove"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- doc card ---------- */
function DocCard({ doc, owner, onUpdate, t }) {
  const [popOpen, setPopOpen] = useState(false)
  const [name, setName] = useState(doc.name)

  useEffect(() => setName(doc.name), [doc.name])

  const collaboratorCount = (doc.collaborators || []).filter((c) => c.role !== 'owner').length

  return (
    <article className={`doccard ${popOpen ? 'is-popover-open' : ''}`}>
      <button
        className="doccard__share"
        onClick={(e) => {
          e.stopPropagation()
          setPopOpen(true)
        }}
        aria-label={t('share_aria')}
        title={t('share_aria')}
      >
        <span className="doccard__share-avatar">+</span>
        <span>{collaboratorCount > 0 ? collaboratorCount : t('invite_short')}</span>
      </button>

      {doc.live && <span className="doccard__live">{t('live')}</span>}

      <div className="doccard__preview">
        <MiniCanvas layout={doc.layout} />
      </div>

      <div className="doccard__body">
        <input
          className="doccard__name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (name.trim() && name !== doc.name) onUpdate({ ...doc, name: name.trim() })
            else setName(doc.name)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.target.blur()
            if (e.key === 'Escape') {
              setName(doc.name)
              e.target.blur()
            }
          }}
        />
        <div className="doccard__meta">
          <span className="doccard__owner">
            <span className="doccard__owner-avatar" style={{ background: owner.color }}>
              {owner.initials}
            </span>
            <span>{owner.id === ME.id ? t('you') : owner.name.split(' ')[0]}</span>
          </span>
          <span className="doccard__sep">·</span>
          <span>{doc.updated}</span>
        </div>
      </div>

      {popOpen && (
        <InvitePopover doc={doc} onClose={() => setPopOpen(false)} onUpdate={onUpdate} t={t} />
      )}
    </article>
  )
}

/* ---------- create modal ---------- */
const NEW_COLORS = [
  'var(--note-mist)',
  'var(--note-cream)',
  'var(--note-sage)',
  'var(--note-rose)',
  'var(--note-sand)',
  'var(--note-slate)',
]
const NEW_HEX = ['#cfe0ec', '#f1e7d0', '#cfdcc9', '#e7c9c9', '#ecdfc6', '#c8cdd6']

function CreateModal({ onClose, onCreate, t }) {
  const [name, setName] = useState('')
  const [colorIdx, setColorIdx] = useState(0)
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal__card" onClick={(e) => e.stopPropagation()}>
        <h3>{t('new_title')}</h3>
        <p className="modal__sub">{t('new_sub')}</p>
        <input
          className="modal__input"
          placeholder={t('new_placeholder')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) onCreate(name.trim(), colorIdx)
          }}
        />
        <div className="modal__colors" role="group" aria-label="Default note color">
          {NEW_HEX.map((c, i) => (
            <button
              key={i}
              type="button"
              className="modal__swatch"
              style={{ background: c }}
              aria-pressed={colorIdx === i}
              onClick={() => setColorIdx(i)}
            />
          ))}
        </div>
        <div className="modal__actions">
          <button className="ghost" onClick={onClose}>
            {t('cancel')}
          </button>
          <button
            className="primary"
            disabled={!name.trim()}
            onClick={() => onCreate(name.trim(), colorIdx)}
          >
            {t('new_create')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- user dropdown ---------- */
function UserMenu({ t }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return (
    <div className="user-menu" ref={ref}>
      <button className="user-avatar" onClick={() => setOpen(!open)} aria-label="Account menu">
        {ME.initials}
      </button>
      {open && (
        <div className="user-dropdown">
          <div className="user-dropdown__head">
            <div className="user-dropdown__name">{ME.name}</div>
            <div className="user-dropdown__email">{ME.email}</div>
          </div>
          <button>{t('menu_account')}</button>
          <button>{t('menu_settings')}</button>
          <button>{t('menu_help')}</button>
          <div className="user-dropdown__sep" />
          <a href="Landing Page.html">{t('menu_signout')}</a>
        </div>
      )}
    </div>
  )
}

/* ---------- main app ---------- */
function Dashboard({ t }) {
  const [docs, setDocs] = useState(SEED_DOCS)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [creating, setCreating] = useState(false)

  function updateDoc(updated, group) {
    setDocs((d) => ({
      ...d,
      [group]: d[group].map((doc) => (doc.id === updated.id ? updated : doc)),
    }))
  }

  function createDoc(name, colorIdx) {
    const newDoc = {
      id: 'd' + Date.now(),
      name,
      layout: ['brainstorm', 'workshop', 'retro', 'planning'][Math.floor(Math.random() * 4)],
      updated: t('just_now'),
      live: false,
      collaborators: [],
    }
    setDocs((d) => ({ ...d, yours: [newDoc, ...d.yours] }))
    setCreating(false)
  }

  function filterAndSort(list) {
    const q = search.trim().toLowerCase()
    let out = q ? list.filter((d) => d.name.toLowerCase().includes(q)) : list.slice()
    if (sort === 'alpha') out.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'active') out.sort((a, b) => Number(b.live) - Number(a.live))
    return out
  }

  const [tab, setTab] = useState('yours')
  const yours = filterAndSort(docs.yours)
  const shared = filterAndSort(docs.shared)
  const active = tab === 'yours' ? yours : shared

  return (
    <div className="dash">
      <header className="dashbar">
        <div className="dashbar__inner">
          <a className="brand" href="Landing Page.html">
            <span className="brand__mark"></span>
            <span className="brand__name">klistra</span>
          </a>
          <div className="dash-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className="dash-sort"
            onClick={() =>
              setSort(sort === 'recent' ? 'alpha' : sort === 'alpha' ? 'active' : 'recent')
            }
          >
            <span>
              {t('sort_label')}: {t('sort_' + sort)}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 4l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="dashbar__right">
            <UserMenu t={t} />
          </div>
        </div>
      </header>

      <main className="dash-main">
        <h1 className="dash-greet">
          {t('greet_a')} <em>{ME.name.split(' ')[0]}</em>
          {t('greet_b')}
        </h1>
        <p className="dash-sub">{t('greet_sub')}</p>

        <div className="dash-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'yours'}
            className={`dash-tab ${tab === 'yours' ? 'is-active' : ''}`}
            onClick={() => setTab('yours')}
          >
            {t('section_yours')}
            <span className="dash-tab__count">{yours.length}</span>
          </button>
          <button
            role="tab"
            aria-selected={tab === 'shared'}
            className={`dash-tab ${tab === 'shared' ? 'is-active' : ''}`}
            onClick={() => setTab('shared')}
          >
            {t('section_shared')}
            <span className="dash-tab__count">{shared.length}</span>
          </button>
        </div>

        <section className="dash-section">
          {active.length === 0 && search ? (
            <div className="dash-empty">
              <h3>{t('nores_title')}</h3>
              <p>{t('nores_sub')}</p>
            </div>
          ) : active.length === 0 && tab === 'shared' ? (
            <div className="dash-empty">
              <div className="dash-empty__art">
                <div
                  className="note"
                  style={{
                    left: 0,
                    top: 0,
                    width: 80,
                    background: 'var(--note-mist)',
                    transform: 'rotate(-4deg)',
                  }}
                >
                  <div className="h">Brief</div>
                </div>
                <div
                  className="note"
                  style={{
                    left: 60,
                    top: 18,
                    width: 80,
                    background: 'var(--note-cream)',
                    transform: 'rotate(3deg)',
                  }}
                >
                  <div className="h">Idea</div>
                </div>
                <div
                  className="note"
                  style={{
                    left: 30,
                    top: 60,
                    width: 80,
                    background: 'var(--note-sage)',
                    transform: 'rotate(-2deg)',
                  }}
                >
                  <div className="h">Next</div>
                </div>
              </div>
              <h3>{t('empty_title')}</h3>
              <p>{t('empty_sub')}</p>
              <button className="btn btn--primary btn--lg" onClick={() => setCreating(true)}>
                {t('empty_cta')}
              </button>
            </div>
          ) : (
            <div className="dash-grid">
              {active.map((doc) => (
                <DocCard
                  key={doc.id}
                  doc={doc}
                  owner={tab === 'yours' ? ME : doc.owner}
                  onUpdate={(u) => updateDoc(u, tab)}
                  t={t}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <button className="fab" onClick={() => setCreating(true)} aria-label={t('fab_aria')}>
        <span className="fab__plus">+</span>
        {t('fab_label')}
      </button>

      {creating && <CreateModal onClose={() => setCreating(false)} onCreate={createDoc} t={t} />}
    </div>
  )
}

window.Dashboard = Dashboard

/* global React */
const { useState } = React;

/* ---------- people ---------- */
const ME = { id: "me", name: "Anna Lindqvist", initials: "AL", color: "oklch(58% 0.13 245)" };
const MIKAEL = { id: "mikael", name: "Mikael Holm", initials: "MH", color: "oklch(60% 0.13 28)" };
const SARA = { id: "sara", name: "Sara Berg", initials: "SB", color: "oklch(60% 0.13 145)" };
const LINN = { id: "linn", name: "Linn Eriksson", initials: "LE", color: "oklch(60% 0.13 80)" };

/* ---------- icons ---------- */
const Icon = {
  Bold: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M4 3h4.5a2.5 2.5 0 0 1 0 5H4V3zM4 8h5a2.5 2.5 0 0 1 0 5H4V8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  Italic: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M10 3H6m2 0L6.5 13M5 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Strike: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 8h10M6 4h4a2 2 0 0 1 2 2M5 12h4a2 2 0 0 0 1.5-3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Code: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M5 5L2 8l3 3M11 5l3 3-3 3M9 4l-2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  H1: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 3v10M3 8h5M8 3v10M11 5l2-1v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  H2: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 3v10M3 8h5M8 3v10M11 5a1.5 1.5 0 0 1 3 0c0 1-3 2.5-3 4.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Bullets: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><circle cx="3" cy="4" r="1" fill="currentColor"/><circle cx="3" cy="8" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Ordered: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M2 3v2.5M2 4.5h1M6 4h8M6 8h8M6 12h8M2 7v2h1.5L2 11h1.5M2 11h1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Quote: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M3 6c0-1.5 1-2.5 2.5-3M3 6v3h2.5V6H3zM9 6c0-1.5 1-2.5 2.5-3M9 6v3h2.5V6H9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
  Link: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M7 9a2 2 0 0 0 3 0l2.5-2.5a2 2 0 0 0-3-3L8 4.5M9 7a2 2 0 0 0-3 0L3.5 9.5a2 2 0 0 0 3 3L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Clock: () => <svg viewBox="0 0 16 16" width="15" height="15" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  Share: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M11.5 5.5L8 2 4.5 5.5M8 2v8M3 10v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Plus: () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  Lock: () => <svg viewBox="0 0 16 16" width="11" height="11" fill="none"><rect x="3.5" y="7" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4"/></svg>,
};

/* ---------- top bar ---------- */
function TopBar({ docName, connection, lang, setLang, onShare, historyOpen, setHistoryOpen, t }) {
  return (
    <header className="cv-topbar">
      <a className="cv-back" href="Dashboard.html" aria-label={t("back")}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </a>
      <a className="brand cv-brand" href="Dashboard.html">
        <span className="brand__mark"></span>
      </a>
      <div className="cv-doc">
        <input className="cv-doc__name" defaultValue={docName} />
        <ConnState state={connection} t={t} />
      </div>

      <div className="cv-presence">
        {[ME, MIKAEL, SARA].map((p, i) => (
          <span key={p.id} className="cv-avatar" style={{ background: p.color, zIndex: 10 - i }} title={p.name}>{p.initials}</span>
        ))}
      </div>

      <button className={`cv-btn ${historyOpen ? "is-active" : ""}`} onClick={() => setHistoryOpen(!historyOpen)} title={t("history")}>
        <Icon.Clock /><span>{t("history")}</span>
      </button>
      <button className="cv-btn cv-btn--primary" onClick={onShare}>
        <Icon.Share /><span>{t("share")}</span>
      </button>
      <div className="cv-lang">
        <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
        <button className={lang === "sv" ? "is-active" : ""} onClick={() => setLang("sv")}>SV</button>
      </div>
      <span className="cv-avatar cv-avatar--me" style={{ background: ME.color }}>{ME.initials}</span>
    </header>
  );
}

function ConnState({ state, t }) {
  return (
    <div className={`cv-conn cv-conn--${state}`}>
      <span className="cv-conn__dot"></span>
      <span>{t("conn_" + state)}</span>
      <span className="cv-conn__save">· {t("saved")}</span>
    </div>
  );
}

/* ---------- empty canvas ---------- */
function EmptyCanvas({ peers, t }) {
  return (
    <div className="cv-empty">
      <div className="cv-empty__hint">
        <svg className="cv-empty__arrow" width="60" height="80" viewBox="0 0 60 80" fill="none">
          <path d="M52 8 C 45 30, 30 45, 12 60" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" strokeDasharray="3 4"/>
          <path d="M8 56 L 12 60 L 16 56" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <div className="cv-empty__copy">
          <h2>{t("empty_title")}</h2>
          <p>{t("empty_sub")}</p>
          <div className="cv-empty__kbds">
            <span><kbd>Double-click</kbd> {t("empty_dbl")}</span>
            <span><kbd>Drag</kbd> {t("empty_pan")}</span>
            <span><kbd>⌘</kbd>+<kbd>Z</kbd> {t("empty_undo")}</span>
          </div>
        </div>
      </div>

      {/* peer activity floating */}
      {peers && (
        <>
          <div className="cv-peer-cursor" style={{ top: "32%", left: "62%", "--c": MIKAEL.color }}>
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M2 2L16 9l-6 1.5L8 17 2 2z" fill={MIKAEL.color} stroke="white" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            <span className="cv-peer-cursor__label" style={{ background: MIKAEL.color }}>{MIKAEL.name.split(" ")[0]}</span>
          </div>
          <div className="cv-peer-cursor" style={{ top: "60%", left: "38%", "--c": SARA.color }}>
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M2 2L16 9l-6 1.5L8 17 2 2z" fill={SARA.color} stroke="white" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            <span className="cv-peer-cursor__label" style={{ background: SARA.color }}>{SARA.name.split(" ")[0]}</span>
          </div>
        </>
      )}

      {/* a single locked-by-peer note hint */}
      <div className="cv-note cv-note--locked" style={{ top: "20%", left: "72%", background: "var(--note-mist)", transform: "rotate(-2deg)" }}>
        <div className="cv-note__lock" style={{ background: MIKAEL.color }}>
          <Icon.Lock /><span>{MIKAEL.name.split(" ")[0]} {t("editing")}</span>
        </div>
        <div className="cv-note__h">Kickoff</div>
        <div className="cv-note__b">Workshop goals…</div>
      </div>
    </div>
  );
}

/* ---------- floating selection toolbar ---------- */
function SelectionToolbar({ visible }) {
  if (!visible) return null;
  return (
    <div className="cv-float-toolbar" style={{ top: "30%", left: "50%" }}>
      <button title="Bold"><Icon.Bold /></button>
      <button title="Italic"><Icon.Italic /></button>
      <button title="Strikethrough"><Icon.Strike /></button>
      <button title="Code"><Icon.Code /></button>
      <span className="cv-float-toolbar__sep"></span>
      <button title="Link"><Icon.Link /></button>
    </div>
  );
}

/* ---------- full edit toolbar (anchored to focused note) ---------- */
function EditToolbar({ t }) {
  return (
    <div className="cv-edit-toolbar">
      <div className="cv-edit-toolbar__group">
        <button title="H1"><Icon.H1 /></button>
        <button title="H2"><Icon.H2 /></button>
      </div>
      <span className="cv-edit-toolbar__sep"></span>
      <div className="cv-edit-toolbar__group">
        <button title="Bold"><Icon.Bold /></button>
        <button title="Italic"><Icon.Italic /></button>
        <button title="Strikethrough"><Icon.Strike /></button>
        <button title="Code"><Icon.Code /></button>
      </div>
      <span className="cv-edit-toolbar__sep"></span>
      <div className="cv-edit-toolbar__group">
        <button title="Bullet list"><Icon.Bullets /></button>
        <button title="Numbered list"><Icon.Ordered /></button>
        <button title="Blockquote"><Icon.Quote /></button>
        <button title="Link"><Icon.Link /></button>
      </div>
      <span className="cv-edit-toolbar__sep"></span>
      <div className="cv-edit-toolbar__colors" role="group" aria-label="Note color">
        {["var(--note-mist)","var(--note-cream)","var(--note-sage)","var(--note-rose)","var(--note-sand)","var(--note-slate)"].map((c,i) => (
          <button key={i} className="cv-swatch" style={{ background: c }} aria-pressed={i === 0} />
        ))}
      </div>
      <span className="cv-edit-toolbar__sep"></span>
      <button className="cv-edit-toolbar__done">{t("done")}</button>
    </div>
  );
}

/* ---------- history panel ---------- */
function HistoryPanel({ open, t }) {
  if (!open) return null;
  const entries = [
    { day: "Today", items: [
      { who: MIKAEL, type: "edit", note: "Kickoff", time: "just now", icon: "✎" },
      { who: SARA, type: "create", note: "Sticky", time: "2 min ago", icon: "+" },
      { who: ME, type: "color", note: "Workshop goals", time: "5 min ago", icon: "●" },
      { who: ME, type: "snapshot", label: "Before workshop", time: "12 min ago", icon: "◆" },
      { who: MIKAEL, type: "move", note: "Risks", time: "18 min ago", icon: "↗" },
    ]},
    { day: "Yesterday", items: [
      { who: SARA, type: "delete", note: "Old idea", time: "4:32 PM", icon: "−" },
      { who: ME, type: "snapshot", label: "v1 draft", time: "11:08 AM", icon: "◆" },
      { who: LINN, type: "edit", note: "Tagline", time: "9:47 AM", icon: "✎" },
    ]},
  ];
  return (
    <aside className="cv-history">
      <header className="cv-history__head">
        <div className="cv-history__title">{t("history_title")}</div>
        <button className="cv-history__save">{t("save_version")}</button>
      </header>
      <div className="cv-history__scroll">
        {entries.map((day) => (
          <section key={day.day} className="cv-history__day">
            <h4 className="cv-history__daylabel">{day.day}</h4>
            <ol className="cv-history__list">
              {day.items.map((it, i) => (
                <li key={i} className={`cv-history__row cv-history__row--${it.type}`}>
                  <span className="cv-history__icon" style={it.type === "snapshot" ? null : { background: it.who.color }}>{it.icon}</span>
                  <div className="cv-history__body">
                    {it.type === "snapshot" ? (
                      <>
                        <div className="cv-history__summary">
                          <strong>{t("snapshot_saved")}</strong> · <em>{it.label}</em>
                        </div>
                        <div className="cv-history__meta">
                          <span>{it.who.name.split(" ")[0]}</span> · <span>{it.time}</span>
                        </div>
                        <button className="cv-history__restore">{t("restore")}</button>
                      </>
                    ) : (
                      <>
                        <div className="cv-history__summary">
                          <span className="cv-history__who">{it.who.name.split(" ")[0]}</span> {t("did_" + it.type)} <span className="cv-history__note">"{it.note}"</span>
                        </div>
                        <div className="cv-history__meta">{it.time}</div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </aside>
  );
}

/* ---------- share modal ---------- */
function ShareModal({ onClose, t }) {
  const [email, setEmail] = useState("");
  const invited = [
    { ...ME, role: "owner", status: "active" },
    { ...MIKAEL, role: "editor", status: "active" },
    { ...SARA, role: "editor", status: "active" },
    { id: "p1", name: "John Park", email: "john.park@figment.co", initials: "JP", color: "oklch(60% 0.13 305)", role: "editor", status: "pending" },
  ];
  return (
    <div className="cv-modal" onClick={onClose}>
      <div className="cv-modal__card" onClick={(e) => e.stopPropagation()}>
        <h3>{t("share_title")}</h3>
        <p className="cv-modal__sub">{t("share_sub")}</p>
        <form className="cv-modal__form" onSubmit={(e) => { e.preventDefault(); setEmail(""); }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@team.com" type="email" />
          <select defaultValue="editor"><option value="editor">{t("role_editor")}</option><option value="viewer">{t("role_viewer")}</option></select>
          <button type="submit">{t("invite")}</button>
        </form>
        <div className="cv-modal__list">
          {invited.map((p) => (
            <div key={p.id} className="cv-modal__row">
              <span className="cv-avatar" style={{ background: p.color }}>{p.initials}</span>
              <div className="cv-modal__id">
                <span className="cv-modal__name">{p.name}</span>
                <span className="cv-modal__email">{p.email || p.id + "@klistra.io"}</span>
              </div>
              {p.status === "pending" ? <span className="cv-chip">{t("pending")}</span> : <span className="cv-modal__role">{t("role_" + p.role)}</span>}
            </div>
          ))}
        </div>
        <div className="cv-modal__link">
          <span className="cv-modal__linkurl">klistra.io/r/q2-strategy-retro</span>
          <button>{t("copy_link")}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- main ---------- */
function Canvas({ t, lang, setLang, connection, peers }) {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const [showSelection, setShowSelection] = useState(false);

  return (
    <div className={`cv ${historyOpen ? "has-history" : ""}`}>
      <TopBar
        docName="Q2 strategy retro"
        connection={connection}
        lang={lang} setLang={setLang}
        onShare={() => setShareOpen(true)}
        historyOpen={historyOpen} setHistoryOpen={setHistoryOpen}
        t={t}
      />

      {connection === "offline" && (
        <div className="cv-banner cv-banner--offline">
          <span className="cv-banner__dot"></span>
          {t("offline_banner")}
        </div>
      )}
      {connection === "reconnecting" && (
        <div className="cv-banner cv-banner--reconnecting">
          <span className="cv-banner__dot"></span>
          {t("reconnecting_banner")}
        </div>
      )}

      <div className="cv-stage">
        <div className="cv-canvas">
          <EmptyCanvas peers={peers} t={t} />
          <SelectionToolbar visible={showSelection} />
          {editingNote && <EditToolbar t={t} />}
        </div>

        {/* zoom controls */}
        <div className="cv-zoom">
          <button>−</button>
          <span>100%</span>
          <button>+</button>
        </div>

        {/* demo state controls */}
        <div className="cv-demo">
          <span className="cv-demo__label">{t("demo_state")}</span>
          <button className={editingNote ? "is-active" : ""} onClick={() => { setEditingNote(!editingNote); setShowSelection(false); }}>{t("demo_edit")}</button>
          <button className={showSelection ? "is-active" : ""} onClick={() => { setShowSelection(!showSelection); setEditingNote(false); }}>{t("demo_select")}</button>
        </div>

        <HistoryPanel open={historyOpen} t={t} />
      </div>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} t={t} />}
    </div>
  );
}

window.Canvas = Canvas;

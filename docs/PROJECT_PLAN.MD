# Klistra — Product Specification

**Klistra** (Swedish: "to collaborate") · Offline-First Real-Time Collaborative Canvas

| Author              | Status       | Last Updated |
| ------------------- | ------------ | ------------ |
| Birat Bhattacharjee | Draft — v1.1 | April 2026   |

---

## 1. Overview

Klistra is an offline-first collaborative sticky-note canvas with cloud-backed document persistence. Multiple users can create named documents, invite collaborators, and edit rich-text notes in a shared workspace — in real time when online, or independently when offline — with automatic conflict-free sync when connectivity is restored.

Documents are stored in Firebase Firestore, solving the late-joiner problem and enabling new users to access full document history at any point. Every change is versioned: a structured changelog records who changed what and when, and full Yjs snapshots allow reliable point-in-time restore.

The real-time collaboration layer remains fully peer-to-peer via WebRTC. Firebase is the persistence and access control layer, not the sync layer. This distinction matters: Firestore write latency does not affect the real-time editing experience.

> **Design Principle:** Firebase solves the cold-start and late-joiner problems. Yjs solves real-time conflict resolution. They are complementary, not competing. Never route live keystrokes through Firestore.

---

## 2. Goals

- Document management: users can create, name, list, and delete their documents
- Cloud persistence: document state stored in Firestore so any authenticated user can open a document on any device at any time
- Versioned changes: every mutation recorded in a structured changelog with author, timestamp, and change summary
- Point-in-time restore: full Yjs snapshots stored periodically allowing rollback to any version
- Late-joiner solved: new peers load document state from Firestore snapshot, not from a connected peer
- Offline-first maintained: all writes go to Yjs + IndexedDB first; Firestore sync is async and non-blocking
- Real-time collaboration remains peer-to-peer via WebRTC — Firestore is never in the hot path
- Rich text editing per note via Tiptap with full collaborative awareness
- i18n (Swedish/English)

---

## 3. Architecture

### 3.1 High-Level Design

Klistra uses a four-layer architecture.

| Layer             | Responsibility                                                                   | Technology                   |
| ----------------- | -------------------------------------------------------------------------------- | ---------------------------- |
| Auth              | Google OAuth identity, document ownership, access control                        | Firebase Auth                |
| Cloud Persistence | Document registry, Yjs snapshots, structured changelog, member lists             | Firestore                    |
| Signaling         | Peer introduction only — WebRTC offer/answer exchange, then out of the data path | y-webrtc signaling           |
| Local + P2P       | Real-time CRDT sync between connected peers, offline persistence                 | Yjs + y-indexeddb + y-webrtc |

### 3.2 Sync Hierarchy

Every write flows through four layers in order of priority. The first two are synchronous from the user's perspective; the last two are async.

```
User write (note create, edit, move, delete)
  ↓
  1. Yjs document      (in-memory, synchronous — UI updates immediately)
  ↓
  2. y-indexeddb       (IndexedDB, synchronous — survives page refresh offline)
  ↓
  3. y-webrtc          (connected peers, async — near-immediate when online)
  ↓
  4. Firestore         (cloud, async — non-blocking, runs in background)
```

The user never waits for Firestore. A write is "done" the moment it lands in the Yjs document. Firestore persistence happens asynchronously via a debounced observer on the Yjs document.

### 3.3 Connection Lifecycle

**New user opening a document for the first time:**

- Auth check → Firestore confirms membership
- Load latest Yjs snapshot from Firestore → `Y.applyUpdate()` to initialise document
- y-indexeddb begins persisting locally from this point
- y-webrtc connects → syncs any delta between snapshot and current peer state

**Returning user (document already in IndexedDB):**

- Yjs document loaded from IndexedDB instantly — no network required
- Firestore snapshot fetched in background → compared via state vector
- If Firestore is ahead (edits from another device) → delta applied silently
- y-webrtc connects → real-time sync resumes

**Late joiner (peers connected, user arrives later):**

- Load Firestore snapshot → initialise Yjs document
- y-webrtc syncs remaining delta from connected peers
- User sees complete, current document state

> **Late-Joiner Problem: Solved.** The previous P2P-only architecture required at least one peer to be online for a new user to receive document state. Firestore snapshot initialisation removes this dependency entirely.

### 3.4 Versioning Architecture

Two complementary mechanisms run in parallel.

**Mechanism 1 — Periodic Yjs Snapshots**

A Yjs snapshot (`Y.encodeStateAsUpdate()`) is written to Firestore whenever:

- A session ends (page unload / visibility change to hidden)
- 5 minutes have elapsed since the last snapshot during an active session
- A user explicitly triggers "Save version" from the UI

Snapshots are binary blobs stored in Firestore with metadata. They are the restore mechanism — reliable, complete, and fast to apply via a single `Y.applyUpdate()` call.

**Mechanism 2 — Structured Changelog**

A human-readable changelog entry is written to Firestore for every meaningful document mutation, generated from Yjs `observe` callbacks.

```
{
  id:          string,
  roomId:      string,
  userId:      string,
  displayName: string,
  timestamp:   Timestamp,
  type:        "note_created" | "note_deleted" | "note_moved"
               | "note_resized" | "note_color_changed"
               | "text_edited" | "text_formatted",
  noteId:      string,
  summary:     string,      // e.g. "Changed note color to blue"
  delta:       object | null // structured diff for text changes
}
```

The changelog drives the history UI. It is append-only and never used for state reconstruction — that is the snapshot's job.

**Why both mechanisms:** Yjs snapshots are reliable for restore but opaque — you cannot render "who changed what" from a binary blob. The structured changelog is readable but unsafe as a restore source. Both are required.

### 3.5 Firestore Data Model

```
/rooms/{roomId}
  name:           string
  createdBy:      userId
  createdAt:      Timestamp
  updatedAt:      Timestamp

  /snapshots/{snapshotId}
    update:       Bytes          (Y.encodeStateAsUpdate())
    createdBy:    userId
    createdAt:    Timestamp
    label:        string | null  ("Auto-save" or user-provided label)

  /changelog/{changeId}
    ...see changelog entry schema above

  /members/{userId}
    role:         "owner" | "editor" | "viewer"
    joinedAt:     Timestamp
    displayName:  string
    photoURL:     string

/users/{userId}
  displayName:    string
  photoURL:       string
  rooms:          [roomId]   (denormalised list for dashboard query)
```

---

## 4. Technology Decisions

### 4.1 Frontend Framework — React + TypeScript

React is the correct choice here, not just the familiar one. The Yjs ecosystem has first-class React bindings (`@yjs/react`), Tiptap is React-first, and Firebase SDK v9 is tree-shakeable and works naturally in a React context.

### 4.2 State Management — Two Distinct Layers

| Layer               | Technology   | Owns                                                                                                   |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------ |
| Collaborative State | Yjs Document | Note rich text (Y.XmlFragment via Tiptap), positions/colors (Y.Map), room metadata, presence data      |
| Ephemeral UI State  | Zustand      | Selected note, drag offset, active tool, modal state, history panel open/closed, Firestore sync status |

> **Anti-Pattern Warning:** Firestore must never be written to on every keystroke. All live editing flows through Yjs. Firestore receives debounced snapshots and coalesced changelog entries only.

### 4.3 Offline Sync Strategy — Yjs + Firestore

The Firestore integration point is a Yjs document observer that:

1. Listens to `ydoc.on('update', handler)`
2. Debounces at 30 seconds for snapshot writes
3. Immediately writes a changelog entry for structural changes (note create/delete/move)
4. Coalesces text edits into a single changelog entry per editing session (on blur or 60-second idle)

This keeps Firestore write volume low while maintaining a meaningful history.

### 4.4 IndexedDB Wrapper — idb

`idb` handles application-level storage: user preferences, room metadata cache, locale preference. All Yjs document persistence is handled by y-indexeddb internally. OPFS evaluated and deferred — not justified at MVP scope.

### 4.5 CRDT Strategy — Yjs Document Model

```
ydoc
  └── Y.Map("notes")
        └── noteId → Y.Map
                      ├── "content"   → Y.XmlFragment  ← Tiptap CRDT (rich text)
                      ├── "x"         → number          ← last-write-wins
                      ├── "y"         → number          ← last-write-wins
                      ├── "width"     → number
                      ├── "color"     → string
                      └── "authorId"  → string
```

`Y.XmlFragment` is required by Tiptap and gives full rich text CRDT: concurrent formatting, nested marks, and insertions all converge correctly.

### 4.6 Rich Text Editor — Tiptap

Tiptap's `@tiptap/extension-collaboration` binds directly to `Y.XmlFragment`, so rich text conflict resolution is handled by the same CRDT layer as everything else.

**Why Tiptap over alternatives:**

- **Slate.js** — no official Yjs integration; community bindings are not production quality
- **Lexical** — Yjs integration less mature than Tiptap's
- **ProseMirror directly** — requires writing the Yjs binding layer yourself
- **Headless architecture** — imposes no styles; works cleanly with Tailwind and canvas note styling

---

## 5. Feature Specification (MVP)

### 5.1 Document Management

**Dashboard**

The landing screen after authentication. Shows all documents the user owns or has been invited to, sorted by last updated.

- Create new document — names the document, generates a roomId, writes to Firestore, redirects to canvas
- Open existing document — loads from Firestore snapshot, then starts y-webrtc sync
- Rename document — inline edit on the dashboard card
- Delete document — owner only, requires confirmation, removes all Firestore subcollections
- Share document — generates an invite link; invited users added to `/members` on first open

**Document Cards**

Each card shows: document name, owner avatar, last updated timestamp, collaborator avatar stack (up to 4), and a live indicator if any peer is currently active.

### 5.2 Canvas & Notes

**Note Operations**

- Create note — double-click empty canvas area
- Edit note — click to select, click again or Enter to enter Tiptap editor
- Move note — drag from non-edit state; Y.Map write
- Resize note — drag handle on bottom-right corner
- Delete note — select + Delete key, or context menu
- Color picker — 6 preset colors per note

**Canvas Interactions**

- Pan — click and drag empty canvas area
- Zoom — scroll wheel, with min/max bounds
- Multi-select — shift-click or drag selection rectangle
- Undo/redo — Yjs UndoManager, scoped per note

### 5.3 Rich Text Editing (Tiptap)

Each note contains a Tiptap editor instance backed by `Y.XmlFragment`. Activates on note entry, deactivates on blur returning to static rendered view.

**Supported Formatting**

- Bold, italic, strikethrough — keyboard shortcuts and toolbar
- Inline code — backtick shortcut
- Headings (H1, H2)
- Bullet lists and ordered lists
- Blockquote
- Hyperlinks

**Collaborative Rich Text Behaviour**

- Concurrent edits converge via Y.XmlFragment CRDT — no data loss
- Concurrent formatting converges correctly — both marks applied
- Remote carets shown inside editor via `@tiptap/extension-collaboration-cursor` using Yjs Awareness

**Toolbar Design**

- Floating toolbar on text selection (bold, italic, code, link)
- Full toolbar in active edit mode
- Custom Tailwind component — no imported Tiptap styles

**Read-Only Rendered View**

- Inactive notes rendered as static HTML via `generateHTML()` from `@tiptap/html`
- Avoids mounting full ProseMirror instance for every note on canvas — critical for render performance

### 5.4 Version History

**History Panel**

A slide-in side panel showing the changelog for the current document, accessible via a clock icon in the top navigation.

- Chronological list of changelog entries grouped by date
- Each entry shows: author avatar, action summary, timestamp (e.g. "Birat edited note · 14:32")
- Text edit entries show a simplified before/after diff for the affected note content
- Snapshot entries shown as named restore points with a "Restore to this version" button

**Version Restore Flow**

1. User clicks "Restore to this version" on a snapshot entry
2. Confirmation dialog: "This will replace the current canvas with the state from [timestamp]. All collaborators will see this change."
3. On confirm: fetch Yjs snapshot bytes from Firestore → `Y.applyUpdate()` → new snapshot written with label "Restored from [timestamp]" → changelog entry written

**Manual Save Version**

- "Save version" button in top navigation
- Prompts for optional label (e.g. "Before client review")
- Writes immediate Yjs snapshot to Firestore with label

**Auto-save Indicators**

- Subtle "Saved" / "Saving..." indicator reflecting Firestore sync status
- Distinct from the offline/online indicator which reflects peer connectivity

### 5.5 Collaboration Features

**Presence**

- Live cursors on canvas with name label and unique color
- Cursor throttling at max 20fps
- Cursor interpolation via CSS transitions
- In-editor cursors via Tiptap collaboration cursor extension
- Presence sidebar with connected peers, avatars, connection status
- Note lock indicator when a peer is in edit mode

**Awareness**
Canvas cursors, editor cursors, and edit locks use Yjs Awareness — ephemeral, not persisted, lost on disconnect.

### 5.6 Offline-First Behaviour

**Connection States**

| State        | Visual Indicator                      | User Behaviour Allowed                         |
| ------------ | ------------------------------------- | ---------------------------------------------- |
| Online       | Green dot, peer count shown           | Full collaboration, writes sync in real time   |
| Offline      | Grey dot, "Working offline" banner    | All writes continue, persisted to IndexedDB    |
| Reconnecting | Yellow pulsing dot, "Reconnecting..." | All writes continue, queued as Yjs operations  |
| Syncing      | Blue spinner, "Syncing changes..."    | Brief read-only while Yjs exchanges operations |

**Offline Write Guarantee**

- Every write committed to Yjs document synchronously
- y-indexeddb persists immediately — survives page refresh with no network
- Firestore sync resumes on reconnect — changelog entries and snapshots flushed from queue
- No manual conflict resolution UI — CRDT handles it

### 5.7 Authentication

- Google OAuth via Firebase Auth
- User profile stored in Firestore `/users/{userId}` on first sign-in
- Identity passed as Yjs Awareness metadata for presence display
- Auth required to create or open documents
- Document access verified via Firestore Security Rules

### 5.8 Internationalisation

- `react-i18next` for all strings
- Swedish (sv) as default locale, English (en) as fallback
- Language toggle in top navigation
- Locale preference persisted to IndexedDB via `idb`

---

## 6. Full Technology Stack

| Category          | Package                                | Rationale                                                      |
| ----------------- | -------------------------------------- | -------------------------------------------------------------- |
| Framework         | React 18 + TypeScript                  | First-class Yjs bindings, concurrent mode for canvas rendering |
| CRDT / Sync       | yjs + @yjs/react                       | Industry-standard CRDT, offline-first by design                |
| P2P Transport     | y-webrtc                               | WebRTC Data Channels + built-in signaling integration          |
| Local Persistence | y-indexeddb                            | Yjs document persistence to IndexedDB                          |
| Cloud Persistence | Firebase Firestore                     | Document registry, snapshots, changelog, access control        |
| Auth              | Firebase Auth                          | Google OAuth, integrates with Firestore Security Rules         |
| App Storage       | idb                                    | Preferences and room metadata cache                            |
| Rich Text         | @tiptap/react + extensions             | Headless ProseMirror with first-class Yjs collaboration        |
| Collab Cursor     | @tiptap/extension-collaboration-cursor | In-editor peer carets via Yjs Awareness                        |
| UI State          | Zustand                                | Clean separation from Yjs doc state                            |
| Server State      | React Query                            | Firestore data fetching, dashboard queries                     |
| Styling           | Tailwind CSS                           | Works cleanly with Tiptap's headless architecture              |
| Animation         | Framer Motion                          | Cursor interpolation, panel transitions, note drag             |
| i18n              | react-i18next                          | Lazy-loads locale files                                        |
| Testing           | Vitest + RTL                           | Yjs mutations, Zustand state machines, Firestore integration   |
| Deployment        | Vercel                                 | Edge deployment, EU region                                     |

---

## 7. Known Tradeoffs & Limitations

| Tradeoff                 | Impact                                                                                                                     | Production Path                                                                                                        |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Firestore write volume   | Text edit changelog entries are coalesced per editing session, not per keystroke. History is not character-level granular. | Acceptable for MVP. Finer granularity requires writing Yjs operation logs to Firestore — significantly increases cost. |
| Binary snapshot opacity  | Yjs snapshots stored as binary blobs cannot be inspected in the Firestore console.                                         | The structured changelog provides the human-readable layer. Snapshots are restore artifacts only.                      |
| Restore is destructive   | Restoring a snapshot replaces the current canvas state for all collaborators. No branching.                                | Add branch/fork support in v2: create a new document from a snapshot rather than overwriting.                          |
| WebRTC NAT traversal     | May fail in restrictive corporate networks without a TURN server.                                                          | Add Coturn or Cloudflare TURN as fallback.                                                                             |
| ProseMirror bundle size  | ~80KB gzipped. Mounting full editor per note would hurt canvas performance.                                                | Mitigated by rendering inactive notes as static HTML via `generateHTML()`.                                             |
| Firestore Security Rules | Correctly securing subcollection access (snapshots, changelog, members) requires careful Rules authoring.                  | Write and document the Rules as part of the project — this is itself a portfolio signal.                               |

---

## 8. Build Phases

| Week | Phase                | Deliverable                                                                                               |
| ---- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| 1    | Foundation           | Yjs doc model, y-indexeddb, local canvas with sticky notes. Works fully offline on a single device.       |
| 2    | Firebase Integration | Firestore data model, Firebase Auth, dashboard UI, document create/open/delete, Firestore Security Rules. |
| 3    | Cloud Sync           | Yjs ↔ Firestore sync (snapshot write on session end, snapshot load on open), late-joiner flow working.    |
| 4    | Versioning           | Changelog observer, history panel UI, manual save version, point-in-time restore flow.                    |
| 5    | Rich Text + P2P      | Tiptap integration, Y.XmlFragment binding, y-webrtc P2P sync, live cursors.                               |
| 6    | Offline Resilience   | Offline/reconnecting/syncing states, Firestore offline queue, reconnection flow testing.                  |
| 7    | Polish + README      | i18n, performance profiling, load test, architecture README with diagrams, Security Rules documentation.  |

---

## 9. README Strategy

- **Live demo link** — always deployed on Vercel. A dead demo hurts more than no demo.
- **Architecture diagram** — showing Yjs, y-webrtc, y-indexeddb, Firestore, Firebase Auth, and the signaling server. Make the separation between "Firestore = persistence" and "Yjs = sync" visually explicit.
- **"Hard problems solved" section** — covering: (1) why Firestore is not in the real-time hot path, (2) the two-versioning-mechanism design and why both are needed, (3) Y.XmlFragment vs Y.Text for rich text, (4) offline write guarantee with Firestore queue flush on reconnect.
- **Tradeoffs section** — paste the tradeoffs table directly.
- **Firestore Security Rules** — include the actual Rules in the README. Few portfolio projects do this; it signals production awareness.
- **Performance numbers** — concurrent peer test results, Firestore write volume per session, canvas render performance with N notes.

---

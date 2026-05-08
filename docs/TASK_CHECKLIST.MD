# Klistra — MVP task checklist

The order within each task follows a strict rule:

1. Supporting utilities, services, hooks, and pure logic first
2. Unit tests for that logic second
3. The React component (`.tsx`) last — never written before its tests exist

---

## T1 · Project setup & tooling

- [x] Install and configure Tailwind CSS with base config
- [x] Add ESLint, Prettier, and tsconfig paths
- [x] Install Vitest and React Testing Library; add a smoke test to confirm the runner works
- [x] Add Framer Motion and verify a simple animation renders

> **PR 1** — Bootstrapped project: tooling, linting, test runner, base styles

---

## T2 · Git hooks, coverage enforcement & commit conventions

- [x] Install Husky and initialise it in the repo (`husky init`)
- [x] Install `lint-staged` and add it to `package.json`
- [x] Configure `lint-staged` in `package.json` to run ESLint and Prettier on staged `.ts` / `.tsx` / `.json` / `.md` files

  ```jsonc
  // package.json
  {
    "lint-staged": {
      "*.{ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
      "*.{json,md}": ["prettier --write"],
    },
  }
  ```

- [x] Create `.husky/pre-commit` — runs `lint-staged` on every commit; the commit is blocked if lint-staged exits non-zero

  ```sh
  # .husky/pre-commit
  npx lint-staged
  ```

- [x] Install `@commitlint/cli` and `@commitlint/config-conventional`
- [x] Create `commitlint.config.ts` enforcing the project's commit convention

  ```ts
  // commitlint.config.ts
  export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [2, 'always', ['feat', 'fix', 'test', 'refactor', 'chore', 'docs', 'perf']],
      'scope-enum': [
        2,
        'always',
        ['landing', 'dashboard', 'canvas', 'auth', 'room', 'common', 'infra', 'deps', 'readme'],
      ],
      'scope-empty': [2, 'never'],
      'subject-case': [2, 'always', 'sentence-case'],
      'subject-full-stop': [2, 'never', '.'],
      'header-max-length': [2, 'always', 100],
    },
  }
  ```

- [x] Create `.husky/commit-msg` — runs commitlint on the commit message; the commit is blocked if the message does not match the convention

  ```sh
  # .husky/commit-msg
  npx --no -- commitlint --edit "$1"
  ```

- [x] Configure Vitest coverage in `vitest.config.ts` (Next.js uses a separate Vitest config, not `vite.config.ts`) using `@vitest/coverage-v8`

  ```ts
  // vitest.config.ts
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  import path from 'path'

  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test-setup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov', 'html'],
        reportsDirectory: './coverage',
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
        exclude: [
          'src/app/**', // Next.js App Router pages and layouts — not unit-testable
          'src/types/**', // pure type declarations
          'src/**/*.test.ts',
          'src/**/*.test.tsx',
          'src/test-setup.ts',
        ],
      },
    },
  })
  ```

- [x] Create `.husky/pre-push` — runs the full test suite with coverage before every `git push`; the push is blocked if coverage falls below 80% on any metric or if any test fails

  ```sh
  # .husky/pre-push
  npx vitest run --coverage
  ```

- [ ] Verify the full hook chain end-to-end:
  - [ ] Attempt a commit with a malformed message (e.g. `"wip stuff"`) — commitlint must block it
  - [ ] Attempt a commit with a lint error in a staged file — lint-staged must block it
  - [ ] Attempt a `git push` with a failing test — pre-push must block it
  - [ ] Attempt a `git push` with coverage below 80% — pre-push must block it
  - [ ] Make a valid commit (`feat(infra): add husky hooks and coverage config`) and push — all hooks pass

> **PR 2** — Git hooks: pre-commit lint-staged, commit-msg commitlint, pre-push coverage gate, all hooks verified

---

## T3 · App shell, routing & auth middleware

- [x] Define Zustand store shape: `selectedNote`, `activeModal`, `panelOpen`, `syncStatus`, `connectionState`
- [x] Write unit tests for Zustand stores — `canvas-store.test.ts`, `collaboration-ui-store.test.ts`
  - [x] Default state matches the defined shape
  - [x] Each action updates only the expected slice of state
- [x] **Auth routing (Next.js Proxy)** — create `proxy.ts` at the project root to gate routing based on Firebase auth state
  - [x] Write `get-auth-token.ts` — reads the Firebase session cookie (`__session`) from the incoming request headers; returns the decoded token or `null`
  - [x] Write unit tests for `get-auth-token.test.ts`
    - [x] Returns a decoded token object when a valid `__session` cookie is present
    - [x] Returns `null` when the cookie is absent
    - [x] Returns `null` when the cookie value cannot be verified
  - [x] In `proxy.ts`, use `getAuthToken` to determine routing:
    - [x] Unauthenticated request to any protected path (`/dashboard`, `/room/:id`) → redirect to `/` (landing page)
    - [x] Authenticated request to `/` (landing page) → redirect to `/dashboard`
    - [x] Authenticated request to a protected path → allow through
  - [x] Add `matcher` config to `proxy.ts` so it runs only on `'/'`, `'/dashboard/:path*'`, and `'/room/:path*'` (per `docs/PROJECT_GUIDELINES.MD` §5.1 — covers `/dashboard` and nested routes)
  - [x] Write integration tests for `proxy.test.ts`
    - [x] Unauthenticated request to `/dashboard` redirects to `/`
    - [x] Authenticated request to `/` redirects to `/dashboard`
    - [x] Authenticated request to `/dashboard` passes through
    - [x] Unauthenticated request to `/` passes through (landing page is public)
- [x] Create Next.js App Router structure:
  - [x] `app/page.tsx` — landing page route (public)
  - [x] `app/dashboard/page.tsx` — dashboard route (protected)
  - [x] `app/room/[id]/page.tsx` — canvas room route (protected)

> **PR 3** — App shell: Next.js App Router structure, auth proxy with tests, Zustand store, store tests

---

## T4 · Landing page

- [ ] Audit `/designs/` — review all design files in `/designs/` and note the exact sections, components, colour tokens, and typography used in the landing page designs before writing any code
- [ ] Write `landing-page.test.tsx`
  - [ ] Hero section renders the primary headline and CTA button
  - [ ] CTA button links to the sign-in flow
  - [ ] Feature sections render the correct number of feature cards
  - [ ] Framer Motion wrappers do not break rendering in a test environment (mock `framer-motion` if needed)
- [ ] Build `app/page.tsx` (landing page) — implement pixel-faithful to `/designs/` landing page designs; sections to include at minimum: hero, features, and call-to-action footer
  - [ ] Match layout, spacing, and colour tokens exactly as specified in `/designs/`
  - [ ] All animations use Framer Motion; verify they render correctly in the browser
  - [ ] Page is fully responsive across mobile, tablet, and desktop breakpoints as shown in `/designs/`
  - [ ] CTA button triggers the Google sign-in flow

> **PR 4** — Landing page: tests then pixel-faithful implementation from `/designs/` with Framer Motion animations

---

## T5 · Dashboard UI

- [ ] Write `format-timestamp.ts` — formats a Firestore `Timestamp` into a human-readable relative string
- [ ] Write unit tests for `format-timestamp.test.ts`
  - [ ] Returns "just now" for timestamps within the last minute
  - [ ] Returns "X minutes ago" for timestamps within the last hour
  - [ ] Returns a formatted date string for timestamps older than 24 hours
- [ ] Write `document-card.test.tsx`
  - [ ] Renders document name, owner avatar initials, and formatted timestamp
  - [ ] Double-clicking the label puts it into rename mode
  - [ ] Pressing Escape in rename mode cancels and restores the original name
  - [ ] Blurring the rename input calls `onRename` with the new value
  - [ ] Delete button triggers the confirmation dialog
  - [ ] Confirming delete calls `onDelete` with the correct roomId
- [ ] Build `document-card.tsx`
- [ ] Write `create-document-modal.test.tsx`
  - [ ] Renders with an empty name input and disabled submit button
  - [ ] Enables submit button once the name field is non-empty
  - [ ] Calls `onCreate` with the trimmed name on submit
  - [ ] Closes and resets on Escape key press
- [ ] Build `create-document-modal.tsx`
- [ ] Write `dashboard-page.test.tsx`
  - [ ] Shows empty state when the owned document list is empty
  - [ ] Renders one `DocumentCard` per owned document under "My documents"
  - [ ] Renders one `DocumentCard` per document under "Collaborating"
  - [ ] "Collaborating" section is hidden when the list is empty
- [ ] Build `app/dashboard/page.tsx` — "My documents" and "Collaborating" sections, empty states; reference `/designs/` for layout, spacing, and visual style

> **PR 5** — Dashboard UI: format-timestamp util, all tests, then document-card, create-document-modal, dashboard-page (styled from `/designs/`)

---

## T6 · Canvas shell

- [ ] Write `canvas-transform.ts` — pure functions: `applyPan(transform, delta)`, `applyZoom(transform, delta, origin)`, `clampZoom(scale)`
- [ ] Write unit tests for `canvas-transform.test.ts`
  - [ ] `applyPan` shifts x and y by the delta values
  - [ ] `applyZoom` scales around the provided origin point
  - [ ] `clampZoom` returns min when scale is below bounds, max when above
  - [ ] `clampZoom` returns the value unchanged when within bounds
- [ ] Write `note-geometry.ts` — pure functions: `snapToGrid(x, y, gridSize)`, `noteContainsPoint(note, x, y)`
- [ ] Write unit tests for `note-geometry.test.ts`
  - [ ] `snapToGrid` rounds x and y to the nearest grid increment
  - [ ] `noteContainsPoint` returns true when point is inside note bounds
  - [ ] `noteContainsPoint` returns false when point is outside note bounds
- [ ] Write `color-picker.test.tsx`
  - [ ] Renders exactly 6 colour swatches
  - [ ] Clicking a swatch calls `onChange` with the correct hex value
  - [ ] Active swatch has the correct `aria-pressed` state
- [ ] Build `color-picker.tsx`
- [ ] Write `sticky-note.test.tsx`
  - [ ] Renders with the correct background colour from props
  - [ ] Calls `onSelect` when clicked in non-edit mode
  - [ ] Does not call `onSelect` when already in edit mode
  - [ ] Renders `ColorPicker` when colour picker is open
  - [ ] Calls `onColorChange` with the selected colour value
- [ ] Build `sticky-note.tsx` — coloured card, positioned absolutely, drag-to-move, colour picker
- [ ] Write `canvas.test.tsx`
  - [ ] Renders all notes from the provided list
  - [ ] Double-click on empty canvas area calls `onCreateNote` with the correct x/y coordinates
  - [ ] Pointerdown + pointermove on the background updates the pan transform
  - [ ] Scroll wheel calls `applyZoom` and updates the transform
- [ ] Build `canvas.tsx` — full-viewport container, pan, zoom, note rendering

> **PR 6** — Canvas shell: canvas-transform and note-geometry utils, all tests, then color-picker, sticky-note, canvas

---

## T7 · Tiptap editor (static)

- [ ] Write `generate-note-html.ts` — thin wrapper around `generateHTML()` from `@tiptap/html` with the app's extension set
- [ ] Write unit tests for `generate-note-html.test.ts`
  - [ ] Returns a non-empty HTML string for a valid Tiptap JSON doc
  - [ ] Returns an empty paragraph string for an empty doc
  - [ ] Preserves bold marks in the output HTML
  - [ ] Preserves bullet list structure in the output HTML
- [ ] Write `editor-toolbar.test.tsx`
  - [ ] Renders buttons for bold, italic, strikethrough, inline code, and bullet list
  - [ ] Each button has a correct accessible label
  - [ ] Bold button has an active class when `isBoldActive` prop is true
  - [ ] Clicking an inactive bold button calls `onBold`
- [ ] Build `editor-toolbar.tsx`
- [ ] Write `note-editor.test.tsx`
  - [ ] Renders static HTML output when `isEditing` is false
  - [ ] Mounts the Tiptap editor when `isEditing` is true
  - [ ] Calls `onBlur` when the editor loses focus
  - [ ] Static HTML matches `generate-note-html` output for a given doc snapshot
- [ ] Build `note-editor.tsx` — Tiptap instance, edit/view toggle, full toolbar, static HTML fallback

> **PR 7** — Tiptap editor: generate-note-html util, all tests, then editor-toolbar, note-editor

---

## T8 · Collaboration UI (shell)

- [ ] Write `presence-utils.ts` — pure functions: `getInitials(displayName)`, `assignCursorColor(userId)`
- [ ] Write unit tests for `presence-utils.test.ts`
  - [ ] `getInitials` returns up to 2 uppercase initials from a full name
  - [ ] `getInitials` handles single-word names
  - [ ] `assignCursorColor` returns a consistent colour for the same userId
  - [ ] `assignCursorColor` returns different colours for different userIds
- [ ] Write `connection-banner.test.tsx`
  - [ ] Renders nothing when state is `"online"`
  - [ ] Renders "Working offline" when state is `"offline"`
  - [ ] Renders "Reconnecting..." when state is `"reconnecting"`
  - [ ] Renders "Syncing changes..." when state is `"syncing"`
  - [ ] Each non-online state applies a distinct colour class
- [ ] Build `connection-banner.tsx`
- [ ] Write `cursor-overlay.test.tsx`
  - [ ] Renders one cursor label per peer
  - [ ] Each cursor is positioned using x/y from the peer's awareness state
  - [ ] Renders nothing when the peer list is empty
- [ ] Build `cursor-overlay.tsx`
- [ ] Write `presence-sidebar.test.tsx`
  - [ ] Renders one row per peer
  - [ ] Each row displays initials from `getInitials` and a status dot
  - [ ] Connected peers show a green dot; disconnected peers show a grey dot
- [ ] Build `presence-sidebar.tsx`

> **PR 8** — Collaboration UI shell: presence-utils, all tests, then connection-banner, cursor-overlay, presence-sidebar

---

## T9 · Auto-save indicator

- [ ] Write `auto-save-indicator.test.tsx`
  - [ ] Renders "Saved" when `syncStatus` is `"saved"`
  - [ ] Renders "Saving..." when `syncStatus` is `"saving"`
  - [ ] Renders nothing when `syncStatus` is `"idle"`
- [ ] Build `auto-save-indicator.tsx` — reads from Zustand `syncStatus`, renders inline in nav

> **PR 9** — Auto-save indicator: tests then component

---

## T10 · Firebase auth & user persistence

- [ ] Write `auth-service.ts` — `signInWithGoogle()`, `signOut()`, `writeUserProfile(user)`
- [ ] Write unit tests for `auth-service.test.ts`
  - [ ] `signInWithGoogle` calls Firebase `signInWithPopup` with the Google provider
  - [ ] `writeUserProfile` writes the correct shape to `/users/{userId}` on first sign-in
  - [ ] `writeUserProfile` does not overwrite an existing profile (uses `setDoc` with `merge: true`)
  - [ ] `signOut` calls Firebase `signOut`
- [ ] **User persistence on login** — extend `writeUserProfile` / `onLoginSuccess` to save user data in Firestore if not already present
  - [ ] Write `user-profile-service.ts` — `ensureUserProfile(user)`: checks `/users/{userId}` for an existing document; writes initial profile only when the document does not yet exist
    - [ ] Profile shape: `{ uid, email, displayName, photoURL, createdAt, rooms: [] }`
    - [ ] Uses a Firestore transaction or `setDoc` with `merge: false` guarded by a prior `getDoc` existence check to avoid overwriting data
  - [ ] Write unit tests for `user-profile-service.test.ts`
    - [ ] Writes a new profile document when `/users/{userId}` does not exist
    - [ ] Does not write or overwrite when the document already exists
    - [ ] Written document contains all required fields with correct types
    - [ ] `createdAt` is a Firestore server timestamp
  - [ ] Call `ensureUserProfile(user)` inside the `signInWithGoogle` success handler — after the Firebase auth credential resolves and before redirecting to `/dashboard`
  - [ ] Write a session cookie (`__session`) containing the Firebase ID token after successful sign-in so that `proxy.ts` can read it on subsequent requests
    - [ ] Write unit test: cookie is set with correct name, value, and `httpOnly`/`secure` flags
- [ ] Write `auth-guard.test.tsx`
  - [ ] Renders children when user is authenticated
  - [ ] Redirects to `/` when user is null
  - [ ] Renders a loading state while auth status is resolving
- [ ] Build `auth-guard.tsx` (client-side fallback guard for components that need it)
- [ ] Write `login-page.test.tsx`
  - [ ] Renders "Sign in with Google" button
  - [ ] Calls `signInWithGoogle` on button click
  - [ ] Calls `ensureUserProfile` with the resolved user after sign-in
  - [ ] Redirects to `/dashboard` after successful sign-in
- [ ] Build `login-page.tsx` — embedded in the landing page or as a modal triggered from the CTA

> **PR 10** — Firebase auth: auth-service, user-profile-service, all tests, auth-guard, login flow with Firestore user persistence and session cookie

---

## T11 · Firestore data model & dashboard wiring

- [ ] Write Firestore Security Rules for `/rooms`, `/members`, `/snapshots`, `/changelog`
- [ ] Write `room-service.ts` — `createRoom()`, `renameRoom()`, `deleteRoom()`
- [ ] Write unit tests for `room-service.test.ts`
  - [ ] `createRoom` writes the correct shape to `/rooms` and `/members` with `owner` role
  - [ ] `createRoom` adds the roomId to `/users/{userId}.rooms`
  - [ ] `renameRoom` updates `rooms/{roomId}.name` with the trimmed value
  - [ ] `deleteRoom` rejects when called by a non-owner
  - [ ] `deleteRoom` removes the room and all subcollections
- [ ] Write `use-rooms.test.ts`
  - [ ] Returns owned rooms and collaborating rooms as separate lists
  - [ ] Returns an empty collaborating list when user has no editor memberships
  - [ ] Calls the Firestore query with the correct userId
- [ ] Write `use-rooms.ts` — React Query hook, queries owned and collaborating rooms separately
- [ ] Wire `app/dashboard/page.tsx` to `use-rooms` — replace mock data with live Firestore data

> **PR 11** — Firestore data model: Security Rules, room-service, use-rooms, all tests, dashboard wired to live data

---

## T12 · Invite flow

- [ ] Write `invite-service.ts` — `inviteByEmail(roomId, email, inviterId)`
  - [ ] Looks up the email in `/users`
  - [ ] Writes `editor` membership to `/rooms/{roomId}/members/{userId}`
  - [ ] Appends roomId to `/users/{userId}.rooms`
  - [ ] Throws a descriptive error if no user matches the email
  - [ ] Is a no-op if the user is already a member
- [ ] Write unit tests for `invite-service.test.ts`
  - [ ] Looks up user by email in the `/users` collection
  - [ ] Writes correct `editor` membership document when user is found
  - [ ] Appends roomId to the invitee's rooms array
  - [ ] Throws `"No account found with that email"` when email is not in `/users`
  - [ ] Does not write a duplicate membership if user is already a member
- [ ] Write `invite-modal.test.tsx`
  - [ ] Renders email input and a disabled submit button when input is empty
  - [ ] Enables submit once a non-empty email is entered
  - [ ] Calls `onInvite` with the trimmed email on submit
  - [ ] Displays the `inviteError` prop as inline error text when set
  - [ ] Clears error and resets input when the modal is closed
- [ ] Build `invite-modal.tsx`
- [ ] Add "Invite" button to the canvas nav bar, visible to owners only; opens `invite-modal`

> **PR 12** — Invite flow: invite-service, all tests, then invite-modal, invite button in nav

---

## T13 · Yjs document model (local)

- [ ] Install `yjs`, `@yjs/react`, `y-indexeddb`
- [ ] Write `note-doc.ts` — pure functions over a `YDoc`: `createNote()`, `moveNote()`, `deleteNote()`, `changeColor()`
- [ ] Write unit tests for `note-doc.test.ts`
  - [ ] `createNote` inserts a new entry in `Y.Map("notes")` with all required fields
  - [ ] `moveNote` updates x/y without affecting other fields
  - [ ] `deleteNote` removes the entry from `Y.Map`
  - [ ] `changeColor` updates color without affecting position fields
  - [ ] Two concurrent `moveNote` calls on separate `YDoc` instances converge after `Y.applyUpdate`
- [ ] Write `use-y-doc.test.ts`
  - [ ] Returns the current list of notes derived from `Y.Map`
  - [ ] Re-renders when `Y.Map` changes via `observe()`
  - [ ] `y-indexeddb` provider restores notes after a simulated page reload
- [ ] Write `use-y-doc.ts` — React hook, wires canvas state to the live `YDoc`
- [ ] Wire `canvas.tsx` to `use-y-doc` — replace local state with Yjs-backed state
- [ ] Bind `note-editor.tsx` to `Y.XmlFragment` via `@tiptap/extension-collaboration`

> **PR 13** — Yjs local: note-doc utils, all tests, use-y-doc hook, canvas and editor wired to live YDoc

---

## T14 · Firestore snapshot sync

- [ ] Write `snapshot-service.ts` — `loadSnapshot(ydoc, roomId)`, `saveSnapshot(ydoc, roomId, userId)`
- [ ] Write unit tests for `snapshot-service.test.ts`
  - [ ] `loadSnapshot` fetches the most recent snapshot and applies it via `Y.applyUpdate`
  - [ ] `loadSnapshot` is a no-op when no snapshot document exists
  - [ ] `saveSnapshot` encodes the YDoc state and writes to `/snapshots` with correct metadata
  - [ ] `syncStatus` transitions to `"saving"` then `"saved"` on a successful write
- [ ] Wire `loadSnapshot` on room open in `use-y-doc.ts`
- [ ] Wire `saveSnapshot` on `visibilitychange` and `beforeunload` in `use-y-doc.ts`
- [ ] Returning user: compare Firestore snapshot state vector against IndexedDB; apply delta if Firestore is ahead

> **PR 14** — Firestore snapshot sync: snapshot-service, all tests, load/save wired into use-y-doc

---

## T15 · Structured changelog

- [ ] Write `changelog-service.ts` — `writeChangelogEntry(roomId, entry)`, `buildEntry(type, noteId, userId, summary)`
- [ ] Write `changelog-observer.ts` — attaches `Y.Map` `observe()` callbacks and calls `writeChangelogEntry`
- [ ] Write unit tests for `changelog-observer.test.ts`
  - [ ] Emits a `note_created` entry when a new key appears in `Y.Map`
  - [ ] Emits a `note_deleted` entry when a key is removed
  - [ ] Emits a `note_moved` entry when x or y changes, not on colour change
  - [ ] Emits a `note_color_changed` entry when color changes, not on position change
  - [ ] Does not emit duplicate entries when the same field is set to its existing value
  - [ ] Multiple rapid text changes produce exactly one `text_edited` entry on flush (coalescing)
- [ ] Write unit tests for `changelog-service.test.ts`
  - [ ] `buildEntry` returns a correctly shaped changelog object with all required fields
  - [ ] `writeChangelogEntry` writes to `/changelog/{changeId}` in Firestore
- [ ] Wire `changelog-observer` into `use-y-doc.ts` — starts observing after the YDoc is initialised

> **PR 15** — Structured changelog: changelog-service, changelog-observer, all tests, observer wired into use-y-doc

---

## T16 · WebRTC P2P sync

- [ ] Write `awareness-utils.ts` — `encodeAwarenessState(user, cursor)`, `decodeAwarenessPeers(states)`
- [ ] Write unit tests for `awareness-utils.test.ts`
  - [ ] `encodeAwarenessState` returns an object with name, color, and cursor fields
  - [ ] `decodeAwarenessPeers` excludes the local client's own entry from the returned list
  - [ ] `decodeAwarenessPeers` returns an empty array when no remote peers are present
- [ ] Write `use-awareness.test.ts`
  - [ ] Returns a list of remote peer states
  - [ ] `setLocalCursor` updates the local awareness position field
  - [ ] Peer removal is reflected in the returned list within one render cycle
- [ ] Write `use-awareness.ts` — hook over `WebrtcProvider.awareness`
- [ ] Install `y-webrtc`; create `WebrtcProvider` for the room in `use-y-doc.ts`
- [ ] Wire `presence-sidebar.tsx` and `cursor-overlay.tsx` to `use-awareness` — replace mock data
- [ ] Throttle cursor broadcast to max 20fps using a `requestAnimationFrame` gate

> **PR 16** — WebRTC P2P: awareness-utils, all tests, use-awareness hook, live presence and cursors, late-joiner verified

---

## T17 · Offline resilience

- [ ] Write `connection-state.ts` — derives `E_ConnectionState` from `navigator.onLine` and provider events
- [ ] Write unit tests for `connection-state.test.ts`
  - [ ] Returns `Online` when `navigator.onLine` is true and WebRTC provider is connected
  - [ ] Returns `Offline` when `navigator.onLine` is false
  - [ ] Returns `Reconnecting` when online but provider is in reconnecting state
  - [ ] Returns `Syncing` while the Firestore queue is flushing after reconnect
- [ ] Write `use-connection-state.test.ts`
  - [ ] Updates Zustand `connectionState` slice when the derived state changes
- [ ] Write `use-connection-state.ts` — hook that calls `connection-state.ts` and updates Zustand
- [ ] Wire `connection-banner.tsx` to live Zustand `connectionState` — replace mock data
- [ ] Manually test offline write: go offline, edit notes, reload — IndexedDB must restore all edits
- [ ] Manually test reconnect flush: Firestore snapshot and changelog entries written on reconnect

> **PR 17** — Offline resilience: connection-state util, all tests, use-connection-state hook, banner wired, manual tests verified

---

## T18 · i18n

- [ ] Install `react-i18next` and `i18next`; configure with `sv` as default and `en` as fallback
- [ ] Create `sv.json` and `en.json` covering all app strings (iterate through every existing `.tsx`)
- [ ] Write i18n key-parity test — `i18n.test.ts`
  - [ ] Every key in `sv.json` exists in `en.json`
  - [ ] Every key in `en.json` exists in `sv.json`
- [ ] Write `locale-storage.ts` — `saveLocale(lang)` and `loadLocale()` using `idb`
- [ ] Write unit tests for `locale-storage.test.ts`
  - [ ] `saveLocale` writes the language string to IndexedDB under the correct key
  - [ ] `loadLocale` returns the stored language string
  - [ ] `loadLocale` returns `"sv"` when no value is stored
- [ ] Replace all hardcoded strings in every `.tsx` file with `t()` calls
- [ ] Write `language-toggle.test.tsx`
  - [ ] Renders the current language label
  - [ ] Clicking the toggle switches the active `i18next` language
  - [ ] The new preference is persisted via `saveLocale`
- [ ] Build `language-toggle.tsx` — wires to `i18next` and `locale-storage`

> **PR 18** — i18n: locale files, key-parity test, locale-storage util, all tests, strings replaced, language-toggle component

---

## T19 · Performance & deploy

- [ ] Profile canvas with 20+ notes; confirm inactive notes use `generate-note-html.ts`, not live ProseMirror instances
- [ ] Write architecture README: sync hierarchy diagram, Yjs/Firestore separation, invite flow description
- [ ] Deploy to Vercel (EU region); verify live demo link and run final QA pass

> **PR 19** — MVP ship: perf verified, README complete, live Vercel deploy

---

## Deferred to v2

The following are intentionally out of scope for MVP.

- **Version restore** — fetch snapshot → `Y.applyUpdate()` → restore flow with confirmation dialog
- **History panel UI** — slide-in panel with changelog grouped by date, before/after diffs
- **Manual save version** — "Save version" button with user-provided label
- **In-editor peer carets** — `@tiptap/extension-collaboration-cursor`
- **Collaborator avatar stack** on dashboard cards
- **Note resize handle**
- **Multi-select** on canvas
- **Yjs UndoManager** — edge cases with collaborative edits need careful handling
- **Floating toolbar** on text selection
- **Two-device CRDT conflict test** — run as a dedicated testing session post-ship
- **Auto-snapshot** every 5 minutes during active sessions
- **TURN server** for WebRTC NAT traversal in restrictive networks
- **Firestore write volume benchmarking** and Security Rules documented in README

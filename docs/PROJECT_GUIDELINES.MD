# Klistra — project guidelines

These guidelines apply to every contributor and every PR. They are not suggestions — a PR that violates them will not be merged.

---

## 1. Directory structure

Every page owns a **module directory** under `src/modules/`. Code that belongs to a page lives inside that module. Code shared across two or more modules lives in `src/common/`.

The Next.js `app/` directory contains **only** route entry points — page files, layouts, and loading/error boundaries. No business logic, no components, no hooks. Those live in `src/modules/`.

```
src/
├── modules/
│   ├── landing/
│   │   └── components/
│   ├── dashboard/
│   │   ├── components/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── services/
│   │   └── api/
│   ├── canvas/
│   │   ├── components/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── services/
│   │   └── api/
│   ├── auth/
│   │   ├── components/
│   │   ├── utils/
│   │   └── services/
│   └── room/
│       ├── components/
│       ├── store/
│       ├── utils/
│       ├── services/
│       └── api/
├── common/
│   ├── components/
│   ├── store/
│   ├── utils/
│   ├── services/
│   └── api/
└── types/
    └── index.ts

app/
├── page.tsx                  ← renders <LandingPage /> from src/modules/landing
├── layout.tsx
├── dashboard/
│   └── page.tsx              ← renders <DashboardPage /> from src/modules/dashboard
└── room/
    └── [id]/
        └── page.tsx          ← renders <CanvasPage /> from src/modules/canvas
middleware.ts                 ← auth routing guard — project root
```

### What goes where

| Subdirectory  | Contains                                                                |
| ------------- | ----------------------------------------------------------------------- |
| `components/` | React components (`.tsx`) and their test files                          |
| `store/`      | Zustand slices scoped to this module                                    |
| `utils/`      | Pure functions with no React dependency                                 |
| `services/`   | Side-effectful logic: Yjs operations, Firestore writes, IndexedDB reads |
| `api/`        | Raw Firestore query functions — no business logic, no React             |

### The rule of two

If a utility, component, or service is used by exactly one module it lives inside that module. The moment a second module imports it, move it to `common/` in the same PR. Never reach across module boundaries — import from `common/` instead.

```ts
// BAD — canvas module reaching into dashboard module
import { formatTimestamp } from '@/modules/dashboard/utils/format-timestamp'

// GOOD — shared utility lives in common
import { formatTimestamp } from '@/common/utils/format-timestamp'
```

### Example: dashboard module layout

```
src/modules/dashboard/
├── components/
│   ├── document-card.tsx
│   ├── document-card.test.tsx
│   ├── create-document-modal.tsx
│   ├── create-document-modal.test.tsx
│   ├── dashboard-page.tsx
│   └── dashboard-page.test.tsx
├── store/
│   └── dashboard-store.ts
├── utils/
│   ├── format-timestamp.ts
│   └── format-timestamp.test.ts
├── services/
│   ├── room-service.ts
│   └── room-service.test.ts
└── api/
    └── room-api.ts
```

---

## 2. File naming

All file names use **kebab-case**. No exceptions.

| Type                 | Convention                           | Example                                       |
| -------------------- | ------------------------------------ | --------------------------------------------- |
| Component            | kebab-case                           | `document-card.tsx`                           |
| Multi-word component | kebab-case                           | `create-document-modal.tsx`                   |
| Hook                 | kebab-case, `use-` prefix            | `use-rooms.ts`, `use-webrtc.ts`               |
| Utility              | kebab-case                           | `format-timestamp.ts`, `canvas-transform.ts`  |
| Service              | kebab-case, `-service` suffix        | `room-service.ts`, `invite-service.ts`        |
| API module           | kebab-case, `-api` suffix            | `room-api.ts`, `snapshot-api.ts`              |
| Test                 | same name as subject, `.test.` infix | `document-card.test.tsx`, `use-rooms.test.ts` |
| Zustand store        | kebab-case, `-store` suffix          | `dashboard-store.ts`, `canvas-store.ts`       |
| Observer / listener  | kebab-case, `-observer` suffix       | `changelog-observer.ts`                       |
| Types file           | `types.ts` at module root            | `src/modules/canvas/types.ts`                 |

One component per file. A file named `document-card.tsx` exports exactly one component: `DocumentCard`.

Next.js reserved filenames (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`) are exempt from the kebab-case rule — they must use the exact names the framework expects.

---

## 3. Naming conventions — interfaces and enums

### 3.1 Interface naming

Interfaces follow the pattern `I_SCOPE_NAME` where scope is the module name in uppercase, or omitted for common interfaces.

```ts
// Module-scoped interface — src/modules/dashboard/types.ts
interface I_DASHBOARD_Room {
  id: string
  name: string
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface I_DASHBOARD_Member {
  role: 'owner' | 'editor'
  joinedAt: Timestamp
  displayName: string
}

// Canvas module — src/modules/canvas/types.ts
interface I_CANVAS_Note {
  id: string
  x: number
  y: number
  width: number
  color: string
  authorId: string
}

interface I_CANVAS_Transform {
  x: number
  y: number
  scale: number
}

// Common interface — src/types/index.ts
interface I_User {
  uid: string
  displayName: string
  photoURL: string
  email: string
}

interface I_AwarenessState {
  name: string
  color: string
  cursor: { x: number; y: number } | null
}
```

### 3.2 Enum naming

Enums follow the pattern `E_SCOPE_NAME` where scope is the module name in uppercase, or omitted for common enums.

```ts
// Module-scoped enum — src/modules/room/types.ts
enum E_ROOM_MemberRole {
  Owner = 'owner',
  Editor = 'editor',
}

// Canvas module — src/modules/canvas/types.ts
enum E_CANVAS_NoteColor {
  Yellow = '#FEF08A',
  Pink = '#FBCFE8',
  Blue = '#BAE6FD',
  Green = '#BBF7D0',
  Orange = '#FED7AA',
  Purple = '#E9D5FF',
}

// Common enums — src/types/index.ts
enum E_ConnectionState {
  Online = 'online',
  Offline = 'offline',
  Reconnecting = 'reconnecting',
  Syncing = 'syncing',
}

enum E_SyncStatus {
  Idle = 'idle',
  Saving = 'saving',
  Saved = 'saved',
}

enum E_ChangelogType {
  NoteCreated = 'note_created',
  NoteDeleted = 'note_deleted',
  NoteMoved = 'note_moved',
  NoteColorChanged = 'note_color_changed',
  TextEdited = 'text_edited',
  TextFormatted = 'text_formatted',
}
```

### 3.3 Props interfaces

Component props interfaces follow the same pattern. The name ends in `Props`.

```ts
// src/modules/dashboard/components/document-card.tsx
interface I_DASHBOARD_DocumentCardProps {
  roomId: string
  name: string
  updatedAt: Timestamp
  onRename: (newName: string) => void
  onDelete: (roomId: string) => void
}

function DocumentCard({ roomId, name, updatedAt, onRename, onDelete }: I_DASHBOARD_DocumentCardProps) {
  ...
}
```

---

## 4. Component rules

### 4.1 Server Components vs Client Components

Next.js App Router components are **Server Components by default**. Only add `'use client'` when the component actually needs it.

**A component needs `'use client'` if it uses any of:**

- `useState`, `useReducer`, `useEffect`, `useRef`, or any other React hook
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onChange`, etc.)
- Framer Motion animations
- Zustand stores

**A component does not need `'use client'` if it only:**

- Renders markup and passes props down
- Calls `async` functions / `await`s data
- Reads from the filesystem or a database directly

```tsx
// BAD — 'use client' added out of habit, blocking server rendering
'use client'

// This component has no hooks, no events, no browser APIs — it's a pure Server Component
export function RoomCard({ name, updatedAt }: I_DASHBOARD_RoomCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <time>{formatTimestamp(updatedAt)}</time>
    </div>
  )
}
```

```tsx
// GOOD — no directive needed; renders on the server
export function RoomCard({ name, updatedAt }: I_DASHBOARD_RoomCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <time>{formatTimestamp(updatedAt)}</time>
    </div>
  )
}
```

```tsx
// GOOD — 'use client' justified because component uses state and events
'use client'

import { useState } from 'react'

export function CreateDocumentModal({ onCreate }: I_DASHBOARD_CreateDocumentModalProps) {
  const [name, setName] = useState('')
  return (
    <dialog>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button disabled={!name} onClick={() => onCreate(name.trim())}>
        Create
      </button>
    </dialog>
  )
}
```

### 4.2 Push `'use client'` to the leaves

Keep the Server/Client boundary as deep in the tree as possible. Wrap only the interactive part in a Client Component, not the whole page.

```tsx
// BAD — entire dashboard page becomes a Client Component because of one interactive modal
'use client'

export function DashboardPage({ rooms }: I_DASHBOARD_DashboardPageProps) {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <RoomList rooms={rooms} /> {/* doesn't need to be client */}
      <CreateDocumentModal open={modalOpen} />
    </>
  )
}
```

```tsx
// GOOD — page stays a Server Component; only the interactive shell is a Client Component
// src/modules/dashboard/components/dashboard-page.tsx  ← Server Component, no directive
export function DashboardPage({ rooms }: I_DASHBOARD_DashboardPageProps) {
  return (
    <>
      <RoomList rooms={rooms} />
      <DashboardActions /> {/* Client Component, isolated */}
    </>
  )
}

// src/modules/dashboard/components/dashboard-actions.tsx
;('use client')

export function DashboardActions() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <button onClick={() => setModalOpen(true)}>New document</button>
      <CreateDocumentModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
```

### 4.3 Always use function components

```tsx
// BAD
class DocumentCard extends React.Component { ... }

// GOOD
function DocumentCard({ name, onRename }: I_DASHBOARD_DocumentCardProps) { ... }
```

### 4.4 Export components as named exports, not default exports

```tsx
// BAD
export default function DocumentCard() { ... }

// GOOD
export function DocumentCard() { ... }
```

The only exception is Next.js page files (`app/**/page.tsx`, `app/**/layout.tsx`). The framework requires default exports for those files.

```tsx
// app/dashboard/page.tsx — default export required by Next.js
import { DashboardPage } from '@/modules/dashboard/components/dashboard-page'

export default function Page() {
  return <DashboardPage />
}
```

### 4.5 Co-locate test files with the component

`document-card.tsx` and `document-card.test.tsx` live in the same directory. Never put tests in a separate top-level `__tests__/` folder.

---

## 5. Middleware

`middleware.ts` lives at the project root (next to `package.json`). It is the single location for auth-based routing. Do not add auth checks inside page files or layouts.

### 5.1 Structure

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAuthToken } from '@/common/utils/get-auth-token'

const PROTECTED_PATHS = ['/dashboard', '/room']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getAuthToken(request)
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))

  // Unauthenticated user hitting a protected route → landing page
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Authenticated user hitting the landing page → dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/room/:path*'],
}
```

### 5.2 Token helper

The token helper reads the Firebase session cookie and is the only place in the codebase that touches `request.cookies` for auth.

```ts
// src/common/utils/get-auth-token.ts
import { NextRequest } from 'next/server'

export async function getAuthToken(request: NextRequest): Promise<DecodedIdToken | null> {
  const session = request.cookies.get('__session')?.value
  if (!session) return null
  try {
    return await verifyIdToken(session) // Firebase Admin SDK
  } catch {
    return null
  }
}
```

### 5.3 Rules

- Middleware must not import from `src/modules/` — only from `src/common/`.
- Keep middleware fast. No Firestore reads, no external fetches. Token verification only.
- The `matcher` config must be kept in sync with any new protected routes.

---

## 6. Data fetching

### 6.1 Server Components fetch their own data

Page-level Server Components fetch data directly — no prop-drilling from a parent layout, no client-side `useEffect` fetch.

```tsx
// app/dashboard/page.tsx
import { DashboardPage } from '@/modules/dashboard/components/dashboard-page'
import { fetchOwnedRooms, fetchCollaboratingRooms } from '@/modules/dashboard/api/room-api'
import { getAuthToken } from '@/common/utils/get-auth-token'
import { headers } from 'next/headers'

export default async function Page() {
  const token = await getAuthToken(/* server-side helper using cookies() */)
  const [owned, collaborating] = await Promise.all([
    fetchOwnedRooms(token.uid),
    fetchCollaboratingRooms(token.uid),
  ])
  return <DashboardPage owned={owned} collaborating={collaborating} />
}
```

### 6.2 Client Components use React Query for live data

Anything that needs real-time updates, optimistic mutations, or cache invalidation uses React Query in a Client Component.

```ts
// src/modules/dashboard/services/use-rooms.ts
'use client' // hooks file — must be a client module

import { useQuery } from '@tanstack/react-query'
import { fetchOwnedRooms, fetchCollaboratingRooms } from '../api/room-api'

export function useRooms(userId: string) {
  const owned = useQuery({
    queryKey: ['rooms', 'owned', userId],
    queryFn: () => fetchOwnedRooms(userId),
  })
  const collaborating = useQuery({
    queryKey: ['rooms', 'collaborating', userId],
    queryFn: () => fetchCollaboratingRooms(userId),
  })
  return { owned, collaborating }
}
```

### 6.3 Never fetch in a Client Component when a Server Component can do it instead

```tsx
// BAD — client fetch adds a waterfall and ships the API key to the browser
'use client'

export function DashboardPage() {
  const { data } = useQuery({ queryKey: ['rooms'], queryFn: fetchOwnedRooms })
  ...
}
```

```tsx
// GOOD — data arrives as props from the server; no client fetch needed
export function DashboardPage({ owned, collaborating }: I_DASHBOARD_DashboardPageProps) {
  ...
}
```

---

## 7. Memoization

Memoize deliberately, not reflexively. Premature memoization adds noise and can mask real performance problems.

### 7.1 `React.memo` — prevent re-renders when props have not changed

Use on components rendered inside a list or a high-frequency update loop (e.g. notes on a canvas that re-renders on every cursor tick).

```tsx
// Without memo: every cursor tick re-renders all notes on the canvas
// With memo: a note re-renders only when its own props change

export const StickyNote = React.memo(function StickyNote({
  id,
  x,
  y,
  color,
  isSelected,
  onSelect,
}: I_CANVAS_StickyNoteProps) {
  return (
    <div
      style={{ transform: `translate(${x}px, ${y}px)`, background: color }}
      onClick={() => onSelect(id)}
    >
      ...
    </div>
  )
})
```

`React.memo` is only meaningful in Client Components. Do not apply it to Server Components.

### 7.2 `useCallback` — stable function references for memoized children

A memoized child will still re-render if a callback prop is recreated on every parent render. Stabilise callbacks passed to memoized components with `useCallback`.

```tsx
// BAD — new function reference on every render, busts StickyNote.memo
function Canvas() {
  const handleSelect = (id: string) => setSelectedNote(id)

  return notes.map((note) => <StickyNote key={note.id} {...note} onSelect={handleSelect} />)
}

// GOOD — stable reference, memo works as intended
function Canvas() {
  const setSelectedNote = useCanvasStore((s) => s.setSelectedNote)
  const handleSelect = useCallback((id: string) => setSelectedNote(id), [setSelectedNote])

  return notes.map((note) => <StickyNote key={note.id} {...note} onSelect={handleSelect} />)
}
```

### 7.3 `useMemo` — expensive derivations only

Use for computations that are genuinely expensive and re-run on renders that do not change their inputs. Sorting a large note list is valid. Constructing a plain string is not.

```ts
// BAD — useMemo adds overhead for a trivial computation
const title = useMemo(() => name.toUpperCase(), [name])

// GOOD — useMemo justified for a sort over a large reactive list
const sortedNotes = useMemo(() => [...notes].sort((a, b) => a.createdAt - b.createdAt), [notes])
```

### 7.4 Zustand selectors — always select the minimum slice

```ts
// BAD — re-renders on every store mutation
const store = useCanvasStore()

// GOOD — re-renders only when selectedNoteId changes
const selectedNoteId = useCanvasStore((s) => s.selectedNoteId)
```

---

## 8. State management

### 8.1 Two distinct state layers — never mix them

| Layer               | Technology | Owns                                                            |
| ------------------- | ---------- | --------------------------------------------------------------- |
| Collaborative state | Yjs `YDoc` | Note positions, colours, rich text content, presence            |
| Ephemeral UI state  | Zustand    | Selected note, modal open/closed, sync status, connection state |

Never write a Yjs value to Zustand and never write Zustand state into Yjs.

```ts
// BAD — canvas selection state has no business in Yjs
ydoc.getMap('ui').set('selectedNoteId', id)

// GOOD — selection is ephemeral, lives in Zustand
useCanvasStore.getState().setSelectedNote(id)
```

Zustand stores are Client-side only. Never instantiate or import a Zustand store in a Server Component or in `middleware.ts`.

### 8.2 Zustand slices — one store per module

```ts
// src/modules/canvas/store/canvas-store.ts
import { create } from 'zustand'
import type { I_CANVAS_Transform } from '../types'

interface I_CANVAS_Store {
  selectedNoteId: string | null
  setSelectedNote: (id: string | null) => void
  transform: I_CANVAS_Transform
  setTransform: (t: I_CANVAS_Transform) => void
}

export const useCanvasStore = create<I_CANVAS_Store>((set) => ({
  selectedNoteId: null,
  setSelectedNote: (id) => set({ selectedNoteId: id }),
  transform: { x: 0, y: 0, scale: 1 },
  setTransform: (transform) => set({ transform }),
}))
```

Cross-cutting state (sync status, connection state, active user) lives in `common/store/`.

### 8.3 No derived state in the store

```ts
// BAD — noteCount is derived, should not be stored
{ notes: I_CANVAS_Note[], noteCount: number }

// GOOD — derive at the call site
const noteCount = useYDoc(s => s.notes.length)
```

---

## 9. Custom hooks

Extract logic from components into custom hooks as soon as a component has more than one `useEffect` or more than three `useState` calls.

```tsx
// BAD — connection logic tangled inside a component
function Canvas() {
  const [status, setStatus] = useState<E_ConnectionState>(E_ConnectionState.Online)

  useEffect(() => {
    const handleOnline = () => setStatus(E_ConnectionState.Online)
    const handleOffline = () => setStatus(E_ConnectionState.Offline)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
}

// GOOD — extracted into a testable hook
// src/common/utils/use-connection-state.ts
export function useConnectionState(): E_ConnectionState {
  const [status, setStatus] = useState<E_ConnectionState>(E_ConnectionState.Online)

  useEffect(() => {
    const handleOnline = () => setStatus(E_ConnectionState.Online)
    const handleOffline = () => setStatus(E_ConnectionState.Offline)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return status
}
```

Custom hooks always live in Client Component files (they use React APIs). Files containing custom hooks do not need an explicit `'use client'` directive unless they are imported directly by a Server Component — but they must never be imported by a Server Component in the first place.

---

## 10. Services and API separation

### 10.1 API modules — raw queries only

```ts
// src/modules/dashboard/api/room-api.ts
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/common/services/firebase'
import type { I_DASHBOARD_Room } from '../types'

export async function fetchOwnedRooms(userId: string): Promise<I_DASHBOARD_Room[]> {
  const q = query(collection(db, 'rooms'), where('createdBy', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as I_DASHBOARD_Room)
}
```

### 10.2 Service modules — business logic

```ts
// src/modules/dashboard/services/room-service.ts
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/common/services/firebase'
import { writeUserRoomRef } from '@/common/api/user-api'

export async function createRoom(userId: string, name: string): Promise<string> {
  if (!name.trim()) throw new Error('Room name cannot be empty')

  const roomId = crypto.randomUUID()
  await setDoc(doc(db, 'rooms', roomId), {
    name: name.trim(),
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await setDoc(doc(db, 'rooms', roomId, 'members', userId), {
    role: E_ROOM_MemberRole.Owner,
    joinedAt: serverTimestamp(),
  })
  await writeUserRoomRef(userId, roomId)
  return roomId
}
```

### 10.3 Hooks — React binding layer only

```ts
// src/modules/dashboard/services/use-rooms.ts
import { useQuery } from '@tanstack/react-query'
import { fetchOwnedRooms, fetchCollaboratingRooms } from '../api/room-api'

export function useRooms(userId: string) {
  const owned = useQuery({
    queryKey: ['rooms', 'owned', userId],
    queryFn: () => fetchOwnedRooms(userId),
  })
  const collaborating = useQuery({
    queryKey: ['rooms', 'collaborating', userId],
    queryFn: () => fetchCollaboratingRooms(userId),
  })
  return { owned, collaborating }
}
```

---

## 11. Linting and formatting

### 11.1 ESLint rules enforced in CI

```jsonc
// eslint.config.mjs  (Next.js uses flat config by default)
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'import/no-cycle': 'error',
    },
  },
]
```

`import/no-cycle` is the most important rule for this codebase — it catches modules importing each other and enforces the module boundary discipline from section 1.

### 11.2 Prettier

```jsonc
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
}
```

Never commit a formatting fix in the same commit as a logic change.

### 11.3 Pre-commit hook

```jsonc
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"],
  },
}
```

A commit that fails linting does not go through. Do not use `--no-verify`.

---

## 12. TypeScript rules

No `any`. Use `unknown` and narrow it.

```ts
// BAD
function applyUpdate(data: any) { ... }

// GOOD
function applyUpdate(data: unknown) {
  if (!(data instanceof Uint8Array)) throw new Error('Expected Uint8Array')
  Y.applyUpdate(ydoc, data)
}
```

All shared types and enums live in `src/types/index.ts`. Module-specific types and enums live in a `types.ts` file at the root of that module directory.

---

## 13. Testing rules

### 13.1 Order within every task

1. Pure utils and services first
2. Unit tests for those utils and services second
3. The React component (`.tsx`) last — never written before its tests exist

### 13.2 What to test

| Subject    | What to assert                                                           |
| ---------- | ------------------------------------------------------------------------ |
| Pure utils | Return values for all meaningful input cases including edge cases        |
| Services   | That the correct Firestore/Yjs calls are made with the correct arguments |
| Hooks      | State transitions and returned values under different conditions         |
| Components | Rendered output, user interactions, and prop-driven behaviour            |
| Middleware | Redirect behaviour for all auth/path combinations                        |

### 13.3 Do not test implementation details

```tsx
// BAD — testing internal state variable name
expect(wrapper.state('isRenaming')).toBe(true)

// GOOD — testing observable behaviour
await userEvent.dblClick(screen.getByText('My document'))
expect(screen.getByRole('textbox')).toBeInTheDocument()
```

### 13.4 Mock at the boundary

Mock Firestore, Firebase Auth, and `y-webrtc` at the module boundary. Do not mock internal utility functions.

```ts
// room-service.test.ts
vi.mock('@/common/services/firebase', () => ({
  db: mockFirestore(),
}))
// Do NOT mock format-timestamp inside the same test — test the real function
```

### 13.5 Testing middleware

Middleware runs in the Next.js Edge Runtime. Test it by constructing a real `NextRequest` and asserting on the returned `NextResponse`.

```ts
// middleware.test.ts
import { middleware } from '../middleware'
import { NextRequest } from 'next/server'

vi.mock('@/common/utils/get-auth-token', () => ({
  getAuthToken: vi.fn(),
}))

it('redirects unauthenticated user from /dashboard to /', async () => {
  vi.mocked(getAuthToken).mockResolvedValue(null)
  const req = new NextRequest('http://localhost/dashboard')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toBe('http://localhost/')
})

it('redirects authenticated user from / to /dashboard', async () => {
  vi.mocked(getAuthToken).mockResolvedValue({ uid: 'user-1' } as DecodedIdToken)
  const req = new NextRequest('http://localhost/')
  const res = await middleware(req)
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toBe('http://localhost/dashboard')
})
```

### 13.6 Testing Server Components

Server Components are async functions. Render them with `@testing-library/react` after awaiting the component call.

```tsx
// dashboard-page.test.tsx
it('renders owned rooms', async () => {
  const ui = await DashboardPage({ owned: mockRooms, collaborating: [] })
  render(ui)
  expect(screen.getByText('My project')).toBeInTheDocument()
})
```

---

## 14. Task and subtask completion rules

### 14.1 Subtask completion

Mark a subtask as done (`- [x]`) only after it has been fully executed — the code written, the file saved, and the change verified to compile without TypeScript errors.

```markdown
<!-- WRONG — marking done before verifying -->

- [x] Write `room-service.ts` ← marked before checking it compiles

<!-- RIGHT — mark only after the file is written and tsc passes -->

- [x] Write `room-service.ts`
```

### 14.2 Task completion gate

A task may only be marked complete after **all three** of the following pass:

**1. All subtasks are checked off**

Every item in the task's checklist is marked `- [x]`.

**2. All tests pass**

Run the test suite scoped to the changed files and confirm zero failures:

```bash
# Run tests for a specific module
npx vitest run src/modules/dashboard

# Run the full suite
npx vitest run
```

Expected output before marking the task done:

```
✓ src/modules/dashboard/utils/format-timestamp.test.ts (4 tests)
✓ src/modules/dashboard/components/document-card.test.tsx (6 tests)
✓ src/modules/dashboard/components/create-document-modal.test.tsx (4 tests)
✓ src/modules/dashboard/components/dashboard-page.test.tsx (4 tests)

Test Files  4 passed (4)
Tests      18 passed (18)
```

**3. Linting is clean**

```bash
# Lint a specific module
npx eslint src/modules/dashboard

# Lint the full src directory
npx eslint src
```

If there are warnings (e.g. `react-hooks/exhaustive-deps`), address them before marking the task done.

### 14.3 Task completion checklist

Before marking any task `- [x]`, confirm:

- [ ] Every subtask in the task is checked off
- [ ] `npx vitest run <module path>` exits with 0 failures
- [ ] `npx eslint <module path>` exits with 0 errors and 0 warnings
- [ ] No `any` types introduced (TypeScript strict mode passes)
- [ ] No cross-module imports introduced (only `common/` imports across modules)
- [ ] No Server Component accidentally marked `'use client'`
- [ ] No Zustand store imported in a Server Component or middleware

### 14.4 Example — correctly completed task entry

```markdown
## T5 · Dashboard UI ✓

- [x] Write `format-timestamp.ts`
- [x] Write unit tests — `format-timestamp.test.ts` ✓ 3/3 passing
- [x] Write `document-card.test.tsx` ✓ 6/6 passing
- [x] Build `document-card.tsx`
- [x] Write `create-document-modal.test.tsx` ✓ 4/4 passing
- [x] Build `create-document-modal.tsx`
- [x] Write `dashboard-page.test.tsx` ✓ 4/4 passing
- [x] Build `dashboard-page.tsx`

**Gate passed:** 18/18 tests passing · 0 lint errors · 0 lint warnings
```

---

## 15. Commit message rules

Format: `type(scope): short description`

Sentence case, present tense, no full stop.

```
feat(dashboard): add collaborating section to dashboard page
feat(landing): build hero and features sections from designs
fix(canvas): prevent note creation when clicking on existing note
test(auth): add middleware redirect tests
refactor(common): move format-timestamp to common utils
chore(deps): update yjs to 13.6.14
docs(readme): add sync hierarchy diagram
```

### Allowed types

| Type       | Use for                                     |
| ---------- | ------------------------------------------- |
| `feat`     | New user-facing functionality               |
| `fix`      | Bug fix                                     |
| `test`     | Adding or updating tests only               |
| `refactor` | Code change with no behaviour change        |
| `chore`    | Dependency updates, config changes, tooling |
| `docs`     | README, comments, guidelines only           |
| `perf`     | Performance improvement                     |

### Allowed scopes

Use the module name: `landing`, `dashboard`, `canvas`, `auth`, `room`, `common`, `infra`, `deps`, `readme`.

### Rules

- One logical change per commit. If you need "and" to describe it, split it.
- Never commit directly to `main`. All changes go through a PR.
- A PR maps to one task from the checklist. Its title matches the PR description from the checklist.
- Squash-merge PRs into `main`. The squash message follows the commit format above.

---

## 16. PR rules

- Every PR requires at least one reviewer before merging.
- A PR is not ready for review until CI passes (lint + tests).
- PR description must reference the task number: `Closes T5`.
- Do not mix concerns. Fixing a bug while adding a feature is two PRs.
- Keep PRs small. More than 400 lines of non-generated code changed is a signal to split.

---

## 17. Patterns to avoid

| Anti-pattern                                    | Why                                                       | Alternative                                                             |
| ----------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| Adding `'use client'` to every component        | Opts out of server rendering for the entire subtree       | Add `'use client'` only when hooks, events, or browser APIs are needed  |
| Putting business logic in `app/` page files     | Mixes routing concerns with application logic             | Keep `app/**/page.tsx` thin; import from `src/modules/`                 |
| Fetching data client-side when server can do it | Adds a waterfall, exposes credentials, delays first paint | Fetch in Server Components; pass data as props                          |
| Auth checks in page files or layouts            | Duplicates middleware logic and can be bypassed           | All auth routing lives in `middleware.ts` only                          |
| Importing Zustand in a Server Component         | Zustand is client-only; this will throw at runtime        | Pass data as props from the server, or read state in a Client Component |
| Writing to Firestore on every keystroke         | Destroys write budget, violates core spec constraint      | Debounce in Yjs observer; write on blur or 60s idle                     |
| Storing Yjs state in Zustand                    | Creates two sources of truth                              | Read Yjs state directly via `use-y-doc`                                 |
| `useEffect` to sync two `useState` variables    | The state should be derived, not stored                   | Derive in render or `useMemo`                                           |
| Importing across module directories             | Breaks module isolation                                   | Move shared code to `common/`                                           |
| `any` type                                      | Defeats TypeScript                                        | Use `unknown` and narrow, or define the correct type                    |
| Mounting full Tiptap per inactive note          | ~80KB ProseMirror bundle × N notes                        | Render inactive notes as static HTML via `generate-note-html`           |
| Default exports for components                  | Makes grep and refactoring harder                         | Named exports everywhere except `app/**/page.tsx` and `layout.tsx`      |
| Marking a task done before tests pass           | Leaves broken state in the checklist                      | Run the full gate check from section 14.3 first                         |

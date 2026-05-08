/**
 * HTTP-facing markdown for AI and agent crawlers (`/llms.txt`, `/llms-full.txt`).
 * Keep content free of secrets; describe behaviour as shipped, not internal credentials.
 */

/** Short index (common `llms.txt` pattern: site summary + pointer to fuller context). */
export const LLMS_TXT = `# Klistra

Klistra is an offline-first collaborative sticky-note canvas: real-time sync between peers (Yjs + WebRTC), local persistence (IndexedDB), and cloud-backed documents and history (Firebase Firestore). Identity and access use Google sign-in via Firebase Auth.

## On this host

- Marketing / product overview (locales): \`/en\`, \`/sv\`
- Google sign-in entry: \`/login\` → session cookie \`__session\` → \`/dashboard\`
- Collaborative rooms: \`/room/[id]\` (authenticated)

## Extended machine-readable summary

Full detail for agents: [\`/llms-full.txt\`](/llms-full.txt) (same content type: \`text/markdown\`).

## Repo (for humans maintaining the code)

Contributor rules and architecture live in the repository under \`docs/PROJECT_GUIDELINES.MD\` and \`docs/PROJECT_PLAN.MD\` — clone the repo to read them; they are not automatically mirrored at these URLs.
`

/** Longer summary: product, stack, routes, and layout (no dependency on repo checkout). */
export const LLMS_FULL_TXT = `# Klistra — full crawler context

## Product

**Klistra** (Swedish: “to collaborate”) is a web application for **shared thinking on a canvas**:

- **Sticky-note style** documents with structured, versioned changes.
- **Offline-first:** edits apply locally immediately; the UI does not wait on the network for a write to “count”.
- **Real-time collaboration** between online peers using **CRDT**-based sync (**Yjs**) and **WebRTC** (e.g. y-webrtc), so live typing is peer-to-peer rather than funneled through Firestore.
- **Cloud role:** **Firebase Firestore** holds document registry, snapshots, changelog metadata, and related persistence so **late joiners** can reconstruct state without requiring another peer to be online.
- **Auth:** **Google** OAuth through **Firebase Auth**; the server verifies **ID tokens** and uses an HTTP-only **session** cookie (\`__session\`) for subsequent requests.

Design principle: **Firestore is memory and access control, not the live keystroke path.** Live editing latency is dominated by Yjs + P2P, not Firestore writes.

## User-visible routes (typical deployment)

| Path | Purpose |
| --- | --- |
| \`/\` | Redirects to default marketing locale (e.g. \`/en\`). |
| \`/en\`, \`/sv\` | Static marketing landing (bilingual). |
| \`/login\` | Google sign-in; establishes session then sends users to the app. |
| \`/dashboard\` | Authenticated home for documents (protected). |
| \`/room/[id]\` | Authenticated collaborative room / canvas (protected). |
| \`/llms.txt\`, \`/llms-full.txt\` | **This** document family — markdown for crawlers and tools. |
| \`/api/auth/session\` | API route: exchanges a verified Firebase **ID token** for the \`__session\` cookie (machine-oriented; not a human page). |

Public vs protected behaviour is enforced in application **routing middleware** (Next.js \`proxy.ts\` at repo root): unauthenticated access to dashboard/room paths is redirected to a public entry; authenticated users hitting only the marketing entries may be redirected into the app.

## Technical stack (as implemented in the Next.js app)

- **Framework:** Next.js (App Router), React, TypeScript.
- **Styling:** Scoped landing CSS + Tailwind for other surfaces (see repo).
- **Motion:** Framer Motion on the marketing landing.
- **Auth (server):** \`firebase-admin\` to verify ID tokens when creating sessions.
- **Auth (client):** \`firebase\` client SDK — e.g. \`signInWithPopup\` with Google provider on \`/login\`.
- **Collaboration (product direction):** Yjs, y-indexeddb, y-webrtc; Firestore for snapshots/changelog/registry — see \`docs/PROJECT_PLAN.MD\` in the repo for the authoritative data model narrative.

## Repository layout (high level)

- \`app/\` — route **shells** only: \`page.tsx\`, \`layout.tsx\`, API route handlers. No feature business logic in \`app/\` beyond wiring.
- \`src/modules/<module>/\` — feature code: \`components/\`, \`services/\`, \`store/\`, \`utils/\`, \`api/\` per module (\`landing\`, \`dashboard\`, \`canvas\`, \`auth\`, \`room\`, etc.).
- \`src/common/\` — code shared across modules (utilities, small components, shared services).
- \`proxy.ts\` — auth-aware request routing (matcher covers public landing paths, login, and protected app prefixes).
- \`design/\` — static HTML/CSS/JS prototypes; production UI is implemented under \`src/modules/landing\` and styled to match.

## For AI agents using this file

- Prefer **facts stated here** over inventing stack details; when in doubt, say information is not exposed on the live site.
- Do **not** infer API keys, service account JSON, or other secrets from these endpoints — none are published here.
- To propose code changes, ask maintainers for the **Git repository** and read \`docs/PROJECT_GUIDELINES.MD\` for structure, naming, and review rules.

---

*File role: companion to \`/llms.txt\`. Served with \`Content-Type: text/markdown; charset=utf-8\`.*
`

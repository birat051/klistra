This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Commit conventions

Commits must satisfy **§15 — Commit message rules** in [`docs/PROJECT_GUIDELINES.MD`](docs/PROJECT_GUIDELINES.MD). Husky runs **commitlint** on each commit (see `commitlint.config.ts`), so invalid messages are rejected locally.

**Format:** `type(scope): Short description`

- **Sentence case** for the subject (first word capitalized), **present tense**, **no full stop** at the end.
- **Scope is required.** Use a module or area name from the list below.

**Allowed types**

| Type       | Use for                                     |
| ---------- | ------------------------------------------- |
| `feat`     | New user-facing functionality               |
| `fix`      | Bug fix                                     |
| `test`     | Adding or updating tests only               |
| `refactor` | Code change with no behaviour change        |
| `chore`    | Dependency updates, config changes, tooling |
| `docs`     | README, comments, guidelines only           |
| `perf`     | Performance improvement                     |

**Allowed scopes**

`landing`, `dashboard`, `canvas`, `auth`, `room`, `common`, `infra`, `deps`, `readme`

**Examples**

```
feat(dashboard): Add collaborating section to dashboard page
fix(canvas): Prevent note creation when clicking existing note
chore(infra): Add husky pre-push coverage gate
docs(readme): Document commit conventions
```

**Also**

- Prefer **one logical change** per commit; split if you need “and” to describe it.
- Do **not** use `git commit --no-verify` to skip hooks unless there is an exceptional reason documented with the team.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

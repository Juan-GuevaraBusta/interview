# MASTER STATE

## CURRENT STATUS

Current Day: 1 (~3h remaining — ACCELERATED)

Current Session: Session 03 — Async CLOSED → **API integration**

Current Topic: API integration — G 8.5/10; H pending (`exercises/03-async/api-h.tsx`)

Overall Readiness: 🟡 Time-boxed. Next.js SKIPPED. TS + React + Async P0 done.

---

## KNOWLEDGE MATRIX

| Topic | Score | Status |
|---|---:|---|
| TypeScript | 8.3/10 | P0 complete |
| React | 8.5/10 | P0 complete (Context/render G-only 8/10) |
| Next.js | SKIP | Explicit skip |
| Async | 8/10 | P0 complete (G 8, H 8). Abort mid-flight in mock incomplete |
| API Integration | - | G 8.5/10 (`res.ok` before treating body as User); H not submitted |
| Performance / Testing / A11y / Security | - | Flash only if time |

---

## REMAINING PLAN (~3h)

1. **API integration (50m)** — G done. Next: `exercises/03-async/api-h.tsx` (HTTP mock, abort mid-flight, retry, LoadState).
2. **Mini mock (50m)** — TS + React + async, no Next.
3. **Flash (10m)** — perf / a11y / security only if leftover.

Mode: short A–F, G required, short H. No React extras. No Next.js. Do not re-teach AbortController from scratch — they have it from useEffect H; enforce mid-flight abort + HTTP.

---

## CURRENT WEAKNESSES

- Validation without `return` (Events H); fixed in Forms H.
- Verbose / chatbot-like interview answers (Forms G). a/b in Async H still a bit long.
- Next.js = gap vs GAFAM P0.
- `Promise<T>` vs `Promise<T[]>` (Async H — trainer fixed).
- Abort sampled only at start of mock delay (Async H). Race/unmount pattern is known from useEffect.

---

## COMPLETED

- Session 01 TypeScript P0 (avg ~8.2)
- Session 02 React P0 (avg ~8.5)
- Session 03 Async P0 (avg ~8)

---

## HOW TO RESUME (new chat)

Read: `MASTER_STATE.md`, `CURRICULUM.md`, `SESSIONS/SESSION_02_REACT.md`.

Do **not** re-teach React/TS/Async A–F. API G already 8.5/10. Evaluate H `exercises/03-async/api-h.tsx`.

Enforce: abort **during** delay (not only at t=0), `AbortError` ≠ UI error, HTTP !ok ≠ User.

Respect candidate level: React/TS/Async not re-taught unless regression.

Cheatsheet entrevista: `CHEATSHEET.md`

Session files: `SESSIONS/SESSION_01_TYPESCRIPT.md`, `SESSIONS/SESSION_02_REACT.md`

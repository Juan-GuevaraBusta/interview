# SESSION 03 — Async + API + Mini mock

**Date:** 2026-08-18  
**Day:** 1 (accelerated)  
**Status:** CLOSED  
**Readiness after session:** 🟡 React/TS/async loops are workable. Race under pressure not automatic. Next.js still a gap.

---

## Objetivo

Async P0 → API integration → mini mock. Next.js out. No re-teach React/TS.

---

## Cubierto y scores

| Tema | G | H | Notas |
|---|---:|---:|---|
| Sequential await vs `Promise.all` | 8 | — | Waterfall correcto; faltó `max` vs suma / I/O vs hilo |
| Async (`all` / `allSettled` / abort) | — | 8 | `all` vs `allSettled` bien; abort mid-flight incomplete in `fetchJson` |
| `res.ok` before `json()` | 8.5 | — | 500 no tira; HTML/`json()` extra. Matiz: `json()` del error body OK |
| API panel (abort, retry, LoadState) | — | 8 | AbortError `name` trainer-fixed |
| Mini mock (ticket inbox) | — | 7 | UI OK; **search race**: delay no rechaza en abort → `setTickets` puede pisar |

**Async avg ~8. API ~8. Mock 7/10.**

---

## Ejercicios

- `exercises/03-async/async-h.ts`
- `exercises/03-async/api-h.tsx`
- `exercises/04-mock/mini-mock.tsx`
- `exercises/04-mock/mini-mock-02-SOLVED.tsx` (referencia; no fue bajo presión)

Cheatsheet: `CHEATSHEET.md` (formato si-X-entonces-Y).

---

## Decisiones

- Next.js skipped.
- Trainer fixed: `WidgetData` vs `WidgetData[]`; `DOMException` name; `setError` string vs `Error`.
- Flash perf/a11y/security → folded into cheatsheet, not a live block.

---

## Cómo reanudar

1. Leer `MASTER_STATE.md` + este archivo + `CHEATSHEET.md`.
2. No reenseñar TS/React/Async/API salvo regresión.
3. Siguiente: self-study Next.js **o** parar P0. No hay Session 04 obligatoria.

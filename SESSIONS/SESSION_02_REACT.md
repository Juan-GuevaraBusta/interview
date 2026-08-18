# SESSION 02 — React Fundamentals

**Date:** 2026-08-18  
**Day:** 1 (accelerated, ~6h then ~4h left)  
**Status:** CLOSED  
**Readiness after session:** 🟡 Improving — React P0 done, Async/API/mock pending

---

## Objetivo

Cubrir React P0 (JSX → hooks → render). Next.js saltado a petición del candidato.

---

## Cubierto y scores

| Tema | G | H | Notas |
|---|---:|---:|---|
| JSX + Components | 7.5 | 8.5 | keys, children, composition |
| Props | 8.5 | 8.0 | data down / events up; className bug |
| State + useState | 8.5 | 9.0 | updaters, controlled input |
| Events | 8.5 | 7.5 | preventDefault good; missing `return` after validation |
| Forms | 8.0 | 8.5 | controlled vs ref; fail-fast fixed |
| useEffect | 8.0 | 8.5 | abort, race, stale closure |
| useMemo / useCallback / useRef | 9.0 | 8.5 | memo + stable handler |
| Context / render / reconciliation | 8.0 | — | G only, flash |

**React avg ~8.5/10.** Sufficient to leave React. Not “automatic under pressure” until mock.

---

## Ejercicios

`exercises/02-react/`

- `react-jsx-components-h.tsx`
- `react-props-h.tsx`
- `react-state-h.tsx`
- `react-events-h.tsx`
- `react-forms-h.tsx`
- `react-useeffect-h.tsx`
- `react-memo-hooks-h.tsx`
- Vite app: `exercises/02-react/app/` (preview only)

---

## Decisiones

- No Next.js.
- Context/render: G only.
- Remaining time: Async → API → mini mock. Flash perf/a11y/security if leftover.

---

## Cómo reanudar Session 03

1. Leer `MASTER_STATE.md` + este archivo.
2. No reenseñar React.
3. Pregunta G pendiente (Async): sequential `await` vs `Promise.all`.
4. Luego H: `exercises/03-async/async-h.ts` (enunciado ya está).

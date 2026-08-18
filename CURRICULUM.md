# GAFAM FRONTEND CURRICULUM

## P0 — Critical

### TypeScript
- [x] Types
- [x] Interfaces
- [x] Unions
- [x] Generics
- [x] Utility Types
- [x] Narrowing
- [x] unknown / any / never

### React
- [x] JSX
- [x] Components
- [x] Props
- [x] State
- [x] Events
- [x] Forms
- [x] useState
- [x] useEffect
- [x] useMemo
- [x] useCallback
- [x] useRef
- [x] Context (G only, flash)
- [x] Rendering (G only, flash)
- [x] Reconciliation (G only, flash)

### Next.js
- [ ] SKIPPED (candidato, ~6h remaining). Gap consciente vs GAFAM App Router / RSC.
- [ ] App Router
- [ ] Layouts
- [ ] Routing
- [ ] Server Components
- [ ] Client Components
- [ ] Data Fetching
- [ ] Caching
- [ ] Rendering
- [ ] Route Handlers

### Async — Session 03
- [x] Promise
- [x] async/await
- [x] Event Loop
- [x] Microtasks
- [x] Promise.all
- [x] Promise.allSettled
- [x] AbortController (G+H; mock abort mid-flight incomplete)

H entregado: `exercises/03-async/async-h.ts` (8/10)

### Frontend Engineering — Session 03 continuación
- [x] API integration — G 8.5, H 8 (`exercises/03-async/api-h.tsx`; AbortError name trainer-fixed)
- [ ] Mini mock (~50 min: TS + React + async, sin Next) — `exercises/04-mock/mini-mock.tsx`
- [ ] Performance — flash 10 min solo si sobra
- [ ] Testing — flash
- [ ] Accessibility — flash
- [ ] Security — flash
- [ ] Architecture — cubierto implícito (props down / events up); no bloque aparte

---

## Plan restante (acelerado, ~4 h)

| Orden | Tiempo | Qué hacer | Cómo |
|---|---|---|---|
| 1 | 70 min | Async P0 (lista de arriba) | A–F corto, G, H `async-h.ts` |
| 2 | 50 min | API integration | fetch + estados + race + abort en effect |
| 3 | 50 min | Mini mock | 1 problema de código bajo presión |
| 4 | 10 min | Flash perf / a11y / security | Solo si sobra |

Modo: no saltar Async ni API ni mock. No Next.js. No ejercicios extra de React.

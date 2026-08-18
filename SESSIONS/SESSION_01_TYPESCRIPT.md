# SESSION 01 — TypeScript Fundamentals

**Date:** 2026-08-17  
**Day:** 1  
**Status:** In progress (TypeScript P0: Utility Types next)  
**Readiness after session:** 🟡 Improving

---

## Objetivo de la sesión

Iniciar Bloque 1 (TypeScript fundamentals + coding) según el plan de 2 días.

---

## Cubierto

### Types (anotaciones y tipos primitivos)

Enseñanza A–F completada:

| Sección | Contenido |
|---|---|
| A | Problema: fallos en runtime por contratos implícitos en JS |
| B | Concepto: types = contratos en compile time; se borran en runtime |
| C | Sintaxis: primitivos, inferencia, funciones, arrays, objetos inline |
| D | Ejemplo: `ApiUser` + `displayName` opcional |
| E | Errores comunes: over-annotation, `any`, literal vs `string`, asumir validación runtime |
| F | Interview mindset: contratos, fallos tempranos, tipar vs inferir |

### Pendiente en este tema

| Sección | Estado |
|---|---|
| G | **Pasa con notas** (7/10). Segunda respuesta. |
| H | Entregado — **5/10, no pasa aún** |
| I | Pendiente (tras corregir H o retry) |

**G v2:** Compilador no ve el JSON (ya no está en el pipeline de type-check). `Student.progress: number`; API devuelve `null`. IDE/compilador confían en la interfaz; runtime ve `null` y falla.

**Evaluación G v2:** Contrato vs payload correcto. Notas: “el compilador ya no existe” es holgazán — el compilador nunca inspeccionó la red. Fallo runtime no nombrado (`null` usado como `number`). No nombró aserción (`as` / generic de `fetch`) vs validación. Suficiente para Mid-Level básico. No dominado.

---

## No cubierto aún (TypeScript P0)

- [ ] Interfaces  
- [ ] Unions  
- [ ] Generics  
- [ ] Utility Types  
- [ ] Narrowing  
- [ ] unknown / any / never  
- [ ] Types — evaluación completa (G–I)

---

## Ejercicios / código

- `exercises/session-01/types-h.ts` — H entregado y pasado (8/10).
- `exercises/session-01/types-practice-2.ts` — Refuerzo: optional fields, validation, narrowing (en progreso).

---

## Evaluaciones

G v2 pasa. H entregado (5/10). Types no cerrado.

| Dimensión | Score |
|---|---:|
| Conceptual understanding | 7/10 (G) |
| Coding | 5/10 (H) |
| TypeScript | 5.5/10 |
| React/Next.js | — |
| Problem solving | — |
| Engineering judgment | — |
| Communication | — |

---

## Weaknesses detectadas

- Primera pasada conceptual incompleta (G).
- Confunde cuándo el compilador actúa vs runtime (H, Q4).
- Comentarios que no coinciden con el comportamiento real del código (`formatProgress` + `null`).
- `as` antes de validar.

---

## Fortalezas detectadas

- Identifica erase de tipos (G).
- G v2: contrato local vs payload de API.
- H: eligió validar en runtime (dirección correcta para APIs externas).
- Guard manual rechaza `progress: null` si el contrato es `number`.

---

## Decisiones del entrenador

- No marcar Types ni TypeScript como dominados.
- No avanzar a Interfaces / Advanced Types hasta cerrar G–I de Types.
- Persistencia honesta: sesión iniciada, aprendizaje presentado, comprensión no verificada.

---

## Status Final Types

✅ **CLOSED.** Promedio 7.75/10 (H + Practice 2). Suficiente para avanzar.

## Siguiente

Interfaces A–F (conceptual, sin código).
Luego: React (JSX, components, props, state).

---

## Archivos actualizados

- `MASTER_STATE.md`
- `SESSIONS/SESSION_01_TYPESCRIPT.md` (este archivo)
- `CURRICULUM.md` — sin cambios (nada completado)

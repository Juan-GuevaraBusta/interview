# MASTER STATE

## CURRENT STATUS

Current Day: Day 1

Current Session: Session 1 (in progress)

Current Topic: TypeScript P0 → Utility Types (A–F)

Overall Readiness: 🟢 Improving steadily

---

## KNOWLEDGE MATRIX

| Topic | Score | Status |
|---|---:|---|
| TypeScript | 8.2/10 | Types 7.75, Interfaces 8.25, Unions 7.75, Generics 8.75, Narrowing 8.5 |
| React | - | Not evaluated |
| Next.js | - | Not evaluated |
| Async | - | Not evaluated |
| API Integration | - | Not evaluated |
| Performance | - | Not evaluated |
| Testing | - | Not evaluated |
| Accessibility | - | Not evaluated |
| Security | - | Not evaluated |
| Frontend Architecture | - | Not evaluated |

---

## CURRENT WEAKNESSES

- Naming inconsistente (`formInput` vs `FormInput`).
- Q4a narrowing: atribuyó crash a string vacío; `"".toUpperCase()` no tira. El crash es `undefined`/`null`.
- Primera pasada Types: compile-time vs runtime (ya corregida).

---

## RECENT MISTAKES

- Narrowing H: `input != null` invertido → tipo `never`.
- Q4a: ejemplo de fallo runtime impreciso (empty string vs missing property).

---

## COMPLETED

✅ Types (7.75/10)
✅ Interfaces (8.25/10)
✅ Unions (7.75/10)
✅ Generics (8.75/10)
✅ Narrowing (8.5/10)

---

## CURRENT

TypeScript P0 → Utility Types (A–F teaching). Then H.

---

## NEXT

1. Utility Types G–H–I.
2. unknown / any / never (P0).
3. React fundamentals.

---

## LAST SESSION SUMMARY

Narrowing closed 8.5/10. Type predicate `isRecord` + `typeof` guards. Q4 mostly correct; empty-string crash example was wrong. Next: Utility Types (skipped earlier; user requested no skips).

Session file: `SESSIONS/SESSION_01_TYPESCRIPT.md`

# WEAKNESSES

## Active

1. **Fail-fast:** set error then continue happy path (`BugForm` / Events H). Corrected in Forms H — watch regression.
2. **Interview wording:** extra filler / “if you'd like…” (Forms G). Cut after the technical point.
3. **Compile-time vs runtime:** early Session 01; recovered. Recheck on API JSON.
4. **Next.js skipped:** App Router, RSC, caching — if the company asks, unprepared.

## Watch

- `className` string literal vs variable (Avatar).
- Calling “bidirectional” a controlled input.
- `key={index}` / compound keys when ids exist.
- Function return type: `T` vs `T[]` (`loadOptionalWidgets`).
- Abort checked only at t=0; delay still **resolves** after `controller.abort()` unless the delay rejects.
- `new DOMException(message)` → `name` is `"Error"`, not `"AbortError"`.
- Mock 01: search `setTickets` after abort because `fetchTickets` ignore mid-flight abort.

## Not weaknesses (working)

- Validation at the boundary (`unknown`).
- `AbortController` + ignore AbortError.
- `useCallback` + functional updater for stable handlers.
- Discriminated unions + `never` exhaustiveness.

// Session 03 — H: API integration (fetch, loading/error, race, abort, retry)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Panel de usuario. `userId` cambia. No muestres el usuario anterior si la
// petición se aborta o llega tarde. Un HTTP !ok NO es un User.
//
// TAREAS:
//
// 1. type User = { id: string; name: string }
//    type LoadState =
//      | { status: 'idle' }
//      | { status: 'loading' }
//      | { status: 'success'; user: User }
//      | { status: 'error'; message: string }
//
// 2. fetchUser(id: string, signal: AbortSignal): Promise<User>
//    - Mock permitido (delay ~150ms).
//    - Abort DURANTE el delay → reject con DOMException name 'AbortError'
//    - id === 'missing' → error estilo 404 (throw; no lo trates como User)
//    - id === 'crash'   → error estilo 500
//    - id normal        → { id, name }
//    - Equivalente a `if (!res.ok) throw` antes de json()
//
// 3. UserPanel({ userId }: { userId: string }):
//    - useEffect deps: [userId]  (y retry si lo necesitas)
//    - AbortController + cleanup
//    - AbortError: NO pases a status 'error'
//    - Botón Retry: vuelve a cargar el mismo userId
//    - UI mínima: loading | nombre | error + retry
//    - NO fetch en el cuerpo del render
//
// 4. Responde:
//    a) En una API real, ¿por qué `await res.json()` sin `res.ok` es un bug?
//    b) Retry vs cambiar userId: ¿qué debe pasar con el fetch anterior en cada caso?
//
// Cuando termines, avísame.

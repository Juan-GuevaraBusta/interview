# CHEATSHEET — Entrevista Frontend Mid-Level

Última actualización: 2026-08-18  
Cubierto: TS P0, React P0, Async P0, API, mini mock. **Gap:** Next.js (skip).

Corta la respuesta cuando el punto técnico está hecho. Nada de “colapso crítico” / “si quieres te explico”.

---

# 0. SI TE PONEN X → HAZ Y

| Si te ponen | Qué hacer | No hagas |
|---|---|---|
| `await fetchA(); await fetchB();` vs `Promise.all` | Independientes → `all`, tiempo ≈ `max`. A depende de B → secuencial, tiempo ≈ suma. JS un hilo; lo concurrente es el **I/O**. | Decir “al mismo tiempo” sin `max` vs suma |
| Dashboard user + orders (ambos obligatorios) | `Promise.all`. Uno falla → falla todo | `allSettled` para datos requeridos |
| Widgets opcionales; uno no debe tumbar la página | `allSettled` + quedarte con `fulfilled` | `all` (fail-fast) |
| Search cada tecla / `userId` cambia | `AbortController` en el effect; cleanup `abort()`; **el delay/fetch debe rechazar en abort** | Solo mirar `signal.aborted` al **inicio** |
| Unmount o cambio de dep con fetch en vuelo | Cleanup `abort()`. `AbortError` → **no** `setError` | Pintar “error” al abortar |
| Fetch 404/500 con body JSON/HTML | `if (!res.ok) throw` **antes** de tratar el body como `User`. `fetch` **no** tira en HTTP error | `const user = await res.json(); setUser(user)` |
| Body de error JSON útil | `!res.ok` → `json()` del error → `throw new Error(msg)` | Tratar `{ error }` como `User` |
| Query vacía | Lista vacía, **sin** petición | Fetch de `""` |
| Lista que se filtra/reordena | `key={item.id}` | `key={index}` |
| Input que no deja escribir | Falta `onChange` en controlled (`value` + `onChange`) | Culpar al browser |
| Validación de form | `setError`; **`return`**; no llames `onSubmit` | Set error y seguir el happy path |
| `onClick={save()}` | `onClick={save}` o `() => save(id)` | Ejecutar el handler en el **render** |
| Submit recarga la página | `<form onSubmit>` + `preventDefault` | Solo `div onClick` si hay Enter |
| Contador +2 en el mismo click | `setN(n => n + 1)` dos veces | Dos `setN(n + 1)` → +1 |
| Hijo memoizado se re-renderiza igual | `useCallback` en el handler que va **como prop** | Arrow inline en el padre: `onClick={() => ...}` |
| JSON de API / `JSON.parse` | Tipo `unknown` + narrowing en el borde | `as User` / `any` |
| PATCH de usuario | `Partial<Omit<User, 'id'>>`; id en la URL | `Partial<User>` (permite cambiar `id`) |
| Función genérica reutilizable | `<T>` para preservar el tipo | `unknown`/`any` que borra T |
| Switch de union | `default: const _: never = x` | Olvidar un case en silencio |
| Tipos `Promise<T>` vs `T[]` | Si retornas lista, firma `Promise<T[]>` | `Promise<T>` y `return arr` |
| Abort + `catch (e.name === 'AbortError')` | `new DOMException(msg, 'AbortError')` | `new DOMException(msg)` → `name` es `"Error"` |
| Chip/row hace `fetch` al click | Padre orquesta; hijo notifica `onSelect(id)` | Leaf acoplado a una URL |
| `let n++;` en click | `useState` | Variable local: no re-renderiza y se reinicia |
| Context | Dato amplio y estable (tema, user) | Cada keystroke / 1–2 niveles de props |
| Dos fetches independientes en detalle | `Promise.all` | Waterfall `await` + `await` |

---

# 1. SINTAXIS QUE DEBES ESCRIBIR SIN PENSAR

## Fetch real

```ts
async function fetchJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<T>; // en entrevista: di que esto NO valida
}
```

## Delay mock que respeta abort (si no usas `fetch`)

```ts
function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const id = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}
```

## Effect: race + abort + retry

```ts
useEffect(() => {
  const ac = new AbortController();
  let cancelled = false;

  (async () => {
    setState({ status: 'loading' });
    try {
      const data = await load(id, ac.signal);
      if (ac.signal.aborted) return;
      setState({ status: 'success', data });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setState({ status: 'error', message: e instanceof Error ? e.message : 'Error' });
    }
  })();

  return () => ac.abort();
}, [id, retryNonce]);
```

Retry: `setRetryNonce(n => n + 1)` (re-ejecuta el effect; el cleanup aborta el anterior).

## Promise.all vs allSettled

```ts
const [user, orders] = await Promise.all([
  fetchJson<User>(`/u/${id}`, signal),
  fetchJson<Order[]>(`/u/${id}/orders`, signal),
]);

const settled = await Promise.allSettled(ids.map((i) => fetchJson<Widget>(i, signal)));
const ok = settled
  .filter((r): r is PromiseFulfilledResult<Widget> => r.status === 'fulfilled')
  .map((r) => r.value);
```

## Discriminated union (UI)

```ts
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

No `{ data?: T; error?: string; loading: boolean }` — permite `success` + `error` a la vez.

## Narrowing de JSON

```ts
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
```

`typeof null === 'object'` → chequea `!== null`.  
`JSON.parse` → **`unknown`**, no `any`.

## Exhaustiveness

```ts
switch (x.kind) {
  case 'a': return 1;
  case 'b': return 2;
  default: {
    const _n: never = x;
    return _n;
  }
}
```

## State / events / form

```ts
setCount((c) => c + 1);
<input value={q} onChange={(e) => setQ(e.target.value)} />
<form onSubmit={(e) => { e.preventDefault(); if (!ok) { setErr('x'); return; } onSave(); }}>
<button type="button">  {/* no submit */}
```

## Memo estable

```ts
const onAdd = useCallback((id: string) => {
  setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
}, []);
```

---

# 2. TYPESCRIPT — frases

- Tipos se **borran**. El compilador **nunca ve** el JSON de red.
- `as User` / `fetch(...): Promise<User>` **no valida**.
- `interface` = objeto/clases/`implements`. `type` = uniones, primitivos, aliases.
- `T?` = la key puede no existir. `T \| undefined` = la key existe, el valor puede ser undefined.
- `Partial` ≠ `Readonly`. Partial sigue mutable.
- `any` apaga el checker. `unknown` obliga narrowing. `never` = imposible.

**G clásico:** ¿Por qué TS no sustituye validación runtime?  
Los tipos no existen en JS. Tipar `fetch` es aserción. Si el backend manda `null`, el crash es runtime (`null.toFixed`). Un template `"Ana is null%"` **no** tira.

---

# 3. REACT — frases

- JSX es JS. `className`. `{expr}` se evalúa **antes** de crear el árbol.
- Props down, events up. El leaf **no** hace fetch de negocio.
- Render = ejecutar la función. Re-render ≠ pintar todo el DOM.
- Padre re-renderiza → hijos también, salvo `memo`.
- Effect = sync con el mundo **después** del paint. Fetch en el cuerpo del render + `setState` = **loop**.
- Stale closure: el effect captura valores del render en que nació. Deps incompletas = lee el valor viejo.
- Controlled: `value` + `onChange`. No es two-way binding.
- `defaultValue` solo en mount.
- Context: no es Redux. Valor `{}` / fn nueva → todos los consumidores re-renderizan.

---

# 4. ASYNC / API — frases

- Promise: pending → fulfilled | rejected.
- `await` pausa **esa función**, no el hilo.
- Event loop: stack → **microtasks** (`then`) → **macrotasks** (`setTimeout`).
- `abort()`: la **promesa** de `fetch` rechaza `AbortError`. No promete cortar el TCP al instante.
- Después del `await`, si puedes, `if (signal.aborted) return` antes de `setState`.
- `key={id}` en el panel de detalle remonta instancia (state limpio) — complemento, no sustituto del abort.

---

# 5. FLASH (si preguntan)

**Perf:** memo solo si mediste / hijo caro + props estables. Waterfall de red > `useMemo` de un string. LCP = contenido grande; CLS = layout shift; INP = input delay.

**a11y:** `<button>` no `<div onClick>`. `label` / `aria-label` en inputs. `role="alert"` en error. Enter en form nativo.

**Security:** nada de secrets en el bundle. XSS: no `dangerouslySetInnerHTML` con string de usuario. Cookies de sesión: `HttpOnly` + `SameSite`. CORS lo decide el **servidor**.

**Testing:** RTL = comportamiento (click, texto), no internals de hooks.

---

# 6. ERRORES QUE YA COMETISTE

| Error | Arreglo |
|---|---|
| “El compilador ve el JSON” | Compile-time vs runtime |
| `as Student` / `Promise<T>` sin validar | Narrow en el borde |
| `handleSubmit` sin `return` | Fail-fast |
| `className="avatarClassName"` | `{avatarClassName}` |
| “Bidireccional” en input | Unidireccional |
| `Promise<WidgetData>` vs `WidgetData[]` | Firma = lo que retornas |
| Abort solo al inicio del delay | Listener `abort` + `clearTimeout` |
| `new DOMException(msg)` | Segundo arg `'AbortError'` |
| `setError(err.message)` con state `Error` | `string \| null` o pasa `Error` |
| Search abort: cleanup sí, mock no rechaza | El `await` **resuelve** y `setTickets` pisa |
| Respuestas G con cola de chatbot | Cortar en el hecho |

---

# 7. FRASES 30 s

1. *TS borra tipos; valida el JSON en el borde.*
2. *`all` = fail-fast requerido; `allSettled` = opcional.*
3. *Tiempo: suma (waterfall) vs `max` (all). I/O concurrente, un hilo.*
4. *`fetch` no tira en 404/500; `res.ok` decide si el body es `User`.*
5. *Cleanup `abort`; `AbortError` no es error de UI.*
6. *`DOMException(msg, 'AbortError')` o el `catch` no lo reconoce.*
7. *Props down, events up.*
8. *`key` = id del dato.*
9. *Updater funcional si el siguiente state depende del anterior.*
10. *Memo compara referencias; arrow como prop mata `memo`.*

---

# 8. GAP

Next.js App Router, RSC, layouts, caching. Si el loop es Vercel/Next, esto no está cubierto.

Referencias de código:
- `exercises/03-async/async-h.ts` — all / allSettled
- `exercises/03-async/api-h.tsx` — HTTP + abort + retry
- `exercises/04-mock/mini-mock.tsx` — inbox (revisar carrera en search)
- `exercises/04-mock/mini-mock-02-SOLVED.tsx` — patrón correcto

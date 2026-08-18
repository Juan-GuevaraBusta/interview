# CHEATSHEET — Entrevista Frontend Mid-Level (lo cubierto)

Última actualización: 2026-08-18  
Cubierto: TypeScript P0 + React P0. **No cubierto:** Next.js (skip), Async H, API mock.  
Async A–F se enseñó en flash; G/H pendientes.

Estilo: frase de entrevista + trampa + respuesta corta. No relleno.

---

# 0. REGLAS DE ENTREVISTA

- Tipos se **borran**. El compilador **nunca ve** JSON de red.
- Render puro. Side effects en events/effects.
- Props down, events up.
- Validar en el borde; `return` tras error (fail-fast).
- `any` apaga TS. `unknown` obliga a narrowing.
- Cortar la respuesta cuando el punto técnico está hecho.

---

# 1. TYPESCRIPT

## 1.1 Types (compile-time vs runtime)

**Problema:** JS no tiene contrato; fallos en runtime.  
**Concepto:** anotaciones = contrato en **compile-time**. Se **eliden** al emitir JS.

```ts
function formatProgress(s: { nombre: string; progress: number }): string {
  return `${s.nombre} is ${s.progress}% complete`;
}
```

**Trampa:** `fetch` + `as User` / `Promise<User>` **no valida**.  
**API:** el payload llega en runtime. `progress: null` con tipo `number` → compile OK, runtime rompe **si usas el valor como number** (`null.toFixed`). Un template `"Ana is null%"` **no tira**.

**Validar borde:**

```ts
function loadStudent(json: unknown): Student {
  if (typeof json !== 'object' || json === null) throw new Error('Invalid JSON');
  const obj = json as Record<string, unknown>;
  if (typeof obj.id !== 'number' || typeof obj.nombre !== 'string' || typeof obj.progress !== 'number') {
    throw new Error('Invalid Student');
  }
  return { id: obj.id, nombre: obj.nombre, progress: obj.progress };
}
```

`typeof null === 'object'` → chequea `json === null`.  
Archivos sin `export` son **scripts globales** → `Duplicate function implementation`. Pon `export`.

### G que te hicieron

**¿Por qué TS no reemplaza validación runtime en API externa?**  
Los tipos no existen en JS. El compilador no type-checkea la red. Tipar `fetch` es aserción. Si el backend manda `null`, el crash es runtime. Valida (o schema) en el borde.

**No digas:** “el compilador ya no existe” / “compila solo local”. El corte es compile-time vs runtime.

---

## 1.2 Optional: `T | undefined` vs `T?`

- `descuento?: number` — la **propiedad puede no existir**.
- `descuento: number | undefined` — la propiedad **existe**; el valor puede ser `undefined`.

En JSON a menudo se parecen. En contratos, sé explícito.  
`in` + `typeof` para “si viene, valida rango”.

`product.discount / 100` con `undefined` → TS: possibly undefined. Narrow:

```ts
if (product.discount === undefined) return product.price;
return product.price - product.price * product.discount / 100;
```

---

## 1.3 Interfaces

Contrato estructural, `extends`, `implements`, declaration merging.  
`type` = alias (uniones, primitivos). `interface` = objeto extensible / clases.

**G:** ¿Por qué interface vs `any` en muchas funciones?  
Contrato centralizado, errores en compile-time, refactor seguro.

**G:** ¿Por qué interface para un servicio que varias clases implementan?  
Mismo contrato, `extends`, merging, OCP: nuevo provider sin cambiar `processOrder(provider: PaymentProvider)`.

`processOrder(Stripe | PayPal)` hay que tocar la unión al agregar GooglePay. Con interfaz, no.

Métodos `async` que declaran `Promise<T>` **deben `return T`**.

---

## 1.4 Unions y discriminated unions

`A | B`. Acceder a campos de una rama → narrowing (`typeof`, `status === 'x'`).

**Discriminated union:** campo literal común (`status`, `type`). Elimina estados imposibles. TS estrecha el resto de campos.

```ts
type Task =
  | { status: 'PENDING'; id: string; title: string }
  | { status: 'COMPLETED'; id: string; title: string; result: string };

function getInfo(t: Task): string {
  switch (t.status) {
    case 'PENDING': return t.title;
    case 'COMPLETED': return t.result;
    default: {
      const _x: never = t;
      return _x;
    }
  }
}
```

`never` en `default` = exhaustiveness. Nuevo status → error compile-time.

**G:** ¿Por qué discriminated vs `{ ok?: boolean; data?: T; error?: string }`?  
La plana permite `ok: true` y `error` a la vez. La tagged no.

`task.result` sin check COMPLETED → error TS (no existe en todas las ramas).

---

## 1.5 Generics

`<T>` preserva identidad del tipo. `unknown` borra info y obliga guards.

```ts
type ApiResponse<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never };

function extractData<T>(r: ApiResponse<T>): T | null {
  return r.success ? r.data : null;
}
```

**G:** ¿Por qué `<T>` mejor que `unknown` en un parámetro?  
El retorno puede ser el mismo T que entró. Inferencia. `unknown` no propaga.

`ApiResponse<any>` rompe la cadena: el backend cambia `price` a string y compile no avisa.

---

## 1.6 Utility types

| Utility | Efecto | Uso |
|---|---|---|
| `Partial<T>` | todo opcional | PATCH / drafts |
| `Required<T>` | todo requerido | |
| `Readonly<T>` | no reasignar props | inmutabilidad compile-time |
| `Pick<T, K>` | subset | listados |
| `Omit<T, K>` | sin keys | create DTO |
| `Record<K, V>` | mapa | diccionarios |

```ts
type CreatePost = Omit<Post, 'id' | 'publishedAt'>;
type UpdatePost = Partial<Omit<Post, 'id' | 'authorId'>>;
```

**G PATCH:** `Partial<User>` deja `id` en el body → reasignar identidad. Usa `Partial<Omit<User, 'id'>>`. El id va en la URL.

**Q authorId:** no es lo mismo que `id`. Omitir `authorId` evita **cambiar ownership** en un PATCH de contenido.

`Readonly` evita mutación en compile-time. `Partial` no: los campos siguen mutables. En JS el objeto sigue siendo mutable.

---

## 1.7 Narrowing vs `as`

Narrowing = checks que reducen el tipo (flujo). Default para APIs, unions, UI.  
`as` = mentira al compilador, **sin** verificar el valor. Solo si TS no puede inferir y **tú** tienes certeza.

```ts
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
```

**`'x' in value` sobre `unknown`:** error. Primero object + no null, luego `Record<string, unknown>`.  
**`'id' in obj` sobre tipo `object`:** puede ir a `never` (object no declara esas keys).

**Q4 parseUser:** `as User` sin validar → `user.name.toUpperCase()` explota si `name` es `undefined`/`null`. `""` **no** tira.

---

## 1.8 `unknown` / `any` / `never`

| | |
|---|---|
| `any` | opt-out. Todo permitido. |
| `unknown` | no sé. Narrow antes de usar. |
| `never` | imposible. Exhaustiveness / funciones que siempre tiran. |

`JSON.parse` → **`unknown`**, no `any`.

```ts
const data: any = JSON.parse('{"name":123}');
data.name.toUpperCase(); // compile OK, runtime boom

const u: unknown = JSON.parse('...');
u.name; // error TS
```

`assertNever(x: never): never { throw new Error(...) }` en `default` del switch.

**`in` sobre unknown:** primero `typeof === 'object' && !== null`.

---

# 2. REACT

## 2.1 JSX + Components

JSX **no es HTML**. Se compila a `jsx` / `createElement`.  
`class` es keyword JS → `className`.  
`{ }` = **cualquier expresión JS** (no solo lógica). Se evalúa **como argumentos** de la llamada, antes de construir el árbol. El DOM se actualiza después.

Componentes = funciones (idealmente puras en render). Props read-only. Composición (`children`) > herencia.

**Keys:** identidad estable (`id`), no `index` si la lista se reordena/filtra. React reusa el componente **en esa posición**; state interno (focus, input) se queda en el índice.

**G className / `{count+1}`:** JSX es JS; `className` por keyword; braces son args de createElement.

---

## 2.2 Props

Unidireccional: padre inyecta datos y callbacks. Hijo **notifica**, no orquesta fetch/global.

```ts
<UserChip user={u} selected={u.id === selectedId} onSelect={setSelectedId} />
```

`selectedId` vive en el padre. Chip presentacional.

**G:** ¿Por qué el chip no hace `fetch('/api/select')`?  
Acoplado a una URL, no reutilizable, peor de testear. Padre orquesta (red, modal, store).

**Mutar `user.role = 'admin'`:** React no se entera (no hay setState). Referencia compartida = bugs en el próximo render.

**Bug:** `className="avatarClassName"` es el **string** `"avatarClassName"`. Usa `className={avatarClassName}`.

Default: `size = 'md'` en la firma.

---

## 2.3 State + useState

State = lo que el componente **recuerda** y dispara re-render.

`let n = 0; n++` en click: (1) no hay re-render, (2) el siguiente render **reinicia** `let n = 0`.  
`useState` persiste entre ejecuciones y el setter **programa** el siguiente render. Recargar la página también resetea `useState`.

```ts
setCount((c) => c + 1); // cola; dos veces en el mismo handler → +2
setCount(count + 1);
setCount(count + 1);    // ambos leen el count de ESTE render → +1
```

Input **controlado:** `value={label}` + `onChange` → `setLabel`. **No** es two-way binding: state baja, evento sube.

No copies props a state “por si acaso” (se desincroniza).  
No `setState` en el cuerpo del render (loop).

**Display sin state:** single source of truth. Duplicar obliga `useEffect` de sync.

---

## 2.4 Events

`onClick={save}` = referencia.  
`onClick={save()}` = **se ejecuta en el render**; `onClick` recibe el retorno (`undefined`).  
Con args: `onClick={() => save(id)}`.

`form onSubmit` + `preventDefault`: el browser recargaría y **destruye** el state de la SPA.

Enter en un input de un `<form>` con `type="submit"` dispara `onSubmit`. Un `<div onClick>` **no**. a11y + semántica.

Botón en form sin `type` = submit en HTML. Usa `type="button"` si no debe enviar.

**Fail-fast:**

```ts
if (title.trim() === '') {
  setValidationError('...');
  return; // OBLIGATORIO
}
onReport({ title: title.trim(), urgent });
```

Sin `return`: llamas `onReport('')` y luego `setValidationError(null)` — el usuario no ve el error.

---

## 2.5 Forms: controlled vs uncontrolled

| | Controlled | Uncontrolled |
|---|---|---|
| Fuente | `useState` | el DOM |
| API | `value` + `onChange` | `defaultValue` + `ref` |
| Cada tecla | re-render | no |

`<input value={email} />` **sin** `onChange`: React pinta siempre el mismo `email` → campo **congelado**.  
`defaultValue` solo en **mount**; después el motor nativo es dueño.

Preferir controlled: validación en vivo, disable, mismo valor en dos sitios.  
Uncontrolled: leer al submit (búsqueda), menos renders.

Checkbox: `checked` + `onChange`, no `value` boolean.

---

## 2.6 useEffect

Sincronizar React con el mundo (red, DOM, timers). **Después** del paint.

| deps | cuándo corre |
|---|---|
| `[]` | mount; cleanup unmount |
| `[url]` | mount + cambio de url (cleanup del anterior primero) |
| (sin array) | cada render — casi nunca |

```ts
useEffect(() => {
  const ac = new AbortController();
  fetch(url, { signal: ac.signal })
    .then(...)
    .catch((e) => {
      if (e.name === 'AbortError') return;
      setError(true);
    });
  return () => ac.abort();
}, [url]);
```

**Fetch en el cuerpo del componente:** cada render dispara red. Si el `then` hace `setState` → **loop**.

**Sin cleanup + url cambia rápido:** race — la respuesta vieja puede llegar después y pisar la UI.

**Stale closure:** el effect “captura” `message` del render en que se creó. Si no está en deps, lee el valor **viejo**.

Ignorar `AbortError`; no `setState` de error al abortar.

---

## 2.7 useRef / useMemo / useCallback / memo

**useRef:** caja mutable, **no** re-renderiza. DOM, timers, “último valor”.

**useMemo:** cachea **cálculo**. Deps iguales → mismo resultado.

**useCallback:** cachea **función**. Misma identidad si deps iguales.

**React.memo:** skip re-render si props **shallow equal** (mismas referencias).

**G:** `memo(Row)` + `onClick={() => add(id)}` en el **padre** como prop: cada render del padre crea una función **nueva** → memo ve prop distinta → hijo pinta igual. Arreglo: `useCallback` (o handler estable).

Arrow **dentro** del hijo memoizado (`onClick={() => onAdd(id)}`) está OK: solo se crea si esa fila **sí** renderiza. Lo que rompe memo es función nueva **como prop**.

**useMemo overhead:** concatenar strings / booleanos — comparar deps cuesta más que recalcular.

Patrón estable + carrito:

```ts
const handleAdd = useCallback((id: string) => {
  setCartIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
}, []);
```

Updater `[]` → el callback no depende de `cartIds`.

Focus al montar: `useRef` + `useEffect(() => { inputRef.current?.focus(); }, [])`.

---

## 2.8 Render, reconciliation, Context

- **Render:** se ejecuta la función → árbol.
- **Re-render:** state/props/context del que tiene el state (o del padre). No = “pintar todo el DOM”.
- **Reconciliación:** mismo tipo + misma `key` → reusa nodo/instancia.
- **Default:** padre re-renderiza → **hijos también**, aunque sus props no cambien, **salvo** `React.memo`.
- **Context:** evita drilling. Valor nuevo (`{}` o fn inline) re-renderiza **todos** los consumidores. No es Redux.
- **No Context:** 1–2 niveles, valores que cambian cada tecla, componentes que quieres reutilizar sin provider.

---

# 3. ASYNC (flash enseñado; G/H pendientes)

**Promise:** pending → fulfilled | rejected.  
**async/await:** no bloquea el hilo; pausa esa función.  
**Event loop:** stack → **microtasks** (`then`/`queueMicrotask`) → **macrotasks** (`setTimeout`).  
**Promise.all:** uno falla → todo falla.  
**allSettled:** espera todos; `{ status, value | reason }`.  
**AbortController.abort():** el `fetch` en vuelo rechaza con `AbortError`.

**G pendiente (Session 03):**  
`await A(); await B();` es **secuencial** (tiempo ≈ A+B).  
`Promise.all([A(), B()])` es **paralelo** (tiempo ≈ max(A,B)). All es más rápido si son independientes. All si A debe terminar para saber la URL de B, no aplica.

H: `exercises/03-async/async-h.ts`

---

# 4. FRASES LISTAS (30 s)

1. *TS borra tipos; el JSON de la API no pasa por el compilador; valida en el borde.*  
2. *Discriminated union + `never` para no olvidar un caso.*  
3. *`unknown` en `JSON.parse`; `any` es opt-out.*  
4. *JSX es JS; `className`; `{expr}` son argumentos de `jsx`.*  
5. *`key` = identidad del dato, no del índice.*  
6. *Props down, events up; el leaf no hace fetch de negocio.*  
7. *`let++` no re-renderiza y se reinicia; `useState` persiste y programa paint.*  
8. *Dos `setCount(count+1)` = +1; dos updaters = +2.*  
9. *Controlled no es two-way; `value` + `onChange`.*  
10. *`onClick={fn()}` corre en render; `onClick={fn}` es referencia.*  
11. *`preventDefault` en submit o recargas la SPA.*  
12. *Validación: `return` antes del dispatch.*  
13. *Effect = sync con el mundo; cleanup aborta; deps incompletas = stale.*  
14. *Fetch en render + setState = loop.*  
15. *Memo compara referencias; arrow inline como prop mata `React.memo`.*  
16. *Context para dato amplio y estable, no para cada keystroke.*

---

# 5. ERRORES QUE YA COMETISTE (no repetir)

| Error | Arreglo |
|---|---|
| “Compile-time ve el JSON” | El compilador no ve la red |
| `formatProgress` “tira con null” | Template no tira; `null.toFixed` sí |
| `as Student` antes de validar | Narrow / construir objeto |
| `progress: number \| null` vs contrato `number` | Rechaza en el borde |
| `input != null` invertido → `never` | `=== null` para rechazar |
| `Partial<User>` en PATCH | `Omit` el `id` |
| Confundir `authorId` con `id` | Ownership vs identidad |
| `handleSubmit` sin `return` | Fail-fast |
| “Bidireccional” en input controlado | Unidireccional |
| `className="avatarClassName"` | `{avatarClassName}` |
| Respuesta G con cola de chatbot | Cortar en el hecho técnico |

---

# 6. NO ESTÁ EN ESTE SHEET (gap)

- Next.js App Router, RSC, layouts, caching  
- API integration ejercicio (loading/error/race en UI)  
- Mini mock bajo presión  
- Testing, a11y profunda, security, perf profiling  

Si la entrevista es Meta/Google UI: prioriza este archivo.  
Si es Vercel/Next shop: estudia RSC aparte; aquí no hay cobertura.

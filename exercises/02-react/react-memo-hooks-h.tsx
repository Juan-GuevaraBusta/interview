// Session 02 — H: useRef + useMemo + useCallback (combined)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Lista de productos con filtro. Evita trabajo y re-renders innecesarios.
//
// TAREAS:
//
// 1. type Product = { id: string; name: string; price: number }
//
// 2. ProductList({ products, filter }: { products: Product[]; filter: string })
//    - filtered = useMemo: products donde name incluye filter (case insensitive)
//    - NO recalcules filtered en cada render sin memo
//
// 3. ProductRow({ product, onAdd }: { product: Product; onAdd: (id: string) => void })
//    - Envuelve con React.memo
//    - onAdd debe ser estable desde el padre (useCallback)
//
// 4. Catalog (padre):
//    - products en state (mock 3 items)
//    - filter en state (input controlado)
//    - cartIds en state (Set o string[])
//    - handleAdd = useCallback que agrega id al cart
//    - inputRef = useRef para enfocar el filtro al montar (useEffect focus una vez)
//
// 5. Responde:
//    a) ¿Cuándo useMemo NO ayuda (cuándo es overhead)?
//    b) ¿Por qué React.memo(ProductRow) no sirve si onAdd es inline () => ...?
//
// Cuando termines, avísame.


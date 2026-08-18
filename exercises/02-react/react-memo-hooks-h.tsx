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

import React, {useState, useMemo, useCallback, useRef, useEffect} from 'react'

export type Product = {
    readonly id: string;
    name: string;
    price: number;
  };
  
  export type ProductRowProps = {
    readonly product: Product;
    readonly onAdd: (id: string) => void;
  };
  
  export type ProductListProps = {
    readonly products: readonly Product[];
    readonly filter: string;
    readonly onAddItem: (id: string) => void;
  };

  export const ProductRow = React.memo(function ProductRow({ product, onAdd }: ProductRowProps): React.JSX.Element {
    console.log(`[Performance Check] Rendering Leaf Node Row ID: ${product.id}`);
  
    return (
      <li className="product-row-item">
        <span>{product.name} — ${product.price}</span>
        <button 
          type="button" 
          onClick={() => onAdd(product.id)} // Fires a stable function reference
          className="btn btn-add-cart"
        >
          Add to Inventory
        </button>
      </li>
    );
  });
  export function ProductList({ products, filter, onAddItem }: ProductListProps): React.JSX.Element {
    // useMemo caches the results of computation-heavy operations across renders
    const filteredProducts = useMemo(() => {
      console.log('[Performance Check] Recomputing expensive search filters...');
      const searchTarget = filter.toLowerCase().trim();
      
      if (searchTarget === '') return products;
      
      return products.filter((product) => 
        product.name.toLowerCase().includes(searchTarget)
      );
    }, [products, filter]); // Explicit dependencies: recalculates ONLY when terms modify
  
    if (filteredProducts.length === 0) {
      return <p className="empty-search-alert">Zero matching product keys cataloged.</p>;
    }
  
    return (
      <ul className="product-filtered-list">
        {filteredProducts.map((product) => (
          <ProductRow 
            key={product.id} 
            product={product} 
            onAdd={onAddItem} // Guaranteed stable reference from parent tree
          />
        ))}
      </ul>
    );
  }
  const MOCK_INVENTORY: readonly Product[] = [
    { id: 'prod_001', name: 'Premium Mechanical Keyboard', price: 120 },
    { id: 'prod_002', name: 'Ergonomic Wireless Mouse', price: 85 },
    { id: 'prod_003', name: 'UltraWide 4K Developer Monitor', price: 450 },
  ];
  
  export function Catalog(): React.JSX.Element {
    const [products] = useState<readonly Product[]>(MOCK_INVENTORY);
    const [filter, setFilter] = useState<string>('');
    const [cartIds, setCartIds] = useState<readonly string[]>([]);
  
    // Bypasses the virtual render cycles to grab direct imperatival DOM execution
    const inputRef = useRef<HTMLInputElement>(null);
  
    // Autofocus pipeline execution upon initial system mounting phase
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []); // Run-once mounting hook array marker
  
    // useCallback locks the memory signature address of this handler across parent shifts
    const handleAdd = useCallback((id: string): void => {
      // Functional state updating keeps this closure clean and independent of cartIds dependency updates
      setCartIds((prevIds) => {
        if (prevIds.includes(id)) return prevIds; // Disallow duplicates safely
        return [...prevIds, id];
      });
    }, []); // Empty dependencies ensure this pointer signature NEVER morphs or changes
  
    return (
      <main className="catalog-system-layout">
        <header className="catalog-header">
          <h1>Enterprise Inventory Systems</h1>
          <div className="cart-badge-status">Items in Cart: <strong>{cartIds.length}</strong></div>
        </header>
  
        <section className="search-filter-controls">
          <label htmlFor="catalog-filter-input">Filter Inventory Data:</label>
          <input
            id="catalog-filter-input"
            type="text"
            ref={inputRef} // Hooks the DOM element straight to the useRef buffer
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Type search keys..."
            className="controlled-search-field"
          />
        </section>
  
        <section className="catalog-display-module">
          <h2>Available Stock Records</h2>
          <ProductList 
            products={products} 
            filter={filter} 
            onAddItem={handleAdd} 
          />
        </section>
      </main>
    );
  }

/*
a) ¿Cuándo useMemo NO ayuda (cuándo es overhead)?
useMemo introduce un costo extra innecesario cuando se aplica sobre 
operaciones primitivas o cálculos simples, como concatenar textos o 
leer booleanos. En esos casos, el proceso de React para registrar dependencias 
y comparar referencias consume más recursos de CPU de lo que costaría volver 
a ejecutar el código crudo desde cero.
b) ¿Por qué React.memo(ProductRow) no sirve si onAdd es inline () => ...?
No sirve porque la función declarada en la línea del prop genera una 
dirección de memoria completamente nueva en cada ciclo de renderizado 
del componente padre. Como React.memo realiza una comparación superficial, 
detecta este cambio de puntero, asume que el prop sufrió modificaciones y 
fuerza el re-renderizado del hijo de todos modos.
*/
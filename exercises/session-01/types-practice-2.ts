// Session 01 — Types Practice 2 (refuerzo antes de Interfaces)
// Escribe TÚ el código. Nivel: intermedio.
//
// ESCENARIO:
// Una API de e-commerce retorna productos. A veces el campo "descuento" llega,
// a veces no. Cuando llega, es un número (0-100). El frontend debe mostrar
// el precio final.
//
// TAREA:
// 1. Define un tipo/interfaz Product con:
//    - id: number
//    - nombre: string
//    - precio: number
//    - descuento: ??? (opcional, 0-100, o undefined)
//
// 2. Escribe calcularPrecioFinal(product: Product): number
//    Retorna: precio - (precio * descuento / 100)
//    Si descuento es undefined, retorna precio sin cambios.
//
// 3. Escribe parseProduct(json: unknown): Product
//    Sin librerías. Sin `any`.
//    Valida: id, nombre, precio siempre presentes.
//    descuento: si viene, debe ser number entre 0 y 100; si no viene, undefined.
//    Si descuento es negativo o > 100, rechaza.
//
// 4. Con estos payloads, ¿qué pasa?
//    a) { id: 1, nombre: "Laptop", precio: 1000, descuento: 50 } → parseProduct → calcularPrecioFinal
//    b) { id: 2, nombre: "Mouse", precio: 50 } → parseProduct → calcularPrecioFinal
//    c) { id: 3, nombre: "Keyboard", precio: 100, descuento: 150 } → parseProduct
//
// 5. ¿Por qué usar `descuento: number | undefined` en lugar de `descuento?: number`?
//    Explica la diferencia en 2–3 frases.
//
// Cuando termines, pega el código + respuesta a Q5 en el chat.

interface Product {
    id: number;
    name: string;
    price: number;
    discount: number | undefined;
}

function calculateFinalPrice(product: Product): number {
    if (product.discount === undefined) {
        return product.price;
    }
    return product.price - (product.price * product.discount / 100);
}

function parseProduct(json: unknown): Product {
    if(typeof json !== 'object' || json === null){
        throw new Error('Invalid JSON');
    }
    const obj = json as Record<string, unknown>;
    
    // Validar campos obligatorios
    if(typeof obj.id !== 'number' ||
        typeof obj.name !== 'string' ||
        typeof obj.price !== 'number'){
            throw new Error('Invalid product: missing required fields');
        }
    
    // Validar descuento: si existe, debe ser number entre 0-100; si no, undefined
    let discount: number | undefined = undefined;
    if ('discount' in obj) {
        if (typeof obj.discount !== 'number' || obj.discount < 0 || obj.discount > 100) {
            throw new Error('Invalid product: discount must be number between 0-100');
        }
        discount = obj.discount;
    }
    
    return {
        id: obj.id as number,
        name: obj.name as string,
        price: obj.price as number,
        discount: discount
    }
}

/* 
4. Con los payloads propuestos:
a) pasará que el descuento es del 50% y todos los campos son válidos,
por lo tanto el resultado es 500
b) pasará que no hay descuento, y todos los campos son válidos por lo
tanto el resultado es 50
c) Pasará que el descuento es 150, lo cual provocará que en el guard,
de descuento, se lance un error porque este es mayor a 100
5. Usar 'descuento: number | undefined' Provoca que el compilador
verifique si el valor de descuento es un numero entre 0-100, y en dado caso
de que no lo sea, obligue a que sea undefined, evitando que sea opcional y
permitiendo que el campo se omita por completo en el JSON
*/
// Session 01 — H: Generics (type parameters & reusability)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Un API client que recupera datos de diferentes endpoints.
// Necesitas una función genérica que:
// 1. Valide que la respuesta tiene los campos correctos.
// 2. Retorne el tipo exacto (no `any`).
// 3. Sea reutilizable para diferentes tipos de datos.
//
// TAREAS:
//
// 1. Define un genérico `ApiResponse<T>`:
//    { success: true; data: T } | { success: false; error: string }
//
// 2. Define dos tipos específicos:
//    - User: id, name, email
//    - Product: id, title, price
//
// 3. Escribe fetchData<T>(endpoint: string): Promise<ApiResponse<T>>
//    Sin código real. Simula con console.log + mock responses.
//    Retorna exactamente ApiResponse<T>.
//
// 4. Escribe extractData<T>(response: ApiResponse<T>): T | null
//    Si success: true, retorna data.
//    Si success: false, retorna null.
//
// 5. Responde:
//    a) ¿Por qué extractData<T> sabe qué tipo retornar sin que lo especifiques explícitamente?
//    b) ¿Qué pasaría si usas fetchData(url): ApiResponse<any> en lugar de genéricos?
//
// Cuando termines, pega el código + respuestas en el chat.


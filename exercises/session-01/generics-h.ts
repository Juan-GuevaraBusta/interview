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

export type ApiResponse<T> = 
    | { success: true; data: T, error?: never}
    | { success: false; error: string, data?: never}

export type User = {
    readonly id: string;
    name: string;
    email: string;
}

export type Product = {
    readonly id: string;
    title: string;
    price: number;
}

export async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>>{
    console.log(`fetching data from ${endpoint}`);

    const mockResponse: unknown = {
        success: true,
        data: {
            id: '1',
            name: 'Juan Bustamante',
            email: 'juanbustamante@gmail.com'
        }
    };

    return mockResponse as ApiResponse<T>
}

export function extractData<T>(response: ApiResponse<T>): T | null {
    if(!response.success){
        return null;
    }
    return response.data
}

/*
extractData<T> sabe exactamente qué retornar gracias a la propagación de firmas (signature propagation) y la inferencia contextual. Cuando invocas fetchData<User>('/user'), el token devuelto queda ligado contractualmente a la estructura User. Al pasar ese token a extractData, TypeScript acopla el argumento físico con el parámetro formal de tipo T. Forzar al desarrollador a escribir extractData<User>(response) sería redundante, degradaría la DX y violaría el principio de código DRY.b) El Peligro Crítico de ApiResponse<any>Utilizar any rompe la cadena de confianza del tipado (type safety chain) en la capa de transporte de datos. Si tu cliente de API escupe any, estás silenciando al compilador. Si el backend cambia el campo price de un producto a string o introduce un breaking change, tu aplicación fallará silenciosamente en tiempo de ejecución (runtime), probablemente rompiendo la UI con un error clásico de Cannot read properties of undefined. El uso de genéricos actúa como una red de seguridad en tiempo de compilación.
*/
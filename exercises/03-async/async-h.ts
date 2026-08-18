// Session 03 — H: Async (Promise, all vs allSettled, AbortController)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Cargas perfil + pedidos en paralelo. Debes abortar y no tragar errores.
//
// TAREAS:
//
// 1. type User = { id: string; name: string }
//    type Order = { id: string; total: number }
//
// 2. fetchJson<T>(url: string, signal?: AbortSignal): Promise<T>
//    - fetch + res.ok check + json
//    - Puedes mockear: delay + si url incluye "fail" reject
//
// 3. loadDashboard(userId: string, signal: AbortSignal):
//    Promise.all de user + orders
//    Retorna { user, orders }
//
// 4. loadOptionalWidgets(ids: string[], signal: AbortSignal):
//    Promise.allSettled — retorna solo los fulfilled values
//
// 5. Responde:
//    a) Promise.all vs allSettled: ¿cuál usas si un widget fallido NO debe
//       tumbar el dashboard?
//    b) ¿Qué hace AbortController.abort() a un fetch en vuelo?
//
// Cuando termines, avísame.

export type User = {
    readonly id: string;
    name: string;
};

export type Order = {
    readonly id: string;
    total: number;
};

export type WidgetData = {
    readonly id: string;
    content: string;
};

export type DashboardPayload = {
    user: User;
    orders: readonly Order[];
};

export async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> { 
    if(signal?.aborted){
        throw signal.reason || new DOMException('Request aborted')
    }

    await new Promise((resolve) => setTimeout(resolve, 150));

    if(url.includes('fail')){
        throw new Error('HTTP Request failed');
    }

    let mockPayload: unknown;

    if (url.includes('/profile/')) {
        mockPayload = { id: 'usr_77', name: 'Alex UI Specialist' };
    }
    else if (url.includes('/orders')) {
        mockPayload = [
            { id: 'ord_101', total: 49.99 },
            { id: 'ord_102', total: 120.00 }
        ];
      }
      else{
        // Fallback dynamic mock layout for general widgets
        mockPayload = { id: url.split('/').pop() || 'unknown', content: 'Widget Render Content OK' };
      }
    
      return mockPayload as T;

}

export async function loadDashboard(userId: string, signal: AbortSignal): Promise<DashboardPayload> {
    const[user, orders] = await Promise.all([
        fetchJson<User>(`/api/profile/${userId}`, signal),
        fetchJson<Order[]>(`/api/orders?userId=${userId}`, signal)
    ]);

    return{user, orders}
}

export async function loadOptionalWidgets(ids: string[], signal: AbortSignal): Promise<WidgetData[]> {
    const endpoints = ids.map(id => `api/widgets/${id}`);

    const settlements = await Promise.allSettled(
        endpoints.map(url => fetchJson<WidgetData>(url, signal))
    );

    const activeWidgets: WidgetData[] = settlements
    .filter((result): result is PromiseFulfilledResult<WidgetData> => result.status === 'fulfilled')
    .map(fulfilledResult => fulfilledResult.value);

    settlements.forEach((result, index) => {
        if(result.status === 'rejected'){
            console.warn('telemetry warning')
        }
    });

    return activeWidgets;

}

/*
a) Promise.all vs allSettled: ¿cuál usas si un widget fallido NO 
debe tumbar el dashboard?
Debes usar Promise.allSettled porque espera a que todas las peticiones 
terminen sin importar si fallan o tienen éxito, devolviendo un reporte 
individual de cada una. Esto te permite aislar los errores de los 
componentes rotos y renderizar de forma segura el resto del dashboard 
con los módulos que se cargaron correctamente.

b) ¿Qué hace AbortController.abort() a un fetch en vuelo?
Envía una señal de interrupción al navegador que cancela inmediatamente 
la transferencia de datos por la red y hace que la promesa del fetch se 
rechace con un error de tipo 'AbortError'. Esto evita fugas de memoria y 
condiciones de carrera al impedir que peticiones desactualizadas intenten 
modificar el estado de componentes que ya no existen en pantalla 
*/
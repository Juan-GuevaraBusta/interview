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

import React, {useState, useEffect, useCallback} from 'react'

export type User = {
    readonly id: string;
    name: string;
};

export type LoadState =
    | {status: 'idle'}
    | {status: 'loading'}
    | {status: 'success', user: User}
    | {status: 'error', message: string}

export type UserPanelProps ={
    readonly userId: string
}

export async function fetchUser(id: string, signal: AbortSignal): Promise<User>{
    if(signal.aborted){
        throw signal.reason || new DOMException('Abort error')
    }

    await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, 150);
        signal.addEventListener('abort', () => {
            clearTimeout(timeoutId)
            reject(new DOMException('User aborted request'))
        });
    });

    if(id === 'missing'){
        throw new Error ('Error 404');
    }
    else if(id === 'crash'){
        throw new Error ('Error 500');
    }

    return{
        id,
        name: `Engineer profile ${id.toUpperCase()}`
    };
}

export function UserPanel({userId}: UserPanelProps): React.JSX.Element{
    const [state, setState] = useState<LoadState>({ status: 'idle' });
  // Explicit counter state to act as a stable trigger mechanism for the retry cycle
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  // useCallback keeps this execution handler stable across re-renders
  const handleRetry = useCallback(() => {
    setRetryTrigger((prevCount) => prevCount + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (!userId.trim()) {
      setState({ status: 'idle' });
      return;
    }

    const executeLoadSequence = async (): Promise<void> => {
      setState({ status: 'loading' });

      try {
        const userData = await fetchUser(userId, signal);
        
        // Success path: safe state mutation
        setState({ status: 'success', user: userData });
      } catch (error) {
        // CRITICAL CHECKPOINT: Catch and ignore AbortError exceptions silently
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.log(`[Network Sync] Intercepted flight request abort for ID: ${userId}`);
          return; // Freeze block: exit cleanly without corrupting the state
        }

        // Structural application layer error handling
        setState({ 
          status: 'error', 
          message: error instanceof Error ? error.message : 'An anomalous networking event occurred.' 
        });
      }
    };

    executeLoadSequence();

    // CLEANUP STAGE: Fires instantly on user shift, component unmount, or manual retry trigger
    return () => {
      controller.abort();
    };
  }, [userId, retryTrigger]); // Strictly bound to changing users OR the retry count trigger

  return (
    <div className="user-panel-widget">
      <header className="widget-header">
        <h4>User Profile Console</h4>
        <small>Target Context: <code>{userId}</code></small>
      </header>

      <div className="widget-display-canvas">
        {state.status === 'idle' && <p className="status-placeholder">Awaiting identity input keys...</p>}
        
        {state.status === 'loading' && <p className="status-loader">Synchronizing remote repository records...</p>}
        
        {state.status === 'success' && (
          <div className="profile-details-node">
            <p>User Token: <strong>{state.user.id}</strong></p>
            <p>Display Alias: <strong>{state.user.name}</strong></p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="profile-error-alert" role="alert">
            <p className="error-text-line">{state.message}</p>
            <button type="button" onClick={handleRetry} className="btn btn-retry-action">
              🔄 Re-attempt Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
/*
a) En una API real, ¿por qué await res.json() sin res.ok es un bug?
Porque las respuestas de error del servidor (como un HTTP 404 o 500) 
resuelven la promesa de fetch con éxito, por lo que omitir res.ok hará 
que tu código lea estructuras de datos inválidas o páginas HTML crudas. 
Esto guarda objetos corruptos en las variables de estado de tu UI, lo 
que provoca colapsos críticos en cascada cuando los componentes intenten 
renderizar propiedades inexistentes.
b) Retry vs cambiar userId: ¿qué debe pasar con el fetch anterior en cada caso?
En ambos casos, el fetch anterior debe ser cancelado de inmediato 
ejecutando controller.abort() en la fase de limpieza (cleanup) del hook. 
Al cambiar el userId, esto evita condiciones de carrera donde peticiones 
retrasadas del usuario viejo sobrescriban al nuevo; mientras que en un Retry, 
previene duplicar peticiones duplicadas volando en paralelo hacia la misma URL
*/
// Session 02 — H: useEffect (deps, cleanup, stale closure)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Poll de un status endpoint. Debes abortar al unmount y no usar datos viejos.
//
// TAREAS:
//
// 1. type Status = 'idle' | 'loading' | 'ok' | 'error'
//
// 2. StatusPoll({ url }: { url: string }):
//    - status + message en useState.
//    - useEffect que:
//        * set status loading
//        * fetch(url, { signal })  (puedes mockear con Promise + AbortSignal)
//        * si ok: set 'ok' + texto
//        * si abort: NO setState de error (ignora AbortError)
//        * cleanup: abort()
//    - deps: [url]  — si cambia url, cancela el fetch anterior.
//
// 3. NO pongas fetch en el cuerpo del render.
//
// 4. Responde:
//    a) ¿Qué pasa si omites cleanup y cambias `url` rápido dos veces?
//    b) Si el effect usa `message` del state pero NO lo pones en deps,
//       ¿qué es una stale closure? (2 frases)
//
// Cuando termines, avísame.

import React, {useState, useEffect} from 'react'

export type PollStatus = 'idle' | 'loading' | 'ok' | 'error';

export type StatusPollProps = {
    readonly url: string;
};

export function StatusPoll({ url }: StatusPollProps): React.JSX.Element {
    const [status, setStatus] = useState<PollStatus>('idle');
    const [message, setMessage] = useState<string>('');
  
    useEffect(() => {
      // Instantiate an AbortController instance exclusively for this execution cycle
      const controller = new AbortController();
      const { signal } = controller;
  
      // Fail-fast boundary execution safety checkpoint
      if (!url.trim()) {
        setStatus('idle');
        setMessage('No active polling endpoint configured.');
        return;
      }
  
      const executeFetchPipeline = async (): Promise<void> => {
        setStatus('loading');
        
        try {
          // HTTP GET simulation wrapper respecting the active AbortSignal network wire
          console.log(`[Network Synchronization] Initializing stream request to: ${url}`);
          
          // Mock network delay that respects our abort signal mechanism
          await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(resolve, 1500);
            signal.addEventListener('abort', () => {
              clearTimeout(timeoutId);
              reject(new DOMException('The user aborted a request.', 'AbortError'));
            });
          });
  
          // Simulate successful resolution payload
          setStatus('ok');
          setMessage(`Telemetry payload sync established successfully at ${new Date().toLocaleTimeString()}`);
        } catch (error) {
          // CRITICAL CHECKPOINT: Intercept expected AbortError terminations silently
          if (error instanceof DOMException && error.name === 'AbortError') {
            console.warn(`[Network Synchronizer] Request explicitly intercepted and ignored for URL: ${url}`);
            return; // Terminate execution instantly without firing state changes on an unmounted component
          }
  
          // Handle structural system validation errors
          setStatus('error');
          setMessage(error instanceof Error ? error.message : 'Unknown transport channel exception.');
        }
      };
  
      executeFetchPipeline();
  
      // CLEANUP PHASE: Fires when dependencies change or when the component completely unmounts
      return () => {
        console.log(`[Cleanup Triggered] Cancelling flight request pipeline for: ${url}`);
        controller.abort();
      };
    }, [url]); // Strict data dependency lock: Re-runs ONLY when the url input contract alters
  
    return (
      <article className="status-polling-card">
        <header className="card-header">
          <h3>Server Telemetry Core</h3>
          <small className="endpoint-tag">Source: <code>{url}</code></small>
        </header>
  
        <div className="status-display-body">
          <p className="status-indicator">
            System State: <span className={`pill pill-${status}`}>{status.toUpperCase()}</span>
          </p>
          {message && <p className="status-message-output">{message}</p>}
        </div>
      </article>
    );
  }

/*
a) ¿Qué pasa si omites cleanup y cambias url rápido dos veces?
Si omites la limpieza, desencadenas una condición de carrera (Race Condition) 
donde ambas peticiones de red siguen volando simultáneamente en segundo plano. 
Esto provoca que la respuesta de la primera URL pueda completarse después de la 
segunda debido a la latencia, sobrescribiendo erróneamente la interfaz con datos 
viejos y desincronizados.

b) Si el effect usa message del state pero NO lo pones en deps, 
¿qué es una stale closure? 

Una stale closure ocurre cuando una función interna dentro del 
efecto captura las variables de estado en el instante 
exacto de su creación, quedando congelada en ese punto del tiempo. Al omitir message 
del arreglo de dependencias, el efecto nunca se reinicia, lo que obliga a las 
funciones internas a leer perpetuamente el valor inicial desactualizado en lugar 
de los datos reales del presente.
*/
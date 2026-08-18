// Session 02 — H: React State
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Un panel de “draft counter” para un editor. El estado vive en un componente.
//
// TAREAS:
//
// 1. CounterPanel:
//    - count: number (useState, inicial 0)
//    - label: string (useState, inicial "")
//    Tres botones: +1, -1 (no bajar de 0), Reset (count=0 y label="").
//
// 2. El input de label es CONTROLADO: value={label} onChange actualiza state.
//    No uses defaultValue para este ejercicio.
//
// 3. Display({ count, label }: { count: number; label: string })
//    Solo muestra. SIN useState. Si label está vacío, muestra "Untitled".
//
// 4. Incrementar no debe hacer count++ sobre el state (explica en comentario
//    de 1 línea por qué usas setCount(c => c + 1) o setCount(count + 1)).
//
// 5. Responde:
//    a) ¿Por qué Display no necesita state?
//    b) ¿Qué pasa si haces setCount(count + 1) dos veces seguidas en el mismo
//       click handler, vs setCount(c => c + 1) dos veces?
//
// Cuando termines, avísame.

import React, {useState} from 'react'

export type DisplayProps = {
    readonly count: number;
    readonly label: string;
};

export function Display({count, label}: DisplayProps): React.JSX.Element{
    const computedLabel = label.trim() === '' ? 'Untitled' : label;
    return (
        <div className = "display-preview-card">
            <h3 className = "preview-title">Document: {computedLabel}</h3>
            <p className = "preview-counter">
                Revision version: <span className = "badge-count">{count}</span>
            </p>
        </div>
    );
}

export function CounterPanel() : React.JSX.Element{
    const [count, setCount] = useState<number>(0)
    const [label, setLabel] = useState<string>('')

    const handleIncrement = (): void => {
         //Usamos el callback funcional porque dependemos estrictamente
         //del estado inmediatamente anterior
         setCount((prevCount) => prevCount + 1)
    };

    const handleDecrement = (): void => {
        setCount((prevCount) => {
            if(prevCount <= 0){
                return 0
            }
            return prevCount - 1
        });
    };

    const handleReset = (): void =>{
        setCount(0)
        setLabel('')
    }

    const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(event.target.value)
    }

    return (
        <section className="counter-panel-container">
          <header className="panel-header">
            <h2>Draft Management System</h2>
          </header>
    
          {/* Flujo Unidireccional: Pasamos los estados como props puras a un hijo Dumb */}
          <Display count={count} label={label} />
    
          <div className="form-control-group">
            <label htmlFor="draft-label-input">Draft Name:</label>
            <input
              id="draft-label-input"
              type="text"
              value={label} // Enlace bidireccional controlado por React
              onChange={handleLabelChange}
              placeholder="Enter draft title..."
              className="controlled-input"
            />
          </div>
    
          <div className="action-button-toolbar">
            <button type="button" onClick={handleIncrement} className="btn btn-primary">
              Increment Draft (+1)
            </button>
            <button type="button" onClick={handleDecrement} className="btn btn-secondary">
              Decrement Draft (-1)
            </button>
            <button type="button" onClick={handleReset} className="btn btn-danger">
              Reset Dashboard
            </button>
          </div>
        </section>
      );

}

/*
a) ¿Por qué Display no necesita state?
Porque viola el principio de Single Source of Truth 
(Fuente única de verdad). El componente Display no es el dueño ni el 
originador de la información; su única responsabilidad es actuar como una 
plantilla visual pura (Dumb Component). Al recibir count y label directamente 
a través de sus props, se garantiza que se renderice sincrónicamente con los 
datos más recientes que le provee su componente padre. Crear un estado interno 
duplicado en el hijo requeriría sincronizaciones complejas (como hooks useEffect), 
lo cual degrada la mantenibilidad del código e introduce desalineaciones en la UI.

b) 
¿Qué pasa si haces setCount(count + 1) dos veces seguidas en el mismo click handler, 
vs setCount(c => c + 1) dos veces?Con setCount(count + 1): El valor de count está 
congelado en el scope de la función durante ese ciclo específico de renderizado 
(por ejemplo, si vale 0, ambas llamadas evalúan setCount(0 + 1)). React acumula 
las peticiones (batching) y al final actualiza el estado a 1, perdiendo una de 
las operaciones.Con setCount(c => c + 1): Le pasas a React una función que se 
añade a una cola de ejecución. La segunda llamada recibe como argumento (c) 
el resultado real calculado de manera inmediata por la primera función en cola 
(1 => 1 + 1). Esto garantiza la correcta actualización en cascada, haciendo 
que el valor final sea correctamente 2.
*/
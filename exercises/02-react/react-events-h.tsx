// Session 02 — H: React Events
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Un formulario mínimo de “report a bug”. Eventos sintéticos de React.
//
// TAREAS:
//
// 1. BugForm:
//    - title: string (controlled)
//    - urgent: boolean (checkbox controlled)
//    - onSubmit del <form>: preventDefault, luego llama
//      onReport({ title, urgent }) si title.trim() no está vacío.
//      Si está vacío, no llames onReport (puedes setear un error local).
//
// 2. type ReportPayload = { title: string; urgent: boolean }
//    BugFormProps = { onReport: (payload: ReportPayload) => void }
//
// 3. handleKeyDown en el input: si el usuario pulsa Escape, limpia title
//    y el error. No envíes el form con Escape.
//
// 4. El padre (BugTracker) guarda un array de reports en state.
//    Lista los títulos. onReport SOLO vive en el padre (push al array).
//
// 5. Responde:
//    a) ¿Por qué e.preventDefault() en onSubmit del form?
//    b) ¿Qué diferencia hay entre onClick en un <div> y type="submit" en un form,
//       respecto a Enter en el input?
//
// Cuando termines, avísame.

import React, {useState} from 'react'

export type ReportPayLoad = {
    title: string;
    urgent: boolean;
};

export type BugFormProps = {
    readonly onReport: (payload: ReportPayLoad) => void;
};

export function BugForm({onReport}: BugFormProps): React.JSX.Element {
    const[title, setTitle] = useState<string>('');
    const [urgent, setUrgent] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string | null > (null);

    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) : void => {
        event.preventDefault();
        if(title.trim() === ''){
            setValidationError('Title cannot be empty');
        }
        onReport({title: title.trim(), urgent});
        setTitle('');
        setUrgent(false);
        setValidationError(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) : void => {
        if(event.key === 'Escape'){
            setValidationError(null);
            setTitle('');
        };
    };

    return(
        <form onSubmit={handleSubmit} className="bug-form-container" noValidate>
      <div className="form-field">
        <label htmlFor="bug-title-input">Bug Summary:</label>
        <input
          id="bug-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what went wrong..."
          className={validationError ? 'input-error' : 'input-valid'}
        />
        {validationError && <p className="error-message-text" role="alert">{validationError}</p>}
      </div>

      <div className="form-field checkbox-group">
        <label htmlFor="bug-urgency-checkbox">
          <input
            id="bug-urgency-checkbox"
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
          />
          Mark as critical priority
        </label>
      </div>

      <button type="submit" className="btn btn-submit">
        Dispatch Bug Report
      </button>
    </form>
    );
}

type PersistedReport = ReportPayLoad & {readonly uuid: string};

export function BugTracker(): React.JSX.Element {
    const [reports, setReports] = useState<readonly PersistedReport[]>([]);
  
    const handleReportBug = (payload: ReportPayLoad): void => {
      // Enforcing immutability by creating a shallow copy array structure
      setReports((prevReports) => [
        ...prevReports,
        { ...payload, uuid: `bug_${Date.now()}` },
      ]);
    };
  
    return (
      <main className="tracker-dashboard">
        <header className="dashboard-header">
          <h1>Internal QA Defect Tracking</h1>
        </header>
  
        <section className="form-section">
          <BugForm onReport={handleReportBug} />
        </section>
  
        <section className="list-section">
          <h2>Logged Issues ({reports.length})</h2>
          {reports.length === 0 ? (
            <p className="empty-state">System stable. Zero pending crash logs.</p>
          ) : (
            <ul className="bug-report-list">
              {reports.map((bug) => (
                <li key={bug.uuid} className={`bug-item ${bug.urgent ? 'critical' : 'minor'}`}>
                  <strong>{bug.title}</strong> {bug.urgent && <span className="pill-urgent">URGENT</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    );
  }

/*
a)Por qué e.preventDefault() en onSubmit del form? 
Porque por defecto, los navegadores web manejan el evento submit de un 
<form> recargando la página completa e intentando enviar los campos 
como parámetros por URL o mediante una petición HTTP POST cruda. En una 
Single Page Application (SPA) basada en React, este comportamiento nativo 
rompería la aplicación por completo al destruir todo el estado que reside en 
memoria (useState, contextos, cachés de API). Ejecutar e.preventDefault() le 
indica al navegador que cancele su comportamiento heredado para permitir que 
nuestro código de JavaScript tome el control total del procesamiento de los 
datos de manera asíncrona y fluida sin parpadeos de pantalla.

b) ¿Qué diferencia hay entre onClick en un <div> y type="submit" en un form, 
respecto a Enter en el input?
La diferencia es crítica para la accesibilidad (a11y) y semántica nativa.
Al utilizar un <form> con un botón de type="submit", el navegador asocia 
implícitamente todos los inputs internos con el desencadenador del formulario. 
Si el usuario presiona la tecla Enter estando enfocado en cualquier input de 
texto, el navegador dispara automáticamente el evento onSubmit de forma nativa.
Si reemplazas esto por un simple <div> con un listener onClick, pierdes por 
completo esa automatización integrada. Para lograr que la tecla Enter funcione, 
te verías obligado a inyectar manejadores de teclado manuales (onKeyDown) en 
cada uno de los inputs para interceptar la tecla e imitar el submit. Además, 
dejas desamparados a los usuarios de lectores de pantalla que navegan mediante 
comandos semánticos estándar del navegador.
*/
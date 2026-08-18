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


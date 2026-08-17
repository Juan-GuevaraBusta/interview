// Session 01 — H: Types (annotations & primitives)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// 1. Tipo Student: id: number, nombre: string, progress: number
// 2. formatProgress(student: Student): string  — asume que progress es number
// 3. loadStudent(json: unknown): Student
//    Sin librerías. Sin `any`.
//    Elige UNA: devolver "como Student" a ciegas, O rechazar datos inválidos.
//    Debajo del código: 2–4 frases de trade-off.
// 4. Con { id: 1, nombre: "Ana", progress: null }:
//    ¿qué pasa en compile-time? ¿qué pasa si llamas formatProgress?
//
// Cuando termines, pega el código + justificación en el chat para evaluación.

interface Student {
    id: number;
    nombre: string;
    progress: number;
}

function formatProgress(student: Student): string {
    return `${student.nombre} is ${student.progress}% complete`;
}

function loadStudent(json: unknown): Student {
    if(typeof json !== 'object' || json === null) {
        throw new Error('Invalid JSON');
    }
    const obj = json as Record<string, unknown>;
    //Se valida cada propiedad antes de convertir a student
    if(typeof obj.id !== 'number' ||
    typeof obj.nombre !== 'string' ||
    typeof obj.progress !== 'number'){
        throw new Error('Invalid Student');
    }
    return {
        id: obj.id as number,
        nombre: obj.nombre as string,
        progress: obj.progress as number
    };
}

/* 
4. Con { id: 1, nombre: "Ana", progress: null }:
Compile-time: ✅ Compila sin error.
Razón: El JSON viene de la red en runtime; el compilador no lo ve.
Si escribieras este literal en código (const s: Student = {...}), 
sí fallaría porque progress es null, no number.
Runtime: ❌ loadStudent lanza Error('Invalid Student').
Razón: El guard typeof obj.progress !== 'number' es true; null no es number.
formatProgress nunca se ejecuta porque la excepción se lanza antes.
*/
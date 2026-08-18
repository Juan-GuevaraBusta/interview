// Session 01 — H: Unions (discriminated unions)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Una aplicación de tareas. Las tareas tienen diferentes ESTADOS.
// Cada estado tiene DATOS DIFERENTES.
//
// Estados:
// - PENDING: id, titulo, createdAt
// - IN_PROGRESS: id, titulo, createdAt, assignedTo, startedAt
// - COMPLETED: id, titulo, createdAt, assignedTo, startedAt, completedAt, result
// - FAILED: id, titulo, createdAt, error
//
// TAREAS:
//
// 1. Define una discriminated union `Task` con los 4 estados arriba.
//    (Usa un campo discriminante como `status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'`)
//
// 2. Escribe getTaskInfo(task: Task): string
//    Retorna información diferente según el estado.
//    Sin `any`. Usa narrowing.
//
// 3. Escribe canAssign(task: Task): boolean
//    Retorna true si es PENDING (sin asignar).
//    Retorna false para otros estados.
//
// 4. Responde:
//    a) ¿Por qué discriminated union es mejor que múltiples campos opcionales?
//    b) ¿Qué pasa si alguien intenta acceder a task.result sin verificar COMPLETED?
//
// Cuando termines, pega el código + respuestas en el chat.

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface BaseTask {
    id: string;
    title: string;
    createdAt: Date;
}

export type Task = 
    | (BaseTask & { status: 'PENDING'})
    | (BaseTask & {status: 'IN_PROGRESS', assignedTo: string, startedAt: Date})
    | (BaseTask & { status: 'COMPLETED'; assignedTo: string; startedAt: Date; completedAt: Date; result: string })
    | (BaseTask & { status: 'FAILED'; error: string });

export function getTaskInfo(task: Task): string{
    switch(task.status){
        case 'PENDING':
            return `task ${task.title} is pending`;
        case 'IN_PROGRESS':
            return `task ${task.title} in progress`;
        case 'COMPLETED':
            return `task ${task.title} completed at ${task.completedAt.toISOString()}`;
        case 'FAILED':
            return `task ${task.title} failed`;
        default:{
            const _exhaustiveCheck: never = task;
            return _exhaustiveCheck;
        }
    }
}

export function canAssign(task: Task): boolean{
    return task.status === 'PENDING';
}

/*
a) discriminated union es mejor que multiples campos opcionales
porque permite que el codigo UI hace una imagen del estado exacto
de la tarea, evitando el riesgo que un componente 

b) si alguien intenta acceder a task.result sin verificar COMPLETED, 
typescript lanzará un error que la propiedad no existe en el tipo de 
tarea, y protege al UI de un runtime error
*/
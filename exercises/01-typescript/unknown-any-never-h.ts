// Session 01 — H: unknown / any / never
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Recibes JSON de localStorage y de una API. Debes parsear y usar sin any.
//
// TAREAS:
//
// 1. Escribe parseStorage(raw: string): unknown
//    Usa JSON.parse. Retorna unknown (NO any).
//
// 2. Escribe isSettings(value: unknown): value is Settings
//    Settings = { theme: 'light' | 'dark'; fontSize: number }
//    Valida con narrowing (sin as Settings).
//
// 3. Escribe loadSettings(raw: string): Settings
//    parseStorage → isSettings → retorna Settings o throw Error.
//
// 4. Escribe assertNever(value: never): never
//    Función que siempre tira. Úsala en un switch exhaustivo sobre:
//    type LoadState = { status: 'idle' } | { status: 'loading' } | { status: 'error'; message: string }
//    Función getLoadMessage(state: LoadState): string con default + assertNever.
//
// 5. Responde:
//    a) ¿Qué bug concreto previene isSettings vs (value as Settings)?
//    b) ¿Qué pasa si agregas { status: 'success' } a LoadState y olvidas el case?
//
// Cuando termines, avísame.

export type Settings = {
    theme: 'light' | 'dark'
    fontSize: number
}

export type loadingState = 
    | {status: 'idle'}
    | {status: 'loading'}
    | {status: 'error'; message: string}


export function parseStorage(raw: string): unknown{
    try{
        return JSON.parse(raw) as unknown
    }catch{
        return null;
    }
}


export function isSettings(value: unknown): value is Settings {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }
    const target = value as Record<string, unknown>;
    if (!('theme' in target) || !('fontSize' in target)) {
        return false;
    }
    const hasValidTheme = target.theme === 'light' || target.theme === 'dark';
    const hasValidFontSize = typeof target.fontSize === 'number';

    return hasValidTheme && hasValidFontSize;
}

export function loadSettings(raw: string): Settings{
    const parsed = parseStorage(raw)

    if(!isSettings(parsed)){
        throw new Error('Invalid settings')
    }

    return parsed
}

export function assertNever(value: never): never{
    throw new Error('Architecture error')
}

export function getLoadMessage(state: loadingState): string{
    switch(state.status){
        case 'idle':
            return 'Ready to fetch';
        case 'loading':
            return 'wait...';
        case 'error':
            return 'operation cancelled';
        default:
            return assertNever(state);
    }
}

/*
El bug que previene es de la asimilacion silenciosa de datos corruptos para 
la prevención de datos no esperados en el sistema, por ejemplo, si type fuera blue
y no tenemos la funcion de isSettings, produciría un error en la UI

b) si agrego un status:success y olvido completamente el state, 
TypeScript disparará inmediatamente un error en compile-time dentro 
del bloque switch. Al añadir un nuevo miembro a la unión de tipos
 (LoadState), la evaluación del switch dejará de ser exhaustiva. 
 En la línea return assertNever(state);, el tipo de state ya no 
 se reducirá a never, sino que contendrá la estructura 
 { status: 'success' }
*/
// Session 01 — H: Narrowing (type guards & safety)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Formulario web que valida diferentes tipos de entrada.
// Usuarios envían datos que pueden ser string, number, object, o null.
// Necesitas validar con NARROWING (seguro), no casting.
//
// TAREAS:
//
// 1. Define tipos:
//    - FormInput = string | number | object | null
//    - User = { id: number; name: string }
//    - ValidationError = { field: string; message: string }
//
// 2. Escribe validateEmail(input: FormInput): boolean
//    Narrowea a string, valida email (regex simple).
//    Retorna true si válido, false sino.
//
// 3. Escribe parseUser(input: FormInput): User | ValidationError
//    Si es object con id y name, retorna User.
//    Si no, retorna error de validación.
//    USA NARROWING, NO CASTING.
//
// 4. Responde:
//    a) ¿Qué hubiera pasado si usaras const user = input as User sin validar?
//    b) ¿Por qué parseUser es más seguro que const user: User = input as any?
//
// Cuando termines, pega el código + respuestas en el chat.

export type formInput = string | number | object | null;

export type User = {
    readonly id: number;
    name: string;
}

export type validationError = {
    field: string;
    message: string;
}

export function validateEmail(input: formInput): boolean{
    if(typeof input != 'string'){
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseUser(input: formInput): User | validationError{
    const genericError = {
        field: 'user',
        message: 'Invalid structure payload'
    };

    if(!isRecord(input)){
        return genericError
    }
    if(typeof input.id === 'number' && typeof input.name === 'string'){
        return{
            id: input.id,
            name: input.name
        };
    }
    return genericError
}

/*
a) si envío un objeto como const user, le estaría mintiendo al compilador
ya que le estaría asegurando de que el usuario no envió un null o un string vacío
a través del formulario, lo cual no es verificable a menos de que implementaramos
la solucion que se propuso. Typescript asumiria a ciegas que el objeto tiene
tanto un id como un name, si se llegara a hacer user.name.toUpperCase(), y
el nombre estaría vacío, eso dispararía un error

b)parseUser usa una arquitectura defensiva en runtime, y usar as any 
destruye el sistema de tipos de typescript y no genera ninguna validacion
real en el javascript que corre en el navegador del cliente.

parseUser inspecciona fisicamente el objeto y verifica que las propiedades existan,
valida sus tipos uno por uno y provee un validationError en dado caso de que 
encuentre un error
*/
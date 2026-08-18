// Session 01 — H: Utility Types (Pick, Omit, Partial, Readonly)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// API de blog. Posts tienen id (server), title, content, authorId, publishedAt.
// Necesitas DTOs derivados con utility types — sin duplicar la interfaz base.
//
// TAREAS:
//
// 1. Define interface Post:
//    - id: number
//    - title: string
//    - content: string
//    - authorId: number
//    - publishedAt: Date | null
//
// 2. Deriva estos tipos (usa utility types, NO reescribas a mano):
//    - CreatePostInput   → todo menos id y publishedAt (cliente crea borrador)
//    - UpdatePostInput   → PATCH parcial, sin id ni authorId
//    - PostPreview       → solo id, title, publishedAt (para listados)
//    - ImmutablePost     → Post de solo lectura
//
// 3. Implementa:
//    - createPost(input: CreatePostInput): Post
//      Genera id mock (Date.now()) y publishedAt = null.
//    - updatePost(current: Post, patch: UpdatePostInput): Post
//      Merge seguro. No debe permitir cambiar id ni authorId vía patch (tipos ya lo impiden).
//    - toPreview(post: Post): PostPreview
//
// 4. Responde:
//    a) ¿Por qué UpdatePostInput omite authorId además de id?
//    b) ¿Qué bug evita Readonly<Post> en compile-time que Partial no evita?
//
// Cuando termines, avísame para evaluación.

export interface Post { 
    readonly id: number;
    title: string;
    content: string;
    authorId: number;
    publishedAt: Date | null
}

type CreatePostInput = Omit<Post, 'id' | 'publishedAt'>;
type UpdatePostInput = Partial<Omit<Post, 'id' | 'authorId'>>;
type PostPreview = Pick<Post, 'id' | 'title' | 'publishedAt'>;
type ImmutablePost = Readonly<Post>

export function createPost(input: CreatePostInput): Post{
    return{
        ...input,
        id: Date.now(),
        publishedAt: null
    };
}

export function updatePost(current: Post, patch: UpdatePostInput): Post{
    return{
        ...current,
        ...patch
    };
}

export function toPreview(post: Post): PostPreview{
    return{
        id: post.id,
        title: post.title,
        publishedAt: post.publishedAt
    };
}

/*
a) Porque el modificar el iD podría cambiar la propiedad intelectual
del escritor de alguno de estos libros, asi que por temas de seguridad,
o por si existe un mal patch, esto evita que de alguna forma updatePost
pueda generar algun cambio ilegal en tiempo de ejecucion

b)Con Partial<Post>, todas las propiedades son opcionales, pero siguen siendo modificables. Podrías hacer post.title = "Nuevo Título" y TypeScript no protestará, lo cual rompe arquitecturas basadas en flujos unidireccionales de datos (como el estado de React, Redux o Zustand), causando que la UI no se entere del cambio o se comporte de forma errática.Con Readonly<Post>, el compilador congela el objeto. Si intentas hacer post.title = "Nuevo Título", TypeScript arrojará inmediatamente un compile-time error: Cannot assign to 'title' because it is a read-only property. Te obliga a tratar los datos como inmutables, forzándote a usar destrucción de objetos ({ ...post }) para cualquier actualización segura.
*/
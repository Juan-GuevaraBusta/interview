// Session 02 — H: React JSX + Components
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Dashboard de un curso. Muestras una lista de lecciones y un header.
// Componentes pequeños, tipados, sin any.
//
import React from 'react'
// TAREAS:
//
// 1. Define:
//    type Lesson = { id: string; title: string; durationMin: number; completed: boolean }
//

export type Lesson = {
    readonly id: string;
    title: string;
    durationMin: number;
    completed: boolean;
}
// 2. LessonItem(props): muestra title, durationMin, y "Done" o "Pending"
//    según completed. Tipa las props. No mutes props.

export type LessonItemProps = {
    readonly lesson: Lesson;
}

export type LessonListProps = {
    readonly lessons: readonly Lesson[];
}

export type CourseHeaderProps = {
    readonly title: string;
    readonly children?: React.ReactNode;
}
//
// 3. LessonList({ lessons }: { lessons: Lesson[] }):
//    Si lessons está vacío, renderiza <p>No lessons</p>.
//    Si no, un <ul> con LessonItem. USA key={lesson.id}, NO index.
//
// 4. CourseHeader({ title, children }: { title: string; children?: React.ReactNode })
//    Renderiza h1 + children (composición).
//
// 5. App: CourseHeader wrapping un párrafo de descripción + LessonList con 2–3
//    lecciones mock (al menos una completed y una no).
//
// 6. Responde:
//    a) ¿Por qué key={index} es un problema si reordenas o filtras la lista?
//    b) ¿Qué se evalúa primero: el JSX o las expresiones dentro de { }?
//
// Cuando termines, avísame.


export function LessonItem({lesson}: LessonItemProps): React.JSX.Element{
    const statusLabel = lesson.completed ? 'Done' : 'Pending';
    const statusClassName = `status-${lesson.completed ? 'success' : 'warning'}`;

    return (
        <li className="lesson-item">
            <span className = "lesson-title">{lesson.title}</span>
            <span className = "lesson-duration">({lesson.durationMin} min)</span>
            <span className = {statusClassName}>{statusLabel}</span>
        </li>
    );
}

export function LessonList({lessons}: LessonListProps): React.JSX.Element{
    if(lessons.length == 0){
        return <p className = "no-data-alert">No lessons available for this module</p>
    }
    return (
        <ul className="lessons-container">
          {lessons.map((lesson) => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </ul>
      );
}

export function CourseHeader({title, children}: CourseHeaderProps): React.JSX.Element{
    return(
        <header className = "course-header">
            <h1 className = "header-title">{title}</h1>
            {children && <div className = "header-meta-slots">{children}</div>}
        </header>
    );
}

const MOCK_LESSONS: readonly Lesson[] = [
    { id: 'les_001', title: 'Introduction to Strict Types', durationMin: 15, completed: true },
    { id: 'les_002', title: 'Mastering TypeScript Generics', durationMin: 45, completed: false },
    { id: 'les_003', title: 'Advanced Compound Components', durationMin: 30, completed: true },
];

export default function App(): React.JSX.Element{
    return(
        <main className = "dashboard-wrapper">
            <CourseHeader title = "Advanced architecture in react and typescript">
                <p className = "course description">
                    Scaling applications
                </p>
            </CourseHeader>

            <section className = "dashboard-content">
                <h2 className = "section-title">Syllabus overview</h2>
                <LessonList lessons = {MOCK_LESSONS}/>
            </section>
        </main>
    );
}

/*
a) porque rompe el algoritmo de reconciliacion del virtual DOM de react el index de un arreglo
no está atado a la identidad intrínseca del dato, sino a su posicion fisica momentanea
Si se filtra o se invierte la lista, el valor que estaba en index : 0 será borrado y ahora tendrá
datos distintos pero react pensara que es el mismo elemento porque ambos tienen index 0

b)Se evalúan primero las expresiones que se encuentran dentro de las llaves { }.
Debido a que el JSX se compila directamente en llamadas de funciones de JavaScript 
(React.createElement o _jsx), los valores que pasas dentro de las llaves actúan 
como los argumentos de dicha función

*/
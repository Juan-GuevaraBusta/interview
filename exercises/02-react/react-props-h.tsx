// Session 02 — H: React Props
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Toolbar de un editor. El padre posee los datos; los hijos solo reciben props.
//
// TAREAS:
//
// 1. type User = { id: string; name: string; role: 'admin' | 'editor' | 'viewer' }
//
// 2. Avatar({ name, size? }: { name: string; size?: 'sm' | 'md' | 'lg' })
//    Default size = 'md'. Muestra la inicial de name. No mutes props.
//
// 3. RoleBadge({ role }: { role: User['role'] })
//    Texto distinto por role (usa el prop, no un lookup global mutable).
//
// 4. UserChip({ user, onSelect }: { user: User; onSelect: (id: string) => void })
//    Renderiza Avatar + RoleBadge + name.
//    Botón que llama onSelect(user.id) — el padre decide qué hacer.
//    NO pongas console.log del “negocio” dentro de UserChip (eso es del padre).
//
// 5. Toolbar: lista de 2 users. onSelect en el padre: solo setea selectedId
//    (puedes usar useState aquí; el chip no debe guardar selectedId).
//    Pasa una prop selected?: boolean a UserChip si quieres highlight.
//
// 6. Responde:
//    a) ¿Por qué onSelect vive en el padre y no dentro de UserChip?
//    b) ¿Qué pasa si haces user.role = 'admin' dentro de Avatar? ¿Por qué está mal
//       aunque TypeScript a veces no lo evite si User no es readonly?
//
// Cuando termines, avísame.

import React, {useState} from 'react'

export type User = {
    readonly id: string;
    name: string;
    role: 'admin' | 'editor' | 'viewer';
};

export type AvatarProps = {
    name: string;
    size?: 'sm' | 'md' | 'lg';
};

export type RoleBadgeProps = {
    readonly role: User['role'];
};

export type UserChipProps = {
    readonly user: User;
    readonly selected?: boolean;
    readonly onSelect: (id: string) => void;
}

export function Avatar({name, size = 'md'}: AvatarProps): React.JSX.Element{
    const initial = name.trim().charAt(0).toUpperCase() || '?';
    const avatarClassName = `avatar avatar-${size}`

    return(
        <div className = {avatarClassName}>
            <span className = "avatar-text">{initial}</span>
        </div>
    );
}

export function RoleBadge({role} : RoleBadgeProps): React.JSX.Element { 
    const roleLabels: Record<User['role'], string> = {
        admin: 'Administrator',
        editor: 'Editor',
        viewer: 'Read only',
    }

    return (
        <span className = {`badge badge-${role}`}>
            {roleLabels[role]}
        </span>
    );
}

export function UserChip({user, selected = false, onSelect}: UserChipProps): React.JSX.Element { 
    const chipClassName = `user-chip ${selected ? 'chip-active' : 'chip-idle'}`;

    return(
        <button
            type = "button"
            className = {chipClassName}
            onClick = {() => onSelect(user.id)}>
            
            <Avatar name = {user.name} size = "sm"/>
            <span className = 'user-name'>{user.name}</span>
            <RoleBadge role = {user.role}/>
        </button>
    );
}

const MOCK_TEAM: readonly User[] = [
    { id: 'usr_901', name: 'Diana Prince', role: 'admin' },
    { id: 'usr_902', name: 'Bruce Wayne', role: 'editor' },
];

export function Toolbar() : React.JSX.Element{
    const [selectedId, setSelectedId] = useState<string | null > (null);
    const handleSelectedUser = (id : string): void => {
        setSelectedId(id);
    };
    return (
        <nav className="toolbar-container" aria-label="Team Editor Access">
          <div className="toolbar-users">
            {MOCK_TEAM.map((member) => (
              <UserChip
                key={member.id}
                user={member}
                selected={member.id === selectedId}
                onSelect={handleSelectedUser}
              />
            ))}
          </div>
          
          {selectedId && (
            <div className="toolbar-feedback">
              <p>Active Context: <strong>{selectedId}</strong></p>
            </div>
          )}
        </nav>
      );
}

/*
a) Porque UserChip es un componente de UI puramente presentacional. El chip no
tiene el contexto ni el alcance para saber si su selección debe mutar
el estado global de una aplicación, abrir un modal de confirmación o
disparar un fetch a una API. Al delegar el callback al Padre mediante
onSelect, mantienes el flujo unidireccional de datos (Data flows down,
events flow up).

b) ¿Qué pasa si haces user.role = 'admin' dentro de Avatar? 
¿Por qué está mal aunque TypeScript a veces no lo evite si User no es readonly?
Si haces esa mutación directa, estarás rompiendo el principio fundamental de
inmutabilidad de React. Aunque el JavaScript del navegador lo ejecute
(y TypeScript no proteste si olvidaste marcar el objeto como readonly),
estás alterando la referencia original del dato por detrás del ciclo de 
vida de React. Esto produce desincronizaciones críticas: React no sabrá 
que el dato cambió porque no se utilizó un despachador de estado (useState),
impidiendo que el motor ejecute un re-render de la UI. Como resultado, la
interfaz mostrará información vieja o corrupta, rompiendo la predictibilidad 
del flujo de renderizado y dificultando severamente el rastreo de bugs.
*/
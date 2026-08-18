// Session 02 — H: React Forms (controlled vs uncontrolled)
// Escribe TÚ el código. El entrenador no implementa esta solución.
//
// ESCENARIO:
// Login + un campo de búsqueda “uncontrolled” para contrastar.
//
// TAREAS:
//
// 1. type Credentials = { email: string; password: string }
//
// 2. LoginForm({ onLogin }: { onLogin: (c: Credentials) => void })
//    - email y password CONTROLADOS (useState).
//    - onSubmit: preventDefault.
//    - Si email no incluye "@" O password.length < 8:
//        setea error, return. NO llames onLogin.
//    - Si es válido: onLogin({ email: email.trim(), password }), luego limpia campos y error.
//
// 3. SearchBox: UNCONTROLLED
//    - input con defaultValue="" y ref (useRef<HTMLInputElement>).
//    - Botón "Search" lee ref.current.value y llama onSearch(query: string).
//    - El padre SearchLog solo acumula queries en un array (inmutable).
//
// 4. AuthPanel: combina LoginForm + SearchBox.
//    onLogin: guarda lastUser: Credentials | null en state (no hagas fetch).
//
// 5. Responde:
//    a) ¿Cuándo preferirías uncontrolled (ref) vs controlled?
//    b) En LoginForm, ¿por qué el error debe hacer return ANTES de onLogin?
//       (relaciona con el bug de BugForm si lo viste)
//
// Cuando termines, avísame.

import React, {useState, useRef} from 'react'

export type Credentials = {
    readonly email: string;
    readonly password: string;
};
  
  export type LoginFormProps = {
    readonly onLogin: (credentials: Credentials) => void;
};
  
  export type SearchBoxProps = {
    readonly onSearch: (query: string) => void;
};

export function LoginForm({ onLogin }: LoginFormProps): React.JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
  
      // Structural Validation Pipeline
      const isInvalidEmail = !email.includes('@');
      const isInvalidPassword = password.length < 8;
  
      if (isInvalidEmail || isInvalidPassword) {
        setError('Authentication failed: Provide a valid email and an 8+ character password.');
        return; // Fail-fast block: Abort sequence execution immediately
      }
  
      // Success dispatching path
      onLogin({ email: email.trim(), password });
      
      // Reset transient visual state variables cleanly
      setEmail('');
      setPassword('');
      setError(null);
    };
  
    return (
      <form onSubmit={handleSubmit} className="auth-form-card" noValidate>
        <h3>Secure Identity Sign-In</h3>
        
        <div className="input-field-group">
          <label htmlFor="login-email-input">Corporate Email:</label>
          <input
            id="login-email-input"
            type="email"
            value={email} // Driven explicitly by React memory cycles
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@enterprise.com"
          />
        </div>
  
        <div className="input-field-group">
          <label htmlFor="login-password-input">Account Password:</label>
          <input
            id="login-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
  
        {error && <p className="form-error-banner" role="alert">{error}</p>}
  
        <button type="submit" className="btn btn-auth-action">
          Authenticate Session
        </button>
      </form>
    );
  }

export function SearchBox({ onSearch }: SearchBoxProps): React.JSX.Element {
  // Directly references the physical DOM input layout boundary
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchTrigger = (): void => {
    // Read directly from the browser DOM buffer node on demand
    const queryValue = searchInputRef.current?.value;
    
    if (typeof queryValue === 'string') {
      onSearch(queryValue.trim());
    }
  };

  return (
    <div className="search-box-widget">
      <label htmlFor="widget-search-input">Global Registry Search:</label>
      <div className="search-input-wrapper">
        <input
          id="widget-search-input"
          type="text"
          defaultValue="" // Initial DOM attribute setup only; completely uncontrolled by state
          ref={searchInputRef}
          placeholder="Search metadata keys..."
        />
        <button type="button" onClick={handleSearchTrigger} className="btn btn-search">
          Execute Query
        </button>
      </div>
    </div>
  );
}

export function AuthPanel(): React.JSX.Element {
    const [lastUser, setLastUser] = useState<Credentials | null>(null);
    const [searchHistory, setSearchHistory] = useState<readonly string[]>([]);
  
    const handleLoginSuccess = (credentials: Credentials): void => {
      setLastUser(credentials);
    };
  
    const handleNewSearchQuery = (query: string): void => {
      if (query === '') return;
      // Strict immutable array state shallow copy manipulation
      setSearchHistory((prevHistory) => [...prevHistory, query]);
    };
  
    return (
      <main className="auth-panel-container">
        <section className="login-module">
          <LoginForm onLogin={handleLoginSuccess} />
          {lastUser && (
            <div className="session-feedback-success">
              <p>Authenticated Session Identity: <code>{lastUser.email}</code></p>
            </div>
          )}
        </section>
  
        <section className="search-module">
          <SearchBox onSearch={handleNewSearchQuery} />
          <div className="search-log-output">
            <h4>Audited Log Queries ({searchHistory.length})</h4>
            {searchHistory.length === 0 ? (
              <p className="empty-log-msg">No active searches recorded in this lifecycle context.</p>
            ) : (
              <ul className="history-query-list">
                {searchHistory.map((term, index) => (
                  <li key={`${term}_${index}`}>{term}</li> // Fallback compound key since values aren't unique IDs
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    );
  }

/*
a) ¿Cuándo preferirías uncontrolled (ref) vs controlled?
Preferirías controlled cuando necesites validaciones en tiempo real,
formateo de texto inmediato o habilitar componentes dinámicamente según 
lo que escribe el usuario. En cambio, preferirías uncontrolled (refs) 
en campos de captura única como barras de búsqueda sencillas para evitar 
re-renders masivos e innecesarios en la interfaz.

b) En LoginForm, ¿por qué el error debe hacer return ANTES de onLogin?
El return actúa como un disyuntor que corta la ejecución inmediatamente e 
impide que la aplicación despache credenciales inválidas hacia el servidor. 
Si omites el return, la interfaz pintará el mensaje de error visual pero 
enviará de todos modos los datos corruptos, provocando un bug de falsa aprobación 
en el sistema.
*/
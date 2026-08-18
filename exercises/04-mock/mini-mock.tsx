// MINI MOCK — 50 min. Entrevista. El entrenador no implementa.
// Reloj: cuando termines, avísame. No pidas pistas.
//
// Inbox de tickets (TypeScript + React + async). Sin Next. Sin librerías.
//
// CONTRATO:
//   Ticket        { id: string; title: string; status: 'open' | 'closed' }
//   TicketDetail  Ticket & { body: string }
//
// UI:
//   1. Input de búsqueda controlado (query).
//   2. Lista de tickets que coinciden con query.
//   3. Click en un ticket → panel de detalle (title, status, body).
//
// COMPORTAMIENTO:
//   4. Query vacía → lista vacía, sin petición.
//   5. Si query cambia, resultados viejos NO deben pintar encima de los nuevos.
//   6. Si el detalle en vuelo se cancela (otro ticket o unmount), NO pintes error.
//   7. id === 'gone' → fallo estilo 404. No lo trates como TicketDetail.
//   8. Loading y error visibles. Retry solo en error de detalle.
//
// DATOS:
//   Mock permitido (delay corto). Strict TypeScript. Sin `any`.
//   fetchTickets(query) / fetchTicketDetail(id) — las escribes tú.
//
// Cuando termines, avísame.

import React, {useState, useCallback, useEffect, useRef} from 'react'

export type TicketStatus = 'open' | 'closed';

export type Ticket = {
    readonly id: string;
    title:string
    status: TicketStatus
};

export type TicketDetail = Ticket & {
    body: string;
};

export async function fetchTickets(query: string, signal: AbortSignal): Promise<readonly Ticket[]>{
    if(!query.trim()){
        return [];
    }

    if(signal.aborted){
        throw signal.reason || new DOMException('User interrupted', 'AbortError');
    }

    await new Promise((resolve) => setTimeout(resolve, 150));

    const databaseMock: readonly Ticket[] = [
        { id: 'tkt_01', title: 'Fatal crash on payment gateway checkout', status: 'open' },
        { id: 'tkt_02', title: 'Localization assets missing in sidebar navigation', status: 'closed' },
        { id: 'tkt_03', title: 'Database record corruption after patch update', status: 'open' },
        { id: 'gone',   title: 'Archived legacy memory leak defect', status: 'closed' }
      ];

    return databaseMock.filter(ticket => 
        ticket.title.toLowerCase().includes(query.toLowerCase().trim())
    );
}

export async function fetchTicketDetail(id: string, signal: AbortSignal): Promise<TicketDetail>{
    if(signal.aborted){
        throw signal.reason || new DOMException('User interrupted operation', 'AbortError');
    }

    await new Promise((resolve, reject) =>{
        const timeoutId = setTimeout(resolve, 250);
        signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
            reject(signal.reason || new DOMException('User interrupted operation', 'AbortError'));
        });
    });

    if(id === 'gone'){
        throw new Error('ticket not found');
    }
    const detailLookup: Record<string, { title: string; status: TicketStatus; body: string }> = {
        tkt_01: { title: 'Fatal crash on payment gateway checkout', status: 'open', body: 'Uncaught TypeError: Cannot read properties of undefined reading stripePublicKey in prod bundle chunks.' },
        tkt_02: { title: 'Localization assets missing in sidebar navigation', status: 'closed', body: 'Spanish and French translation keys missing in locales/es.json schema definitions.' },
        tkt_03: { title: 'Database record corruption after patch update', status: 'open', body: 'SQL unique constraint violations occurring across user profile update operations during cluster replication.' }
      };

    const record = detailLookup[id];
    if(!record){
        throw new Error('ticket not found');
    }
    return{
        id,
        ...record,
    };
}

type DetailPanelProps = {
    readonly ticketId: string;
};

export function DetailPanel({ticketId}: DetailPanelProps): React.JSX.Element{
    const [Detail, setDetail] = useState<TicketDetail | null> (null);
    const [error, setError] = useState<Error | null> (null);
    const[isLoading, setIsLoading] = useState(false);
    const [retryNonce, setRetryNonce] = useState(0);

    const triggerRetry = useCallback(() => {
        setRetryNonce(prev => prev + 1);
      }, []);
    
      useEffect(() => {
        const controller = new AbortController();
        
        const executeLoad = async (): Promise<void> => {
          setIsLoading(true);
          setError(null);
          try {
            const data = await fetchTicketDetail(ticketId, controller.signal);
            setDetail(data);
          } catch (err) {
            // Task Requirement 6: Silence AbortError signals completely from state mutation
            if (err instanceof DOMException && err.name === 'AbortError') return;
            
            setDetail(null);
            setError(err instanceof Error ? err.message : 'Unknown network failure.');
          } finally {
            if (!controller.signal.aborted) {
              setIsLoading(false);
            }
          }
        };
    
        executeLoad();
    
        return () => controller.abort(); // Automatic teardown protects state bounds on unmount/id change
      }, [ticketId, retryNonce]);
    
      return (
        <aside className="ticket-detail-panel" aria-live="polite">
          <h4>System Inspection View</h4>
          {isLoading && <p className="shimmer">Loading operational tracking telemetry...</p>}
          
          {error && (
            <div className="alert alert-danger" role="alert">
              <p>{error}</p>
              <button type="button" onClick={triggerRetry} className="btn btn-retry">🔄 Re-evaluate Logs</button>
            </div>
          )}
    
          {detail && !isLoading && !error && (
            <article className="detail-canvas">
              <h5>[{detail.id}] — {detail.title}</h5>
              <span className={`status-pill pill-${detail.status}`}>{detail.status.toUpperCase()}</span>
              <div className="code-block-body">
                <pre><code>{detail.body}</code></pre>
              </div>
            </article>
          )}
        </aside>
      );
    }
    
    // ============================================================================
    // 4. MAIN WORKSPACE CONSOLE ORCHESTRATOR
    // ============================================================================
    export default function TicketInboxWorkspace(): React.JSX.Element {
      const [query, setQuery] = useState<string>('');
      const [tickets, setTickets] = useState<readonly Ticket[]>([]);
      const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
      const [isSearching, setIsSearching] = useState<boolean>(false);
      const [searchError, setSearchError] = useState<string | null>(null);
    
      useEffect(() => {
        const controller = new AbortController();
        const cleanQuery = query.trim();
    
        // Task Requirement 4: Empty query states bypass remote network streams entirely
        if (cleanQuery === '') {
          setTickets([]);
          setIsSearching(false);
          setSearchError(null);
          return;
        }
    
        const executeSearch = async (): Promise<void> => {
          setIsSearching(true);
          setSearchError(null);
          try {
            const matches = await fetchTickets(cleanQuery, controller.signal);
            // Task Requirement 5: Guarantees stale flight arrays cannot overwrite newer execution chains
            setTickets(matches);
          } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setSearchError(err instanceof Error ? err.message : 'Internal pipeline search error.');
          } finally {
            if (!controller.signal.aborted) {
              setIsSearching(false);
            }
          }
        };
    
        executeSearch();
    
        return () => controller.abort(); // Structural cleanups execute prior to next keystroke or layout demolition
      }, [query]);
    
      return (
        <main className="workspace-inbox-layout">
          <section className="inbox-search-navigation">
            <header className="inbox-header">
              <h2>Defect Tracking Engine</h2>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search operational logging systems..."
                className="search-control-node"
                aria-label="Filter tickets through titles"
              />
            </header>
    
            <div className="inbox-results-stream">
              {isSearching && <p className="stream-loading-indicator">Querying ledger records...</p>}
              {searchError && <p className="alert alert-warning">{searchError}</p>}
              
              {!isSearching && query.trim() !== '' && tickets.length === 0 && (
                <p className="empty-stream-msg">Zero historical entries match criteria.</p>
              )}
    
              <ul className="ticket-vector-list">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className={`ticket-row-node ${selectedTicketId === ticket.id ? 'active' : ''}`}>
                    <button 
                      type="button" 
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className="interactive-row-trigger"
                    >
                      <span className="row-title">{ticket.title}</span>
                      <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
    
          <section className="inbox-inspection-sidebar">
            {selectedTicketId ? (
              <TicketDetailPanel key={selectedTicketId} ticketId={selectedTicketId} />
            ) : (
              <div className="empty-panel-placeholder">
                <p>Select an inventory defect marker row to evaluate system telemetry payload strings.</p>
              </div>
            )}
          </section>
        </main>
      );
    }


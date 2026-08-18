// MINI MOCK 02 — referencia resuelta (no es el ejercicio bajo presión).
//
// Directorio: búsqueda + detalle.
// Detalle REQUERIDO en paralelo (profile + reports). Kudos OPCIONALES (allSettled).
// Abort en vuelo. HTTP-like 404. AbortError ≠ error de UI.

import React, { useCallback, useEffect, useState } from 'react';

export type Employee = {
  readonly id: string;
  name: string;
  title: string;
};

export type Report = {
  readonly id: string;
  title: string;
};

export type Kudo = {
  readonly id: string;
  text: string;
};

export type EmployeeDetail = {
  profile: Employee;
  reports: readonly Report[];
  kudos: readonly Kudo[];
};

type ListState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; items: readonly Employee[] }
  | { status: 'error'; message: string };

type DetailState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: EmployeeDetail }
  | { status: 'error'; message: string };

function abortError(): DOMException {
  return new DOMException('Aborted', 'AbortError');
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/** Delay que SÍ muere si abortan a mitad. Sin esto, el Promise resuelve igual. */
function delay(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason ?? abortError());
      return;
    }
    const timeoutId = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        reject(signal.reason ?? abortError());
      },
      { once: true },
    );
  });
}

const DIRECTORY: readonly Employee[] = [
  { id: 'e_01', name: 'Ana Ruiz', title: 'Staff Engineer' },
  { id: 'e_02', name: 'Luis Mora', title: 'PM' },
  { id: 'missing', name: 'Ghost User', title: '—' },
];

export async function fetchEmployees(query: string, signal: AbortSignal): Promise<readonly Employee[]> {
  if (!query.trim()) return [];
  await delay(150, signal);
  const q = query.toLowerCase().trim();
  return DIRECTORY.filter((e) => e.name.toLowerCase().includes(q));
}

export async function fetchProfile(id: string, signal: AbortSignal): Promise<Employee> {
  await delay(200, signal);
  if (id === 'missing') throw new Error('HTTP 404');
  const row = DIRECTORY.find((e) => e.id === id);
  if (!row) throw new Error('HTTP 404');
  return row;
}

export async function fetchReports(id: string, signal: AbortSignal): Promise<readonly Report[]> {
  await delay(180, signal);
  if (id === 'missing') throw new Error('HTTP 404');
  return [{ id: `r_${id}`, title: `Q3 review (${id})` }];
}

export async function fetchKudo(id: string, signal: AbortSignal): Promise<Kudo> {
  await delay(120, signal);
  if (id.includes('fail')) throw new Error('kudo failed');
  return { id, text: `Kudo ${id}` };
}

/**
 * Profile + reports: Promise.all (uno falla → detalle falla).
 * Kudos: allSettled (uno falla → el resto se muestra).
 */
export async function fetchEmployeeDetail(id: string, signal: AbortSignal): Promise<EmployeeDetail> {
  const [profile, reports] = await Promise.all([
    fetchProfile(id, signal),
    fetchReports(id, signal),
  ]);

  const kudoIds = [`k_${id}_1`, `k_${id}_fail`, `k_${id}_2`];
  const settled = await Promise.allSettled(kudoIds.map((kid) => fetchKudo(kid, signal)));
  const kudos = settled
    .filter((r): r is PromiseFulfilledResult<Kudo> => r.status === 'fulfilled')
    .map((r) => r.value);

  return { profile, reports, kudos };
}

function EmployeeDetailPanel({
  employeeId,
}: {
  readonly employeeId: string;
}): React.JSX.Element {
  const [state, setState] = useState<DetailState>({ status: 'idle' });
  const [retry, setRetry] = useState(0);
  const onRetry = useCallback(() => setRetry((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const load = async (): Promise<void> => {
      setState({ status: 'loading' });
      try {
        const data = await fetchEmployeeDetail(employeeId, signal);
        if (signal.aborted) return;
        setState({ status: 'success', data });
      } catch (error) {
        if (isAbortError(error)) return;
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    };

    void load();
    return () => controller.abort();
  }, [employeeId, retry]);

  if (state.status === 'loading' || state.status === 'idle') {
    return <p>Loading detail…</p>;
  }
  if (state.status === 'error') {
    return (
      <div role="alert">
        <p>{state.message}</p>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <article>
      <h3>{state.data.profile.name}</h3>
      <p>{state.data.profile.title}</p>
      <ul>
        {state.data.reports.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
      <ul>
        {state.data.kudos.map((k) => (
          <li key={k.id}>{k.text}</li>
        ))}
      </ul>
    </article>
  );
}

export default function EmployeeDirectory(): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [list, setList] = useState<ListState>({ status: 'idle' });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const q = query.trim();

    if (q === '') {
      setList({ status: 'idle' });
      setSelectedId(null);
      return;
    }

    const search = async (): Promise<void> => {
      setList({ status: 'loading' });
      try {
        const items = await fetchEmployees(q, controller.signal);
        if (controller.signal.aborted) return;
        setList({ status: 'success', items });
      } catch (error) {
        if (isAbortError(error)) return;
        setList({
          status: 'error',
          message: error instanceof Error ? error.message : 'Search failed',
        });
      }
    };

    void search();
    return () => controller.abort();
  }, [query]);

  return (
    <main>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search employees"
      />

      {list.status === 'loading' && <p>Searching…</p>}
      {list.status === 'error' && <p role="alert">{list.message}</p>}
      {list.status === 'success' && list.items.length === 0 && <p>No matches</p>}
      {list.status === 'success' && (
        <ul>
          {list.items.map((e) => (
            <li key={e.id}>
              <button type="button" onClick={() => setSelectedId(e.id)}>
                {e.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedId ? (
        <EmployeeDetailPanel key={selectedId} employeeId={selectedId} />
      ) : (
        <p>Select an employee</p>
      )}
    </main>
  );
}

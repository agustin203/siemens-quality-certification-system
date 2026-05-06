import {
  type CertificationOperation,
  type CertificationProcess,
  type ProcessStatus,
} from '../pages/Processes/types';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/supabase/${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const processesService = {
  list(): Promise<{ data: CertificationProcess[] }> {
    return apiFetch('processes');
  },

  create(
    data: Pick<
      CertificationProcess,
      'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
    >,
  ): Promise<{ data: CertificationProcess }> {
    return apiFetch('processes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(
    id: string,
    data: Pick<
      CertificationProcess,
      'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
    >,
  ): Promise<{ data: CertificationProcess }> {
    return apiFetch(`processes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  setStatus(id: string, status: ProcessStatus): Promise<{ ok: boolean }> {
    return apiFetch(`processes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  listOperations(
    processId: string,
  ): Promise<{ data: CertificationOperation[] }> {
    return apiFetch(`operations?processId=${encodeURIComponent(processId)}`);
  },

  createOperation(
    processId: string,
    data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>,
  ): Promise<{ data: CertificationOperation }> {
    return apiFetch('operations', {
      method: 'POST',
      body: JSON.stringify({
        processId,
        nombre: data.nombre,
        tiempoEstandarSeg: data.tiempo_estandar_seg,
      }),
    });
  },

  updateOperation(
    id: string,
    data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>,
  ): Promise<{ data: CertificationOperation }> {
    return apiFetch(`operations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        nombre: data.nombre,
        tiempoEstandarSeg: data.tiempo_estandar_seg,
      }),
    });
  },

  deleteOperation(id: string): Promise<{ ok: boolean }> {
    return apiFetch(`operations/${id}`, { method: 'DELETE' });
  },
};

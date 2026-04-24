import { type CertificationRequest } from '../pages/Operator/types';

export type CreateCertificationInput = {
  operationId: string;
};

export type CancelCertificationInput = {
  id: string;
};

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

export const certificationsService = {
  /** Operator: their own certifications */
  listMine(): Promise<{ data: CertificationRequest[] }> {
    return apiFetch('certifications');
  },

  /** Operator: create new certification request */
  create(
    input: CreateCertificationInput,
  ): Promise<{ data: CertificationRequest }> {
    return apiFetch('certifications', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /** Operator: cancel an in-progress request */
  cancel(id: string): Promise<{ ok: boolean }> {
    return apiFetch(`certifications/${id}/cancel`, { method: 'PATCH' });
  },

  /** Fetch attempts for a specific certification request */
  listAttempts(requestId: string): Promise<{
    data: import('../pages/Operator/types').CertificationAttempt[];
  }> {
    return apiFetch(`attempts?requestId=${encodeURIComponent(requestId)}`);
  },

  /** Processes list */
  listProcesses(): Promise<{ data: { id: string; name: string }[] }> {
    return apiFetch('processes');
  },

  /** Operations by process */
  listOperations(processId: string): Promise<{
    data: { id: string; name: string; tiempo_estandar_seg: number }[];
  }> {
    return apiFetch(`operations?processId=${encodeURIComponent(processId)}`);
  },
};

export const oroService = {
  /** ORO: pending certifications to evaluate */
  listPending(): Promise<{
    data: import('../pages/ORO/types').PendingRequest[];
  }> {
    return apiFetch('oro/pending');
  },

  /** ORO: submit evaluation result */
  submitAttempt(data: {
    requestId: string;
    tiempoRegistradoSeg: number;
    result: 'passed' | 'failed';
  }): Promise<{ ok: boolean; newStatus: string; attemptNumber: number }> {
    return apiFetch('oro/attempt', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** ORO: history of conducted evaluations */
  listHistory(): Promise<{
    data: import('../pages/ORO/types').OroEvaluationRecord[];
  }> {
    return apiFetch('oro/history');
  },
};

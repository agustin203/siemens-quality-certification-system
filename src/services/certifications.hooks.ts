import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { certificationsService, oroService } from './certifications';

// ─── Query key factory ────────────────────────────────────────────────────────
export const certKeys = {
  all: ['certifications'] as const,
  mine: () => [...certKeys.all, 'mine'] as const,
  attempts: (requestId: string) =>
    [...certKeys.all, 'attempts', requestId] as const,
  processes: () => ['processes'] as const,
  operations: (processId: string) => ['operations', processId] as const,
  oroPending: () => ['oro', 'pending'] as const,
  oroHistory: () => ['oro', 'history'] as const,
};

// ─── Operator ─────────────────────────────────────────────────────────────────

export function useMyCertifications() {
  return useQuery({
    queryKey: certKeys.mine(),
    queryFn: () => certificationsService.listMine().then(r => r.data),
  });
}

export function useCertificationAttempts(requestId: string) {
  return useQuery({
    queryKey: certKeys.attempts(requestId),
    queryFn: () =>
      certificationsService.listAttempts(requestId).then(r => r.data),
    enabled: Boolean(requestId),
  });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (operationId: string) =>
      certificationsService.create({ operationId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: certKeys.mine() }),
  });
}

export function useCancelCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => certificationsService.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: certKeys.mine() }),
  });
}

// ─── Processes & operations ───────────────────────────────────────────────────

export function useProcesses() {
  return useQuery({
    queryKey: certKeys.processes(),
    queryFn: () => certificationsService.listProcesses().then(r => r.data),
  });
}

export function useOperations(processId: string | undefined) {
  return useQuery({
    queryKey: certKeys.operations(processId ?? ''),
    queryFn: () =>
      certificationsService.listOperations(processId!).then(r => r.data),
    enabled: Boolean(processId),
  });
}

// ─── ORO ─────────────────────────────────────────────────────────────────────

export function useOroPending() {
  return useQuery({
    queryKey: certKeys.oroPending(),
    queryFn: () => oroService.listPending().then(r => r.data),
  });
}

export function useOroHistory() {
  return useQuery({
    queryKey: certKeys.oroHistory(),
    queryFn: () => oroService.listHistory().then(r => r.data),
  });
}

export function useSubmitAttempt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: oroService.submitAttempt,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: certKeys.oroPending() });
      qc.invalidateQueries({ queryKey: certKeys.oroHistory() });
      qc.invalidateQueries({ queryKey: certKeys.mine() });
    },
  });
}

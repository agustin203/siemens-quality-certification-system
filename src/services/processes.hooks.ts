import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type CertificationOperation,
  type CertificationProcess,
  type ProcessStatus,
} from '../pages/Processes/types';

import { processesService } from './processes';

export const processKeys = {
  all: ['processes'] as const,
  list: () => [...processKeys.all, 'list'] as const,
  operations: (processId: string) =>
    [...processKeys.all, 'operations', processId] as const,
};

// ─── Processes ───────────────────────────────────────────────────────────────

export function useProcessList() {
  return useQuery({
    queryKey: processKeys.list(),
    queryFn: () => processesService.list().then(r => r.data),
  });
}

export function useCreateProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<
        CertificationProcess,
        'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
      >,
    ) => processesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: processKeys.list() }),
  });
}

export function useUpdateProcess() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Pick<
        CertificationProcess,
        'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
      >;
    }) => processesService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: processKeys.list() }),
  });
}

export function useSetProcessStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProcessStatus }) =>
      processesService.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: processKeys.list() }),
  });
}

// ─── Operations ──────────────────────────────────────────────────────────────

export function useProcessOperations(processId: string) {
  return useQuery({
    queryKey: processKeys.operations(processId),
    queryFn: () => processesService.listOperations(processId).then(r => r.data),
    enabled: Boolean(processId),
  });
}

export function useCreateOperation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      processId,
      data,
    }: {
      processId: string;
      data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>;
    }) => processesService.createOperation(processId, data),
    onSuccess: (_res, vars) =>
      qc.invalidateQueries({
        queryKey: processKeys.operations(vars.processId),
      }),
  });
}

export function useUpdateOperation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      processId,
      data,
    }: {
      id: string;
      processId: string;
      data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>;
    }) => processesService.updateOperation(id, data),
    onSuccess: (_res, vars) =>
      qc.invalidateQueries({
        queryKey: processKeys.operations(vars.processId),
      }),
  });
}

export function useDeleteOperation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, processId }: { id: string; processId: string }) =>
      processesService.deleteOperation(id),
    onSuccess: (_res, vars) =>
      qc.invalidateQueries({
        queryKey: processKeys.operations(vars.processId),
      }),
  });
}

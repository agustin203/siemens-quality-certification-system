import { type PillsProps } from '@material-hu/components/design-system/Pills/types';

import {
  type CertificationAttempt,
  type CertificationRequest,
  type CertificationStatus,
} from './types';

export const CERTIFICATION_STATUS_CONFIG: Record<
  CertificationStatus,
  { label: string; type: PillsProps['type'] }
> = {
  approved: { label: 'APROBADO', type: 'success' },
  rejected: { label: 'REPROBADO', type: 'error' },
  in_progress: { label: 'EN PROCESO', type: 'warning' },
  cancelled: { label: 'CANCELADO', type: 'disabled' },
};

export const CERTIFICATION_STATUS_FILTER_OPTIONS = [
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Reprobado' },
  { value: 'in_progress', label: 'En proceso' },
  { value: 'cancelled', label: 'Cancelado' },
];

export const PERIOD_FILTER_OPTIONS = [
  { value: '30d', label: 'Último mes' },
  { value: '90d', label: 'Últimos 3 meses' },
  { value: '365d', label: 'Último año' },
];

export const PROCESS_FILTER_OPTIONS = [
  { value: '1', label: 'Q120 — 1 Polo' },
  { value: '2', label: 'Q120 L2 — 1 Polo' },
  { value: '6', label: 'Q150 — 4 Polos' },
  { value: '9', label: 'Q180 — 2 Polos L2' },
];

export const OPERATOR_OPERATIONS_BY_PROCESS: Record<
  string,
  { value: string; label: string }[]
> = {
  '1': [
    { value: 'op-1', label: 'Insertar contacto inferior' },
    { value: 'op-2', label: 'Soldar contacto inferior' },
    { value: 'op-3', label: 'Insertar resorte de contacto' },
    { value: 'op-4', label: 'Colocar cubierta superior' },
    { value: 'op-5', label: 'Verificar continuidad eléctrica' },
  ],
  '2': [
    { value: 'op-6', label: 'Insertar contacto inferior L2' },
    { value: 'op-7', label: 'Soldar contacto inferior L2' },
    { value: 'op-8', label: 'Colocar cubierta superior L2' },
  ],
  '6': [
    { value: 'op-11', label: 'Montaje de arco eléctrico' },
    { value: 'op-12', label: 'Insertar bimetálico' },
    { value: 'op-13', label: 'Calibrar disparador térmico' },
  ],
  '9': [
    { value: 'op-14', label: 'Insertar contacto inferior L2' },
    { value: 'op-15', label: 'Soldar contacto inferior L2' },
    { value: 'op-16', label: 'Ensamblar tapa lateral' },
  ],
};

export const MOCK_CERTIFICATIONS: CertificationRequest[] = [
  {
    id: 'cert-1',
    processId: '1',
    processName: 'Q120 — 1 Polo',
    operationId: 'op-1',
    operationName: 'Insertar contacto inferior',
    requestDate: '2026-01-15T09:00:00Z',
    status: 'approved',
    expirationDate: '2027-01-15T09:00:00Z',
  },
  {
    id: 'cert-2',
    processId: '1',
    processName: 'Q120 — 1 Polo',
    operationId: 'op-2',
    operationName: 'Soldar contacto inferior',
    requestDate: '2026-02-10T10:00:00Z',
    status: 'rejected',
  },
  {
    id: 'cert-3',
    processId: '2',
    processName: 'Q120 L2 — 1 Polo',
    operationId: 'op-6',
    operationName: 'Insertar contacto inferior L2',
    requestDate: '2026-03-01T11:00:00Z',
    status: 'in_progress',
  },
  {
    id: 'cert-4',
    processId: '6',
    processName: 'Q150 — 4 Polos',
    operationId: 'op-11',
    operationName: 'Montaje de arco eléctrico',
    requestDate: '2026-03-15T09:00:00Z',
    status: 'approved',
    expirationDate: '2027-03-15T09:00:00Z',
  },
  {
    id: 'cert-5',
    processId: '6',
    processName: 'Q150 — 4 Polos',
    operationId: 'op-12',
    operationName: 'Insertar bimetálico',
    requestDate: '2026-03-20T14:00:00Z',
    status: 'cancelled',
  },
  {
    id: 'cert-6',
    processId: '1',
    processName: 'Q120 — 1 Polo',
    operationId: 'op-3',
    operationName: 'Insertar resorte de contacto',
    requestDate: '2026-04-01T09:00:00Z',
    status: 'in_progress',
  },
  {
    id: 'cert-7',
    processId: '9',
    processName: 'Q180 — 2 Polos L2',
    operationId: 'op-6',
    operationName: 'Insertar contacto inferior L2',
    requestDate: '2026-04-05T11:00:00Z',
    status: 'approved',
    expirationDate: '2027-04-05T11:00:00Z',
  },
  {
    id: 'cert-8',
    processId: '2',
    processName: 'Q120 L2 — 1 Polo',
    operationId: 'op-7',
    operationName: 'Soldar contacto inferior L2',
    requestDate: '2026-04-10T10:00:00Z',
    status: 'rejected',
  },
];

export const MOCK_ATTEMPTS: CertificationAttempt[] = [
  {
    id: 'att-1',
    requestId: 'cert-1',
    processId: '1',
    processName: 'Q120 — 1 Polo',
    operationId: 'op-1',
    operationName: 'Insertar contacto inferior',
    evaluatorName: 'Carlos Méndez',
    attemptNumber: 1,
    completedAt: '2026-01-15T10:30:00Z',
    tiempoRegistradoSeg: 13,
    tiempoEstandarSeg: 15,
    meetsThreshold: true,
    result: 'passed',
  },
  {
    id: 'att-2',
    requestId: 'cert-2',
    processId: '1',
    processName: 'Q120 — 1 Polo',
    operationId: 'op-2',
    operationName: 'Soldar contacto inferior',
    evaluatorName: 'Carlos Méndez',
    attemptNumber: 1,
    completedAt: '2026-02-10T11:20:00Z',
    tiempoRegistradoSeg: 22,
    tiempoEstandarSeg: 18,
    meetsThreshold: false,
    result: 'failed',
  },
  {
    id: 'att-3',
    requestId: 'cert-2',
    processId: '1',
    processName: 'Q120 — 1 Polo',
    operationId: 'op-2',
    operationName: 'Soldar contacto inferior',
    evaluatorName: 'Laura Ríos',
    attemptNumber: 2,
    completedAt: '2026-02-18T09:00:00Z',
    tiempoRegistradoSeg: 20,
    tiempoEstandarSeg: 18,
    meetsThreshold: false,
    result: 'failed',
  },
  {
    id: 'att-4',
    requestId: 'cert-4',
    processId: '6',
    processName: 'Q150 — 4 Polos',
    operationId: 'op-11',
    operationName: 'Montaje de arco eléctrico',
    evaluatorName: 'Carlos Méndez',
    attemptNumber: 1,
    completedAt: '2026-03-15T10:00:00Z',
    tiempoRegistradoSeg: 27,
    tiempoEstandarSeg: 30,
    meetsThreshold: true,
    result: 'passed',
  },
  {
    id: 'att-5',
    requestId: 'cert-7',
    processId: '9',
    processName: 'Q180 — 2 Polos L2',
    operationId: 'op-14',
    operationName: 'Insertar contacto inferior L2',
    evaluatorName: 'Laura Ríos',
    attemptNumber: 1,
    completedAt: '2026-04-05T12:00:00Z',
    tiempoRegistradoSeg: 11,
    tiempoEstandarSeg: 12,
    meetsThreshold: true,
    result: 'passed',
  },
];

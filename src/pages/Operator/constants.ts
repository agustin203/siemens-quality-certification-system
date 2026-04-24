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

// Process UUIDs — must match the seed in Supabase
export const PROCESS_IDS = {
  Q120_1POLO: '00000000-0000-0000-0000-000000000001',
  Q120L2_1POLO: '00000000-0000-0000-0000-000000000002',
  Q150_4POLOS: '00000000-0000-0000-0000-000000000006',
  Q180_2POLOS_L2: '00000000-0000-0000-0000-000000000009',
};

export const PROCESS_FILTER_OPTIONS = [
  { value: PROCESS_IDS.Q120_1POLO, label: 'Q120 — 1 Polo' },
  { value: PROCESS_IDS.Q120L2_1POLO, label: 'Q120 L2 — 1 Polo' },
  { value: PROCESS_IDS.Q150_4POLOS, label: 'Q150 — 4 Polos' },
  { value: PROCESS_IDS.Q180_2POLOS_L2, label: 'Q180 — 2 Polos L2' },
];

// Operation UUIDs — must match the seed in Supabase
export const OP_IDS = {
  // Q120 — 1 Polo
  insertar_contacto_inferior: '00000000-0000-0000-0000-000000000101',
  soldar_contacto_inferior: '00000000-0000-0000-0000-000000000102',
  insertar_resorte_contacto: '00000000-0000-0000-0000-000000000103',
  colocar_cubierta_superior: '00000000-0000-0000-0000-000000000104',
  verificar_continuidad_electrica: '00000000-0000-0000-0000-000000000105',
  // Q120 L2 — 1 Polo
  insertar_contacto_inferior_l2_proc2: '00000000-0000-0000-0000-000000000106',
  soldar_contacto_inferior_l2_proc2: '00000000-0000-0000-0000-000000000107',
  colocar_cubierta_superior_l2: '00000000-0000-0000-0000-000000000108',
  // Q150 — 4 Polos
  montaje_arco_electrico: '00000000-0000-0000-0000-000000000111',
  insertar_bimetalico: '00000000-0000-0000-0000-000000000112',
  calibrar_disparador: '00000000-0000-0000-0000-000000000113',
  // Q180 — 2 Polos L2
  insertar_contacto_inferior_l2_proc9: '00000000-0000-0000-0000-000000000114',
  soldar_contacto_inferior_l2_proc9: '00000000-0000-0000-0000-000000000115',
  ensamblar_tapa_lateral: '00000000-0000-0000-0000-000000000116',
};

export const OPERATOR_OPERATIONS_BY_PROCESS: Record<
  string,
  { value: string; label: string }[]
> = {
  [PROCESS_IDS.Q120_1POLO]: [
    {
      value: OP_IDS.insertar_contacto_inferior,
      label: 'Insertar contacto inferior',
    },
    {
      value: OP_IDS.soldar_contacto_inferior,
      label: 'Soldar contacto inferior',
    },
    {
      value: OP_IDS.insertar_resorte_contacto,
      label: 'Insertar resorte de contacto',
    },
    {
      value: OP_IDS.colocar_cubierta_superior,
      label: 'Colocar cubierta superior',
    },
    {
      value: OP_IDS.verificar_continuidad_electrica,
      label: 'Verificar continuidad eléctrica',
    },
  ],
  [PROCESS_IDS.Q120L2_1POLO]: [
    {
      value: OP_IDS.insertar_contacto_inferior_l2_proc2,
      label: 'Insertar contacto inferior L2',
    },
    {
      value: OP_IDS.soldar_contacto_inferior_l2_proc2,
      label: 'Soldar contacto inferior L2',
    },
    {
      value: OP_IDS.colocar_cubierta_superior_l2,
      label: 'Colocar cubierta superior L2',
    },
  ],
  [PROCESS_IDS.Q150_4POLOS]: [
    {
      value: OP_IDS.montaje_arco_electrico,
      label: 'Montaje de arco eléctrico',
    },
    { value: OP_IDS.insertar_bimetalico, label: 'Insertar bimetálico' },
    { value: OP_IDS.calibrar_disparador, label: 'Calibrar disparador térmico' },
  ],
  [PROCESS_IDS.Q180_2POLOS_L2]: [
    {
      value: OP_IDS.insertar_contacto_inferior_l2_proc9,
      label: 'Insertar contacto inferior L2',
    },
    {
      value: OP_IDS.soldar_contacto_inferior_l2_proc9,
      label: 'Soldar contacto inferior L2',
    },
    { value: OP_IDS.ensamblar_tapa_lateral, label: 'Ensamblar tapa lateral' },
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

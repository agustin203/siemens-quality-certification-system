import { type OperatorRow } from './types';

export const ADMIN_PROCESS_OPTIONS = [
  { value: '1', label: 'Q120 — 1 Polo' },
  { value: '2', label: 'Q120 L2 — 1 Polo' },
  { value: '6', label: 'Q150 — 4 Polos' },
  { value: '9', label: 'Q180 — 2 Polos L2' },
];

export const ADMIN_OPERATIONS_BY_PROCESS: Record<
  string,
  { value: string; label: string }[]
> = {
  '1': [
    { value: 'op-1', label: 'Insertar contacto inf.' },
    { value: 'op-2', label: 'Soldar contacto inf.' },
    { value: 'op-3', label: 'Insertar resorte' },
    { value: 'op-4', label: 'Colocar cubierta sup.' },
    { value: 'op-5', label: 'Verificar continuidad' },
  ],
  '2': [
    { value: 'op-6', label: 'Insertar contacto L2' },
    { value: 'op-7', label: 'Soldar contacto L2' },
    { value: 'op-8', label: 'Colocar cubierta L2' },
  ],
  '6': [
    { value: 'op-11', label: 'Montaje arco eléctrico' },
    { value: 'op-12', label: 'Insertar bimetálico' },
    { value: 'op-13', label: 'Calibrar disparador' },
  ],
  '9': [
    { value: 'op-14', label: 'Insertar contacto L2' },
    { value: 'op-15', label: 'Soldar contacto L2' },
    { value: 'op-16', label: 'Ensamblar tapa lateral' },
  ],
};

export const ADMIN_OPERATOR_MATRIX: Record<string, OperatorRow[]> = {
  '1': [
    {
      operatorId: 'op-juan',
      operatorName: 'Juan Pérez',
      certifications: {
        'op-1': 'approved',
        'op-2': 'in_progress',
        'op-3': 'none',
        'op-4': 'none',
        'op-5': 'none',
      },
    },
    {
      operatorId: 'op-maria',
      operatorName: 'María García',
      certifications: {
        'op-1': 'approved',
        'op-2': 'approved',
        'op-3': 'approved',
        'op-4': 'none',
        'op-5': 'none',
      },
    },
    {
      operatorId: 'op-roberto',
      operatorName: 'Roberto Silva',
      certifications: {
        'op-1': 'rejected',
        'op-2': 'none',
        'op-3': 'none',
        'op-4': 'none',
        'op-5': 'none',
      },
    },
    {
      operatorId: 'op-ana',
      operatorName: 'Ana Torres',
      certifications: {
        'op-1': 'approved',
        'op-2': 'approved',
        'op-3': 'in_progress',
        'op-4': 'approved',
        'op-5': 'none',
      },
    },
    {
      operatorId: 'op-carlos',
      operatorName: 'Carlos Mendoza',
      certifications: {
        'op-1': 'none',
        'op-2': 'none',
        'op-3': 'none',
        'op-4': 'none',
        'op-5': 'none',
      },
    },
    {
      operatorId: 'op-laura',
      operatorName: 'Laura Romero',
      certifications: {
        'op-1': 'approved',
        'op-2': 'approved',
        'op-3': 'approved',
        'op-4': 'approved',
        'op-5': 'approved',
      },
    },
  ],
  '2': [
    {
      operatorId: 'op-juan',
      operatorName: 'Juan Pérez',
      certifications: {
        'op-6': 'approved',
        'op-7': 'none',
        'op-8': 'none',
      },
    },
    {
      operatorId: 'op-ana',
      operatorName: 'Ana Torres',
      certifications: {
        'op-6': 'approved',
        'op-7': 'in_progress',
        'op-8': 'none',
      },
    },
    {
      operatorId: 'op-laura',
      operatorName: 'Laura Romero',
      certifications: {
        'op-6': 'approved',
        'op-7': 'approved',
        'op-8': 'approved',
      },
    },
    {
      operatorId: 'op-carlos',
      operatorName: 'Carlos Mendoza',
      certifications: {
        'op-6': 'rejected',
        'op-7': 'none',
        'op-8': 'none',
      },
    },
  ],
  '6': [
    {
      operatorId: 'op-roberto',
      operatorName: 'Roberto Silva',
      certifications: {
        'op-11': 'approved',
        'op-12': 'in_progress',
        'op-13': 'none',
      },
    },
    {
      operatorId: 'op-maria',
      operatorName: 'María García',
      certifications: {
        'op-11': 'approved',
        'op-12': 'approved',
        'op-13': 'approved',
      },
    },
    {
      operatorId: 'op-carlos',
      operatorName: 'Carlos Mendoza',
      certifications: {
        'op-11': 'none',
        'op-12': 'rejected',
        'op-13': 'none',
      },
    },
  ],
  '9': [
    {
      operatorId: 'op-juan',
      operatorName: 'Juan Pérez',
      certifications: {
        'op-14': 'approved',
        'op-15': 'approved',
        'op-16': 'none',
      },
    },
    {
      operatorId: 'op-laura',
      operatorName: 'Laura Romero',
      certifications: {
        'op-14': 'approved',
        'op-15': 'approved',
        'op-16': 'approved',
      },
    },
    {
      operatorId: 'op-ana',
      operatorName: 'Ana Torres',
      certifications: {
        'op-14': 'in_progress',
        'op-15': 'none',
        'op-16': 'none',
      },
    },
  ],
};

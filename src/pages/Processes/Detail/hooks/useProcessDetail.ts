import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { MOCK_OPERATIONS, MOCK_PROCESSES } from '../../constants';
import { type CertificationOperation } from '../../types';

export const useProcessDetail = () => {
  const { id } = useParams<{ id: string }>();

  const process = MOCK_PROCESSES.find(p => p.id === id) ?? null;

  const [operations, setOperations] = useState<CertificationOperation[]>(
    MOCK_OPERATIONS.filter(op => op.process_id === id),
  );

  const handleCreateOperation = (
    data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>,
  ) => {
    const newOp: CertificationOperation = {
      id: `op-${Date.now()}`,
      process_id: id ?? '',
      orden: operations.length + 1,
      nombre: data.nombre,
      tiempo_estandar_seg: data.tiempo_estandar_seg,
    };
    setOperations(prev => [...prev, newOp]);
  };

  const handleEditOperation = (
    operationId: string,
    data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>,
  ) => {
    setOperations(prev =>
      prev.map(op => (op.id === operationId ? { ...op, ...data } : op)),
    );
  };

  const handleDeleteOperation = (operationId: string) => {
    setOperations(prev => prev.filter(op => op.id !== operationId));
  };

  return {
    process,
    operations,
    handleCreateOperation,
    handleEditOperation,
    handleDeleteOperation,
  };
};

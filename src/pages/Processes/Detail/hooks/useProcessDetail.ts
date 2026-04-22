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

  const handleDeleteOperation = (operationId: string) => {
    setOperations(prev => prev.filter(op => op.id !== operationId));
  };

  return {
    process,
    operations,
    handleDeleteOperation,
  };
};

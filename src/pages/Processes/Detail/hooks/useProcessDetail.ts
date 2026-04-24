import { useParams } from 'react-router-dom';

import {
  useCreateOperation,
  useDeleteOperation,
  useProcessList as useProcessListQuery,
  useProcessOperations,
  useUpdateOperation,
} from '../../../../services/processes.hooks';
import { type CertificationOperation } from '../../types';

export const useProcessDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: processes = [] } = useProcessListQuery();
  const process = processes.find(p => p.id === id) ?? null;

  const { data: operations = [] } = useProcessOperations(id ?? '');

  const createMutation = useCreateOperation();
  const updateMutation = useUpdateOperation();
  const deleteMutation = useDeleteOperation();

  const handleCreateOperation = (
    data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>,
  ) => {
    if (!id) return;
    createMutation.mutate({ processId: id, data });
  };

  const handleEditOperation = (
    operationId: string,
    data: Pick<CertificationOperation, 'nombre' | 'tiempo_estandar_seg'>,
  ) => {
    if (!id) return;
    updateMutation.mutate({ id: operationId, processId: id, data });
  };

  const handleDeleteOperation = (operationId: string) => {
    if (!id) return;
    deleteMutation.mutate({ id: operationId, processId: id });
  };

  return {
    process,
    operations,
    handleCreateOperation,
    handleEditOperation,
    handleDeleteOperation,
  };
};

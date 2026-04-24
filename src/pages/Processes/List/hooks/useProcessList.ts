import { useEffect, useState } from 'react';

import {
  useCreateProcess,
  useProcessList as useProcessListQuery,
  useSetProcessStatus,
  useUpdateProcess,
} from '../../../../services/processes.hooks';
import { type CertificationProcess, type ProcessStatus } from '../../types';

export const useProcessList = () => {
  const { data: processes = [], isLoading } = useProcessListQuery();
  const createMutation = useCreateProcess();
  const updateMutation = useUpdateProcess();
  const setStatusMutation = useSetProcessStatus();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const filteredProcesses = processes.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProcesses.length / limit));

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1);
  }, [page, totalPages]);

  const paginatedProcesses = filteredProcesses.slice(
    (page - 1) * limit,
    page * limit,
  );

  const handleArchive = (id: string) => {
    setStatusMutation.mutate({ id, status: 'archived' });
  };

  const handlePublish = (id: string) => {
    setStatusMutation.mutate({ id, status: 'published' });
  };

  const handleCreate = (
    data: Pick<
      CertificationProcess,
      'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
    >,
  ) => {
    createMutation.mutate(data);
  };

  const handleEdit = (
    id: string,
    data: Pick<
      CertificationProcess,
      'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
    >,
  ) => {
    updateMutation.mutate({ id, data });
  };

  return {
    isLoading,
    processes,
    filteredProcesses,
    paginatedProcesses,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    limit,
    totalPages,
    handleArchive,
    handlePublish,
    handleCreate,
    handleEdit,
  };
};

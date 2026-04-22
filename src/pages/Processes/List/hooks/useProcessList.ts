import { useEffect, useState } from 'react';

import { MOCK_PROCESSES } from '../../constants';
import { type CertificationProcess, type ProcessStatus } from '../../types';

export const useProcessList = () => {
  const [processes, setProcesses] =
    useState<CertificationProcess[]>(MOCK_PROCESSES);
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

  const totalPages = Math.ceil(filteredProcesses.length / limit);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  const paginatedProcesses = filteredProcesses.slice(
    (page - 1) * limit,
    page * limit,
  );

  const handleArchive = (id: string) => {
    setProcesses(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'archived' } : p)),
    );
  };

  const handlePublish = (id: string) => {
    setProcesses(prev =>
      prev.map(p => (p.id === id ? { ...p, status: 'published' } : p)),
    );
  };

  const handleCreate = (
    data: Pick<
      CertificationProcess,
      'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
    >,
  ) => {
    const newProcess: CertificationProcess = {
      ...data,
      id: `proc-${Date.now()}`,
      version: 1,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    setProcesses(prev => [newProcess, ...prev]);
  };

  const handleEdit = (
    id: string,
    data: Pick<
      CertificationProcess,
      'nombre' | 'modelo' | 'familia' | 'linea' | 'turno'
    >,
  ) => {
    setProcesses(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)));
  };

  return {
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

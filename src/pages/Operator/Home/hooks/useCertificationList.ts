import { useEffect, useState } from 'react';

import { MOCK_CERTIFICATIONS } from '../../constants';
import {
  type CertificationRequest,
  type CertificationStatus,
} from '../../types';

type PeriodFilter = '30d' | '90d' | '365d';

export const useCertificationList = () => {
  const [certifications, setCertifications] =
    useState<CertificationRequest[]>(MOCK_CERTIFICATIONS);
  const [statusFilter, setStatusFilter] = useState<
    CertificationStatus | undefined
  >(undefined);
  const [processFilter, setProcessFilter] = useState<string | undefined>(
    undefined,
  );
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const filteredCertifications = certifications.filter(c => {
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    const matchesProcess = processFilter ? c.processId === processFilter : true;
    const matchesPeriod = (() => {
      if (!periodFilter) return true;
      const days =
        periodFilter === '30d' ? 30 : periodFilter === '90d' ? 90 : 365;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      return new Date(c.requestDate) >= cutoff;
    })();
    return matchesStatus && matchesProcess && matchesPeriod;
  });

  const totalPages = Math.ceil(filteredCertifications.length / limit);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  const paginatedCertifications = filteredCertifications.slice(
    (page - 1) * limit,
    page * limit,
  );

  const handleCancel = (id: string) => {
    setCertifications(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'cancelled' as const } : c)),
    );
  };

  return {
    filteredCertifications,
    paginatedCertifications,
    statusFilter,
    setStatusFilter,
    processFilter,
    setProcessFilter,
    periodFilter,
    setPeriodFilter,
    page,
    setPage,
    totalPages,
    handleCancel,
  };
};

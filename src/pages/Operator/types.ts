export type CertificationStatus =
  | 'approved'
  | 'rejected'
  | 'in_progress'
  | 'cancelled';

export type CertificationRequest = {
  id: string;
  processId: string;
  processName: string;
  operationId: string;
  operationName: string;
  requestDate: string;
  status: CertificationStatus;
  expirationDate?: string;
};

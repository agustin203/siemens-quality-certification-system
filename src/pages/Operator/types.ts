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

export type AttemptResult = 'passed' | 'failed';

export type CertificationAttempt = {
  id: string;
  requestId: string;
  processId: string;
  processName: string;
  operationId: string;
  operationName: string;
  evaluatorName: string;
  attemptNumber: number;
  completedAt: string;
  tiempoRegistradoSeg: number;
  tiempoEstandarSeg: number;
  meetsThreshold: boolean;
  result: AttemptResult;
};

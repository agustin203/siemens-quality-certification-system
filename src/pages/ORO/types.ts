export type PendingRequestStatus = 'available' | 'cooldown';

export type PendingRequest = {
  id: string;
  operatorName: string;
  processId: string;
  processName: string;
  operationId: string;
  operationName: string;
  tiempoEstandarSeg: number;
  requestDate: string;
  attemptNumber: number;
  maxAttempts: number;
  status: PendingRequestStatus;
  cooldownUntil?: string;
};

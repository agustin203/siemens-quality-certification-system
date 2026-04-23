export type RiskLevel = 'ok' | 'warning' | 'critical';

export type ProcessLineStats = {
  processId: string;
  processName: string;
  totalOperators: number;
  certified: number;
  inProgress: number;
  uncertified: number;
  risk: RiskLevel;
};

export type PendingOperator = {
  operatorId: string;
  operatorName: string;
  operationName: string;
  processName: string;
  attemptNumber: number;
  maxAttempts: number;
  lastAttemptDate?: string;
};

export type DrillAttempt = {
  id: string;
  operationName: string;
  processName: string;
  evaluatorName: string;
  attemptNumber: number;
  completedAt: string;
  tiempoRegistradoSeg: number;
  tiempoEstandarSeg: number;
  result: 'passed' | 'failed';
};

export type EmployeeDrillData = {
  operatorId: string;
  operatorName: string;
  attempts: DrillAttempt[];
};

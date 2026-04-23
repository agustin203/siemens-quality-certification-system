export type CellStatus = 'approved' | 'rejected' | 'in_progress' | 'none';

export type OperatorRow = {
  operatorId: string;
  operatorName: string;
  certifications: Record<string, CellStatus>;
};

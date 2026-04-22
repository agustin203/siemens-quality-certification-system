export type ProcessStatus = 'draft' | 'published' | 'archived';

export type CertificationProcess = {
  id: string;
  nombre: string;
  modelo: string;
  familia: string;
  linea: string;
  turno: string;
  version: number;
  status: ProcessStatus;
  createdAt: string;
};

export type CertificationOperation = {
  id: string;
  process_id: string;
  orden: number;
  nombre: string;
  tiempo_estandar_seg: number;
};

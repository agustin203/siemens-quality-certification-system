import { useLocation, useNavigate } from 'react-router-dom';

import { IconArrowLeft, IconCertificate } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Pills from '@material-hu/components/design-system/Pills';
import Title from '@material-hu/components/design-system/Title';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { CERTIFICATION_STATUS_CONFIG } from '../constants';
import { type CertificationRequest } from '../types';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

type FieldRowProps = {
  label: string;
  value: React.ReactNode;
};

const FieldRow = ({ label, value }: FieldRowProps) => (
  <Stack
    sx={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      py: 2,
      borderBottom: '1px solid',
      borderColor: 'new.border.neutral.default',
    }}
  >
    <Typography
      variant="body2"
      sx={{ color: 'new.text.neutral.subtle' }}
    >
      {label}
    </Typography>
    {typeof value === 'string' ? (
      <Typography variant="body2">{value}</Typography>
    ) : (
      value
    )}
  </Stack>
);

const CertificationDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cert = location.state as CertificationRequest | undefined;

  if (!cert) {
    return (
      <DashboardLayout>
        <StateCard
          Icon={IconCertificate}
          title="Certificación no encontrada"
          description="No se encontró la certificación. Volvé al listado e intentá de nuevo."
          slotProps={{ title: { variant: 'M' }, avatar: { color: 'default' } }}
        />
      </DashboardLayout>
    );
  }

  const statusConfig = CERTIFICATION_STATUS_CONFIG[cert.status];

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/operator')}
            sx={{ mt: 0.5 }}
          >
            <IconArrowLeft size={20} />
          </IconButton>
          <Title
            title="Detalle de certificación"
            description={`${cert.processName} · ${cert.operationName}`}
          />
        </Stack>

        <Stack
          sx={{
            border: '1px solid',
            borderColor: 'new.border.neutral.default',
            borderRadius: '8px',
            px: 3,
            maxWidth: 640,
          }}
        >
          <FieldRow
            label="Proceso"
            value={cert.processName}
          />
          <FieldRow
            label="Operación"
            value={cert.operationName}
          />
          <FieldRow
            label="Fecha solicitud"
            value={formatDate(cert.requestDate)}
          />
          <FieldRow
            label="Estado"
            value={
              <Pills
                label={statusConfig.label}
                type={statusConfig.type}
              />
            }
          />
          <FieldRow
            label="Vencimiento"
            value={cert.expirationDate ? formatDate(cert.expirationDate) : '—'}
          />
        </Stack>
      </Stack>
    </DashboardLayout>
  );
};

export default CertificationDetail;

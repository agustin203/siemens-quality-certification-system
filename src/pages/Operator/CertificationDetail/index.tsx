import { useLocation, useNavigate } from 'react-router-dom';

import {
  IconArrowLeft,
  IconCertificate,
  IconCircleCheck,
  IconCircleX,
  IconPencil,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Pills from '@material-hu/components/design-system/Pills';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';
import Title from '@material-hu/components/design-system/Title';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { CERTIFICATION_STATUS_CONFIG, MOCK_ATTEMPTS } from '../constants';
import { type CertificationRequest } from '../types';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
  const attempts = MOCK_ATTEMPTS.filter(a => a.requestId === cert.id);
  const lastAttempt =
    attempts.length > 0 ? attempts[attempts.length - 1] : null;

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6, maxWidth: 720, mx: 'auto', width: '100%' }}>
        {/* Header */}
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

        {/* Main fields */}
        <Stack
          sx={{
            border: '1px solid',
            borderColor: 'new.border.neutral.default',
            borderRadius: '8px',
            px: 3,
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
            label="Fecha de solicitud"
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
          {lastAttempt && (
            <FieldRow
              label="Evaluador ORO"
              value={lastAttempt.evaluatorName}
            />
          )}
        </Stack>

        {/* Attempt history */}
        {attempts.length > 0 && (
          <Stack sx={{ gap: 2 }}>
            <Typography variant="h6">Historial de intentos</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Intento</TableCell>
                    <TableCell>Evaluador</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Tiempo registrado</TableCell>
                    <TableCell>Estándar</TableCell>
                    <TableCell>Resultado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attempts.map(att => (
                    <TableRow key={att.id}>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: 'new.text.neutral.subtle' }}
                        >
                          #{att.attemptNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {att.evaluatorName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateTime(att.completedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {att.tiempoRegistradoSeg}s
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: 'new.text.neutral.subtle' }}
                        >
                          {att.tiempoEstandarSeg}s
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Pills
                          label={
                            att.result === 'passed' ? 'APROBADO' : 'REPROBADO'
                          }
                          type={att.result === 'passed' ? 'success' : 'error'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        )}

        {/* Signature section */}
        {lastAttempt && (
          <Stack sx={{ gap: 2 }}>
            <Typography variant="h6">Firmas</Typography>
            <Stack
              sx={{
                border: '1px solid',
                borderColor: 'new.border.neutral.default',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {/* ORO signature */}
              <Stack
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 2.5,
                  borderBottom: '1px solid',
                  borderColor: 'new.border.neutral.default',
                }}
              >
                <Stack sx={{ gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    Evaluador ORO
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'new.text.neutral.subtle' }}
                  >
                    {lastAttempt.evaluatorName} ·{' '}
                    {formatDateTime(lastAttempt.completedAt)}
                  </Typography>
                </Stack>
                <Stack
                  sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}
                >
                  {cert.status === 'approved' || cert.status === 'rejected' ? (
                    <>
                      {cert.status === 'approved' ? (
                        <IconCircleCheck
                          size={18}
                          color="#16a34a"
                        />
                      ) : (
                        <IconCircleX
                          size={18}
                          color="#dc2626"
                        />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            cert.status === 'approved' ? '#16a34a' : '#dc2626',
                          fontWeight: 600,
                        }}
                      >
                        Firmado
                      </Typography>
                    </>
                  ) : (
                    <>
                      <IconPencil
                        size={18}
                        color="#9ca3af"
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        Pendiente
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>

              {/* Supervisor signature placeholder */}
              <Stack
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 2.5,
                }}
              >
                <Stack sx={{ gap: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    Supervisor de línea
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'new.text.neutral.subtle' }}
                  >
                    Validación de conformidad
                  </Typography>
                </Stack>
                <Stack
                  sx={{ flexDirection: 'row', alignItems: 'center', gap: 1 }}
                >
                  {cert.status === 'approved' ? (
                    <>
                      <IconCircleCheck
                        size={18}
                        color="#16a34a"
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: '#16a34a', fontWeight: 600 }}
                      >
                        Firmado
                      </Typography>
                    </>
                  ) : (
                    <>
                      <IconPencil
                        size={18}
                        color="#9ca3af"
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        Pendiente
                      </Typography>
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default CertificationDetail;

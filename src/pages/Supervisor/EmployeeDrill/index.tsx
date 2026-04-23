import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { IconArrowLeft } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Button from '@material-hu/components/design-system/Buttons/Button';
import Pills from '@material-hu/components/design-system/Pills';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { MOCK_EMPLOYEE_DRILL } from '../constants';
import { type EmployeeDrillData } from '../types';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const EmployeeDrill = () => {
  const navigate = useNavigate();
  const { operatorId } = useParams<{ operatorId: string }>();
  const location = useLocation();
  const stateData = location.state as EmployeeDrillData | undefined;

  const data =
    stateData ?? (operatorId ? MOCK_EMPLOYEE_DRILL[operatorId] : undefined);

  if (!data) {
    return (
      <DashboardLayout>
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Typography variant="h6">Operador no encontrado.</Typography>
          <Button
            onClick={() => navigate('/supervisor')}
            variant="secondary"
            sx={{ mt: 2 }}
          >
            Volver al dashboard
          </Button>
        </Stack>
      </DashboardLayout>
    );
  }

  const attempts = [...data.attempts].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );

  const passed = attempts.filter(a => a.result === 'passed').length;
  const failed = attempts.filter(a => a.result === 'failed').length;

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 4, maxWidth: 900, mx: 'auto', width: '100%' }}>
        {/* Header */}
        <Stack sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/supervisor')}
            sx={{ mt: 0.5 }}
          >
            <IconArrowLeft size={20} />
          </IconButton>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="h6">{data.operatorName}</Typography>
            <Typography
              variant="body2"
              sx={{ color: 'new.text.neutral.subtle' }}
            >
              Historial completo de intentos de certificación
            </Typography>
          </Stack>
        </Stack>

        {/* Summary cards */}
        <Stack sx={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
          {[
            {
              label: 'Total intentos',
              value: attempts.length,
              color: 'new.text.neutral.default',
            },
            { label: 'Aprobados', value: passed, color: '#16a34a' },
            { label: 'Reprobados', value: failed, color: '#dc2626' },
          ].map(stat => (
            <Stack
              key={stat.label}
              sx={{
                px: 3,
                py: 2,
                border: '1px solid',
                borderColor: 'new.border.neutral.default',
                borderRadius: '8px',
                alignItems: 'center',
                minWidth: 120,
              }}
            >
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'new.text.neutral.subtle', mt: 0.5 }}
              >
                {stat.label}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {/* Attempts table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Proceso</TableCell>
                <TableCell>Operación</TableCell>
                <TableCell>Evaluador</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tiempo registrado</TableCell>
                <TableCell>Estándar</TableCell>
                <TableCell>Intento</TableCell>
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
                      {att.processName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{att.operationName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: 'new.text.neutral.subtle' }}
                    >
                      {att.evaluatorName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(att.completedAt)}
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
                    <Typography
                      variant="body2"
                      sx={{ color: 'new.text.neutral.subtle' }}
                    >
                      #{att.attemptNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Pills
                      label={att.result === 'passed' ? 'APROBADO' : 'REPROBADO'}
                      type={att.result === 'passed' ? 'success' : 'error'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </DashboardLayout>
  );
};

export default EmployeeDrill;

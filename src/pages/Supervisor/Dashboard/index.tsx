import {
  IconAlertTriangle,
  IconCircleCheck,
  IconUsers,
} from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Pills from '@material-hu/components/design-system/Pills';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';
import Title from '@material-hu/components/design-system/Title';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { MOCK_LINE_STATS, MOCK_PENDING_OPERATORS } from '../constants';
import { type RiskLevel } from '../types';

const RISK_CONFIG: Record<
  RiskLevel,
  {
    label: string;
    type: 'success' | 'warning' | 'error';
    icon: React.ReactNode;
  }
> = {
  ok: {
    label: 'OK',
    type: 'success',
    icon: (
      <IconCircleCheck
        size={16}
        color="#16a34a"
      />
    ),
  },
  warning: {
    label: 'Atención',
    type: 'warning',
    icon: (
      <IconAlertTriangle
        size={16}
        color="#d97706"
      />
    ),
  },
  critical: {
    label: 'Crítico',
    type: 'error',
    icon: (
      <IconAlertTriangle
        size={16}
        color="#dc2626"
      />
    ),
  },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const ProgressBar = ({
  certified,
  inProgress,
  total,
}: {
  certified: number;
  inProgress: number;
  total: number;
}) => {
  const certPct = total > 0 ? (certified / total) * 100 : 0;
  const inPct = total > 0 ? (inProgress / total) * 100 : 0;

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Stack
        sx={{
          flexDirection: 'row',
          height: 8,
          borderRadius: '4px',
          overflow: 'hidden',
          bgcolor: 'new.background.surface.subtle',
          width: '100%',
          minWidth: 160,
        }}
      >
        <Stack sx={{ width: `${certPct}%`, bgcolor: '#16a34a' }} />
        <Stack sx={{ width: `${inPct}%`, bgcolor: '#d97706' }} />
      </Stack>
      <Typography
        variant="caption"
        sx={{ color: 'new.text.neutral.subtle' }}
      >
        {certified} aprobados · {inProgress} en proceso ·{' '}
        {total - certified - inProgress} sin certificar
      </Typography>
    </Stack>
  );
};

const SupervisorDashboard = () => {
  const atRisk = MOCK_LINE_STATS.filter(s => s.risk !== 'ok').length;
  const totalCertified = MOCK_LINE_STATS.reduce((a, s) => a + s.certified, 0);
  const totalOperators = MOCK_LINE_STATS.reduce(
    (a, s) => a + s.totalOperators,
    0,
  );

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Title
          title="Dashboard de línea"
          description="Estado de certificación por proceso en tu línea"
        />

        {/* Summary */}
        <Stack sx={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
          {[
            {
              label: 'Total operadores',
              value: totalOperators,
              icon: <IconUsers size={20} />,
              color: 'new.text.neutral.default',
            },
            {
              label: 'Certificados',
              value: totalCertified,
              icon: (
                <IconCircleCheck
                  size={20}
                  color="#16a34a"
                />
              ),
              color: '#16a34a',
            },
            {
              label: 'Procesos en riesgo',
              value: atRisk,
              icon: (
                <IconAlertTriangle
                  size={20}
                  color="#d97706"
                />
              ),
              color: '#d97706',
            },
          ].map(stat => (
            <Stack
              key={stat.label}
              sx={{
                px: 3,
                py: 2,
                border: '1px solid',
                borderColor: 'new.border.neutral.default',
                borderRadius: '8px',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                minWidth: 160,
              }}
            >
              {stat.icon}
              <Stack>
                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: stat.color,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'new.text.neutral.subtle' }}
                >
                  {stat.label}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>

        {/* Process progress table */}
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h6">Progreso por proceso</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Proceso</TableCell>
                  <TableCell>Operadores</TableCell>
                  <TableCell>Progreso</TableCell>
                  <TableCell>% Certificado</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_LINE_STATS.map(stat => {
                  const pct =
                    stat.totalOperators > 0
                      ? Math.round((stat.certified / stat.totalOperators) * 100)
                      : 0;
                  const risk = RISK_CONFIG[stat.risk];
                  return (
                    <TableRow key={stat.processId}>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500 }}
                        >
                          {stat.processName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {stat.totalOperators}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 220 }}>
                        <ProgressBar
                          certified={stat.certified}
                          inProgress={stat.inProgress}
                          total={stat.totalOperators}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color:
                              pct >= 80
                                ? '#16a34a'
                                : pct >= 50
                                  ? '#d97706'
                                  : '#dc2626',
                          }}
                        >
                          {pct}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Pills
                          label={risk.label}
                          type={risk.type}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>

        {/* Pending operators */}
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h6">
            Operadores pendientes de certificar
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Operador</TableCell>
                  <TableCell>Proceso</TableCell>
                  <TableCell>Operación</TableCell>
                  <TableCell>Intento</TableCell>
                  <TableCell>Último intento</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {MOCK_PENDING_OPERATORS.map(op => (
                  <TableRow key={`${op.operatorId}-${op.operationName}`}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        {op.operatorName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {op.processName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {op.operationName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {op.attemptNumber}/{op.maxAttempts}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {op.lastAttemptDate
                          ? formatDate(op.lastAttemptDate)
                          : '—'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </DashboardLayout>
  );
};

export default SupervisorDashboard;

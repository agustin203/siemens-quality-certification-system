import { useState } from 'react';

import {
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconMinus,
} from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Button from '@material-hu/components/design-system/Buttons/Button';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';
import Title from '@material-hu/components/design-system/Title';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import {
  ADMIN_OPERATIONS_BY_PROCESS,
  ADMIN_OPERATOR_MATRIX,
  ADMIN_PROCESS_OPTIONS,
} from '../constants';
import { type CellStatus } from '../types';

const STATUS_ICON: Record<CellStatus, React.ReactNode> = {
  approved: (
    <IconCircleCheck
      size={18}
      color="#16a34a"
    />
  ),
  rejected: (
    <IconCircleX
      size={18}
      color="#dc2626"
    />
  ),
  in_progress: (
    <IconClock
      size={18}
      color="#d97706"
    />
  ),
  none: (
    <IconMinus
      size={16}
      color="#9ca3af"
    />
  ),
};

const STATUS_LABEL: Record<CellStatus, string> = {
  approved: 'Aprobado',
  rejected: 'Reprobado',
  in_progress: 'En proceso',
  none: '—',
};

const AdminDashboard = () => {
  const [selectedProcess, setSelectedProcess] = useState('1');

  const operations = ADMIN_OPERATIONS_BY_PROCESS[selectedProcess] ?? [];
  const operators = ADMIN_OPERATOR_MATRIX[selectedProcess] ?? [];

  const totalOperators = operators.length;
  const certified = operators.filter(op =>
    Object.values(op.certifications).some(s => s === 'approved'),
  ).length;
  const inProgress = operators.filter(op =>
    Object.values(op.certifications).some(s => s === 'in_progress'),
  ).length;
  const uncertified = operators.filter(op =>
    Object.values(op.certifications).every(s => s === 'none'),
  ).length;

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Title
          title="Dashboard global"
          description="Estado de certificación por operador y operación"
        />

        {/* Process filter */}
        <Stack sx={{ flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
          {ADMIN_PROCESS_OPTIONS.map(p => (
            <Button
              key={p.value}
              size="small"
              variant={selectedProcess === p.value ? 'primary' : 'secondary'}
              onClick={() => setSelectedProcess(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </Stack>

        {/* Summary chips */}
        <Stack sx={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
          {[
            {
              label: 'Total operadores',
              value: totalOperators,
              color: 'new.text.neutral.default',
            },
            { label: 'Con aprobación', value: certified, color: '#16a34a' },
            { label: 'En proceso', value: inProgress, color: '#d97706' },
            { label: 'Sin certificar', value: uncertified, color: '#9ca3af' },
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

        {/* Matrix table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Operador</TableCell>
                {operations.map(op => (
                  <TableCell
                    key={op.value}
                    align="center"
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600 }}
                    >
                      {op.label}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell align="center">Progreso</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operators.map(row => {
                const approvedCount = Object.values(row.certifications).filter(
                  s => s === 'approved',
                ).length;
                return (
                  <TableRow key={row.operatorId}>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        {row.operatorName}
                      </Typography>
                    </TableCell>
                    {operations.map(op => {
                      const status: CellStatus =
                        row.certifications[op.value] ?? 'none';
                      return (
                        <TableCell
                          key={op.value}
                          align="center"
                        >
                          <Stack
                            sx={{
                              alignItems: 'center',
                              title: STATUS_LABEL[status],
                            }}
                          >
                            {STATUS_ICON[status]}
                          </Stack>
                        </TableCell>
                      );
                    })}
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            approvedCount === operations.length
                              ? '#16a34a'
                              : 'new.text.neutral.default',
                        }}
                      >
                        {approvedCount}/{operations.length}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Legend */}
        <Stack sx={{ flexDirection: 'row', gap: 3, flexWrap: 'wrap' }}>
          {(Object.entries(STATUS_ICON) as [CellStatus, React.ReactNode][]).map(
            ([status, icon]) => (
              <Stack
                key={status}
                sx={{ flexDirection: 'row', alignItems: 'center', gap: 0.5 }}
              >
                {icon}
                <Typography
                  variant="caption"
                  sx={{ color: 'new.text.neutral.subtle' }}
                >
                  {STATUS_LABEL[status]}
                </Typography>
              </Stack>
            ),
          )}
        </Stack>
      </Stack>
    </DashboardLayout>
  );
};

export default AdminDashboard;

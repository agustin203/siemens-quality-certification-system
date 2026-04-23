import { IconHistory } from '@material-hu/icons/tabler';
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
import { MOCK_ATTEMPTS } from '../constants';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const OperatorHistory = () => {
  const attempts = [...MOCK_ATTEMPTS].sort(
    (a, b) =>
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
  );

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Title
          title="Historial de evaluaciones"
          description="Todos tus intentos de certificación"
        />

        {attempts.length === 0 ? (
          <StateCard
            Icon={IconHistory}
            title="Sin historial"
            description="Todavía no tenés evaluaciones registradas."
            slotProps={{
              title: { variant: 'M' },
              avatar: { color: 'default' },
            }}
          />
        ) : (
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
                {attempts.map(attempt => (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {attempt.processName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {attempt.operationName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {attempt.evaluatorName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(attempt.completedAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {attempt.tiempoRegistradoSeg}s
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {attempt.tiempoEstandarSeg}s
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        #{attempt.attemptNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Pills
                        label={
                          attempt.result === 'passed' ? 'APROBADO' : 'REPROBADO'
                        }
                        type={attempt.result === 'passed' ? 'success' : 'error'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default OperatorHistory;

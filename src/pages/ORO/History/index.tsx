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
import { MOCK_ORO_EVALUATIONS } from '../constants';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const OroHistory = () => {
  const evaluations = [...MOCK_ORO_EVALUATIONS].sort(
    (a, b) =>
      new Date(b.evaluatedAt).getTime() - new Date(a.evaluatedAt).getTime(),
  );

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Title
          title="Historial de evaluaciones"
          description="Evaluaciones realizadas por vos como evaluador ORO"
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Operador</TableCell>
                <TableCell>Proceso</TableCell>
                <TableCell>Operación</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Tiempo registrado</TableCell>
                <TableCell>Estándar</TableCell>
                <TableCell>Intento</TableCell>
                <TableCell>Resultado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluations.map(ev => (
                <TableRow key={ev.id}>
                  <TableCell>
                    <Typography variant="body2">{ev.operatorName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: 'new.text.neutral.subtle' }}
                    >
                      {ev.processName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{ev.operationName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(ev.evaluatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                    >
                      {ev.tiempoRegistradoSeg}s
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: 'new.text.neutral.subtle' }}
                    >
                      {ev.tiempoEstandarSeg}s
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: 'new.text.neutral.subtle' }}
                    >
                      #{ev.attemptNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Pills
                      label={ev.result === 'passed' ? 'APROBADO' : 'REPROBADO'}
                      type={ev.result === 'passed' ? 'success' : 'error'}
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

export default OroHistory;

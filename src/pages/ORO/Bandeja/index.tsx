import { useNavigate } from 'react-router-dom';

import { IconClipboardCheck } from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Button from '@material-hu/components/design-system/Buttons/Button';
import Pills from '@material-hu/components/design-system/Pills';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';
import Title from '@material-hu/components/design-system/Title';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { useOroPending } from '../../../services/certifications.hooks';
import { type PendingRequest } from '../types';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const OroBandeja = () => {
  const navigate = useNavigate();
  const { data: requests = [], isLoading } = useOroPending();

  const handleStart = (request: PendingRequest) => {
    navigate(`/oro/evaluation/${request.id}`, { state: request });
  };

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Title
          title="Bandeja de evaluaciones"
          description="Solicitudes pendientes de certificación"
        />

        {isLoading ? null : requests.length === 0 ? (
          <StateCard
            Icon={IconClipboardCheck}
            title="Sin solicitudes pendientes"
            description="No hay solicitudes de certificación para evaluar."
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
                  <TableCell>Operador</TableCell>
                  <TableCell>Proceso</TableCell>
                  <TableCell>Operación</TableCell>
                  <TableCell>T. estándar</TableCell>
                  <TableCell>Solicitud</TableCell>
                  <TableCell>Intento</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map(req => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {req.operatorName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {req.processName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {req.operationName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {req.tiempoEstandarSeg}s
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(req.requestDate)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {req.attemptNumber} / {req.maxAttempts}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {req.status === 'available' ? (
                        <Pills
                          label="Disponible"
                          type="success"
                        />
                      ) : (
                        <Stack sx={{ gap: 0.5 }}>
                          <Pills
                            label="En espera"
                            type="warning"
                          />
                          {req.cooldownUntil && (
                            <Typography
                              variant="caption"
                              sx={{ color: 'new.text.neutral.subtle' }}
                            >
                              Hasta {formatDate(req.cooldownUntil)}
                            </Typography>
                          )}
                        </Stack>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="primary"
                        disabled={req.status === 'cooldown'}
                        onClick={() => handleStart(req)}
                      >
                        Iniciar evaluación
                      </Button>
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

export default OroBandeja;

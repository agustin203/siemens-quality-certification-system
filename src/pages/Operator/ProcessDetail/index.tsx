import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { IconArrowLeft, IconClipboardList } from '@material-hu/icons/tabler';
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
import { useMyCertifications } from '../../../services/certifications.hooks';
import { useProcessOperations } from '../../../services/processes.hooks';

const OperatorProcessDetail = () => {
  const navigate = useNavigate();
  const { processId } = useParams<{ processId: string }>();
  const location = useLocation();
  const processName = location.state as string | undefined;

  const { data: operations = [], isLoading: loadingOps } = useProcessOperations(processId ?? '');
  const { data: myCertifications = [] } = useMyCertifications();

  const getOperationStatus = (operationId: string) => {
    const certs = myCertifications.filter(c => c.operationId === operationId);
    if (certs.some(c => c.status === 'approved'))
      return { label: 'Certificada', type: 'success' as const };
    if (certs.some(c => c.status === 'in_progress'))
      return { label: 'En proceso', type: 'warning' as const };
    return { label: 'Sin certificar', type: 'disabled' as const };
  };

  if (!loadingOps && (!processId || operations.length === 0)) {
    return (
      <DashboardLayout>
        <StateCard
          Icon={IconClipboardList}
          title="Sin operaciones"
          description="Este proceso no tiene operaciones cargadas todavía."
          slotProps={{ title: { variant: 'M' }, avatar: { color: 'default' } }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Stack sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/operator/processes')}
            sx={{ mt: 0.5 }}
          >
            <IconArrowLeft size={20} />
          </IconButton>
          <Title
            title={processName ?? ''}
            description="Estado de tus operaciones"
          />
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Operación</TableCell>
                <TableCell>Tiempo estándar</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operations.map(op => {
                const status = getOperationStatus(op.id);
                return (
                  <TableRow key={op.id}>
                    <TableCell>
                      <Typography variant="body2">{op.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {op.tiempo_estandar_seg}s
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Pills label={status.label} type={status.type} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </DashboardLayout>
  );
};

export default OperatorProcessDetail;

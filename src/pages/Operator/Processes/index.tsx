import { useNavigate } from 'react-router-dom';
import { IconClipboardList } from '@material-hu/icons/tabler';
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
import { OPERATOR_OPERATIONS_BY_PROCESS, PROCESS_FILTER_OPTIONS } from '../constants';

const OperatorProcesses = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Title title="Mis procesos" description="Seleccioná un proceso para ver tus operaciones" />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Proceso</TableCell>
                <TableCell>Operaciones</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {PROCESS_FILTER_OPTIONS.map(process => {
                const ops = OPERATOR_OPERATIONS_BY_PROCESS[process.value] ?? [];
                return (
                  <TableRow key={process.value}>
                    <TableCell>
                      <Typography variant="body2">{process.label}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'new.text.neutral.subtle' }}>
                        {ops.length} operaciones
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          navigate(`/operator/processes/${process.value}`, {
                            state: process.label,
                          })
                        }
                      >
                        Ver detalle
                      </Button>
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

export default OperatorProcesses;

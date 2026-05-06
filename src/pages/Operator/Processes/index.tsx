import { useNavigate } from 'react-router-dom';

import { IconClipboardList } from '@material-hu/icons/tabler';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Button from '@material-hu/components/design-system/Buttons/Button';
import Table from '@material-hu/components/design-system/Table';
import TableBody from '@material-hu/components/design-system/Table/components/TableBody';
import TableCell from '@material-hu/components/design-system/Table/components/TableCell';
import TableContainer from '@material-hu/components/design-system/Table/components/TableContainer';
import TableHead from '@material-hu/components/design-system/Table/components/TableHead';
import TableRow from '@material-hu/components/design-system/Table/components/TableRow';
import Title from '@material-hu/components/design-system/Title';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { useProcessList } from '../../../services/processes.hooks';

const OperatorProcesses = () => {
  const navigate = useNavigate();
  const { data: allProcesses = [], isLoading } = useProcessList();
  const processes = allProcesses.filter(p => p.status === 'published');

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Title
          title="Mis procesos"
          description="Seleccioná un proceso para ver tus operaciones"
        />

        {!isLoading && processes.length === 0 ? (
          <StateCard
            Icon={IconClipboardList}
            title="Sin procesos disponibles"
            description="No hay procesos publicados en este momento."
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
                  <TableCell>Modelo</TableCell>
                  <TableCell>Línea</TableCell>
                  <TableCell>Turno</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {processes.map(process => (
                  <TableRow key={process.id}>
                    <TableCell>
                      <Typography variant="body2">{process.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{process.modelo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{process.linea}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{process.turno}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          navigate(`/operator/processes/${process.id}`, {
                            state: process.nombre,
                          })
                        }
                      >
                        Ver operaciones
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

export default OperatorProcesses;

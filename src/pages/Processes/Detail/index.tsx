import { useNavigate } from 'react-router-dom';

import {
  IconArrowLeft,
  IconClipboardList,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
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
import { useDialogLayer } from '@material-hu/components/layers/Dialogs';
import { useMenuLayer } from '@material-hu/components/layers/Menus';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { STATUS_CONFIG } from '../constants';
import { processesRoutes } from '../routes';
import { type CertificationOperation } from '../types';

import { useProcessDetail } from './hooks/useProcessDetail';

const ProcessDetail = () => {
  const navigate = useNavigate();
  const { openMenu } = useMenuLayer();
  const { openDialog, closeDialog } = useDialogLayer();

  const { process, operations, handleDeleteOperation } = useProcessDetail();

  const openRowMenu = (
    event: React.MouseEvent<HTMLElement>,
    operation: CertificationOperation,
  ) => {
    openMenu({
      anchorEl: event.currentTarget,
      items: [
        {
          id: 'edit',
          title: 'Editar',
          icon: IconEdit,
          onSelect: () => {},
        },
        {
          id: 'delete',
          title: 'Eliminar',
          icon: IconTrash,
          onSelect: () => {
            openDialog({
              title: '¿Eliminar operación?',
              textBody: `Se eliminará "${operation.nombre}" de forma permanente.`,
              primaryButtonProps: {
                children: 'Eliminar',
                color: 'error',
                onClick: () => {
                  handleDeleteOperation(operation.id);
                  closeDialog();
                },
              },
              secondaryButtonProps: {
                children: 'Cancelar',
                onClick: () => closeDialog(),
              },
            });
          },
        },
      ],
    });
  };

  if (!process) {
    return (
      <DashboardLayout>
        <StateCard
          Icon={IconClipboardList}
          title="Proceso no encontrado"
          description="El proceso que buscás no existe o fue eliminado."
          slotProps={{ title: { variant: 'M' }, avatar: { color: 'default' } }}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <IconButton
            onClick={() => navigate(processesRoutes.list())}
            sx={{ mt: 0.5 }}
          >
            <IconArrowLeft size={20} />
          </IconButton>
          <Stack sx={{ flex: 1 }}>
            <Title
              title={process.nombre}
              description={`${process.modelo} · ${process.linea} · ${process.turno} · v${process.version}`}
            />
          </Stack>
          <Stack
            sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, mt: 0.5 }}
          >
            <Pills
              label={STATUS_CONFIG[process.status].label}
              type={STATUS_CONFIG[process.status].type}
            />
            <Button
              startIcon={<IconPlus />}
              onClick={() => {}}
            >
              Nueva operación
            </Button>
          </Stack>
        </Stack>

        {operations.length === 0 ? (
          <StateCard
            Icon={IconClipboardList}
            title="Sin operaciones"
            description="Este proceso aún no tiene operaciones cargadas."
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
                  <TableCell>#</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tiempo estándar (seg)</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {operations.map(op => (
                  <TableRow key={op.id}>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ color: 'new.text.neutral.subtle' }}
                      >
                        {op.orden}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{op.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {op.tiempo_estandar_seg}s
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={e => openRowMenu(e, op)}
                      >
                        <IconDotsVertical size={20} />
                      </IconButton>
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

export default ProcessDetail;

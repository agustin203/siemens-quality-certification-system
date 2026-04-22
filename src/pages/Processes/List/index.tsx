import { useNavigate } from 'react-router-dom';

import {
  IconArchive,
  IconClipboardList,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPlus,
  IconRefresh,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Button from '@material-hu/components/design-system/Buttons/Button';
import Pagination from '@material-hu/components/design-system/Inputs/Pagination';
import Search from '@material-hu/components/design-system/Inputs/Search';
import Select from '@material-hu/components/design-system/Inputs/Select';
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
import { STATUS_CONFIG, STATUS_FILTER_OPTIONS } from '../constants';
import { processesRoutes } from '../routes';
import { type CertificationProcess } from '../types';

import { useProcessList } from './hooks/useProcessList';

const ProcessList = () => {
  const navigate = useNavigate();
  const { openMenu } = useMenuLayer();
  const { openDialog, closeDialog } = useDialogLayer();

  const {
    paginatedProcesses,
    filteredProcesses,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    handleArchive,
    handlePublish,
  } = useProcessList();

  const openRowMenu = (
    event: React.MouseEvent<HTMLElement>,
    process: CertificationProcess,
  ) => {
    const items = [
      {
        id: 'view',
        title: 'Ver detalle',
        icon: IconEye,
        onSelect: () => navigate(processesRoutes.detail(process.id)),
      },
      {
        id: 'edit',
        title: 'Editar',
        icon: IconEdit,
        onSelect: () => {},
      },
      ...(process.status === 'draft'
        ? [
            {
              id: 'publish',
              title: 'Publicar',
              icon: IconRefresh,
              onSelect: () => handlePublish(process.id),
            },
          ]
        : []),
      ...(process.status !== 'archived'
        ? [
            {
              id: 'archive',
              title: 'Archivar',
              icon: IconArchive,
              onSelect: () => {
                openDialog({
                  title: '¿Archivar proceso?',
                  textBody: `Se archivará "${process.nombre}".`,
                  primaryButtonProps: {
                    children: 'Archivar',
                    color: 'error',
                    onClick: () => {
                      handleArchive(process.id);
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
          ]
        : []),
    ];

    openMenu({ anchorEl: event.currentTarget, items });
  };

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 6 }}>
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Title
            title="Procesos"
            description="Gestión de procesos de certificación de calidad"
          />
          <Button
            startIcon={<IconPlus />}
            onClick={() => {}}
          >
            Nuevo proceso
          </Button>
        </Stack>

        <Stack sx={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre..."
            sx={{ flex: 1, maxWidth: 320 }}
          />
          <Select
            value={statusFilter}
            onChange={value => setStatusFilter(value as typeof statusFilter)}
            options={STATUS_FILTER_OPTIONS}
            placeholder="Todos los estados"
            allowClear
            sx={{ minWidth: 200 }}
          />
        </Stack>

        {filteredProcesses.length === 0 ? (
          <StateCard
            Icon={IconClipboardList}
            title="Sin procesos"
            description="No se encontraron procesos que coincidan con los filtros aplicados."
            slotProps={{
              title: { variant: 'M' },
              avatar: { color: 'default' },
            }}
          />
        ) : (
          <Stack sx={{ gap: 4 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Modelo</TableCell>
                    <TableCell>Línea</TableCell>
                    <TableCell>Turno</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProcesses.map(process => (
                    <TableRow key={process.id}>
                      <TableCell>
                        <Stack sx={{ gap: 0.5 }}>
                          <Typography variant="body2">
                            {process.nombre}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: 'new.text.neutral.subtle' }}
                          >
                            v{process.version}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {process.modelo}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{process.linea}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{process.turno}</Typography>
                      </TableCell>
                      <TableCell>
                        <Pills
                          label={STATUS_CONFIG[process.status].label}
                          type={STATUS_CONFIG[process.status].type}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={e => openRowMenu(e, process)}
                        >
                          <IconDotsVertical size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack sx={{ alignItems: 'center' }}>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChangePage={setPage}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default ProcessList;

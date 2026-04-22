import {
  IconBan,
  IconCertificate,
  IconDotsVertical,
  IconPlus,
} from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import StateCard from '@material-hu/components/composed-components/StateCard';
import Button from '@material-hu/components/design-system/Buttons/Button';
import Pagination from '@material-hu/components/design-system/Inputs/Pagination';
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
import {
  CERTIFICATION_STATUS_CONFIG,
  CERTIFICATION_STATUS_FILTER_OPTIONS,
  PERIOD_FILTER_OPTIONS,
  PROCESS_FILTER_OPTIONS,
} from '../constants';
import { type CertificationRequest, type CertificationStatus } from '../types';

import { useCertificationList } from './hooks/useCertificationList';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

const OperatorHome = () => {
  const { openMenu } = useMenuLayer();
  const { openDialog, closeDialog } = useDialogLayer();

  const {
    filteredCertifications,
    paginatedCertifications,
    statusFilter,
    setStatusFilter,
    processFilter,
    setProcessFilter,
    periodFilter,
    setPeriodFilter,
    page,
    setPage,
    totalPages,
    handleCancel,
  } = useCertificationList();

  const openRowMenu = (
    event: React.MouseEvent<HTMLElement>,
    certification: CertificationRequest,
  ) => {
    const items = [
      ...(certification.status === 'in_progress'
        ? [
            {
              id: 'cancel',
              title: 'Cancelar',
              icon: IconBan,
              onSelect: () => {
                openDialog({
                  title: '¿Cancelar solicitud?',
                  textBody: `Se cancelará la solicitud de certificación para "${certification.operationName}".`,
                  primaryButtonProps: {
                    children: 'Cancelar solicitud',
                    color: 'error',
                    onClick: () => {
                      handleCancel(certification.id);
                      closeDialog();
                    },
                  },
                  secondaryButtonProps: {
                    children: 'Volver',
                    onClick: () => closeDialog(),
                  },
                });
              },
            },
          ]
        : []),
    ];

    if (items.length > 0) {
      openMenu({ anchorEl: event.currentTarget, items });
    }
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
            title="Mis certificaciones"
            description="Seguimiento de tus certificaciones de calidad"
          />
          <Button
            startIcon={<IconPlus />}
            size="large"
          >
            Nueva certificación
          </Button>
        </Stack>

        <Stack sx={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
          <Select
            value={statusFilter}
            onChange={value =>
              setStatusFilter(value as CertificationStatus | undefined)
            }
            options={CERTIFICATION_STATUS_FILTER_OPTIONS}
            placeholder="Todos los estados"
            allowClear
            sx={{ minWidth: 180 }}
          />
          <Select
            value={processFilter}
            onChange={value => setProcessFilter(value as string | undefined)}
            options={PROCESS_FILTER_OPTIONS}
            placeholder="Todos los procesos"
            allowClear
            sx={{ minWidth: 200 }}
          />
          <Select
            value={periodFilter}
            onChange={value =>
              setPeriodFilter(value as '30d' | '90d' | '365d' | undefined)
            }
            options={PERIOD_FILTER_OPTIONS}
            placeholder="Todo el tiempo"
            allowClear
            sx={{ minWidth: 180 }}
          />
        </Stack>

        {filteredCertifications.length === 0 ? (
          <StateCard
            Icon={IconCertificate}
            title="Sin certificaciones"
            description="No se encontraron certificaciones que coincidan con los filtros aplicados."
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
                    <TableCell>Proceso</TableCell>
                    <TableCell>Operación</TableCell>
                    <TableCell>Fecha solicitud</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Vencimiento</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCertifications.map(cert => (
                    <TableRow key={cert.id}>
                      <TableCell>
                        <Typography variant="body2">
                          {cert.processName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {cert.operationName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(cert.requestDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Pills
                          label={CERTIFICATION_STATUS_CONFIG[cert.status].label}
                          type={CERTIFICATION_STATUS_CONFIG[cert.status].type}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {cert.expirationDate
                            ? formatDate(cert.expirationDate)
                            : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {cert.status === 'in_progress' && (
                          <IconButton
                            size="small"
                            onClick={e => openRowMenu(e, cert)}
                          >
                            <IconDotsVertical size={20} />
                          </IconButton>
                        )}
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

export default OperatorHome;

import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';

import { IconArrowLeft } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Button from '@material-hu/components/design-system/Buttons/Button';
import Pills from '@material-hu/components/design-system/Pills';
import { useDialogLayer } from '@material-hu/components/layers/Dialogs';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { useSubmitAttempt } from '../../../services/certifications.hooks';
import { type PendingRequest } from '../types';

type SignatureState = {
  request: PendingRequest;
  samples: number[];
  average: number;
  passed: boolean;
};

const OroSignature = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openDialog, closeDialog } = useDialogLayer();
  const state = location.state as SignatureState | undefined;
  const sigRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const submitAttempt = useSubmitAttempt();

  if (!state) {
    return (
      <DashboardLayout>
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Typography variant="h6">Sesión no encontrada.</Typography>
          <Button
            onClick={() => navigate('/oro')}
            variant="secondary"
            sx={{ mt: 2 }}
          >
            Volver a la bandeja
          </Button>
        </Stack>
      </DashboardLayout>
    );
  }

  const { request, average, passed } = state;

  const handleClear = () => {
    sigRef.current?.clear();
    setIsEmpty(true);
  };

  const handleConfirm = () => {
    openDialog({
      title: passed ? 'Confirmar aprobación' : 'Confirmar resultado',
      textBody: passed
        ? `La evaluación de "${request.operationName}" de ${request.operatorName} quedará registrada como APROBADA con un promedio de ${average.toFixed(2)}s.`
        : `La evaluación de "${request.operationName}" de ${request.operatorName} quedará registrada como REPROBADA con un promedio de ${average.toFixed(2)}s.`,
      primaryButtonProps: {
        children: 'Confirmar y cerrar',
        onClick: () => {
          closeDialog();
          submitAttempt.mutate(
            {
              requestId: request.id,
              tiempoRegistradoSeg: parseFloat(average.toFixed(2)),
              result: passed ? 'passed' : 'failed',
            },
            {
              onSettled: () => navigate('/oro'),
            },
          );
        },
      },
      secondaryButtonProps: {
        children: 'Cancelar',
        onClick: () => closeDialog(),
      },
    });
  };

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 4, maxWidth: 640, mx: 'auto', width: '100%' }}>
        {/* Header */}
        <Stack sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ mt: 0.5 }}
          >
            <IconArrowLeft size={20} />
          </IconButton>
          <Stack sx={{ gap: 0.5 }}>
            <Typography variant="h6">Firma del evaluador ORO</Typography>
            <Typography
              variant="body2"
              sx={{ color: 'new.text.neutral.subtle' }}
            >
              {request.operationName} · {request.operatorName}
            </Typography>
          </Stack>
        </Stack>

        {/* Result summary */}
        <Stack
          sx={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 3,
            border: '1px solid',
            borderColor: 'new.border.neutral.default',
            borderRadius: '8px',
          }}
        >
          <Stack sx={{ gap: 0.5 }}>
            <Typography
              variant="body2"
              sx={{ color: 'new.text.neutral.subtle' }}
            >
              Promedio registrado
            </Typography>
            <Typography variant="h6">{average.toFixed(2)}s</Typography>
            <Typography
              variant="caption"
              sx={{ color: 'new.text.neutral.subtle' }}
            >
              Estándar: {request.tiempoEstandarSeg}s · Umbral:{' '}
              {(request.tiempoEstandarSeg / 0.8).toFixed(1)}s
            </Typography>
          </Stack>
          <Pills
            label={passed ? 'APROBADO' : 'REPROBADO'}
            type={passed ? 'success' : 'error'}
          />
        </Stack>

        {/* Signature canvas */}
        <Stack sx={{ gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: 'new.text.neutral.subtle' }}
          >
            Firmá en el recuadro para confirmar la evaluación
          </Typography>
          <Stack
            sx={{
              border: '1px solid',
              borderColor: 'new.border.neutral.default',
              borderRadius: '8px',
              overflow: 'hidden',
              bgcolor: 'new.background.surface.default',
            }}
          >
            <SignatureCanvas
              ref={sigRef}
              penColor="#1a1a2e"
              canvasProps={{
                width: 600,
                height: 200,
                style: { width: '100%', height: 200 },
              }}
              onEnd={() => setIsEmpty(false)}
            />
          </Stack>
          <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              variant="text"
              size="small"
              onClick={handleClear}
            >
              Limpiar firma
            </Button>
          </Stack>
        </Stack>

        {/* Actions */}
        <Stack
          sx={{ flexDirection: 'row', gap: 2, justifyContent: 'flex-end' }}
        >
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <Button
            variant="primary"
            disabled={isEmpty || submitAttempt.isPending}
            onClick={handleConfirm}
          >
            Confirmar evaluación
          </Button>
        </Stack>
      </Stack>
    </DashboardLayout>
  );
};

export default OroSignature;

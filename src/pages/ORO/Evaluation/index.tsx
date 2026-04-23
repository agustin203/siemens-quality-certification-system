import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { IconArrowLeft } from '@material-hu/icons/tabler';
import IconButton from '@material-hu/mui/IconButton';
import Stack from '@material-hu/mui/Stack';
import Typography from '@material-hu/mui/Typography';

import Button from '@material-hu/components/design-system/Buttons/Button';
import Pills from '@material-hu/components/design-system/Pills';

import { DashboardLayout } from '../../../layouts/DashboardLayout';
import { type PendingRequest } from '../types';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  annotationPlugin,
);

type Phase = 'idle' | 'running' | 'between' | 'results';

const TOTAL_SAMPLES = 10;

const formatElapsed = (ms: number) => {
  const totalSecs = ms / 1000;
  const mins = Math.floor(totalSecs / 60);
  const secs = (totalSecs % 60).toFixed(2).padStart(5, '0');
  return mins > 0 ? `${mins}:${secs}` : `${secs}s`;
};

const OroEvaluation = () => {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();
  const location = useLocation();
  const request = location.state as PendingRequest | undefined;

  const [phase, setPhase] = useState<Phase>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [samples, setSamples] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startSample = () => {
    startTimeRef.current = Date.now();
    setElapsed(0);
    setPhase('running');
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 50);
  };

  const stopSample = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const time = parseFloat(
      ((Date.now() - startTimeRef.current) / 1000).toFixed(2),
    );
    const newSamples = [...samples, time];
    setSamples(newSamples);
    if (newSamples.length >= TOTAL_SAMPLES) {
      setPhase('results');
    } else {
      setPhase('between');
    }
  };

  if (!request) {
    return (
      <DashboardLayout>
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Typography variant="h6">Solicitud no encontrada.</Typography>
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

  const threshold = request.tiempoEstandarSeg / 0.8;
  const average =
    samples.length > 0
      ? samples.reduce((a, b) => a + b, 0) / samples.length
      : 0;
  const passed =
    samples.length === TOTAL_SAMPLES &&
    request.tiempoEstandarSeg / average >= 0.8;

  const currentSample = samples.length + 1;

  return (
    <DashboardLayout>
      <Stack sx={{ gap: 4, maxWidth: 720, mx: 'auto', width: '100%' }}>
        {/* Header */}
        <Stack sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 2 }}>
          <IconButton
            onClick={() => navigate('/oro')}
            sx={{ mt: 0.5 }}
          >
            <IconArrowLeft size={20} />
          </IconButton>
          <Stack>
            <Typography variant="h6">{request.operationName}</Typography>
            <Typography
              variant="body2"
              sx={{ color: 'new.text.neutral.subtle' }}
            >
              {request.processName} · Operador: {request.operatorName} · T.
              estándar: {request.tiempoEstandarSeg}s
            </Typography>
          </Stack>
        </Stack>

        {phase !== 'results' && (
          <>
            {/* Sample counter */}
            <Stack sx={{ alignItems: 'center', gap: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: 'new.text.neutral.subtle',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                {phase === 'idle'
                  ? 'Listo para comenzar'
                  : phase === 'running'
                    ? `Muestra ${currentSample} de ${TOTAL_SAMPLES}`
                    : `Muestra ${samples.length} de ${TOTAL_SAMPLES} registrada`}
              </Typography>

              {/* Big timer */}
              <Typography
                sx={{
                  fontSize: 72,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color:
                    phase === 'running'
                      ? 'new.text.brand.default'
                      : 'new.text.neutral.default',
                  lineHeight: 1,
                  letterSpacing: -2,
                }}
              >
                {phase === 'running'
                  ? formatElapsed(elapsed)
                  : phase === 'between'
                    ? `${samples[samples.length - 1]}s`
                    : `${request.tiempoEstandarSeg}s`}
              </Typography>

              {phase !== 'running' && (
                <Typography
                  variant="caption"
                  sx={{ color: 'new.text.neutral.subtle' }}
                >
                  {phase === 'idle'
                    ? 'tiempo estándar de referencia'
                    : 'tiempo registrado'}
                </Typography>
              )}
            </Stack>

            {/* Action button */}
            <Stack sx={{ alignItems: 'center' }}>
              {phase === 'idle' && (
                <Button
                  size="large"
                  variant="primary"
                  onClick={startSample}
                >
                  Iniciar muestra 1
                </Button>
              )}
              {phase === 'running' && (
                <Button
                  size="large"
                  color="error"
                  onClick={stopSample}
                >
                  Detener
                </Button>
              )}
              {phase === 'between' && (
                <Button
                  size="large"
                  variant="primary"
                  onClick={startSample}
                >
                  Iniciar muestra {currentSample}
                </Button>
              )}
            </Stack>

            {/* Samples so far */}
            {samples.length > 0 && (
              <Stack
                sx={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                {samples.map((s, i) => (
                  <Stack
                    key={i}
                    sx={{
                      px: 2,
                      py: 1,
                      border: '1px solid',
                      borderColor: 'new.border.neutral.default',
                      borderRadius: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: 'new.text.neutral.subtle' }}
                    >
                      #{i + 1}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600 }}
                    >
                      {s}s
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </>
        )}

        {/* Results */}
        {phase === 'results' && (
          <Stack sx={{ gap: 4 }}>
            {/* Verdict */}
            <Stack sx={{ alignItems: 'center', gap: 2 }}>
              <Pills
                label={passed ? 'APROBADO' : 'REPROBADO'}
                type={passed ? 'success' : 'error'}
              />
              <Typography sx={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>
                {average.toFixed(2)}s
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'new.text.neutral.subtle' }}
              >
                promedio de {TOTAL_SAMPLES} muestras · estándar:{' '}
                {request.tiempoEstandarSeg}s · umbral: {threshold.toFixed(1)}s
              </Typography>
            </Stack>

            {/* Chart */}
            <Stack sx={{ height: 240 }}>
              <Bar
                data={{
                  labels: samples.map((_, i) => `#${i + 1}`),
                  datasets: [
                    {
                      label: 'Tiempo (s)',
                      data: samples,
                      backgroundColor: samples.map(s =>
                        s <= threshold
                          ? 'rgba(34,197,94,0.7)'
                          : 'rgba(239,68,68,0.7)',
                      ),
                      borderRadius: 4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    annotation: {
                      annotations: {
                        threshold: {
                          type: 'line',
                          yMin: threshold,
                          yMax: threshold,
                          borderColor: 'rgba(239,68,68,0.9)',
                          borderWidth: 2,
                          borderDash: [6, 3],
                          label: {
                            display: true,
                            content: `Umbral ${threshold.toFixed(1)}s`,
                            position: 'end',
                            backgroundColor: 'rgba(239,68,68,0.1)',
                            color: 'rgba(239,68,68,0.9)',
                            font: { size: 11 },
                          },
                        },
                        standard: {
                          type: 'line',
                          yMin: request.tiempoEstandarSeg,
                          yMax: request.tiempoEstandarSeg,
                          borderColor: 'rgba(59,130,246,0.7)',
                          borderWidth: 2,
                          borderDash: [4, 4],
                          label: {
                            display: true,
                            content: `Estándar ${request.tiempoEstandarSeg}s`,
                            position: 'start',
                            backgroundColor: 'rgba(59,130,246,0.1)',
                            color: 'rgba(59,130,246,0.9)',
                            font: { size: 11 },
                          },
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      grid: { color: 'rgba(0,0,0,0.06)' },
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                }}
              />
            </Stack>

            {/* Action */}
            <Stack sx={{ alignItems: 'center' }}>
              <Button
                size="large"
                variant="primary"
                onClick={() =>
                  navigate(`/oro/signature/${requestId}`, {
                    state: { request, samples, average, passed },
                  })
                }
              >
                Continuar a firma
              </Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default OroEvaluation;

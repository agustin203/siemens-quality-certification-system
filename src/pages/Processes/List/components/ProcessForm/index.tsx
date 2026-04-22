import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stack from '@material-hu/mui/Stack';

import FormInputClassic from '@material-hu/components/design-system/Inputs/Classic/form';
import FormInputSelect from '@material-hu/components/design-system/Inputs/Select/form';

const schema = z.object({
  nombre: z.string().min(1, 'Requerido').max(100),
  modelo: z.string().min(1, 'Requerido'),
  familia: z.string().min(1, 'Requerido'),
  linea: z.string().min(1, 'Requerido'),
  turno: z.string().min(1, 'Requerido'),
});

export type ProcessFormValues = {
  nombre: string;
  modelo: string;
  familia: string;
  linea: string;
  turno: string;
};

type ProcessFormProps = {
  defaultValues?: Partial<ProcessFormValues>;
  onSubmit: (data: ProcessFormValues) => void;
};

const TURNO_OPTIONS = [
  { value: 'Mañana', label: 'Mañana' },
  { value: 'Tarde', label: 'Tarde' },
  { value: 'Noche', label: 'Noche' },
];

const ProcessForm = ({ defaultValues, onSubmit }: ProcessFormProps) => {
  const methods = useForm<ProcessFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      modelo: '',
      familia: '',
      linea: '',
      turno: '',
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        id="proceso-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Stack sx={{ gap: 3, p: 3 }}>
          <FormInputClassic
            name="nombre"
            inputProps={{
              label: 'Nombre',
              placeholder: 'Ej: Q120 línea 1 Polo',
              hasCounter: true,
              maxLength: 100,
            }}
          />
          <FormInputClassic
            name="modelo"
            inputProps={{ label: 'Modelo', placeholder: 'Ej: Q120' }}
          />
          <FormInputClassic
            name="familia"
            inputProps={{ label: 'Familia', placeholder: 'Ej: Polo' }}
          />
          <FormInputClassic
            name="linea"
            inputProps={{ label: 'Línea', placeholder: 'Ej: Línea 1' }}
          />
          <FormInputSelect
            name="turno"
            inputProps={{ label: 'Turno', options: TURNO_OPTIONS }}
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export default ProcessForm;

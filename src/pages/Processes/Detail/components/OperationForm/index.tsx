import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stack from '@material-hu/mui/Stack';

import FormInputClassic from '@material-hu/components/design-system/Inputs/Classic/form';

import { type CertificationOperation } from '../../../types';

const schema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  tiempo_estandar_seg: z.coerce.number().positive('Debe ser mayor a 0'),
});

export type OperationFormValues = {
  nombre: string;
  tiempo_estandar_seg: number;
};

type Props = {
  defaultValues?: Pick<
    CertificationOperation,
    'nombre' | 'tiempo_estandar_seg'
  >;
  onSubmit: (values: OperationFormValues) => void;
};

const OperationForm = ({ defaultValues, onSubmit }: Props) => {
  const methods = useForm<OperationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? '',
      tiempo_estandar_seg: defaultValues?.tiempo_estandar_seg,
    },
  });

  return (
    <FormProvider {...methods}>
      <form
        id="operation-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Stack sx={{ gap: 3, p: 3 }}>
          <FormInputClassic
            name="nombre"
            inputProps={{
              label: 'Nombre de la operación',
              placeholder: 'Ej: Soldadura de contacto',
            }}
          />
          <FormInputClassic
            name="tiempo_estandar_seg"
            inputProps={{
              label: 'Tiempo estándar (seg)',
              placeholder: 'Ej: 15',
              type: 'number',
            }}
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export default OperationForm;

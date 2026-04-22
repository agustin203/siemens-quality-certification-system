import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Stack from '@material-hu/mui/Stack';

import FormInputSelect from '@material-hu/components/design-system/Inputs/Select/form';

import {
  OPERATOR_OPERATIONS_BY_PROCESS,
  PROCESS_FILTER_OPTIONS,
} from '../../../constants';

const schema = z.object({
  processId: z.string().min(1, 'Requerido'),
  operationId: z.string().min(1, 'Requerido'),
});

export type NewCertificationFormValues = {
  processId: string;
  operationId: string;
};

type NewCertificationFormProps = {
  onSubmit: (data: NewCertificationFormValues) => void;
};

const NewCertificationForm = ({ onSubmit }: NewCertificationFormProps) => {
  const methods = useForm<NewCertificationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { processId: '', operationId: '' },
  });

  const { setValue } = methods;
  const processId = methods.watch('processId');
  const operationOptions = OPERATOR_OPERATIONS_BY_PROCESS[processId] ?? [];

  useEffect(() => {
    if (processId !== undefined) {
      setValue('operationId', '');
    }
  }, [processId, setValue]);

  return (
    <FormProvider {...methods}>
      <form
        id="nueva-certificacion-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Stack sx={{ gap: 3, p: 3 }}>
          <FormInputSelect
            name="processId"
            inputProps={{
              label: 'Proceso',
              placeholder: 'Seleccioná un proceso',
              options: PROCESS_FILTER_OPTIONS,
            }}
          />
          <FormInputSelect
            name="operationId"
            inputProps={{
              label: 'Operación',
              placeholder: processId
                ? 'Seleccioná una operación'
                : 'Primero seleccioná un proceso',
              options: operationOptions,
              disabled: !processId,
            }}
          />
        </Stack>
      </form>
    </FormProvider>
  );
};

export default NewCertificationForm;

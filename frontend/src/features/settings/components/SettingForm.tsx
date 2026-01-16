import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Alert from '~/components/Alert';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Select from '~/components/Select';
import { SYSTEM_VAR_TYPES } from '~/constants/arrays';
import {
  CancelIcon,
  ClearIcon,
  DescriptionIcon,
  SaveIcon,
  SysKeyIcon,
  UpdateIcon,
  ValueIcon,
} from '~/constants/iconNames';
import {
  CancelText,
  ClearText,
  DescriptionText,
  EditSysVarAdvice,
  ErrorTagText,
  InvalidSettingValueTypeText,
  KeyText,
  NewSysVarAdvice,
  OkTagText,
  OpRollbackText,
  SaveText,
  SavingText,
  SettingCreatedText,
  SettingUpdatedText,
  SysSettingKeyTakenText,
  UpdateText,
  UpdatingText,
  ValueText,
} from '~/constants/strings';
import { longSwalDismissalTime } from '~/constants/values';
import type { Setting } from '~/types/setting';

interface SettingFormProps {
  setting?: Setting;
  onSubmit: (data: any) => Promise<any>;
  onSubmittingChange?: (value: boolean) => void;
  closeParentModal?: () => void;
}

export default function SettingForm({
  setting,
  onSubmit,
  onSubmittingChange,
  closeParentModal,
}: SettingFormProps) {
  const isEdit = Boolean(setting);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      key: setting?.key ?? '',
      value: setting?.value ?? '',
      valueType: setting?.valueType ?? SYSTEM_VAR_TYPES[0].value,
      description: setting?.description ?? '',
    },
  });

  const valueType = watch('valueType');

  const submitHandler = async (data: any) => {
    try {
      await onSubmit(data);

      await Swal.fire({
        icon: 'success',
        title: OkTagText,
        html: isEdit ? SettingUpdatedText : SettingCreatedText,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      });

      if (isEdit) {
        closeParentModal?.();
      } else {
        reset();
        closeParentModal?.();
      }
    } catch (err: any) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => {
          const field = e.field as 'key' | 'value' | 'valueType' | 'description';

          setError(field, {
            message:
              field === 'key'
                ? SysSettingKeyTakenText
                : field === 'valueType'
                  ? InvalidSettingValueTypeText
                  : e.message,
          });
        });
        return;
      }

      await Swal.fire({
        icon: 'error',
        title: OpRollbackText,
        text: ErrorTagText,
      });
      window.location.reload();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className='w-full space-y-2 md:grid md:grid-cols-1 md:gap-2 md:space-y-0'
    >
      {!isEdit && (
        <Alert
          type='info'
          variant='outline'
          message={NewSysVarAdvice}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}
      {isEdit && (
        <Alert
          type='error'
          variant='outline'
          message={EditSysVarAdvice}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}
      <Input
        placeholder={KeyText}
        icon={SysKeyIcon}
        errorMessage={errors.key?.message}
        disabled={isSubmitting}
        {...register('key', {
          required: 'La clave es obligatoria.',
          minLength: { value: 3, message: 'La clave debe tener entre 3 y 200 carácteres.' },
          maxLength: { value: 200, message: 'La clave no puede superar los 200 carácteres.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Select
        options={SYSTEM_VAR_TYPES}
        width='w-full'
        disabled={isSubmitting}
        {...register('valueType', { required: true })}
      />

      <Input
        placeholder={ValueText}
        icon={ValueIcon}
        errorMessage={errors.value?.message}
        disabled={isSubmitting}
        {...register('value', {
          required: 'El valor es obligatorio',
          validate: (v) => {
            switch (valueType) {
              case 'double':
              case 'decimal':
                return /^-?\d+(\.\d+)?$/.test(v) || 'Debe ser un número decimal';

              case 'integer':
                return /^-?\d+$/.test(v) || 'Debe ser un número entero';

              case 'boolean':
                return /^(true|false)$/i.test(v) || 'Debe ser true o false';

              case 'array':
                try {
                  const normalized = v.replace(/'/g, '"');
                  const parsed = JSON.parse(normalized);
                  return Array.isArray(parsed) || 'Debe ser una lista válida';
                } catch {
                  return 'Formato de lista inválido';
                }

              case 'string':
              case 'other':
              default:
                return v.length > 0 || 'Debe contener texto';
            }
          },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Input
        placeholder={DescriptionText}
        icon={DescriptionIcon}
        disabled={isSubmitting}
        errorMessage={errors.description?.message}
        {...register('description', {
          required: 'Debe ingresar una descripción.',
          minLength: { value: 3, message: 'La descripción debe tener entre 3 y 150 carácteres.' },
          maxLength: { value: 150, message: 'La descripción no puede superar los 150 carácteres.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      <div className='col-span-full flex w-full flex-col items-center md:w-auto md:mt-3'>
        <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
          <Button
            type='button'
            className='join-item'
            color='btn-error'
            onClick={() => closeParentModal?.()}
            label={CancelText}
            icon={CancelIcon}
            disabled={isSubmitting}
          />

          <Button
            type='button'
            className='join-item'
            label={ClearText}
            icon={ClearIcon}
            color='btn-secondary'
            onClick={() => reset()}
            disabled={isSubmitting}
          />

          <Button
            type='submit'
            className='join-item'
            disabled={isSubmitting}
            label={
              isSubmitting ? (isEdit ? UpdatingText : SavingText) : isEdit ? UpdateText : SaveText
            }
            icon={isEdit ? UpdateIcon : SaveIcon}
            color='btn-success'
          />
        </div>
      </div>
    </form>
  );
}

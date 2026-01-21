import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  AddressText,
  CancelText,
  ClearText,
  ErrorTagText,
  NameText,
  OkTagText,
  OpRollbackText,
  PhoneText,
  RucText,
  SaveText,
  SavingText,
  StoreCreatedText,
  StoreRucTakenText,
  StoreUpdatedText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { swalDismissalTime } from '~/constants/values';
import Input from '~/components/Input';
import {
  AddressIcon,
  CancelIcon,
  ClearIcon,
  NameIcon,
  PhoneIcon,
  RucIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import Button from '~/components/Button';
import { useAuth } from '~/context/authContext';
import { hasAbilities } from '~/utils/helpers';

export interface StoreFormData {
  name: string;
  ruc: string;
  address: string;
  phone: string;
}

interface StoreFormProps {
  defaultValues?: Partial<StoreFormData>;
  onSubmit: (data: StoreFormData) => Promise<any>;
}

export default function StoreForm({ defaultValues, onSubmit }: StoreFormProps) {
  const isEdit = Boolean(defaultValues?.name);
  const authStore = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<StoreFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const submitHandler = async (data: StoreFormData) => {
    try {
      await onSubmit(data).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? StoreUpdatedText : StoreCreatedText,
          timer: swalDismissalTime,
          showConfirmButton: false,
        }).then((r) => {
          if (r.dismiss || r.isDismissed) {
            isEdit ? window.location.reload() : reset();
          }
        });
      });
    } catch (err: any) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => {
          const field = e.field as keyof StoreFormData;
          setError(field, { message: field === 'ruc' ? StoreRucTakenText : e.message });
        });
        return;
      }

      Swal.fire({
        icon: 'error',
        title: OpRollbackText,
        text: ErrorTagText,
      }).then((r) => {
        if (r.dismiss || r.isDismissed || r.isConfirmed) {
          window.location.reload();
        }
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className='w-full space-y-2 grid md:gap-2 md:space-y-0'
    >
      <Input
        disabled={isSubmitting}
        placeholder={NameText}
        icon={NameIcon}
        {...register('name', {
          required: 'Los nombres son obligatorios.',
          validate: {
            notBlank: (v) =>
              v.trim().length > 0 || 'Los nombres no pueden estar vacío ni contener solo espacios.',
            noLeadingSpace: (v) =>
              !v.startsWith(' ') || 'Los nombres no deben comenzar con espacios.',
          },
          minLength: { value: 3, message: 'Minímo 3 caracteres.' },
          maxLength: { value: 30, message: 'Máximo 30 caracteres.' },
        })}
        errorMessage={errors.name?.message}
      />

      <Input
        disabled={isSubmitting}
        placeholder={RucText.toUpperCase()}
        icon={RucIcon}
        {...register('ruc', {
          required: 'El RUC es obligatorio.',
          pattern: {
            value: /^\d{11}$/,
            message: 'El RUC debe contener exactamente 11 dígitos.',
          },
        })}
        errorMessage={errors.ruc?.message}
      />

      <Input
        disabled={isSubmitting}
        placeholder={AddressText}
        icon={AddressIcon}
        {...register('address', {
          required: 'La dirección es obligatoria.',
          validate: {
            notBlank: (v) =>
              v.trim().length > 0 || 'La dirección no puede estar vacía ni contener solo espacios.',
            noLeadingSpace: (v) =>
              !v.startsWith(' ') || 'La dirección no debe comenzar con espacios.',
          },
          maxLength: { value: 150, message: 'Máximo 150 caracteres.' },
        })}
        errorMessage={errors.address?.message}
      />

      <Input
        disabled={isSubmitting}
        placeholder={PhoneText}
        icon={PhoneIcon}
        {...register('phone', {
          required: 'El teléfono es obligatorio.',
          pattern: {
            value: /^\+?\d{6,15}$/,
            message: 'Debe contener entre 6 y 15 dígitos y puede comenzar con +.',
          },
        })}
        errorMessage={errors.phone?.message}
      />

      <div className='col-span-full flex w-full flex-col items-center md:w-auto'>
        <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
          <Button
            disabled={isSubmitting}
            type='button'
            className='join-item'
            color='btn-error'
            onClick={() => history.back()}
            label={CancelText}
            icon={CancelIcon}
          />

          <Button
            disabled={isSubmitting}
            type='button'
            className='join-item'
            onClick={() => reset(defaultValues)}
            label={ClearText}
            icon={ClearIcon}
            color='btn-secondary'
          />

          <Button
            type='submit'
            className='join-item'
            disabled={
              isSubmitting ||
              !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'store:store', 'store:update'])
            }
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

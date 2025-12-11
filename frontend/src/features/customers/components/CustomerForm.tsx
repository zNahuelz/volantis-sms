import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Button from '~/components/Button';
import Input from '~/components/Input';
import {
  AddressIcon,
  CancelIcon,
  ClearIcon,
  DniIcon,
  EmailIcon,
  NameIcon,
  PhoneIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  AddressText,
  CancelText,
  ClearText,
  CustomerCreatedText,
  CustomerDniTakenText,
  CustomerUpdatedText,
  DniText,
  EmailText,
  ErrorTagText,
  NamesText,
  OkTagText,
  OpRollbackText,
  PhoneText,
  SaveText,
  SavingText,
  SurnamesText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { swalDismissalTime } from '~/constants/values';

export interface CustomerFormData {
  names: string;
  surnames: string;
  address: string;
  phone: string;
  email: string;
  dni: string;
}

interface CustomerFormProps {
  defaultValues?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => Promise<any>;
}

export default function CustomerForm({ defaultValues, onSubmit }: CustomerFormProps) {
  const isEdit = Boolean(defaultValues?.names);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CustomerFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const submitHandler = async (data: CustomerFormData) => {
    try {
      await onSubmit(data).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? CustomerUpdatedText : CustomerCreatedText,
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
          const field = e.field as keyof CustomerFormData;
          setError(field, { message: field === 'dni' ? CustomerDniTakenText : e.message });
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
      className='w-full space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0'
    >
      <Input
        disabled={isSubmitting}
        placeholder={NamesText}
        icon={NameIcon}
        {...register('names', {
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
        errorMessage={errors.names?.message}
      />

      <Input
        disabled={isSubmitting}
        placeholder={SurnamesText}
        icon={NameIcon}
        {...register('surnames', {
          required: 'Los apellidos son obligatorios.',
          validate: {
            notBlank: (v) =>
              v.trim().length > 0 ||
              'Los apellidos no pueden estar vacío ni contener solo espacios.',
            noLeadingSpace: (v) =>
              !v.startsWith(' ') || 'Los apellidos no deben comenzar con espacios.',
          },
          minLength: { value: 3, message: 'Minímo 3 caracteres.' },
          maxLength: { value: 30, message: 'Máximo 30 caracteres.' },
        })}
        errorMessage={errors.surnames?.message}
      />

      <Input
        disabled={isSubmitting}
        placeholder={DniText.toUpperCase()}
        icon={DniIcon}
        {...register('dni', {
          required: 'El DNI es obligatorio.',
          pattern: {
            value: /^\d{8,15}$/,
            message: 'El DNI debe contener exactamente 8 dígitos.',
          },
        })}
        errorMessage={errors.dni?.message}
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

      <Input
        disabled={isSubmitting}
        placeholder={EmailText}
        icon={EmailIcon}
        {...register('email', {
          required: 'El correo es obligatorio.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Correo no válido.',
          },
          maxLength: { value: 50, message: 'Máximo 50 caracteres.' },
        })}
        errorMessage={errors.email?.message}
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

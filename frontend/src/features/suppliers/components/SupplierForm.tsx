import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Button from '~/components/Button';
import Input from '~/components/Input';
import {
  AddressIcon,
  CancelIcon,
  ClearIcon,
  EmailIcon,
  NameIcon,
  PhoneIcon,
  RucIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  AddressText,
  CancelText,
  ClearText,
  EmailText,
  ErrorTagText,
  NameText,
  OkTagText,
  OpRollbackText,
  PhoneText,
  RucText,
  SaveText,
  SavingText,
  SupplierCreatedText,
  SupplierRucTakenText,
  SupplierUpdatedText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { swalDismissalTime } from '~/constants/values';

export interface SupplierFormData {
  name: string;
  ruc: string;
  phone: string;
  email: string;
  address: string;
}

interface SupplierFormProps {
  defaultValues?: Partial<SupplierFormData>;
  onSubmit: (data: SupplierFormData) => Promise<any>;
}

export default function SupplierForm({ defaultValues, onSubmit }: SupplierFormProps) {
  const isEdit = Boolean(defaultValues?.name);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SupplierFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const submitHandler = async (data: SupplierFormData) => {
    try {
      await onSubmit(data).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? SupplierUpdatedText : SupplierCreatedText,
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
          const field = e.field as keyof SupplierFormData;
          setError(field, { message: field === 'ruc' ? SupplierRucTakenText : e.message });
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
        placeholder={NameText}
        icon={NameIcon}
        {...register('name', {
          required: 'El nombre es obligatorio.',
          validate: {
            notBlank: (v) =>
              v.trim().length > 0 || 'El nombre no puede estar vacío ni contener solo espacios.',
            noLeadingSpace: (v) => !v.startsWith(' ') || 'El nombre no debe comenzar con espacios.',
          },
          maxLength: { value: 100, message: 'Máximo 100 caracteres.' },
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

      <div className='col-span-full'>
        <Input
          disabled={isSubmitting}
          placeholder={AddressText}
          icon={AddressIcon}
          {...register('address', {
            required: 'La dirección es obligatoria.',
            validate: {
              notBlank: (v) =>
                v.trim().length > 0 ||
                'La dirección no puede estar vacía ni contener solo espacios.',
              noLeadingSpace: (v) =>
                !v.startsWith(' ') || 'La dirección no debe comenzar con espacios.',
            },
            maxLength: { value: 150, message: 'Máximo 150 caracteres.' },
          })}
          errorMessage={errors.address?.message}
        />
      </div>

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

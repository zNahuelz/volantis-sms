import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Select from '~/components/Select';
import { PAYMENT_TYPES_ACTIONS } from '~/constants/arrays';
import {
  CancelIcon,
  ClearIcon,
  HelpIcon,
  NameIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  CancelText,
  ClearText,
  ErrorTagText,
  InfoTag,
  NameText,
  OkTagText,
  OpRollbackText,
  PaymentTypeCreatedText,
  PaymentTypeNameTakenText,
  PaymentTypeUpdatedText,
  PaymentTypesHelp,
  SaveText,
  SavingText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { swalDismissalTime } from '~/constants/values';

export interface PaymentTypeFormData {
  name: string;
  action: string;
}

interface PaymentTypeFormProps {
  defaultValues?: Partial<PaymentTypeFormData>;
  onSubmit: (data: PaymentTypeFormData) => Promise<any>;
}

export default function PaymentTypeForm({ defaultValues, onSubmit }: PaymentTypeFormProps) {
  const isEdit = Boolean(defaultValues?.name);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<PaymentTypeFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const submitHandler = async (data: PaymentTypeFormData) => {
    try {
      await onSubmit(data).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? PaymentTypeUpdatedText : PaymentTypeCreatedText,
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
          const field = e.field as keyof PaymentTypeFormData;
          setError(field, { message: field === 'name' ? PaymentTypeNameTakenText : e.message });
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

  const showHelpModal = () => {
    Swal.fire({ title: InfoTag, html: PaymentTypesHelp, icon: 'info' });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className='w-full space-y-2 md:grid md:grid-cols-1 md:gap-2 md:space-y-0'
    >
      <div className='flex flex-col items-center'>
        <Button
          className='btn-sm p-2'
          icon={HelpIcon}
          color='btn-info'
          onClick={() => showHelpModal()}
          disabled={isSubmitting}
        ></Button>
      </div>
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
          maxLength: { value: 20, message: 'Máximo 20 carácteres.' },
        })}
        errorMessage={errors.name?.message}
      />
      <Select
        options={PAYMENT_TYPES_ACTIONS}
        {...register('action', { required: true })}
        disabled={isSubmitting}
        width='w-full'
      ></Select>

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

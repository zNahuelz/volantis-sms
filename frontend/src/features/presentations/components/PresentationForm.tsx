import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Alert from '~/components/Alert';
import Button from '~/components/Button';
import Input from '~/components/Input';
import {
  CancelIcon,
  ClearIcon,
  DescriptionIcon,
  NameIcon,
  NumericValueIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  CancelText,
  ClearText,
  DescriptionText,
  DuplicatedPresentationText,
  ErrorTagText,
  NameText,
  NewPresentationAdviceText,
  NumericValueText,
  OkTagText,
  OpRollbackText,
  PresentationCreatedText,
  PresentationUpdatedText,
  SaveText,
  SavingText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { longSwalDismissalTime } from '~/constants/values';
import type { Presentation } from '~/types/presentation';

interface PresentationFormProps {
  presentation?: Presentation;
  onSubmit: (data: any) => Promise<any>;
  onSubmittingChange?: (value: boolean) => void;
  closeParentModal?: () => void;
}

export default function PresentationForm({
  presentation,
  onSubmit,
  onSubmittingChange,
  closeParentModal,
}: PresentationFormProps) {
  const isEdit = Boolean(presentation);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<Presentation>({
    defaultValues: {
      name: presentation?.name ?? '',
      numericValue: presentation?.numericValue ?? undefined,
      description: presentation?.description ?? '',
    },
  });

  const submitHandler = async (data: any) => {
    try {
      await onSubmit({ ...data, numericValue: Number(data.numericValue) });

      await Swal.fire({
        icon: 'success',
        title: OkTagText,
        html: isEdit ? PresentationUpdatedText : PresentationCreatedText,
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
          const field = e.field as 'name' | 'numericValue' | 'description';

          setError(field, {
            message: field === 'name' ? DuplicatedPresentationText : e.message,
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
      {
        <Alert
          type='info'
          variant='outline'
          message={NewPresentationAdviceText}
          width='w-full'
          className='col-span-full'
        ></Alert>
      }
      <Input
        placeholder={NameText}
        icon={NameIcon}
        errorMessage={errors.name?.message}
        disabled={isSubmitting}
        {...register('name', {
          required: 'El nombre es obligatorio.',
          minLength: { value: 3, message: 'El nombre debe tener entre 3 y 50 carácteres.' },
          maxLength: { value: 50, message: 'El nombre no puede superar los 50 carácteres.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Input
        placeholder={NumericValueText}
        icon={NumericValueIcon}
        errorMessage={errors.numericValue?.message}
        disabled={isSubmitting}
        type='number'
        {...register('numericValue', {
          required: 'El valor numérico es obligatorio.',
          setValueAs: (v) => {
            if (v === '') return undefined;
            return Number(v);
          },
          validate: (v) => {
            if (!Number.isInteger(v)) {
              return 'Debe ser un número entero';
            }
            if (v < 1 || v > 1_000_000) {
              return 'El valor debe estar entre 1 y 1,000,000';
            }
            return true;
          },
        })}
      />

      <Input
        placeholder={DescriptionText}
        icon={DescriptionIcon}
        disabled={isSubmitting}
        errorMessage={errors.description?.message}
        {...register('description', {
          required: 'Debe ingresar una descripción.',
          minLength: { value: 3, message: 'La descripción debe tener entre 3 y 100 carácteres.' },
          maxLength: { value: 100, message: 'La descripción no puede superar los 100 carácteres.' },
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

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
  SaveIcon,
  SysKeyIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  AbilityCreatedText,
  AbilityKeyTakenText,
  AbilityUpdatedText,
  CancelText,
  ClearText,
  DescriptionText,
  EditAbilityAdvice,
  ErrorTagText,
  KeyText,
  NameText,
  NewAbilityAdvice,
  OkTagText,
  OpRollbackText,
  SaveText,
  SavingText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { longSwalDismissalTime } from '~/constants/values';
import type { Ability } from '~/types/ability';

interface AbilityFormProps {
  ability?: Ability;
  onSubmit: (data: any) => Promise<any>;
  onSubmittingChange?: (value: boolean) => void;
  closeParentModal?: () => void;
}

export default function AbilityForm({
  ability,
  onSubmit,
  onSubmittingChange,
  closeParentModal,
}: AbilityFormProps) {
  const isEdit = Boolean(ability);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      name: ability?.name ?? '',
      key: ability?.key ?? '',
      description: ability?.description ?? '',
    },
  });

  const submitHandler = async (data: any) => {
    try {
      await onSubmit(data);

      await Swal.fire({
        icon: 'success',
        title: OkTagText,
        html: isEdit ? AbilityUpdatedText : AbilityCreatedText,
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
          const field = e.field as 'name' | 'key' | 'description';

          setError(field, {
            message: field === 'key' ? AbilityKeyTakenText : e.message,
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
          message={NewAbilityAdvice}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}
      {isEdit && (
        <Alert
          type='error'
          variant='outline'
          message={EditAbilityAdvice}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}
      <Input
        placeholder={NameText}
        icon={NameIcon}
        errorMessage={errors.name?.message}
        disabled={isSubmitting}
        {...register('name', {
          required: 'El nombre es obligatorio.',
          minLength: { value: 3, message: 'El nombre debe tener entre 3 y 150 carácteres.' },
          maxLength: { value: 150, message: 'El nombre no puede superar los 150 carácteres.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Input
        placeholder={KeyText}
        icon={SysKeyIcon}
        errorMessage={errors.key?.message}
        disabled={isSubmitting}
        {...register('key', {
          required: 'La clave es obligatoria.',
          minLength: { value: 3, message: 'La clave debe tener entre 3 y 150 carácteres.' },
          maxLength: { value: 150, message: 'La clave no puede superar los 150 carácteres.' },
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
          minLength: { value: 8, message: 'La descripción debe tener entre 3 y 150 carácteres.' },
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

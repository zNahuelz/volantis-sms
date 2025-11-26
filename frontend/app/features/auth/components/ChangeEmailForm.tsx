import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { CancelIcon, UpdateIcon } from '~/constants/iconNames';
import {
  CancelText,
  ConfirmEmailText,
  EmailText,
  ErrorTagText,
  NewEmailText,
  OkTagText,
  ServerErrorText,
  UpdateText,
  UpdatingText,
  UserEmailUpdatedText,
} from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import { updateEmailService } from '../services/authService';
import Swal from 'sweetalert2';
import { longSwalDismissalTime, swalDismissalTime } from '~/constants/values';

type Props = {
  onBusyStart?: () => void;
  onBusyEnd?: () => void;
};

interface FormValues {
  newEmail: string;
  confirmEmail: string;
}

export default function ChangeEmailForm({ onBusyStart, onBusyEnd }: Props) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>();

  const newEmailValue = watch('newEmail');

  const onSubmit = async (data: FormValues) => {
    try {
      onBusyStart?.();
      await updateEmailService(data.newEmail.trim().toLowerCase()).then(() => {
        onBusyEnd?.();
        Swal.fire({
          title: OkTagText,
          html: UserEmailUpdatedText(data.newEmail.trim().toUpperCase()),
          icon: 'success',
          timer: longSwalDismissalTime,
          showConfirmButton: false,
        }).then((e) => {
          if (e.dismiss) window.location.reload();
        });
      });
    } catch (error: any) {
      if (error.errors?.[0].message) {
        setError('confirmEmail', {
          message: 'El correo electrónico ingresado ya se encuentra en uso.',
        });
      } else {
        Swal.fire(ErrorTagText, ServerErrorText, 'error').then((e) => {
          if (e.isDismissed) window.location.reload();
        });
      }
    }
  };

  return (
    <form
      className=' max-w-[600px] w-full grid grid-cols-1 md:grid-cols-2 gap-1'
      onSubmit={handleSubmit(onSubmit)}
    >
      <fieldset className='fieldset col-span-2'>
        <legend className='fieldset-legend'>{EmailText}</legend>
        <Input value={user?.email?.toUpperCase()} readOnly></Input>
      </fieldset>

      <fieldset className='fieldset col-span-2'>
        <legend className='fieldset-legend'>{NewEmailText}</legend>
        <Input
          disabled={isSubmitting}
          {...register('newEmail', {
            required: 'Debe ingresar un correo electrónico.',
            maxLength: {
              value: 50,
              message: 'El correo electrónico puede tener máximo 50 carácteres.',
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Debe ingresar un correo electrónico válido.',
            },
          })}
          error={!!errors.newEmail}
          errorMessage={errors.newEmail?.message}
        ></Input>
      </fieldset>

      <fieldset className='fieldset col-span-2'>
        <legend className='fieldset-legend'>{ConfirmEmailText}</legend>
        <Input
          disabled={isSubmitting}
          {...register('confirmEmail', {
            required: 'Debe confirmar el correo electrónico.',
            validate: (value) => value === newEmailValue || 'El correo electrónico no coincide.',
          })}
          error={!!errors.confirmEmail}
          errorMessage={errors.confirmEmail?.message}
        ></Input>
      </fieldset>
      <div className='col-span-full w-full flex flex-col items-center'>
        <div className='join join-vertical md:join-horizontal w-full md:w-auto '>
          <Button
            label={CancelText}
            className='join-item'
            width='w-full md:w-auto'
            color='btn-error'
            icon={CancelIcon}
            disabled={isSubmitting}
            onClick={() => window.location.reload()}
          />
          <Button
            type='submit'
            label={isSubmitting ? UpdatingText : UpdateText}
            className='join-item'
            width='w-full md:w-auto'
            color='btn-success'
            icon={UpdateIcon}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}

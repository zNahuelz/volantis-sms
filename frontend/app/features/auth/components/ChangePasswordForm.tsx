import Swal from 'sweetalert2';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { CancelIcon, UpdateIcon } from '~/constants/iconNames';
import {
  CancelText,
  CurrentPasswordText,
  ErrorTagText,
  NewPasswordText,
  OkTagText,
  RepeatPasswordText,
  ServerErrorText,
  UpdateText,
  UpdatingText,
  UserPasswordUpdatedText,
} from '~/constants/strings';
import { updatePasswordService } from '../services/authService';
import { useForm } from 'react-hook-form';
import { longSwalDismissalTime, swalDismissalTime } from '~/constants/values';
import { useAuth } from '~/context/authContext';

type Props = {
  onBusyStart?: () => void;
  onBusyEnd?: () => void;
};

type FormValues = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
};

export default function ChangePasswordForm({ onBusyStart, onBusyEnd }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();
  const { logout } = useAuth();

  const newPasswordValue = watch('newPassword');

  const onSubmit = async (data: FormValues) => {
    try {
      onBusyStart?.();
      await updatePasswordService(data.currentPassword, data.newPassword).then(() => {
        Swal.fire({
          title: OkTagText,
          html: UserPasswordUpdatedText,
          icon: 'success',
          timer: longSwalDismissalTime,
          showConfirmButton: false,
        }).then((e) => {
          if (e.dismiss || e.isDismissed) logout();
        });
      });
    } catch (error: any) {
      if (error.message?.includes('incorrecta')) {
        Swal.fire({
          title: ErrorTagText,
          html: error.message,
          icon: 'error',
          timer: longSwalDismissalTime,
          showConfirmButton: false,
        }).then((e) => {
          if (e.dismiss) reset();
        });
      } else {
        Swal.fire({
          title: ErrorTagText,
          html: ServerErrorText,
          icon: 'error',
          showConfirmButton: false,
          timer: longSwalDismissalTime,
        }).then((e) => {
          if (e.dismiss) window.location.reload();
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
        <legend className='fieldset-legend'>{CurrentPasswordText}</legend>
        <Input
          type='password'
          {...register('currentPassword', {
            required: 'Debe ingresar su contraseña actual.',
            minLength: { value: 5, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
            maxLength: { value: 20, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
          })}
          error={!!errors.currentPassword}
          errorMessage={errors.currentPassword?.message}
        ></Input>
      </fieldset>
      <fieldset className='fieldset col-span-2'>
        <legend className='fieldset-legend'>{NewPasswordText}</legend>
        <Input
          type='password'
          {...register('newPassword', {
            required: 'Debe ingresar su nueva contraseña.',
            minLength: { value: 5, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
            maxLength: { value: 20, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
          })}
          error={!!errors.newPassword}
          errorMessage={errors.newPassword?.message}
          disabled={isSubmitting}
        ></Input>
      </fieldset>

      <fieldset className='fieldset col-span-2'>
        <legend className='fieldset-legend'>{RepeatPasswordText}</legend>
        <Input
          type='password'
          {...register('repeatPassword', {
            required: 'Debe confirmar su nueva contraseña.',
            minLength: { value: 5, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
            maxLength: { value: 20, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
            validate: (value) => value === newPasswordValue || 'Las contraseñas no coinciden.',
          })}
          error={!!errors.repeatPassword}
          errorMessage={errors.repeatPassword?.message}
          disabled={isSubmitting}
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
            onClick={() => window.location.reload()}
            disabled={isSubmitting}
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

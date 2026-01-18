import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { ArrowRightIcon, CancelIcon, PasswordIcon } from '~/constants/iconNames';
import {
  CancelText,
  ChangePasswordWithTokenMessage,
  ContinueText,
  ErrorTagText,
  InvalidOrExpiredTokenText,
  NewPasswordText,
  OkTagText,
  RepeatPasswordText,
  UserPasswordUpdatedText,
} from '~/constants/strings';
import { updatePasswordWithTokenService } from '../services/authService';
import Swal from 'sweetalert2';
import { longSwalDismissalTime } from '~/constants/values';
import { useNavigate } from 'react-router';

type Props = {
  token: string;
};

export default function ChangePasswordWithTokenForm({ token }: Props) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      passwordOne: '',
      passwordTwo: '',
    },
  });

  const passwordOne = watch('passwordOne');

  const onSubmit = async (data: any) => {
    try {
      const res = await updatePasswordWithTokenService(token, data.passwordOne);
      Swal.fire({
        icon: 'success',
        title: OkTagText,
        html: !res.message ? UserPasswordUpdatedText : res.message,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      }).then((r) => {
        if (r.dismiss) navigate('/');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: ErrorTagText,
        html: !error.message ? InvalidOrExpiredTokenText : error.message,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      }).then((r) => {
        if (r.dismiss) navigate('/');
      });
    }
  };

  return (
    <form className='w-full space-y-3' onSubmit={handleSubmit(onSubmit)}>
      <div dangerouslySetInnerHTML={{ __html: ChangePasswordWithTokenMessage }}></div>
      <Input
        icon={PasswordIcon}
        type='password'
        placeholder={NewPasswordText}
        {...register('passwordOne', {
          required: 'Debe ingresar su nueva contraseña.',
          minLength: { value: 5, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
          maxLength: { value: 20, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
        })}
        error={!!errors.passwordOne}
        errorMessage={errors.passwordOne?.message}
      ></Input>
      <Input
        icon={PasswordIcon}
        type='password'
        placeholder={RepeatPasswordText}
        {...register('passwordTwo', {
          required: 'Debe confirmar su nueva contraseña.',
          minLength: { value: 5, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
          maxLength: { value: 20, message: 'La contraseña debe tener entre 5 y 20 carácteres.' },
          validate: (value) => value === passwordOne || 'Las contraseñas no coinciden.',
        })}
        error={!!errors.passwordTwo}
        errorMessage={errors.passwordTwo?.message}
      ></Input>
      <div className='flex flex-col items-center'>
        <div className='join join-vertical md:join-horizontal w-full md:w-auto'>
          <Button
            label={CancelText}
            icon={CancelIcon}
            color='btn-error'
            className='join-item'
            width='w-full md:w-auto'
            type='button'
            disabled={isSubmitting}
            onClick={() => navigate('/')}
          ></Button>
          <Button
            label={ContinueText}
            icon={ArrowRightIcon}
            className='join-item'
            width='w-full md:w-auto'
            type='submit'
            disabled={isSubmitting}
          ></Button>
        </div>
      </div>
    </form>
  );
}

import Button from '~/components/Button';
import Input from '~/components/Input';
import { EmailIcon, PasswordIcon } from '~/constants/iconNames';
import {
  ClickHereText,
  EmailText,
  ForgotPasswordText,
  LoginButtonText,
  PasswordText,
  RememberMeText,
  UsernameText,
} from '~/constants/strings';
import { useForm } from 'react-hook-form';
import { loginService } from '../services/authService';
import { useAuth } from '~/context/authContext';
import { useNavigate } from 'react-router';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: any) => {
    try {
      const res = await loginService(data);
      login(res.token.token, res.user, data.rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      setError('username', { message: 'Credenciales incorrectas' });
      setError('password', { message: 'Credenciales incorrectas' });
    }
  };

  return (
    <form className='w-full space-y-3' onSubmit={handleSubmit(onSubmit)}>
      <Input
        width='w-full'
        icon={EmailIcon}
        placeholder={UsernameText}
        error={!!errors.username}
        errorMessage={errors.username?.message}
        {...register('username', {
          required: 'Debe ingresar un correo electrónico.',
        })}
      />
      <Input
        width='w-full'
        icon={PasswordIcon}
        placeholder={PasswordText}
        type='password'
        error={!!errors.password}
        errorMessage={errors.password?.message}
        {...register('password', {
          required: 'Debe ingresar una contraseña.',
          minLength: {
            value: 5,
            message: 'La contraseña debe tener al menos 5 carácteres.',
          },
        })}
      />
      <label className='label cursor-pointer gap-2'>
        <input
          type='checkbox'
          className='checkbox checkbox-sm checkbox-primary'
          {...register('rememberMe')}
        />
        {RememberMeText}
      </label>
      <p className='mb-3 text-center text-sm'>
        {ForgotPasswordText}
        <span className='text-primary/50 hover:text-primary font-bold'>{ClickHereText}</span>
      </p>
      <div className='flex flex-col items-center'>
        <Button label={LoginButtonText} type='submit' />
      </div>
    </form>
  );
}

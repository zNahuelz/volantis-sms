import Button from '~/components/Button';
import Input from '~/components/Input';
import { EmailIcon, PasswordIcon } from '~/constants/iconNames';
import {
  ClickHereText,
  EmailText,
  ForgotPasswordText,
  InvalidCredentialsText,
  LoggingInText,
  LoginButtonText,
  LoginErrorText,
  PasswordText,
  RememberMeText,
  UsernameText,
} from '~/constants/strings';
import { useForm } from 'react-hook-form';
import { loginService } from '../services/authService';
import { useAuth } from '~/context/authContext';
import { useNavigate } from 'react-router';
import { useState } from 'react';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

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
    setServerError('');
    try {
      const res = await loginService(data);
      login(res.token.token, res.user, data.rememberMe);
      navigate('/dashboard');
    } catch (err: any) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => {
          const allowedFields = ['username', 'password', 'rememberMe'];

          if (allowedFields.includes(e.field)) {
            setError(e.field as 'username' | 'password' | 'rememberMe', {
              message: e.message,
            });
          }
          if (e.message.includes('user credentials')) {
            setServerError(InvalidCredentialsText);
          }
        });
        return;
      } else {
        setServerError(LoginErrorText);
      }
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
        disabled={isSubmitting}
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
        disabled={isSubmitting}
      />
      <label className='label cursor-pointer gap-2'>
        <input
          type='checkbox'
          className='checkbox checkbox-sm checkbox-primary'
          {...register('rememberMe')}
          disabled={isSubmitting}
        />
        {RememberMeText}
      </label>
      <p className='mb-2 text-center text-sm'>
        {ForgotPasswordText}
        <span className='text-primary/50 hover:text-primary font-bold'>{ClickHereText}</span>
      </p>
      <p className='text-error text-sm text-center mb-2'>{serverError}</p>
      <div className='flex flex-col items-center'>
        <Button
          label={!isSubmitting ? LoginButtonText : LoggingInText}
          type='submit'
          disabled={isSubmitting}
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}

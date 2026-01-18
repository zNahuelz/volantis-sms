import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { ArrowRightIcon, CancelIcon, EmailIcon } from '~/constants/iconNames';
import {
  CancelText,
  ContinueText,
  EmailText,
  ErrorTagText,
  OkTagText,
  PasswordRecoveryMessage,
  RecoveryMailSentText,
} from '~/constants/strings';
import { sendRecoveryMailService } from '../services/authService';
import Swal from 'sweetalert2';
import { longSwalDismissalTime, swalDismissalTime } from '~/constants/values';
import { useNavigate } from 'react-router';

export default function SendRecoveryMailForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await sendRecoveryMailService(data.email);
      showModal('success', res);
    } catch (error) {
      showModal('error', error);
    }
  };

  const showModal = (type: 'success' | 'error', object: any) => {
    Swal.fire({
      icon: type,
      title: type === 'success' ? OkTagText : ErrorTagText,
      html: !object.message ? RecoveryMailSentText : object.message,
      timer: longSwalDismissalTime,
      showConfirmButton: false,
    }).then((r) => {
      if (r.dismiss) navigate('/');
    });
  };

  return (
    <form className='w-full space-y-3' onSubmit={handleSubmit(onSubmit)}>
      <p dangerouslySetInnerHTML={{ __html: PasswordRecoveryMessage }}></p>
      <Input
        icon={EmailIcon}
        placeholder={EmailText}
        {...register('email', {
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
        errorMessage={errors.email?.message}
        disabled={isSubmitting}
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

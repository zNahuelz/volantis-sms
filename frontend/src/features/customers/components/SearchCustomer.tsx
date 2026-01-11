import { useForm } from 'react-hook-form';
import type { Customer } from '~/types/customer';
import { customerService } from '../services/customerService';
import Swal from 'sweetalert2';
import {
  CancelText,
  CustomerNotFoundByDniText,
  CustomerText,
  DniText,
  ErrorTagText,
  QuestionText,
  RegisterText,
  SearchText,
  ServerConnErrorText,
} from '~/constants/strings';
import { ErrorColor, SuccessColor } from '~/constants/values';
import { useNavigate } from 'react-router';
import Input from '~/components/Input';
import { DniIcon, SearchIcon } from '~/constants/iconNames';
import Button from '~/components/Button';

interface SearchCustomerProps {
  onCustomerResolved: (customer: Customer) => void;
}

export default function SearchCustomer({ onCustomerResolved }: SearchCustomerProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { dni: '' },
  });

  const searchCustomer = async (dni: string) => {
    try {
      const customer = await customerService.showByDni(dni);
      onCustomerResolved(customer);
    } catch (error: any) {
      if (error?.status === 404) {
        reset();
        Swal.fire({
          title: QuestionText.toUpperCase(),
          html: CustomerNotFoundByDniText,
          icon: 'question',
          showCancelButton: true,
          cancelButtonColor: ErrorColor,
          confirmButtonColor: SuccessColor,
          confirmButtonText: RegisterText.toUpperCase(),
          cancelButtonText: CancelText.toUpperCase(),
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          reverseButtons: true,
        }).then((r) => {
          if (r.isConfirmed) navigate(`/dashboard/customer/create`);
          else window.location.reload();
        });
      } else {
        Swal.fire(ErrorTagText, ServerConnErrorText, 'error').then((r) => {
          if (r.dismiss) window.location.reload();
        });
      }
    }
  };

  const submitHandler = async (data: { dni: string }) => {
    await searchCustomer(data.dni);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className='w-full join join-vertical md:join-horizontal'>
        <Input
          className='join-item'
          icon={DniIcon}
          placeholder={`${DniText.toUpperCase()} ${CustomerText}...`}
          width='w-full'
          {...register('dni', {
            required: 'El DNI es obligatorio.',
            pattern: {
              value: /^(0|\d{8,15})$/,
              message: 'El DNI debe contener exactamente 8 dígitos ó ser 0 para cliente genérico.',
            },
          })}
          errorMessage={errors.dni?.message}
          disabled={isSubmitting}
        />
        <Button
          className='join-item'
          color='btn-success'
          icon={!isSubmitting ? SearchIcon : ''}
          isLoading={isSubmitting}
          type='submit'
          disabled={isSubmitting}
          title={SearchText.toUpperCase()}
        />
      </div>
    </form>
  );
}

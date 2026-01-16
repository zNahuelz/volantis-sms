import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  AddressText,
  CancelText,
  ConfirmActionText,
  CreatedAtText,
  CustomerDetailText,
  CustomerNotFoundText,
  CustomerStatusChangeMessage,
  CustomerStatusUpdateFailedText,
  CustomerStatusUpdatedText,
  DeleteText,
  DeletedAtText,
  DniText,
  EditText,
  EmailText,
  ErrorTagText,
  GoBackText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LoadingCustomerText,
  NamesText,
  OkTagText,
  PhoneText,
  RestoreText,
  StateText,
  SurnamesText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Customer } from '~/types/customer';
import { formatAsDatetime, isInteger } from '~/utils/helpers';
import { customerService } from '../services/customerService';
import Loading from '~/components/Loading';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { DeleteIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';

export default function CustomerDetailView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();

  const showStatusChangeModal = async (customer: Customer) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: CustomerStatusChangeMessage(customer),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        customer.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(customer.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await customerService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? CustomerStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: CustomerStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  useEffect(() => {
    const loadCustomer = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/customer');
      }
      try {
        const res = await customerService.show(Number(id!));
        setCustomer(res);
      } catch (error) {
        navigate('/dashboard/customer');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingCustomerText}></Loading>;
  }

  if (!customer) {
    return <p className='text-center text-error'>{CustomerNotFoundText}</p>;
  }
  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {CustomerDetailText} #{customer.id}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={customer.id} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{NamesText}</legend>
            <Input value={customer.names} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SurnamesText}</legend>
            <Input value={customer.surnames} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{DniText.toUpperCase()}</legend>
            <Input value={customer.dni} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{PhoneText}</legend>
            <Input value={customer.phone} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{EmailText}</legend>
            <Input value={customer.email} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset md:col-span-3'>
            <legend className='fieldset-legend'>{AddressText}</legend>
            <Input value={customer.address ?? '-----'} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(customer.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(customer.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!customer.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(customer.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={customer.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={customer.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
            ></Input>
          </fieldset>
        </div>

        <div className='flex flex-col items-center ps-4 pe-4 pb-4 w-full md:w-auto'>
          <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
            <Button
              label={GoBackText}
              icon={GoBackIcon}
              color='btn-secondary'
              className='join-item'
              onClick={() => history.back()}
            ></Button>
            <Button
              label={EditText}
              color='btn-accent'
              icon={EditIcon}
              className='join-item'
              onClick={() => {
                navigate(`/dashboard/customer/${customer.id}/edit`);
              }}
              disabled={customer.id === 1} //TODO: Create ability customer:editDefaultCustomer
            ></Button>
            <Button
              label={customer.deletedAt ? RestoreText : DeleteText}
              icon={customer.deletedAt ? RestoreIcon : DeleteIcon}
              color={customer.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
              onClick={() => {
                showStatusChangeModal(customer);
              }}
              disabled={customer.id === 1}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

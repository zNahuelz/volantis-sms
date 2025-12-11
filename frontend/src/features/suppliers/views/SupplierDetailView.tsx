import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import Loading from '~/components/Loading';
import {
  AddressText,
  CancelText,
  ConfirmActionText,
  CreatedAtText,
  DeleteText,
  DeletedAtText,
  EditText,
  EmailText,
  ErrorTagText,
  GoBackText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LoadingSupplierText,
  NameText,
  OkTagText,
  PhoneText,
  RestoreText,
  RucText,
  StateText,
  SupplierDetailAreaText,
  SupplierDetailText,
  SupplierNotFound,
  SupplierStatusChangeMessage,
  SupplierStatusUpdateFailedText,
  SupplierStatusUpdatedText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Supplier } from '~/types/supplier';
import { formatAsDatetime, isInteger } from '~/utils/helpers';
import { supplierService } from '../services/supplierService';
import { useEffect, useState } from 'react';

import Input from '~/components/Input';
import Button from '~/components/Button';
import { DeleteIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';

export default function SupplierDetailView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const navigate = useNavigate();

  const showStatusChangeModal = async (supplier: Supplier) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: SupplierStatusChangeMessage(supplier),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        supplier.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(supplier.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await supplierService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? SupplierStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: SupplierStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  useEffect(() => {
    const loadSupplier = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/supplier');
      }
      try {
        const res = await supplierService.show(Number(id!));
        setSupplier(res);
      } catch (error) {
        navigate('/dashboard/supplier');
      } finally {
        setLoading(false);
      }
    };

    loadSupplier();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingSupplierText}></Loading>;
  }

  if (!supplier) {
    return <p className='text-center text-error'>{SupplierNotFound}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {SupplierDetailText} #{supplier.id}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={supplier.id} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{NameText}</legend>
            <Input value={supplier.name} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{RucText.toUpperCase()}</legend>
            <Input value={supplier.ruc} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{PhoneText}</legend>
            <Input value={supplier.phone} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{EmailText}</legend>
            <Input value={supplier.email} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset md:col-span-3'>
            <legend className='fieldset-legend'>{AddressText}</legend>
            <Input value={supplier.address} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(supplier.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(supplier.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!supplier.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(supplier.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={supplier.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={supplier.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
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
                navigate(`/dashboard/supplier/${supplier.id}/edit`);
              }}
            ></Button>
            <Button
              label={supplier.deletedAt ? RestoreText : DeleteText}
              icon={supplier.deletedAt ? RestoreIcon : DeleteIcon}
              color={supplier.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
              onClick={() => {
                showStatusChangeModal(supplier);
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

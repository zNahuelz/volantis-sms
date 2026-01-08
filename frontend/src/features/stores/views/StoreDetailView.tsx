import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import type { Store } from '~/types/store';
import { useNavigate } from 'react-router';
import { formatAsDatetime, isInteger } from '~/utils/helpers';
import { storeService } from '../services/storeService';
import Loading from '~/components/Loading';
import {
  AddressText,
  CancelText,
  ConfirmActionText,
  CreatedAtText,
  DeleteText,
  DeletedAtText,
  EditText,
  ErrorTagText,
  GoBackText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LoadingStoreText,
  NameText,
  OkTagText,
  PhoneText,
  RestoreText,
  RucText,
  StateText,
  StoreDetailText,
  StoreNotFoundText,
  StoreStatusChangeMessage,
  StoreStatusUpdateFailedText,
  StoreStatusUpdatedText,
  UpdatedAtText,
} from '~/constants/strings';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { DeleteIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';

export default function StoreDetailView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Store | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStore = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/store');
      }
      try {
        const res = await storeService.show(Number(id!));
        setStore(res);
      } catch (error) {
        navigate('/dashboard/store');
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [id]);

  const showStatusChangeModal = async (store: Store) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: StoreStatusChangeMessage(store),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        store.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(store.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await storeService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? StoreStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: StoreStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  if (loading) {
    return <Loading loadMessage={LoadingStoreText}></Loading>;
  }

  if (!store) {
    return <p className='text-center text-error'>{StoreNotFoundText}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {StoreDetailText} #{store.id}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={store.id} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{NameText}</legend>
            <Input value={store.name} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{RucText.toUpperCase()}</legend>
            <Input value={store.ruc} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{PhoneText}</legend>
            <Input value={store.phone} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset md:col-span-2'>
            <legend className='fieldset-legend'>{AddressText}</legend>
            <Input value={store.address} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(store.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(store.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!store.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(store.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={store.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={store.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
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
                navigate(`/dashboard/store/${store.id}/edit`);
              }}
            ></Button>
            <Button
              label={store.deletedAt ? RestoreText : DeleteText}
              icon={store.deletedAt ? RestoreIcon : DeleteIcon}
              color={store.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
              onClick={() => showStatusChangeModal(store)}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

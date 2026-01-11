import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import {
  DEFAULT_STATUS_TYPES,
  PAYMENT_TYPES_ACTIONS,
  PAYMENT_TYPES_SEARCH_TYPES,
} from '~/constants/arrays';
import type { PaymentType } from '~/types/paymentType';
import { paymentTypeService, type PaymentTypeQuery } from '../services/paymentTypeService';
import { NavLink } from 'react-router';
import {
  CancelText,
  ConfirmActionText,
  DeleteText,
  EditText,
  ErrorTagText,
  HelpText,
  InfoTag,
  LoadingPaymentTypesText,
  NewText,
  OkTagText,
  PaymentTypeStatusChangeMessage,
  PaymentTypeStatusUpdateFailedText,
  PaymentTypeStatusUpdatedText,
  PaymentTypeText,
  PaymentTypesHelp,
  PaymentTypesText,
  ReloadText,
  RestoreText,
  SearchText,
  TableElementsMessage,
} from '~/constants/strings';
import Select from '~/components/Select';
import Input from '~/components/Input';
import {
  DeleteIcon,
  DetailsIcon,
  EditIcon,
  HelpIcon,
  InfoIcon,
  ReloadIcon,
  RestoreIcon,
  SearchIcon,
} from '~/constants/iconNames';
import Button from '~/components/Button';
import Loading from '~/components/Loading';
import PaymentTypeTable from '../components/PaymentTypeTable';
import clsx from 'clsx';
import { Paginator } from '~/components/Paginator';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';

export default function PaymentTypeListView() {
  const [data, setData] = useState<PaymentType[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('available');
  const [fetchFailed, setFetchFailed] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { isValid },
    reset,
    resetField,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      field: PAYMENT_TYPES_SEARCH_TYPES[0].value,
      actionField: PAYMENT_TYPES_ACTIONS[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const loadPaymentTypes = async () => {
    setLoading(true);

    const query: PaymentTypeQuery = {
      page,
      limit,
      search: '',
      status: status,
      field: undefined,
      sortBy: undefined,
      sortDir: undefined,
    };

    try {
      const response = await paymentTypeService.index(query);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
      setLoading(false);
    } catch {
      handleFailedFetch();
    }
  };

  const reloadPaymentTypes = async () => {
    reset();
    setData([]);
    setPage(1);
    setLimit(10);
    await loadPaymentTypes();
  };

  const onSubmit = async (values: { field: string; search: string; actionField: string }) => {
    setLoading(true);
    const query: PaymentTypeQuery = {
      page,
      limit,
      field: values.field,
      search: values.field === 'action' ? values.actionField : values.search,
      status: status,
    };
    try {
      const response = await paymentTypeService.index(query);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
      setLoading(false);
    } catch {
      handleFailedFetch();
    }
  };

  const handleFailedFetch = () => {
    setData([]);
    setTotalPages(1);
    setTotalItems(0);
    setLoading(false);
    setFetchFailed(true);
  };

  const showStatusChangeModal = async (paymentType: PaymentType) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: PaymentTypeStatusChangeMessage(paymentType),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        paymentType.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(paymentType.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await paymentTypeService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? PaymentTypeStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadPaymentTypes();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: PaymentTypeStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  const showHelpModal = () => {
    Swal.fire({ title: InfoTag, html: PaymentTypesHelp, icon: 'info' });
  };

  useEffect(() => {
    loadPaymentTypes();
  }, [page, limit]);

  useEffect(() => {
    loadPaymentTypes();
  }, [status]);

  useEffect(() => {
    resetField('search');
    resetField('actionField');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink to='/dashboard/payment-type/create' className='btn btn-success w-full md:w-auto'>
          {NewText}
        </NavLink>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={PAYMENT_TYPES_SEARCH_TYPES}
            width='w-full md:w-50'
            {...register('field', { required: true })}
          />

          <Select
            options={PAYMENT_TYPES_ACTIONS}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField != 'action'}
            {...register('actionField', {
              required: selectedField === 'action' ? true : false,
            })}
          />

          <Input
            icon={SearchIcon}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField === 'action'}
            {...register('search', {
              validate: (value) => {
                if (selectedField === 'action') return true;
                if (!value) return 'Campo requerido';
                if (selectedField === 'id') return /^[0-9]+$/.test(value) || 'Solo números';
                if (selectedField === 'name') return value.length >= 3 || 'Min 3 caracteres';
                return true;
              },
            })}
          />

          <Button
            label={SearchText}
            type='submit'
            width='w-full md:w-auto'
            color='btn-info'
            disabled={!isValid}
          />

          <Button
            icon={ReloadIcon}
            width='w-full md:w-auto'
            color='btn-neutral'
            title={ReloadText}
            type='button'
            onClick={reloadPaymentTypes}
          />
          <Button
            icon={HelpIcon}
            width='w-full md:w-auto'
            color='btn-info'
            title={HelpText}
            type='button'
            onClick={() => showHelpModal()}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingPaymentTypesText} />
      ) : (
        <PaymentTypeTable
          data={data}
          fetchFailed={fetchFailed}
          actions={(row) => (
            <div className='join-horizontal join'>
              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  navigate(`/dashboard/payment-type/${row.id}/edit`);
                }}
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => showStatusChangeModal(row)}
              />
            </div>
          )}
        />
      )}

      <Paginator
        page={page}
        limit={limit}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        status={status}
        onStatusChange={(newStatus) => {
          setStatus(newStatus);
          setPage(1);
        }}
        statusTypes={DEFAULT_STATUS_TYPES}
      />

      <h1 className='mt-1 text-center font-medium'>
        {data.length >= 1 && !loading && !fetchFailed
          ? TableElementsMessage(
              PaymentTypeText.toLowerCase(),
              PaymentTypesText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
    </div>
  );
}

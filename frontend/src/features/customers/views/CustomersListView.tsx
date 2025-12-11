import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { CUSTOMER_SEARCH_TYPES, DEFAULT_STATUS_TYPES } from '~/constants/arrays';
import {
  CancelText,
  ConfirmActionText,
  CustomerStatusChangeMessage,
  CustomerStatusUpdateFailedText,
  CustomerStatusUpdatedText,
  CustomerText,
  CustomersListAreaText,
  CustomersText,
  DeleteText,
  DetailsText,
  EditText,
  ErrorTagText,
  LoadingCustomersText,
  NewText,
  OkTagText,
  ReloadText,
  RestoreText,
  SearchText,
  SupplierText,
  SuppliersText,
  TableElementsMessage,
} from '~/constants/strings';
import type { Customer } from '~/types/customer';
import { customerService, type CustomerQuery } from '../services/customerService';
import Select from '~/components/Select';
import Input from '~/components/Input';
import {
  DeleteIcon,
  DetailsIcon,
  EditIcon,
  ReloadIcon,
  RestoreIcon,
  SearchIcon,
} from '~/constants/iconNames';
import Button from '~/components/Button';
import Loading from '~/components/Loading';
import CustomerTable from '../components/CustomerTable';
import clsx from 'clsx';
import { Paginator } from '~/components/Paginator';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';

export default function CustomerListView() {
  const [data, setData] = useState<Customer[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('available');
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
      field: CUSTOMER_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const loadCustomers = async () => {
    setLoading(true);

    const query: CustomerQuery = {
      page,
      limit,
      search: '',
      status: status,
      field: undefined,
      sortBy: undefined,
      sortDir: undefined,
    };

    const response = await customerService.index(query);

    setData(response.data);
    setTotalPages(response.meta.lastPage);
    setTotalItems(response.meta.total);

    setLoading(false);
  };

  const reloadCustomers = async () => {
    reset();
    setData([]);
    setPage(1);
    setLimit(10);
    await loadCustomers();
  };

  const onSubmit = async (values: { field: string; search: string }) => {
    setLoading(true);
    const query: CustomerQuery = {
      page,
      limit,
      field: values.field,
      search: values.search,
      status: status,
    };
    const response = await customerService.index(query);
    setData(response.data);
    setTotalPages(response.meta.lastPage);
    setTotalItems(response.meta.total);
    setLoading(false);
  };

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
        if (e.dismiss) reloadCustomers();
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
    loadCustomers();
  }, [page, limit]);

  useEffect(() => {
    loadCustomers();
  }, [status]);

  useEffect(() => {
    resetField('search');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink to='/dashboard/customer/create' className='btn btn-success w-full md:w-auto'>
          {NewText}
        </NavLink>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={CUSTOMER_SEARCH_TYPES}
            width='w-full md:w-50'
            {...register('field', { required: true })}
          />

          <Input
            icon={SearchIcon}
            width='w-full md:w-50'
            disabled={!selectedField}
            {...register('search', {
              validate: (value) => {
                if (!value) return 'Campo requerido';
                if (selectedField === 'id') return /^[0-9]+$/.test(value) || 'Solo números';
                if (selectedField === 'dni') {
                  if (!/^[0-9]+$/.test(value)) return 'Solo números';
                  if (value.length < 8) return 'Min 8';
                  if (value.length > 15) return 'Max 15';
                  return true;
                }
                if (selectedField === 'names') return value.length >= 3 || 'Min 3 caracteres';
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
            onClick={reloadCustomers}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingCustomersText} />
      ) : (
        <CustomerTable
          data={data}
          actions={(row) => (
            <div className='join-horizontal join'>
              <Button
                className='join-item btn-sm'
                color='btn-primary'
                icon={DetailsIcon}
                title={DetailsText}
                onClick={() => {
                  navigate(`/dashboard/customer/${row.id}`);
                }}
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  navigate(`/dashboard/customer/${row.id}/edit`);
                }}
                disabled={row.id === 1}
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => showStatusChangeModal(row)}
                disabled={row.id === 1}
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
        {data.length >= 1
          ? TableElementsMessage(
              CustomerText.toLowerCase(),
              CustomersText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
    </div>
  );
}

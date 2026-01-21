import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import type { Supplier } from '~/types/supplier';
import type { SupplierQuery } from '../services/supplierService';
import { supplierService } from '../services/supplierService';
import SupplierTable from '../components/SupplierTable';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Button from '~/components/Button';
import { Paginator } from '~/components/Paginator';
import { DEFAULT_STATUS_TYPES, SUPPLIER_SEARCH_TYPES } from '~/constants/arrays';

import {
  CancelText,
  ConfirmActionText,
  DeleteText,
  DetailsText,
  EditText,
  ErrorTagText,
  LoadingSuppliersText,
  NewText,
  OkTagText,
  ReloadText,
  RestoreText,
  SearchText,
  SupplierStatusChangeMessage,
  SupplierStatusUpdatedText,
  SupplierStatusUpdateFailedText,
  SuppliersText,
  SupplierText,
  TableElementsMessage,
} from '~/constants/strings';

import {
  DeleteIcon,
  DetailsIcon,
  EditIcon,
  ReloadIcon,
  RestoreIcon,
  SearchIcon,
} from '~/constants/iconNames';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import { useAuth } from '~/context/authContext';
import { hasAbilities } from '~/utils/helpers';

export default function SuppliersListView() {
  const [data, setData] = useState<Supplier[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [query, setQuery] = useState<SupplierQuery>({
    page: 1,
    limit: 10,
    search: '',
    field: undefined,
    status: 'available',
  });
  const navigate = useNavigate();
  const authStore = useAuth();

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
      field: SUPPLIER_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const fetchSuppliers = async (q: SupplierQuery) => {
    setLoading(true);
    try {
      const response = await supplierService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadSuppliers = async () => {
    reset();
    setQuery({
      page: 1,
      limit: 10,
      search: '',
      field: undefined,
      status: 'available',
    });
  };

  const onSubmit = async (values: { field: string; search: string }) => {
    setLoading(true);
    setQuery((q) => ({
      ...q,
      field: values.field,
      search: values.search,
      page: 1,
    }));
  };

  const handleFailedFetch = () => {
    setData([]);
    setTotalPages(1);
    setTotalItems(0);
    setLoading(false);
    setFetchFailed(true);
  };

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
        if (e.dismiss) reloadSuppliers();
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
    fetchSuppliers(query);
  }, [query]);

  useEffect(() => {
    resetField('search');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink
          to={
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'supplier:store'])
              ? '/dashboard'
              : '/dashboard/supplier/create'
          }
          className='btn btn-success w-full md:w-auto'
        >
          {NewText}
        </NavLink>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={SUPPLIER_SEARCH_TYPES}
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
                if (selectedField === 'ruc') {
                  if (!/^[0-9]+$/.test(value)) return 'Solo números';
                  if (value.length < 11) return 'Min 11';
                  if (value.length > 15) return 'Max 15';
                  return true;
                }
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
            onClick={reloadSuppliers}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingSuppliersText} />
      ) : (
        <SupplierTable
          data={data}
          fetchFailed={fetchFailed}
          actions={(row) => (
            <div className='join-horizontal join'>
              <Button
                className='join-item btn-sm'
                color='btn-primary'
                icon={DetailsIcon}
                title={DetailsText}
                onClick={() => {
                  navigate(`/dashboard/supplier/${row.id}`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'supplier:show'])}
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  navigate(`/dashboard/supplier/${row.id}/edit`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'supplier:update'])}
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => showStatusChangeModal(row)}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'supplier:destroy'])}
              />
            </div>
          )}
        />
      )}

      <Paginator
        page={query.page}
        limit={query.limit}
        totalPages={totalPages}
        onPageChange={(page) => setQuery((q) => ({ ...q, page }))}
        onLimitChange={(limit) => setQuery((q) => ({ ...q, limit, page: 1 }))}
        status={query.status}
        onStatusChange={(status) => setQuery((q) => ({ ...q, status, page: 1 }))}
        statusTypes={DEFAULT_STATUS_TYPES}
      />

      <h1 className='mt-1 text-center font-medium'>
        {data.length >= 1 && !loading && !fetchFailed
          ? TableElementsMessage(
              SupplierText.toLowerCase(),
              SuppliersText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
    </div>
  );
}

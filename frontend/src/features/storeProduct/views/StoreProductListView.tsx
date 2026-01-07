import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { DEFAULT_STATUS_TYPES, DEFAULT_STORE_PRODUCT_SEARCH_TYPES } from '~/constants/arrays';
import type { StoreProduct } from '~/types/storeProduct';
import { storeProductService, type StoreProductQuery } from '../services/storeProductService';
import { Paginator } from '~/components/Paginator';
import Button from '~/components/Button';
import {
  DeleteIcon,
  DetailsIcon,
  EditIcon,
  ReloadIcon,
  RestoreIcon,
  SearchIcon,
} from '~/constants/iconNames';
import {
  CancelText,
  ConfirmActionText,
  DeleteText,
  DetailsText,
  EditText,
  ErrorTagText,
  LoadingStoreProductsText,
  NewText,
  OkTagText,
  ReloadText,
  RestoreText,
  SearchText,
  StoreProductStatusChangeMessage,
  StoreProductStatusUpdateFailedText,
  StoreProductStatusUpdatedText,
  StoreProductText,
  StoreProductsText,
  TableElementsMessage,
} from '~/constants/strings';
import clsx from 'clsx';
import StoreProductTable from '../components/StoreProductTable';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';

export default function StoreProductListView() {
  const [data, setData] = useState<StoreProduct[]>([]);
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
      field: DEFAULT_STORE_PRODUCT_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const onSubmit = async (values: { field: string; search: string }) => {
    setLoading(true);
    const query: StoreProductQuery = {
      page,
      limit,
      field: values.field,
      search: values.search,
      status: status,
    };
    try {
      const response = await storeProductService.index(query);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
      setLoading(false);
    } catch {
      handleFailedFetch();
    }
  };

  const loadStoreProducts = async () => {
    setLoading(true);

    const query: StoreProductQuery = {
      page,
      limit,
      search: '',
      status: status,
      field: undefined,
      sortBy: undefined,
      sortDir: undefined,
    };

    try {
      const response = await storeProductService.index(query);
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

  const reloadStoreProducts = async () => {
    reset();
    setData([]);
    setPage(1);
    setLimit(10);
    await loadStoreProducts();
  };

  const showStatusChangeModal = async (storeProduct: StoreProduct) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: StoreProductStatusChangeMessage(storeProduct),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        storeProduct.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(storeProduct.storeId, storeProduct.productId);
    }
  };

  const performStatusChange = async (storeId: number, productId: number) => {
    try {
      const res = await storeProductService.Destroy(storeId, productId);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? StoreProductStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadStoreProducts();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: StoreProductStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  useEffect(() => {
    loadStoreProducts();
  }, [page, limit]);

  useEffect(() => {
    loadStoreProducts();
  }, [status]);

  useEffect(() => {
    resetField('search');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink to='/dashboard/store-product/create' className='btn btn-success w-full md:w-auto'>
          {NewText}
        </NavLink>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={DEFAULT_STORE_PRODUCT_SEARCH_TYPES}
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
                if (selectedField === 'storeId' || selectedField === 'productId')
                  return /^[0-9]+$/.test(value) || 'Solo números';
                if (selectedField === 'barcode') {
                  if (!/^[A-Za-z0-9]{8,30}$/.test(value))
                    return 'Formato de código de barras incorrecto.';
                  if (value.length < 8) return 'Min 8';
                  if (value.length > 30) return 'Max 30';
                  return true;
                }
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
            onClick={reloadStoreProducts}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingStoreProductsText} />
      ) : (
        <StoreProductTable
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
                  navigate(`/dashboard/store-product/${row.storeId}/${row.productId}`);
                }}
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  navigate(`/dashboard/store-product/${row.storeId}/${row.productId}/edit`);
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
              StoreProductText.toLowerCase(),
              StoreProductsText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
    </div>
  );
}

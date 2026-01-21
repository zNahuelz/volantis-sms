import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { DEFAULT_STATUS_TYPES, PRODUCT_SEARCH_TYPES } from '~/constants/arrays';
import type { Product } from '~/types/product';
import { productService, type ProductQuery } from '../services/productService';
import {
  CancelText,
  ConfirmActionText,
  DeleteText,
  DetailsText,
  EditText,
  ErrorTagText,
  LoadingProductsText,
  NewText,
  OkTagText,
  ProductStatusChangeMessage,
  ProductStatusUpdatedText,
  ProductText,
  ProductsText,
  ReloadText,
  RestoreText,
  SearchText,
  SupplierStatusUpdateFailedText,
  TableElementsMessage,
} from '~/constants/strings';
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
import ProductTable from '../components/ProductTable';
import clsx from 'clsx';
import { Paginator } from '~/components/Paginator';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import { useAuth } from '~/context/authContext';
import { hasAbilities } from '~/utils/helpers';

export default function ProductsListView() {
  const authStore = useAuth();
  const [data, setData] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [query, setQuery] = useState<ProductQuery>({
    page: 1,
    limit: 10,
    search: '',
    field: undefined,
    status: 'available',
  });
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
      field: PRODUCT_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const fetchProducts = async (q: ProductQuery) => {
    setLoading(true);
    setFetchFailed(false);
    try {
      const response = await productService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadProducts = async () => {
    reset();
    setQuery({
      page: 1,
      limit: 10,
      search: '',
      field: undefined,
      status: 'available',
    });
  };

  const onSubmit = (values: { field: string; search: string }) => {
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

  const showStatusChangeModal = async (product: Product) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: ProductStatusChangeMessage(product),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        product.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(product.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await productService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? ProductStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadProducts();
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
    fetchProducts(query);
  }, [query]);

  useEffect(() => {
    resetField('search');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink
          to={
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:store'])
              ? '/dashboard'
              : '/dashboard/product/create'
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
            options={PRODUCT_SEARCH_TYPES}
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
                if (selectedField === 'barcode') {
                  if (!/^[A-Za-z0-9]{8,30}$/.test(value))
                    return 'Formato de código de barras incorrecto.';
                  if (value.length < 8) return 'Min 8';
                  if (value.length > 30) return 'Max 30';
                  return true;
                }
                if (selectedField === 'name' || selectedField === 'description')
                  return value.length >= 3 || 'Min 3 caracteres';
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
            onClick={reloadProducts}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingProductsText} />
      ) : (
        <ProductTable
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
                  navigate(`/dashboard/product/${row.id}`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:show'])}
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  navigate(`/dashboard/product/${row.id}/edit`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:update'])}
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => showStatusChangeModal(row)}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:destroy'])}
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
              ProductText.toLowerCase(),
              ProductsText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
    </div>
  );
}

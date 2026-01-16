import { useState, useEffect } from 'react';
import type { Product } from '~/types/product';
import { productService, type ProductQuery } from '~/features/products/services/productService';
import { DEFAULT_STATUS_TYPES, PRODUCT_SEARCH_TYPES } from '~/constants/arrays';
import { useForm } from 'react-hook-form';
import Select from '~/components/Select';
import Input from '~/components/Input';
import { AddIcon, ReloadIcon, SearchIcon } from '~/constants/iconNames';
import Button from '~/components/Button';
import {
  AddProductText,
  LoadingProductsText,
  ProductText,
  ProductsText,
  ReloadText,
  SearchText,
  TableElementsMessage,
} from '~/constants/strings';
import Loading from '~/components/Loading';
import ProductTable from '~/features/products/components/ProductTable';
import { Paginator } from '~/components/Paginator';

interface ProductSearchComponentProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductSearchComponent({ onSelectProduct }: ProductSearchComponentProps) {
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

  useEffect(() => {
    fetchProducts(query);
  }, [query]);

  useEffect(() => {
    resetField('search');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <div className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'>
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
            onClick={handleSubmit(onSubmit)}
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
        </div>
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
                icon={AddIcon}
                title={AddProductText.toUpperCase()}
                onClick={() => onSelectProduct(row)}
              />
            </div>
          )}
          hiddenCols={['updatedAt', 'deletedAt']}
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

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { BUY_ORDER_SEARCH_TYPES, BUY_ORDER_STATUS, DEFAULT_STATUS_TYPES } from '~/constants/arrays';
import type { BuyOrder } from '~/types/buyOrder';
import { buyOrderService, type BuyOrderQuery } from '../services/buyOrderService';
import { Paginator } from '~/components/Paginator';
import {
  BuyOrderStatusChangeMessage,
  BuyOrderStatusUpdateFailedText,
  BuyOrderStatusUpdatedText,
  BuyOrderText,
  BuyOrdersText,
  CancelText,
  ConfirmActionText,
  DeleteText,
  DetailsText,
  EditText,
  ErrorTagText,
  LoadingBuyOrdersText,
  NewText,
  OkTagText,
  ReloadText,
  RestoreText,
  SearchText,
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
import Button from '~/components/Button';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import { NavLink } from 'react-router';
import BuyOrderTable from '../components/BuyOrderTable';
import type { Supplier } from '~/types/supplier';
import type { Store } from '~/types/store';
import { storeService } from '~/features/stores/services/storeService';
import { supplierService } from '~/features/suppliers/services/supplierService';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import clsx from 'clsx';

export default function BuyOrderListView() {
  const [data, setData] = useState<BuyOrder[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [lockSearchBySupplier, setLockSearchBySupplier] = useState(false);
  const [lockSearchByStore, setLockSearchByStore] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [query, setQuery] = useState<BuyOrderQuery>({
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
      field: BUY_ORDER_SEARCH_TYPES[0].value,
      search: '',
      buyOrderStatusField: BUY_ORDER_STATUS[0].value,
      supplierId: suppliers[0]?.id ?? '',
      storeId: stores[0]?.id ?? '',
    },
  });

  const selectedField = watch('field');

  const fetchBuyOrders = async (q: BuyOrderQuery) => {
    setLoading(true);
    try {
      const response = await buyOrderService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadBuyOrders = async () => {
    reset();
    setQuery({
      page: 1,
      limit: 10,
      search: '',
      field: undefined,
      status: 'available',
    });
  };

  const onSubmit = async (values: {
    field: string;
    search: string;
    buyOrderStatusField: string;
    storeId: string;
    supplierId: string;
  }) => {
    setLoading(true);
    setQuery((q) => ({
      ...q,
      field: values.field,
      search: resolveSearchValue(values),
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

  const resolveSearchValue = (values: any) => {
    switch (values.field) {
      case 'status':
        return values.buyOrderStatusField;
      case 'storeId':
        return values.storeId;
      case 'supplierId':
        return values.supplierId;
      default:
        return values.search;
    }
  };

  const showStatusChangeModal = async (buyOrder: BuyOrder) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: BuyOrderStatusChangeMessage(buyOrder),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        buyOrder.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(buyOrder.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await buyOrderService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? BuyOrderStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadBuyOrders();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: BuyOrderStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadSuppliersAndStores() {
      const [storesResult, suppliersResult] = await Promise.allSettled([
        storeService.list('available'),
        supplierService.list('available'),
      ]);

      if (!mounted) return;

      const storeFailed = storesResult.status === 'rejected';
      const supplierFailed = suppliersResult.status === 'rejected';

      let storesData: Store[] = [];
      let suppliersData: Supplier[] = [];

      if (!storeFailed) storesData = storesResult.value;
      if (!supplierFailed) suppliersData = suppliersResult.value;

      setStores(storesData);
      setSuppliers(suppliersData);

      if (storeFailed || storesData.length === 0) setLockSearchByStore(true);

      if (supplierFailed || suppliersData.length === 0) setLockSearchBySupplier(true);

      setLoading(false);
    }

    loadSuppliersAndStores();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    fetchBuyOrders(query);
  }, [query]);

  useEffect(() => {
    resetField('search');
    resetField('buyOrderStatusField');
    resetField('storeId');
    resetField('supplierId');
  }, [selectedField]);

  useEffect(() => {
    if (suppliers.length && stores.length) {
      reset({
        field: BUY_ORDER_SEARCH_TYPES[0].value,
        search: '',
        buyOrderStatusField: BUY_ORDER_STATUS[0].value,
        supplierId: suppliers[0].id,
        storeId: stores[0].id,
      });
    }
  }, [suppliers, stores, reset]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink to='/dashboard/buy-order/create' className='btn btn-success w-full md:w-auto'>
          {NewText}
        </NavLink>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={BUY_ORDER_SEARCH_TYPES}
            width='w-full md:w-50'
            {...register('field', { required: true })}
          />

          <Select
            options={BUY_ORDER_STATUS}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField != 'status'}
            {...register('buyOrderStatusField', {
              required: selectedField === 'status' ? true : false,
            })}
          />

          <Select
            options={suppliers.map((s) => ({ label: s.name!, value: s.id! }))}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField != 'supplierId' || lockSearchBySupplier}
            title={SupplierText.toUpperCase()}
            {...register('supplierId', {
              required: selectedField === 'supplierId' ? true : false,
              valueAsNumber: true,
            })}
          />

          <Select
            options={stores.map((s) => ({ label: s.name!, value: s.id! }))}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField != 'storeId' || lockSearchByStore}
            title={SupplierText.toUpperCase()}
            {...register('storeId', {
              required: selectedField === 'storeId' ? true : false,
              valueAsNumber: true,
            })}
          />

          <Input
            icon={SearchIcon}
            width='w-full md:w-50'
            disabled={
              !selectedField ||
              selectedField === 'status' ||
              selectedField === 'storeId' ||
              selectedField === 'supplierId'
            }
            {...register('search', {
              validate: (value) => {
                if (selectedField === 'status') return true;
                if (selectedField === 'supplierId') return true;
                if (selectedField === 'storeId') return true;
                if (!value) return 'Campo requerido';
                if (selectedField === 'id') return /^[0-9]+$/.test(value) || 'Solo números';
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
            onClick={reloadBuyOrders}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingBuyOrdersText} />
      ) : (
        <BuyOrderTable
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
                  navigate(`/dashboard/buy-order/${row.id}`);
                }}
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  navigate(`/dashboard/buy-order/${row.id}/edit`);
                }}
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => {
                  showStatusChangeModal(row);
                }}
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
              BuyOrderText.toLowerCase(),
              BuyOrdersText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
    </div>
  );
}

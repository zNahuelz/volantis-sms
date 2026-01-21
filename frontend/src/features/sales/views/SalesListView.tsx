import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import type { Sale } from '~/types/sale';
import { saleService, type SaleQuery } from '../services/saleService';
import { useForm } from 'react-hook-form';
import { DEFAULT_STATUS_TYPES, SALE_SEARCH_TYPES } from '~/constants/arrays';
import {
  DetailsText,
  DownloadPdfText,
  DownloadingText,
  ErrorTagText,
  GoToPdfText,
  LoadingSalesText,
  NewText,
  PdfDownloadFailed,
  ReloadText,
  SaleTextAlt,
  SalesTextAlt,
  SearchText,
  TableElementsMessage,
} from '~/constants/strings';
import { Paginator } from '~/components/Paginator';
import Button from '~/components/Button';
import { DetailsIcon, DownloadIcon, PdfIcon, ReloadIcon, SearchIcon } from '~/constants/iconNames';
import SaleTable from '../components/SaleTable';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import type { Store } from '~/types/store';
import type { PaymentType } from '~/types/paymentType';
import type { VoucherType } from '~/types/voucherType';
import { storeService } from '~/features/stores/services/storeService';
import { paymentTypeService } from '~/features/paymentTypes/services/paymentTypeService';
import { voucherTypeService } from '~/features/voucherTypes/services/voucherTypeService';
import { useAuth } from '~/context/authContext';
import Swal from 'sweetalert2';
import { longSwalDismissalTime } from '~/constants/values';
import { hasAbilities } from '~/utils/helpers';

export default function SalesListView() {
  const [data, setData] = useState<Sale[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [voucherTypes, setVoucherTypes] = useState<VoucherType[]>([]);
  const [lockSearchByStore, setLockSearchByStore] = useState(false);
  const [lockSearchByPaymentT, setLockSearchByPaymentT] = useState(false);
  const [lockSearchByVoucherT, setLockSearchByVoucherT] = useState(false);
  const [query, setQuery] = useState<SaleQuery>({
    page: 1,
    limit: 10,
    search: '',
    field: undefined,
    status: 'available',
  });
  const [downloading, setDownloading] = useState(false);
  const authStore = useAuth();
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
      field: SALE_SEARCH_TYPES[0].value,
      search: '',
      storeId: stores[0]?.id ?? '',
      paymentTypeId: paymentTypes[0]?.id ?? '',
      voucherTypeId: voucherTypes[0]?.id ?? '',
    },
  });

  const selectedField = watch('field');

  const fetchSales = async (q: SaleQuery) => {
    setLoading(true);
    try {
      const response = await saleService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadSales = async () => {
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
    storeId: string | number;
    paymentTypeId: string | number;
    voucherTypeId: string | number;
  }) => {
    setLoading(true);
    setQuery((q) => ({
      ...q,
      field: values.field,
      search: resolveSearchValue(values),
      page: 1,
    }));
    setLoading(true);
  };

  const resolveSearchValue = (values: any) => {
    switch (values.field) {
      case 'storeId':
        return values.storeId;
      case 'paymentTypeId':
        return values.paymentTypeId;
      case 'voucherTypeId':
        return values.voucherTypeId;
      default:
        return values.search;
    }
  };

  const handleFailedFetch = () => {
    setData([]);
    setTotalPages(1);
    setTotalItems(0);
    setLoading(false);
    setFetchFailed(true);
  };

  useEffect(() => {
    let mounted = true;

    async function loadSearchEntities() {
      const [storesResult, paymentsResult, vouchersResult] = await Promise.allSettled([
        storeService.list('available'),
        paymentTypeService.list('available'),
        voucherTypeService.list('available'),
      ]);

      if (!mounted) return;

      const storeFailed = storesResult.status === 'rejected';
      const paymentFailed = paymentsResult.status === 'rejected';
      const voucherFailed = vouchersResult.status === 'rejected';

      let storesData: Store[] = [];
      let paymentsData: PaymentType[] = [];
      let vouchersData: VoucherType[] = [];

      if (!storeFailed) storesData = storesResult.value;
      if (!paymentFailed) paymentsData = paymentsResult.value;
      if (!voucherFailed) vouchersData = vouchersResult.value;

      setStores(storesData);
      setPaymentTypes(paymentsData);
      setVoucherTypes(vouchersData);

      if (storeFailed || storesData.length === 0) setLockSearchByStore(true);

      if (paymentFailed || paymentsData.length === 0) setLockSearchByPaymentT(true);

      if (voucherFailed || vouchersData.length === 0) setLockSearchByVoucherT(true);

      setLoading(false);
    }

    loadSearchEntities();
    return () => {
      mounted = false;
    };
  }, []);

  const downloadVoucherPdf = async (row: Sale) => {
    setDownloading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/report/sale-pdf/${row.id}?download=true`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Descarga de PDF fallida: (${response.status})`);
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${row.set}-${row.correlative}.pdf`;
        a.click();
      } finally {
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: ErrorTagText,
        html: PdfDownloadFailed,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      });
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchSales(query);
  }, [query]);

  useEffect(() => {
    resetField('search');
    resetField('storeId');
    resetField('paymentTypeId');
    resetField('voucherTypeId');
  }, [selectedField]);

  useEffect(() => {
    if (stores.length && paymentTypes.length && voucherTypes.length) {
      reset({
        field: SALE_SEARCH_TYPES[0].value,
        search: '',
        storeId: stores[0].id,
        paymentTypeId: paymentTypes[0].id,
        voucherTypeId: voucherTypes[0].id,
      });
    }
  }, [stores, paymentTypes, voucherTypes, reset]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink
          to={
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:store'])
              ? '/dashboard'
              : '/dashboard/sale/create'
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
            options={SALE_SEARCH_TYPES}
            width='w-full md:w-50'
            disabled={loading}
            {...register('field', { required: true })}
          />

          <Select
            options={stores.map((s) => ({ label: s.name, value: s.id! }))}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField !== 'storeId' || lockSearchByStore || loading}
            {...register('storeId', {
              required: selectedField === 'storeId' ? true : false,
              valueAsNumber: true,
            })}
          />

          <Select
            options={paymentTypes.map((s) => ({ label: s.name, value: s.id! }))}
            width='w-full md:w-50'
            disabled={
              !selectedField || selectedField !== 'paymentTypeId' || lockSearchByPaymentT || loading
            }
            {...register('paymentTypeId', {
              required: selectedField === 'paymentTypeId' ? true : false,
              valueAsNumber: true,
            })}
          />

          <Select
            options={voucherTypes.map((s) => ({ label: s.name, value: s.id! }))}
            width='w-full md:w-50'
            disabled={
              !selectedField || selectedField !== 'voucherTypeId' || lockSearchByVoucherT || loading
            }
            {...register('voucherTypeId', {
              required: selectedField === 'voucherTypeId' ? true : false,
              valueAsNumber: true,
            })}
          />

          <Input
            icon={SearchIcon}
            width='w-full md:w-50'
            disabled={
              !selectedField ||
              selectedField === 'storeId' ||
              selectedField === 'paymentTypeId' ||
              selectedField === 'voucherTypeId' ||
              loading
            }
            {...register('search', {
              validate: (value) => {
                if (selectedField === 'storeId') return true;
                if (selectedField === 'paymentTypeId') return true;
                if (selectedField === 'voucherTypeId') return true;
                if (!value) return 'Campo requerido';
                if (selectedField === 'id') return /^[0-9]+$/.test(value) || 'Solo números';
                if (selectedField === 'dni') {
                  if (!/^[0-9]+$/.test(value)) return 'Solo números';
                  if (value.length < 8) return 'Min 8';
                  if (value.length > 15) return 'Max 15';
                  return true;
                }
                if (selectedField === 'set' || selectedField === 'correlative')
                  return value.length >= 3 || 'Min 3 caracteres.';
                return true;
              },
            })}
          />

          <Button
            label={SearchText}
            type='submit'
            width='w-full md:w-auto'
            color='btn-info'
            disabled={!isValid || loading}
          />

          <Button
            icon={ReloadIcon}
            width='w-full md:w-auto'
            color='btn-neutral'
            title={ReloadText}
            type='button'
            onClick={reloadSales}
            disabled={loading}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingSalesText} />
      ) : (
        <SaleTable
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
                  navigate(`/dashboard/sale/${row.id}`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:show'])}
              />
              <Button
                className='join-item btn-sm'
                color='btn-error'
                icon={PdfIcon}
                title={GoToPdfText.toUpperCase()}
                onClick={() => {
                  navigate(`/dashboard/sale/${row.id}/pdf`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'report:salePdf'])}
              />
              <Button
                className='join-item btn-sm'
                color='btn-success'
                icon={!downloading ? DownloadIcon : ''}
                isLoading={downloading}
                title={!downloading ? DownloadPdfText.toUpperCase() : DownloadingText.toUpperCase()}
                onClick={() => {
                  downloadVoucherPdf(row);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'report:salePdf'])}
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
              SaleTextAlt.toLowerCase(),
              SalesTextAlt.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
    </div>
  );
}

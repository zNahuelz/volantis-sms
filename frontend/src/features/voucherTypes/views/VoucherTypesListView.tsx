import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DEFAULT_STATUS_TYPES, VOUCHER_TYPES_SEARCH_TYPES } from '~/constants/arrays';
import type { VoucherType } from '~/types/voucherType';
import { voucherTypeService, type VoucherTypeQuery } from '../services/voucherTypeService';
import { Paginator } from '~/components/Paginator';
import {
  CancelText,
  ConfirmActionText,
  ContinueText,
  DetailsText,
  ErrorTagText,
  HelpText,
  InfoTag,
  LoadingVoucherTypesText,
  OkTagText,
  ReloadText,
  ResetText,
  SearchText,
  TableElementsMessage,
  VoucherTypeAltText,
  VoucherTypeDetailText,
  VoucherTypeRestorationMessage,
  VoucherTypesHelp,
  VoucherTypesRestorationCompText,
  VoucherTypesRestorationFailText,
  VoucherTypesText,
} from '~/constants/strings';
import { DetailsIcon, HelpIcon, ReloadIcon, SearchIcon } from '~/constants/iconNames';
import Button from '~/components/Button';
import VoucherTypeTable from '../components/VoucherTypeTable';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Swal from 'sweetalert2';
import Modal from '~/components/Modal';
import VoucherTypeDetail from '../components/VoucherTypeDetail';
import { ErrorColor, SuccessColor, longSwalDismissalTime } from '~/constants/values';
import { hasAbilities } from '~/utils/helpers';
import { useAuth } from '~/context/authContext';

export default function VoucherTypesListView() {
  const [data, setData] = useState<VoucherType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [voucherTypeDetailVisible, setVoucherTypeDetailVisible] = useState(false);
  const [selectedVoucherType, setSelectedVoucherType] = useState<VoucherType | null>();
  const [query, setQuery] = useState<VoucherTypeQuery>({
    page: 1,
    limit: 10,
    search: '',
    field: undefined,
    status: 'available',
  });
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
      field: VOUCHER_TYPES_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const fetchVoucherTypes = async (q: VoucherTypeQuery) => {
    setLoading(true);
    try {
      const response = await voucherTypeService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadVoucherTypes = async () => {
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

  const showHelpModal = () => {
    Swal.fire({ title: InfoTag, html: VoucherTypesHelp, icon: 'info' });
  };

  const showRestoreTypesModal = async () => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: VoucherTypeRestorationMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText: ContinueText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performTypesRestoration();
    }
  };

  const performTypesRestoration = async () => {
    try {
      const res = await voucherTypeService.restoreTypes();
      Swal.fire({
        title: OkTagText,
        html: !res.message ? VoucherTypesRestorationCompText : res.message,
        icon: 'success',
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadVoucherTypes();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: !error.message ? VoucherTypesRestorationFailText : error.message,
        icon: 'error',
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadVoucherTypes();
      });
    }
  };

  useEffect(() => {
    fetchVoucherTypes(query);
  }, [query]);

  useEffect(() => {
    resetField('search');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <Button
          label={ResetText}
          color='btn-success'
          width='w-full md:w-auto'
          onClick={() => showRestoreTypesModal()}
          disabled={
            data.length >= 2 ||
            query.status === 'deleted' ||
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'voucherType:regenerate'])
          }
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={VOUCHER_TYPES_SEARCH_TYPES}
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
            onClick={reloadVoucherTypes}
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
        <Loading loadMessage={LoadingVoucherTypesText} />
      ) : (
        <VoucherTypeTable
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
                  setSelectedVoucherType(row);
                  setVoucherTypeDetailVisible(true);
                }}
                disabled={
                  voucherTypeDetailVisible ||
                  !hasAbilities(authStore?.abilityKeys, [
                    'sys:admin',
                    'voucherType:show',
                    'voucherType:index',
                    'voucherType:list',
                  ])
                }
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
              VoucherTypeAltText.toLowerCase(),
              VoucherTypesText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
      {/** Voucher type detail modal*/}
      <Modal
        open={voucherTypeDetailVisible}
        title={VoucherTypeDetailText}
        onClose={() => setVoucherTypeDetailVisible(false)}
        width='max-w-2xl'
      >
        <VoucherTypeDetail voucherType={selectedVoucherType}></VoucherTypeDetail>
      </Modal>
    </div>
  );
}

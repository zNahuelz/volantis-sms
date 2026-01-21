import type { VoucherSerie } from '~/types/voucherSerie';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { VOUCHER_SERIES_SEARCH_TYPES, VOUCHER_SERIES_STATUS_TYPES } from '~/constants/arrays';
import { voucherSerieService, type VoucherSerieQuery } from '../services/voucherSerieService';
import {
  CancelText,
  ConfirmActionText,
  DisableText,
  EditText,
  EditVoucherSerieText,
  EnableText,
  ErrorTagText,
  HelpText,
  InfoTag,
  LoadingVoucherSeriesText,
  NewText,
  NewVoucherSerieText,
  OkTagText,
  ReloadText,
  SearchText,
  TableElementsMessage,
  VoucherSerieStatusChangeFailedText,
  VoucherSerieStatusChangeMessage,
  VoucherSerieStatusChangedText,
  VoucherSerieText,
  VoucherSeriesHelp,
  VoucherSeriesText,
} from '~/constants/strings';
import { Paginator } from '~/components/Paginator';
import Button from '~/components/Button';
import {
  DisabledIcon,
  EditIcon,
  EnabledIcon,
  HelpIcon,
  ReloadIcon,
  SearchIcon,
} from '~/constants/iconNames';
import clsx from 'clsx';
import VoucherSerieTable from '../components/VoucherSerieTable';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Modal from '~/components/Modal';
import VoucherSerieForm from '../components/VoucherSerieForm';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import { useAuth } from '~/context/authContext';
import { hasAbilities } from '~/utils/helpers';

export default function VoucherSeriesListView() {
  const [data, setData] = useState<VoucherSerie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [newSerieModalVisible, setNewSerieModalVisible] = useState(false);
  const [editSerieModalVisible, setEditSerieModalVisible] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState<VoucherSerie>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [query, setQuery] = useState<VoucherSerieQuery>({
    page: 1,
    limit: 10,
    search: '',
    field: undefined,
    status: 'active',
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
      field: VOUCHER_SERIES_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const fetchVoucherSeries = async (q: VoucherSerieQuery) => {
    setLoading(true);
    try {
      const response = await voucherSerieService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadVoucherSeries = async () => {
    reset();
    setQuery({
      page: 1,
      limit: 10,
      search: '',
      field: undefined,
      status: 'active',
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

  const showStatusChangeModal = async (voucherSerie: VoucherSerie) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: VoucherSerieStatusChangeMessage(voucherSerie),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText: voucherSerie.isActive
        ? DisableText.toUpperCase()
        : EnableText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(voucherSerie.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await voucherSerieService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? VoucherSerieStatusChangedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadVoucherSeries();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: !error.message ? VoucherSerieStatusChangeFailedText : error.message,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  const showHelpModal = () => {
    Swal.fire({ title: InfoTag, html: VoucherSeriesHelp, icon: 'info' });
  };

  useEffect(() => {
    fetchVoucherSeries(query);
  }, [query]);

  useEffect(() => {
    resetField('search');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <Button
          label={NewText}
          color='btn-success'
          width='w-full md:w-auto'
          onClick={() => setNewSerieModalVisible(true)}
          disabled={
            newSerieModalVisible ||
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'voucherSerie:store'])
          }
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={VOUCHER_SERIES_SEARCH_TYPES}
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
                if (selectedField === 'id' || selectedField === 'currentNumber')
                  return /^[0-9]+$/.test(value) || 'Solo números';
                if (selectedField === 'seriesCode') return value.length >= 2 || 'Min 3 caracteres';
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
            onClick={reloadVoucherSeries}
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
        <Loading loadMessage={LoadingVoucherSeriesText} />
      ) : (
        <VoucherSerieTable
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
                  setSelectedSerie(row);
                  setEditSerieModalVisible(true);
                }}
                disabled={
                  editSerieModalVisible ||
                  !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'voucherSerie:update'])
                }
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.isActive ? 'btn-success' : 'btn-warning'}
                icon={row.isActive ? EnabledIcon : DisabledIcon}
                title={row.isActive ? DisableText : EnableText}
                onClick={() => showStatusChangeModal(row)}
                disabled={
                  !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'voucherSerie:destroy'])
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
        statusTypes={VOUCHER_SERIES_STATUS_TYPES}
      />

      <h1 className='mt-1 text-center font-medium'>
        {data.length >= 1 && !loading && !fetchFailed
          ? TableElementsMessage(
              VoucherSerieText.toLowerCase(),
              VoucherSeriesText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>

      {/** New voucher serie modal*/}
      <Modal
        open={newSerieModalVisible}
        title={NewVoucherSerieText}
        onClose={() => setNewSerieModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-md'
      >
        <VoucherSerieForm
          onSubmit={(data) => voucherSerieService.create(data)}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadVoucherSeries();
            setNewSerieModalVisible(false);
          }}
        ></VoucherSerieForm>
      </Modal>

      {/** Edit voucher serie modal*/}
      <Modal
        open={editSerieModalVisible}
        title={EditVoucherSerieText}
        onClose={() => setEditSerieModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-md'
      >
        <VoucherSerieForm
          onSubmit={(data) => voucherSerieService.update(Number(selectedSerie?.id), data!)}
          voucherSerie={selectedSerie}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadVoucherSeries();
            setEditSerieModalVisible(false);
            setSelectedSerie(null);
          }}
        ></VoucherSerieForm>
      </Modal>
    </div>
  );
}

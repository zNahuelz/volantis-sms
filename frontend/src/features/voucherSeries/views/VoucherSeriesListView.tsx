import type { VoucherSerie } from '~/types/voucherSerie';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { VOUCHER_SERIES_SEARCH_TYPES, VOUCHER_SERIES_STATUS_TYPES } from '~/constants/arrays';
import { voucherSerieService, type VoucherSerieQuery } from '../services/voucherSerieService';
import {
  CancelText,
  ConfirmActionText,
  DeleteText,
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
  RestoreText,
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
  DeleteIcon,
  DisabledIcon,
  EditIcon,
  EnabledIcon,
  HelpIcon,
  ReloadIcon,
  RestoreIcon,
  SearchIcon,
} from '~/constants/iconNames';
import clsx from 'clsx';
import VoucherSerieTable from '../components/VoucherSerieTable';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import { NavLink } from 'react-router';
import Modal from '~/components/Modal';
import VoucherSerieForm from '../components/VoucherSerieForm';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';

export default function VoucherSeriesListView() {
  const [data, setData] = useState<VoucherSerie[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('available');
  const [fetchFailed, setFetchFailed] = useState(false);
  const [newSerieModalVisible, setNewSerieModalVisible] = useState(false);
  const [editSerieModalVisible, setEditSerieModalVisible] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState<VoucherSerie>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
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
      field: VOUCHER_SERIES_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const loadVoucherSeries = async () => {
    setLoading(true);

    const query: VoucherSerieQuery = {
      page,
      limit,
      search: '',
      status: status,
      field: undefined,
      sortBy: undefined,
      sortDir: undefined,
    };

    try {
      const response = await voucherSerieService.index(query);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
      setLoading(false);
    } catch {
      handleFailedFetch();
    }
  };

  const reloadVoucherSeries = async () => {
    reset();
    setData([]);
    setPage(1);
    setLimit(10);
    await loadVoucherSeries();
  };

  const onSubmit = async (values: { field: string; search: string }) => {
    setLoading(true);
    const query: VoucherSerieQuery = {
      page,
      limit,
      field: values.field,
      search: values.search,
      status: status,
    };
    try {
      const response = await voucherSerieService.index(query);
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
    loadVoucherSeries();
  }, [page, limit]);

  useEffect(() => {
    loadVoucherSeries();
  }, [status]);

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
          disabled={newSerieModalVisible}
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
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.isActive ? 'btn-success' : 'btn-warning'}
                icon={row.isActive ? EnabledIcon : DisabledIcon}
                title={row.isActive ? DisableText : EnableText}
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

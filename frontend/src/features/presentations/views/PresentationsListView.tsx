import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { DEFAULT_STATUS_TYPES, PRESENTATION_SEARCH_TYPES } from '~/constants/arrays';
import type { Presentation } from '~/types/presentation';
import { presentationService, type PresentationQuery } from '../services/presentationService';
import {
  CancelText,
  ConfirmActionText,
  DeleteText,
  DetailsText,
  DisableText,
  EditPresentationText,
  EditText,
  ErrorTagText,
  LoadingPresentationsText,
  NewPresentationText,
  NewText,
  OkTagText,
  PresentationStatusChangeMessage,
  PresentationStatusUpdatedText,
  PresentationText,
  PresentationsText,
  ReloadText,
  RestoreText,
  SearchText,
  TableElementsMessage,
  UserStatusUpdateFailedText,
} from '~/constants/strings';
import { Paginator } from '~/components/Paginator';
import {
  DeleteIcon,
  DetailsIcon,
  EditIcon,
  ReloadIcon,
  RestoreIcon,
  SearchIcon,
} from '~/constants/iconNames';
import Button from '~/components/Button';
import clsx from 'clsx';
import PresentationTable from '../components/PresentationTable';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Select from '~/components/Select';
import Modal from '~/components/Modal';
import PresentationForm from '../components/PresentationForm';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';

export default function PresentationsListView() {
  const [data, setData] = useState<Presentation[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('available');
  const [newPresentationModalVisible, setNewPresentationModalVisible] = useState(false);
  const [editPresentationModalVisible, setEditPresentationModalVisible] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState<Presentation>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
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
      field: PRESENTATION_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const loadPresentations = async () => {
    setLoading(true);

    const query: PresentationQuery = {
      page,
      limit,
      search: '',
      status: status,
      field: undefined,
      sortBy: undefined,
      sortDir: undefined,
    };

    try {
      const response = await presentationService.index(query);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
      setLoading(false);
    } catch {
      handleFailedFetch();
    }
  };

  const reloadPresentations = async () => {
    reset();
    setData([]);
    setPage(1);
    setLimit(10);
    await loadPresentations();
  };

  const onSubmit = async (values: { field: string; search: string }) => {
    setLoading(true);
    const query: PresentationQuery = {
      page,
      limit,
      field: values.field,
      search: values.search,
      status: status,
    };
    try {
      const response = await presentationService.index(query);
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

  const showStatusChangeModal = async (presentation: Presentation) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: PresentationStatusChangeMessage(presentation),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        presentation.deletedAt != null ? RestoreText.toUpperCase() : DisableText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(presentation.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await presentationService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? PresentationStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadPresentations();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: UserStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  useEffect(() => {
    loadPresentations();
  }, [page, limit]);

  useEffect(() => {
    loadPresentations();
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
          onClick={() => setNewPresentationModalVisible(true)}
          disabled={newPresentationModalVisible}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={PRESENTATION_SEARCH_TYPES}
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
            onClick={reloadPresentations}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingPresentationsText} />
      ) : (
        <PresentationTable
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
                  setSelectedPresentation(row);
                  setEditPresentationModalVisible(true);
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
              PresentationText.toLowerCase(),
              PresentationsText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>

      {/** New presentation modal*/}
      <Modal
        open={newPresentationModalVisible}
        title={NewPresentationText}
        onClose={() => setNewPresentationModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-md'
      >
        <PresentationForm
          onSubmit={(data) => presentationService.create(data)}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadPresentations();
            setNewPresentationModalVisible(false);
          }}
        ></PresentationForm>
      </Modal>

      {/** Edit presentation modal*/}
      <Modal
        open={editPresentationModalVisible}
        title={EditPresentationText}
        onClose={() => setEditPresentationModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-md'
      >
        <PresentationForm
          onSubmit={(data) => presentationService.update(Number(selectedPresentation?.id), data!)}
          presentation={selectedPresentation}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadPresentations();
            setEditPresentationModalVisible(false);
            setSelectedPresentation(null);
          }}
        ></PresentationForm>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import type { Ability } from '~/types/ability';
import { abilityService, type AbilityQuery } from '../services/abilityService';
import {
  AbilitiesText,
  AbilityEditText,
  AbilityText,
  BackText,
  CancelText,
  ContinueText,
  DeleteText,
  DetailsText,
  EditText,
  LoadingAbilitiesText,
  ModifySettingsWarning,
  NewAbilityText,
  NewText,
  ReloadText,
  RestoreText,
  SearchText,
  TableElementsMessage,
  WarningText,
} from '~/constants/strings';
import Button from '~/components/Button';
import { EditIcon, ReloadIcon, SearchIcon } from '~/constants/iconNames';
import AbilityTable from '../components/AbilityTable';
import Loading from '~/components/Loading';
import { useForm } from 'react-hook-form';
import { ABILITY_SEARCH_TYPES, DEFAULT_STATUS_TYPES } from '~/constants/arrays';
import Select from '~/components/Select';
import Input from '~/components/Input';
import { Paginator } from '~/components/Paginator';
import Modal from '~/components/Modal';
import AbilityForm from '../components/AbilityForm';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor } from '~/constants/values';

export default function AbilitiesListView() {
  const [data, setData] = useState<Ability[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('available');
  const navigate = useNavigate();
  const [newAbilityModalVisible, setNewAbilityModalVisible] = useState(false);
  const [editAbilityModalVisible, setEditAbilityModalVisible] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState<Ability>();
  const [dismissedWarning, setDismissedWarning] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

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
      field: ABILITY_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const loadAbilities = async () => {
    setLoading(true);

    const query: AbilityQuery = {
      page,
      limit,
      search: '',
      status: status,
      field: undefined,
      sortBy: undefined,
      sortDir: undefined,
    };

    try {
      const response = await abilityService.index(query);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
      setLoading(false);
    } catch {
      handleFailedFetch();
    }
  };

  const reloadAbilities = async () => {
    reset();
    setData([]);
    setPage(1);
    setLimit(10);
    await loadAbilities();
  };

  const onSubmit = async (values: { field: string; search: string }) => {
    setLoading(true);
    const query: AbilityQuery = {
      page,
      limit,
      field: values.field,
      search: values.search,
      status: status,
    };
    try {
      const response = await abilityService.index(query);
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

  const showWarning = () => {
    if (!dismissedWarning) {
      Swal.fire({
        title: WarningText.toUpperCase(),
        html: ModifySettingsWarning,
        icon: 'warning',
        showDenyButton: true,
        denyButtonColor: ErrorColor,
        confirmButtonColor: SuccessColor,
        confirmButtonText: ContinueText.toUpperCase(),
        denyButtonText: BackText.toUpperCase(),
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        reverseButtons: true,
      }).then((r) => {
        if (r.isConfirmed) setDismissedWarning(true);
        if (r.isDenied) navigate('/dashboard');
      });
    }
  };

  useEffect(() => {
    loadAbilities();
    showWarning();
  }, [page, limit]);

  useEffect(() => {
    loadAbilities();
    showWarning();
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
          onClick={() => setNewAbilityModalVisible(true)}
          disabled={newAbilityModalVisible}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={ABILITY_SEARCH_TYPES}
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
                if (
                  selectedField === 'name' ||
                  selectedField === 'description' ||
                  selectedField === 'key'
                )
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
            onClick={reloadAbilities}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingAbilitiesText} />
      ) : (
        <AbilityTable
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
                  setSelectedAbility(row);
                  setEditAbilityModalVisible(true);
                }}
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
              AbilityText.toLowerCase(),
              AbilitiesText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>

      {/** New ability modal*/}
      <Modal
        open={newAbilityModalVisible}
        title={NewAbilityText}
        onClose={() => setNewAbilityModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-lg'
      >
        <AbilityForm
          onSubmit={(data) => abilityService.create(data)}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadAbilities();
            setNewAbilityModalVisible(false);
          }}
        ></AbilityForm>
      </Modal>

      {/** Edit ability modal*/}
      <Modal
        open={editAbilityModalVisible}
        title={AbilityEditText}
        onClose={() => setEditAbilityModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-lg'
      >
        <AbilityForm
          onSubmit={(data) => abilityService.update(Number(selectedAbility?.id), data!)}
          ability={selectedAbility}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadAbilities();
            setEditAbilityModalVisible(false);
            setSelectedAbility(null);
          }}
        ></AbilityForm>
      </Modal>
    </div>
  );
}

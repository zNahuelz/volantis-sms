import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { SETTING_SEARCH_TYPES, SYSTEM_VAR_TYPES } from '~/constants/arrays';
import type { Setting } from '~/types/setting';
import { settingService, type SettingQuery } from '../services/settingService';
import {
  BackText,
  CancelText,
  ConfirmActionText,
  ContinueText,
  DeleteText,
  DetailsText,
  EditSettingText,
  EditText,
  ErrorTagText,
  LoadingSettingsText,
  ModifySettingsWarning,
  NewSettingText,
  NewText,
  OkTagText,
  ReloadText,
  SearchText,
  SettingDeletedText,
  SettingDeletionFailedText,
  SettingDeletionMessage,
  SettingDetailText,
  SysSettingText,
  SysSettingsText,
  TableElementsMessage,
  WarningText,
} from '~/constants/strings';
import Select from '~/components/Select';
import Input from '~/components/Input';
import { DeleteIcon, DetailsIcon, EditIcon, ReloadIcon, SearchIcon } from '~/constants/iconNames';
import Button from '~/components/Button';
import Loading from '~/components/Loading';
import SettingTable from '../components/SettingTable';
import { Paginator } from '~/components/Paginator';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import Modal from '~/components/Modal';
import SettingForm from '../components/SettingForm';
import SettingDetails from '../components/SettingDetails';

export default function SettingsListView() {
  const [data, setData] = useState<Setting[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newSettingModalVisible, setNewSettingModalVisible] = useState(false);
  const [editSettingModalVisible, setEditSettingModalVisible] = useState(false);
  const [settingDetailModalVisible, setSettingDetailModalVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [dismissedWarning, setDismissedWarning] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [query, setQuery] = useState<SettingQuery>({
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
      field: SETTING_SEARCH_TYPES[0].value,
      search: '',
      valueTypeField: SYSTEM_VAR_TYPES[0].value,
    },
  });

  const selectedField = watch('field');

  const fetchSettings = async (q: SettingQuery) => {
    setLoading(true);
    try {
      const response = await settingService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadSettings = async () => {
    reset();
    setQuery({
      page: 1,
      limit: 10,
      search: '',
      field: undefined,
      status: 'available',
    });
  };

  const onSubmit = async (values: { field: string; search: string; valueTypeField: string }) => {
    setLoading(true);
    setQuery((q) => ({
      ...q,
      field: values.field,
      search: values.field === 'valueType' ? values.valueTypeField : values.search,
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

  const showStatusChangeModal = async (setting: Setting) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: SettingDeletionMessage(setting),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText: DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(setting.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await settingService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? SettingDeletedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadSettings();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: SettingDeletionFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
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
    fetchSettings(query);
    showWarning();
  }, [query]);

  useEffect(() => {
    resetField('search');
    resetField('valueTypeField');
  }, [selectedField]);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-2 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <Button
          label={NewText}
          color='btn-success'
          width='w-full md:w-auto'
          onClick={() => setNewSettingModalVisible(true)}
          disabled={newSettingModalVisible}
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={SETTING_SEARCH_TYPES}
            width='w-full md:w-50'
            {...register('field', { required: true })}
          />

          <Select
            options={SYSTEM_VAR_TYPES}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField != 'valueType'}
            {...register('valueTypeField', {
              required: selectedField === 'valueType' ? true : false,
            })}
          />

          <Input
            icon={SearchIcon}
            width='w-full md:w-50'
            disabled={!selectedField || selectedField === 'valueType'}
            {...register('search', {
              validate: (value) => {
                if (selectedField === 'valueType') return true;
                if (!value) return 'Campo requerido';
                if (selectedField === 'id') return /^[0-9]+$/.test(value) || 'Solo números';
                if (['key', 'value', 'description'].includes(selectedField))
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
            onClick={reloadSettings}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingSettingsText} />
      ) : (
        <SettingTable
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
                  setSelectedSetting(row);
                  setSettingDetailModalVisible(true);
                }}
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  setSelectedSetting(row);
                  setEditSettingModalVisible(true);
                }}
              />

              <Button
                className='join-item btn-sm'
                color='btn-error'
                icon={DeleteIcon}
                title={DeleteText}
                onClick={() => showStatusChangeModal(row)}
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
      />

      <h1 className='mt-1 text-center font-medium'>
        {data.length >= 1 && !loading && !fetchFailed
          ? TableElementsMessage(
              SysSettingText.toLowerCase(),
              SysSettingsText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>

      {/** New setting modal*/}
      <Modal
        open={newSettingModalVisible}
        title={NewSettingText}
        onClose={() => setNewSettingModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-lg'
      >
        <SettingForm
          onSubmit={(data) => settingService.create(data)}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadSettings();
            setNewSettingModalVisible(false);
          }}
        ></SettingForm>
      </Modal>

      {/** Edit setting modal*/}
      <Modal
        open={editSettingModalVisible}
        title={EditSettingText}
        onClose={() => setEditSettingModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-lg'
      >
        <SettingForm
          onSubmit={(data) => settingService.update(Number(selectedSetting?.id), data!)}
          setting={selectedSetting}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadSettings();
            setEditSettingModalVisible(false);
            setSelectedSetting(null);
          }}
        ></SettingForm>
      </Modal>

      {/** Setting detail modal */}
      <Modal
        open={settingDetailModalVisible}
        title={SettingDetailText}
        onClose={() => {
          setSettingDetailModalVisible(false);
          setSelectedSetting(null);
        }}
        width='max-w-lg'
      >
        <SettingDetails setting={selectedSetting}></SettingDetails>
      </Modal>
    </div>
  );
}

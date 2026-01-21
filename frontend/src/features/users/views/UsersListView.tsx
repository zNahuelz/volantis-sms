import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CancelText,
  ConfirmActionText,
  DeleteText,
  DetailsText,
  DisableText,
  EditText,
  ErrorTagText,
  LoadingUsersText,
  NewText,
  OkTagText,
  ReloadText,
  RestoreText,
  SearchText,
  TableElementsMessage,
  UserEditText,
  UserRegisterText,
  UserStatusChangeMessage,
  UserStatusUpdateFailedText,
  UserStatusUpdatedText,
  UserText,
  UsersText,
} from '~/constants/strings';
import type { User } from '~/types/user';
import { userService, type UserQuery } from '../services/userService';
import Select from '~/components/Select';
import Input from '~/components/Input';
import Button from '~/components/Button';
import {
  DeleteIcon,
  DetailsIcon,
  EditIcon,
  ReloadIcon,
  RestoreIcon,
  SearchIcon,
} from '~/constants/iconNames';
import Loading from '~/components/Loading';
import UserTable from '../components/UserTable';
import clsx from 'clsx';
import { Paginator } from '~/components/Paginator';
import { DEFAULT_STATUS_TYPES, USER_SEARCH_TYPES } from '~/constants/arrays';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import Modal from '~/components/Modal';
import UserForm from '../components/UserForm';
import { useAuth } from '~/context/authContext';
import { hasAbilities } from '~/utils/helpers';

export default function UsersListView() {
  const [data, setData] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newUserModalVisible, setNewUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [fetchFailed, setFetchFailed] = useState(false);
  const [query, setQuery] = useState<UserQuery>({
    page: 1,
    limit: 10,
    search: '',
    field: undefined,
    status: 'available',
  });
  const navigate = useNavigate();

  const { user } = useAuth();
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
      field: USER_SEARCH_TYPES[0].value,
      search: '',
    },
  });

  const selectedField = watch('field');

  const fetchUsers = async (q: UserQuery) => {
    setLoading(true);
    try {
      const response = await userService.index(q);
      setData(response.data);
      setTotalPages(response.meta.lastPage);
      setTotalItems(response.meta.total);
    } catch {
      handleFailedFetch();
    } finally {
      setLoading(false);
    }
  };

  const reloadUsers = async () => {
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

  const showStatusChangeModal = async (user: User) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: UserStatusChangeMessage(user),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        user.deletedAt != null ? RestoreText.toUpperCase() : DisableText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(user.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await userService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? UserStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) reloadUsers();
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
    fetchUsers(query);
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
          onClick={() => setNewUserModalVisible(true)}
          disabled={
            newUserModalVisible ||
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'user:store'])
          }
        ></Button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex w-full flex-col items-center space-y-2 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:space-y-0'
        >
          <Select
            options={USER_SEARCH_TYPES}
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
                if (selectedField === 'dni') {
                  if (!/^[0-9]+$/.test(value)) return 'Solo números';
                  if (value.length < 8) return 'Min 8';
                  if (value.length > 15) return 'Max 15';
                  return true;
                }
                if (selectedField === 'names' || selectedField === 'username')
                  return value.length >= 3 || 'Min 3 caracteres';
                if (selectedField === 'email') return value.length >= 5 || 'Min 5 caracteres';
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
            onClick={reloadUsers}
          />
        </form>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingUsersText} />
      ) : (
        <UserTable
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
                  navigate(`/dashboard/user/${row.id}`);
                }}
                disabled={
                  row.id === user?.id ||
                  !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'user:show'])
                }
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  setSelectedUser(row);
                  setEditUserModalVisible(true);
                }}
                disabled={
                  row.id === user?.id ||
                  !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'user:update']) ||
                  editUserModalVisible
                }
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => showStatusChangeModal(row)}
                disabled={
                  row.id === user?.id ||
                  !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'user:destroy'])
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
              UserText.toLowerCase(),
              UsersText.toLowerCase(),
              totalItems,
              data.length
            )
          : ''}
      </h1>
      {/** New user modal*/}
      <Modal
        open={newUserModalVisible}
        title={UserRegisterText}
        onClose={() => setNewUserModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-3xl'
      >
        <UserForm
          onSubmit={(data) => userService.create(data)}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadUsers();
            setNewUserModalVisible(false);
          }}
        ></UserForm>
      </Modal>

      {/** Edit user modal*/}
      <Modal
        open={editUserModalVisible}
        title={UserEditText}
        onClose={() => setEditUserModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-3xl'
      >
        <UserForm
          onSubmit={(data) => userService.update(Number(selectedUser?.id), data!)}
          user={selectedUser}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            reloadUsers();
            setEditUserModalVisible(false);
            setSelectedUser(null);
          }}
        ></UserForm>
      </Modal>
    </div>
  );
}

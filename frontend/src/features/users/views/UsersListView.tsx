import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
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
  UsersListAreaText,
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

export default function UsersListView() {
  const [data, setData] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('available');
  const [newUserModalVisible, setNewUserModalVisible] = useState(false);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const navigate = useNavigate();

  const { user } = useAuth();

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

  const loadUsers = async () => {
    setLoading(true);

    const query: UserQuery = {
      page,
      limit,
      search: '',
      status: status,
      field: undefined,
      sortBy: undefined,
      sortDir: undefined,
    };

    const response = await userService.index(query);

    setData(response.data);
    setTotalPages(response.meta.lastPage);
    setTotalItems(response.meta.total);

    setLoading(false);
  };

  const reloadUsers = async () => {
    reset();
    setData([]);
    setPage(1);
    setLimit(10);
    await loadUsers();
  };

  const onSubmit = async (values: { field: string; search: string }) => {
    setLoading(true);
    const query: UserQuery = {
      page,
      limit,
      field: values.field,
      search: values.search,
      status: status,
    };
    const response = await userService.index(query);
    setData(response.data);
    setTotalPages(response.meta.lastPage);
    setTotalItems(response.meta.total);
    setLoading(false);
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
    loadUsers();
  }, [page, limit]);

  useEffect(() => {
    loadUsers();
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
          onClick={() => setNewUserModalVisible(true)}
          disabled={newUserModalVisible}
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
                disabled={row.id === user?.id}
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
                disabled={row.id === user?.id}
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => showStatusChangeModal(row)}
                disabled={row.id === user?.id}
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
        {data.length >= 1
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
          }}
        ></UserForm>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { User } from '~/types/user';
import { formatAsDatetime, isInteger } from '~/utils/helpers';
import { userService } from '../services/userService';
import Loading from '~/components/Loading';
import {
  CancelText,
  ConfirmActionText,
  CreatedAtText,
  DeleteText,
  DeletedAtText,
  DisableText,
  DniText,
  EditText,
  EmailText,
  ErrorTagText,
  GoBackText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LoadingUserText,
  NamesText,
  OkTagText,
  RestoreText,
  RoleText,
  StateText,
  SurnamesText,
  UpdatedAtText,
  UserDetailText,
  UserEditText,
  UserNotFoundText,
  UserStatusChangeMessage,
  UserStatusUpdateFailedText,
  UserStatusUpdatedText,
} from '~/constants/strings';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { DeleteIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import Modal from '~/components/Modal';
import UserForm from '../components/UserForm';
import { useAuth } from '~/context/authContext';

export default function UserDetailView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [editUserModalVisible, setEditUserModalVisible] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const navigate = useNavigate();

  const { user: _user } = useAuth();
  //TODO: ADD OTHER FIELDS AND ICON.

  useEffect(() => {
    const loadUser = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/user');
      }
      try {
        const res = await userService.show(Number(id!));
        setUser(res);
        if (res.id === _user?.id) {
          navigate('/dashboard/user');
        }
      } catch (error) {
        navigate('/dashboard/user');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

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
        if (e.dismiss) window.location.reload();
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

  if (loading) {
    return <Loading loadMessage={LoadingUserText}></Loading>;
  }

  if (!user) {
    return <p className='text-center text-error'>{UserNotFoundText}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {UserDetailText} #{user.id}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={user.id} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{NamesText}</legend>
            <Input value={user.names} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SurnamesText}</legend>
            <Input value={user.surnames} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{DniText.toUpperCase()}</legend>
            <Input value={user.dni} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{EmailText}</legend>
            <Input value={user.email} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{RoleText}</legend>
            <Input value={user?.role?.name} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(user.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(user.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!user.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(user.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={user.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={user.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
            ></Input>
          </fieldset>
        </div>

        <div className='flex flex-col items-center ps-4 pe-4 pb-4 w-full md:w-auto'>
          <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
            <Button
              label={GoBackText}
              icon={GoBackIcon}
              color='btn-secondary'
              className='join-item'
              onClick={() => history.back()}
            ></Button>
            <Button
              label={EditText}
              color='btn-accent'
              icon={EditIcon}
              className='join-item'
              onClick={() => setEditUserModalVisible(true)}
            ></Button>
            <Button
              label={user.deletedAt ? RestoreText : DeleteText}
              icon={user.deletedAt ? RestoreIcon : DeleteIcon}
              color={user.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
              onClick={() => showStatusChangeModal(user)}
            ></Button>
          </div>
        </div>
      </div>

      {/** Edit user modal*/}
      <Modal
        open={editUserModalVisible}
        title={UserEditText}
        onClose={() => setEditUserModalVisible(false)}
        disableClose={isFormSubmitting}
        width='max-w-3xl'
      >
        <UserForm
          onSubmit={(data) => userService.update(Number(user.id), data!)}
          user={user}
          onSubmittingChange={setIsFormSubmitting}
          closeParentModal={() => {
            window.location.reload();
          }}
        ></UserForm>
      </Modal>
    </div>
  );
}

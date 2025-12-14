import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import type { Role } from '~/types/role';
import { formatAsDatetime, isInteger } from '~/utils/helpers';
import { roleService } from '../services/roleService';
import Swal from 'sweetalert2';
import {
  CancelText,
  ConfirmActionText,
  CreatedAtText,
  DeleteText,
  DeletedAtText,
  DescriptionText,
  EditText,
  EmptyAbilityListText,
  ErrorTagText,
  GoBackText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LinkedAbilitiesText,
  LoadingRoleText,
  NameText,
  OkTagText,
  RestoreText,
  RoleDetailText,
  RoleNotFound,
  RoleStatusChangeMessage,
  RoleStatusUpdateFailedText,
  RoleStatusUpdatedText,
  StateText,
  UpdatedAtText,
} from '~/constants/strings';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { DeleteIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';
import { Table, type Column } from '~/components/Table';
import type { Ability } from '~/types/ability';

export default function RoleDetailView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  const columns: Column<Ability>[] = [
    { key: 'name', label: NameText },
    { key: 'description', label: DescriptionText },
  ];

  const showStatusChangeModal = async (role: Role) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: RoleStatusChangeMessage(role),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        role.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(role.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await roleService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? RoleStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: RoleStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  useEffect(() => {
    const loadRole = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/role');
      }
      try {
        const res = await roleService.show(Number(id!));
        setRole(res);
      } catch (error) {
        navigate('/dashboard/roler');
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingRoleText}></Loading>;
  }

  if (!role) {
    return <p className='text-center text-error'>{RoleNotFound}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {RoleDetailText} #{role.id}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={role.id} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{NameText}</legend>
            <Input value={role.name} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(role.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(role.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!role.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(role.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={role.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={role.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
            ></Input>
          </fieldset>

          <div className='col-span-1 md:col-start-2'>
            <p className='text-center font-semibold text-sm'>{LinkedAbilitiesText.toUpperCase()}</p>
          </div>

          <div className='col-span-full md:col-span-full'>
            <Table
              columns={columns}
              data={role?.abilities!}
              size='table-sm'
              showActions={false}
              errorMessage={EmptyAbilityListText}
            ></Table>
          </div>
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
              onClick={() => {
                navigate(`/dashboard/role/${role.id}/edit`);
              }}
            ></Button>
            <Button
              label={role.deletedAt ? RestoreText : DeleteText}
              icon={role.deletedAt ? RestoreIcon : DeleteIcon}
              color={role.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
              onClick={() => {
                showStatusChangeModal(role);
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

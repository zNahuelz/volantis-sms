import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Role } from '~/types/role';
import { roleService } from '../services/roleService';
import { NavLink } from 'react-router';
import {
  BackText,
  CancelText,
  ConfirmActionText,
  ContinueText,
  DeleteText,
  DetailsText,
  EditText,
  ErrorTagText,
  LoadingRolesText,
  ModifySettingsWarning,
  NewText,
  OkTagText,
  ReloadText,
  RestoreText,
  RoleStatusChangeMessage,
  RoleStatusUpdateFailedText,
  RoleStatusUpdatedText,
  TotalSystemRolesText,
  WarningText,
} from '~/constants/strings';
import Loading from '~/components/Loading';
import RoleTable from '../components/RoleTable';
import Button from '~/components/Button';
import { DeleteIcon, DetailsIcon, EditIcon, ReloadIcon, RestoreIcon } from '~/constants/iconNames';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import { hasAbilities } from '~/utils/helpers';
import { useAuth } from '~/context/authContext';

export default function RolesListView() {
  const authStore = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissedWarning, setDismissedWarning] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const navigate = useNavigate();

  const loadRoles = async () => {
    setLoading(true);
    try {
      const response = await roleService.list('all');
      setRoles(response);
      setLoading(false);
    } catch {
      handleFailedFetch();
    }
  };

  const handleFailedFetch = () => {
    setRoles([]);
    setLoading(false);
    setFetchFailed(true);
  };

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
        if (e.dismiss) loadRoles();
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
    loadRoles();
    showWarning();
  }, []);

  return (
    <div className='p-0 md:p-4'>
      <div className='mb-4 flex flex-col items-center space-y-2 md:flex md:flex-row md:items-center md:justify-between'>
        <NavLink
          to={
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'role:store'])
              ? '/dashboard'
              : '/dashboard/role/create'
          }
          className='btn btn-success w-full md:w-auto'
        >
          {NewText}
        </NavLink>
        <Button
          icon={ReloadIcon}
          color='btn-neutral'
          title={ReloadText}
          width='w-full md:w-auto'
          onClick={() => loadRoles()}
          disabled={
            loading ||
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'role:index', 'role:list'])
          }
        ></Button>
      </div>

      {loading ? (
        <Loading loadMessage={LoadingRolesText} />
      ) : (
        <RoleTable
          data={roles}
          fetchFailed={fetchFailed}
          actions={(row) => (
            <div className='join-horizontal join'>
              <Button
                className='join-item btn-sm'
                color='btn-primary'
                icon={DetailsIcon}
                title={DetailsText}
                onClick={() => {
                  navigate(`/dashboard/role/${row.id}`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'role:show'])}
              />

              <Button
                className='join-item btn-sm'
                color='btn-accent'
                icon={EditIcon}
                title={EditText}
                onClick={() => {
                  navigate(`/dashboard/role/${row.id}/edit`);
                }}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'role:update'])}
              />

              <Button
                className={clsx('join-item btn-sm')}
                color={row.deletedAt ? 'btn-warning' : 'btn-error'}
                icon={row.deletedAt ? RestoreIcon : DeleteIcon}
                title={row.deletedAt ? RestoreText : DeleteText}
                onClick={() => showStatusChangeModal(row)}
                disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'role:destroy'])}
              />
            </div>
          )}
        />
      )}

      <h1 className={`mt-2 text-center font-medium ${loading || fetchFailed ? 'hidden' : ''}`}>
        {TotalSystemRolesText(roles.length)}
      </h1>
    </div>
  );
}

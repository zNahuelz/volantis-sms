import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Alert from '~/components/Alert';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import Select from '~/components/Select';
import {
  CancelIcon,
  ClearIcon,
  DniIcon,
  EmailIcon,
  NameIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  CancelText,
  ClearText,
  DniText,
  EmailText,
  EmptyAbilityListText,
  ErrorTagText,
  FormLoadFailed,
  InvalidRoleIdText,
  InvalidStoreIdText,
  LoadingForm,
  NamesText,
  OkTagText,
  OpRollbackText,
  SaveText,
  SavingText,
  SurnamesText,
  UpdateText,
  UpdatingText,
  UserCreatedText,
  UserDniTakenText,
  UserEmailTaken,
  UserUpdatedText,
  UsernameChangeDisabledOnEditText,
} from '~/constants/strings';
import { longSwalDismissalTime, swalDismissalTime } from '~/constants/values';
import { roleService } from '~/features/roles/services/roleService';
import { storeService } from '~/features/stores/services/storeService';
import type { Role } from '~/types/role';
import type { Store } from '~/types/store';
import type { User } from '~/types/user';

interface UserFormProps {
  user?: User;
  onSubmit: (data: any) => Promise<any>;
  onSubmittingChange?: (value: boolean) => void;
  closeParentModal?: () => void;
}

export default function UserForm({
  user,
  onSubmit,
  onSubmittingChange,
  closeParentModal,
}: UserFormProps) {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const isEdit = Boolean(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      names: user?.names ?? '',
      surnames: user?.surnames ?? '',
      dni: user?.dni ?? '',
      email: user?.email ?? '',
      storeId: user?.storeId ?? stores[0]?.id ?? '',
      roleId: user?.roleId ?? roles[0]?.id ?? '',
    },
  });

  const submitHandler = async (data: any) => {
    try {
      await onSubmit(data);

      await Swal.fire({
        icon: 'success',
        title: OkTagText,
        html: isEdit ? UserUpdatedText : UserCreatedText,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      });

      if (isEdit) {
        closeParentModal?.();
      } else {
        reset();
        closeParentModal?.();
      }
    } catch (err: any) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => {
          const field = e.field as 'names' | 'surnames' | 'dni' | 'email' | 'storeId' | 'roleId';

          setError(field, {
            message:
              field === 'storeId'
                ? InvalidStoreIdText
                : field === 'roleId'
                  ? InvalidRoleIdText
                  : field === 'dni'
                    ? UserDniTakenText
                    : field === 'email'
                      ? UserEmailTaken
                      : e.message,
          });
        });
        return;
      }

      await Swal.fire({
        icon: 'error',
        title: OpRollbackText,
        text: ErrorTagText,
      });
      window.location.reload();
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const [storesResult, rolesResult] = await Promise.allSettled([
        storeService.list('available'),
        roleService.list('available'),
      ]);

      if (!mounted) return;

      const storeFailed = storesResult.status === 'rejected';
      const roleFailed = rolesResult.status === 'rejected';

      let storesData: Store[] = [];
      let rolesData: Role[] = [];

      if (!storeFailed) storesData = storesResult.value;
      if (!roleFailed) rolesData = rolesResult.value;

      if (!storeFailed && !roleFailed) {
        reset((prev) => ({
          ...prev,
          storeId: prev.storeId || storesResult.value[0]?.id || '',
          roleId: prev.roleId || rolesResult.value[0]?.id || '',
        }));
      }

      setStores(storesData);
      setRoles(rolesData);

      if (storeFailed || roleFailed || storesData.length === 0 || rolesData.length === 0) {
        setIsLocked(true);
      }

      setLoading(false);
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting]);

  const selectedRoleId = watch('roleId');
  const selectedRole = roles.find((r) => r.id === selectedRoleId);

  const abilityMessage =
    selectedRole?.abilities && selectedRole.abilities.length > 0
      ? `El rol seleccionado posee las siguientes habilidades: ${selectedRole.abilities
          .map((a) => a.name)
          .join(', ')}`
      : EmptyAbilityListText;

  if (loading)
    return (
      <Loading loadMessage={LoadingForm} color={`${isEdit ? 'text-accent' : 'text-success'}`} />
    );

  if (isLocked)
    return <div className='p-4 text-center text-error font-semibold'>{FormLoadFailed}</div>;

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className='w-full space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0'
    >
      {isEdit && (
        <Alert
          type='warning'
          variant='dash'
          message={UsernameChangeDisabledOnEditText}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}
      <Input
        placeholder={NamesText}
        icon={NameIcon}
        errorMessage={errors.names?.message}
        disabled={isSubmitting}
        {...register('names', {
          required: 'El nombre es obligatorio.',
          minLength: { value: 3, message: 'El nombre debe tener entre 3 y 30 carácteres.' },
          maxLength: { value: 30, message: 'El nombre no puede superar los 30 carácteres.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Input
        placeholder={SurnamesText}
        icon={NameIcon}
        errorMessage={errors.surnames?.message}
        disabled={isSubmitting}
        {...register('surnames', {
          required: 'El apellido es obligatorio.',
          minLength: { value: 3, message: 'El apellido debe tener entre 3 y 30 carácteres.' },
          maxLength: { value: 30, message: 'El apellido no puede superar los 30 carácteres.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Input
        placeholder={DniText.toUpperCase()}
        icon={DniIcon}
        disabled={isSubmitting}
        errorMessage={errors.dni?.message}
        {...register('dni', {
          required: 'Debe ingresar un DNI.',
          minLength: { value: 8, message: 'El DNI debe tener 8 digitos.' },
          maxLength: { value: 15, message: 'El DNI no puede superar los 15 digitos.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Input
        placeholder={EmailText}
        icon={EmailIcon}
        disabled={isSubmitting}
        errorMessage={errors.email?.message}
        {...register('email', {
          required: 'Debe ingresar un correo electrónico.',
          maxLength: { value: 50, message: 'No puede superar los 50 carácteres.' },
          pattern: {
            value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
            message: 'Correo electrónico inválido.',
          },
          setValueAs: (v) => v.trim(),
        })}
      />

      <Select
        options={stores.map((s) => ({ label: s.name!, value: s.id! }))}
        width='w-full'
        disabled={isSubmitting}
        errorMessage={errors.storeId?.message}
        {...register('storeId', {
          required: 'Debe seleccionar una tienda.',
          valueAsNumber: true,
        })}
      />

      <Select
        options={roles.map((r) => ({ label: r.name!, value: r.id! }))}
        width='w-full'
        disabled={isSubmitting}
        errorMessage={errors.roleId?.message}
        {...register('roleId', {
          required: 'Debe seleccionar un rol.',
          valueAsNumber: true,
        })}
      />

      <div className='col-span-full md:mt-3'>
        <Alert
          type={selectedRole?.abilities && selectedRole.abilities.length > 0 ? 'info' : 'error'}
          message={abilityMessage}
        />
      </div>

      <div className='col-span-full flex w-full flex-col items-center md:w-auto md:mt-3'>
        <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
          <Button
            type='button'
            className='join-item'
            color='btn-error'
            onClick={() => closeParentModal?.()}
            label={CancelText}
            icon={CancelIcon}
            disabled={isSubmitting}
          />

          <Button
            type='button'
            className='join-item'
            label={ClearText}
            icon={ClearIcon}
            color='btn-secondary'
            onClick={() => reset()}
            disabled={isSubmitting}
          />

          <Button
            type='submit'
            className='join-item'
            disabled={isSubmitting}
            label={
              isSubmitting ? (isEdit ? UpdatingText : SavingText) : isEdit ? UpdateText : SaveText
            }
            icon={isEdit ? UpdateIcon : SaveIcon}
            color='btn-success'
          />
        </div>
      </div>
    </form>
  );
}

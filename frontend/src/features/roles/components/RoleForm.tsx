import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Alert from '~/components/Alert';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import { Table, type Column } from '~/components/Table';
import { CancelIcon, ClearIcon, NameIcon, SaveIcon, UpdateIcon } from '~/constants/iconNames';
import {
  CancelText,
  ClearText,
  ErrorTagText,
  FormLoadFailed,
  LoadingForm,
  NameText,
  OkTagText,
  OpRollbackText,
  RoleCreatedText,
  RoleNameTaken,
  RoleUpdatedText,
  SaveText,
  SavingText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { swalDismissalTime } from '~/constants/values';
import { abilityService } from '~/features/abilities/services/abilityService';
import type { Ability } from '~/types/ability';

export interface RoleFormData {
  name: string;
  abilities: Ability[];
  abilitiesIds?: number[];
}

export interface RoleFormProps {
  defaultValues?: Partial<RoleFormData>;
  onSubmit: (data: RoleFormData) => Promise<any>;
}

export default function RoleForm({ defaultValues, onSubmit }: RoleFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [abilities, setAbilities] = useState<
    { isLocked: boolean; ability: Ability; isChecked: boolean }[]
  >([]);
  const [isLocked, setIsLocked] = useState(false);
  const isEdit = Boolean(defaultValues?.name);
  const ADMIN_KEY = 'sys:admin';

  const abilityColumns: Column<{
    isLocked: boolean;
    ability: Ability;
    isChecked: boolean;
  }>[] = [
    {
      key: 'abilityName',
      label: 'Nombre',
      render: (row) => row.ability.name,
    },
    {
      key: 'description',
      label: 'Descripción',
      render: (row) => row.ability.description,
    },
    {
      key: 'isChecked',
      label: 'Seleccionar',
      render: (row) => (
        <div className='flex flex-col items-center'>
          <input
            type='checkbox'
            className='checkbox checkbox-sm checkbox-success'
            checked={row.isChecked}
            disabled={row.isLocked || isSubmitting}
            onChange={() => toggleAbility(row.ability.id)}
          />
        </div>
      ),
    },
  ];

  const toggleAbility = (abilityId: number) => {
    setAbilities((prev) => {
      const updated = prev.map((item) =>
        item.ability.id === abilityId ? { ...item, isChecked: !item.isChecked } : item
      );

      const next = applyAdminRule(updated);

      if (next.some((a) => a.isChecked)) {
        clearErrors('abilitiesIds');
      }

      return next;
    });
  };

  const applyAdminRule = (
    abilities: { ability: Ability; isChecked: boolean; isLocked: boolean }[]
  ) => {
    const adminSelected = abilities.some((a) => a.ability.key === ADMIN_KEY && a.isChecked);

    if (!adminSelected) {
      return abilities.map((a) => ({ ...a, isLocked: false }));
    }

    return abilities.map((a) => {
      if (a.ability.key === ADMIN_KEY) {
        return { ...a, isLocked: false, isChecked: true };
      }

      return { ...a, isLocked: true, isChecked: false };
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
    clearErrors,
  } = useForm<RoleFormData>({
    defaultValues,
  });

  const loadAbilities = async () => {
    try {
      setLoading(true);

      const response = await abilityService.list('all');

      if (response.length === 0) {
        setIsLocked(true);
        return;
      }

      const roleAbilityIds = new Set(defaultValues?.abilitiesIds ?? []);

      const abilityArray = response.map((a) => ({
        isLocked: false,
        ability: a,
        isChecked: roleAbilityIds.has(a.id),
      }));

      setAbilities(applyAdminRule(abilityArray));
    } catch {
      setIsLocked(true);
      setAbilities([]);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (data: RoleFormData) => {
    const abilitiesIds = abilities.filter((a) => a.isChecked).map((a) => a.ability.id);

    if (abilitiesIds.length === 0) {
      setError('abilitiesIds', {
        type: 'manual',
        message: 'Debe seleccionar al menos un permiso.',
      });
      return;
    }
    try {
      await onSubmit({ name: data.name, abilities: [], abilitiesIds: abilitiesIds }).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? RoleUpdatedText : RoleCreatedText,
          timer: swalDismissalTime,
          showConfirmButton: false,
        }).then((r) => {
          if (r.dismiss || r.isDismissed) {
            isEdit ? window.location.reload() : navigate('/dashboard/role');
          }
        });
      });
    } catch (err: any) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => {
          const field = e.field as keyof RoleFormData;
          setError(field, { message: field === 'name' ? RoleNameTaken : e.message });
        });
        return;
      }

      Swal.fire({
        icon: 'error',
        title: OpRollbackText,
        text: ErrorTagText,
      }).then((r) => {
        if (r.dismiss || r.isDismissed || r.isConfirmed) {
          window.location.reload();
        }
      });
    }
  };

  useEffect(() => {
    loadAbilities();
  }, []);

  if (loading)
    return (
      <Loading loadMessage={LoadingForm} color={`${isEdit ? 'text-accent' : 'text-success'}`} />
    );

  if (isLocked)
    return <div className='p-4 text-center text-error font-semibold'>{FormLoadFailed}</div>;

  return (
    <form onSubmit={handleSubmit(submitHandler)} className='w-full'>
      <Input
        placeholder={NameText}
        icon={NameIcon}
        errorMessage={errors.name?.message}
        disabled={isSubmitting}
        {...register('name', {
          required: 'El nombre es obligatorio.',
          minLength: { value: 3, message: 'El nombre debe tener entre 3 y 20 carácteres.' },
          maxLength: { value: 20, message: 'El nombre no puede superar los 20 carácteres.' },
          setValueAs: (v) => v.trim(),
        })}
      />

      {errors.abilitiesIds && (
        <Alert message={errors.abilitiesIds.message} type='error' className='my-2' />
      )}

      <Table
        columns={abilityColumns}
        data={abilities}
        showActions={false}
        errorMessage='No hay habilidades disponibles'
        className='my-2'
      />

      <div className='col-span-full flex w-full flex-col items-center md:w-auto md:mt-3'>
        <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
          <Button
            type='button'
            className='join-item'
            color='btn-error'
            label={CancelText}
            icon={CancelIcon}
            disabled={isSubmitting}
            onClick={() => {
              navigate('/dashboard/role');
            }}
          />

          <Button
            type='button'
            className='join-item'
            label={ClearText}
            icon={ClearIcon}
            color='btn-secondary'
            onClick={() => window.location.reload()}
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

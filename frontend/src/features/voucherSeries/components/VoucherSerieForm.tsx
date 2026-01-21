import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import Select from '~/components/Select';
import {
  CancelIcon,
  ClearIcon,
  CorrelativeIcon,
  NumericValueIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  CancelText,
  ClearText,
  CorrelativeText,
  DuplicatedVoucherSerieText,
  ErrorTagText,
  FormLoadFailed,
  LoadingForm,
  OkTagText,
  OpRollbackText,
  SaveText,
  SavingText,
  SeriesCodeText,
  UpdateText,
  UpdatingText,
  VoucherSerieCreatedText,
  VoucherSerieUpdatedText,
} from '~/constants/strings';
import { longSwalDismissalTime } from '~/constants/values';
import { useAuth } from '~/context/authContext';
import { voucherTypeService } from '~/features/voucherTypes/services/voucherTypeService';
import type { VoucherSerie } from '~/types/voucherSerie';
import type { VoucherType } from '~/types/voucherType';
import { generateSerie, hasAbilities } from '~/utils/helpers';

interface VoucherSerieFormProps {
  voucherSerie?: VoucherSerie;
  onSubmit: (data: any) => Promise<any>;
  onSubmittingChange?: (value: boolean) => void;
  closeParentModal?: () => void;
}

export default function VoucherSerieForm({
  voucherSerie,
  onSubmit,
  onSubmittingChange,
  closeParentModal,
}: VoucherSerieFormProps) {
  const [loading, setLoading] = useState(true);
  const [voucherTypes, setVoucherTypes] = useState<VoucherType[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const isEdit = Boolean(voucherSerie);
  const authStore = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<VoucherSerie>({
    defaultValues: {
      seriesCode: voucherSerie?.seriesCode ?? '',
      currentNumber: voucherSerie?.currentNumber ?? 1,
      voucherTypeId: voucherSerie?.voucherTypeId ?? 0,
    },
  });

  const seriesCodeRegister = isEdit
    ? register('seriesCode')
    : register('seriesCode', {
        required: 'Debe ingresar una serie numérica.',
        valueAsNumber: true,
        min: {
          value: 1,
          message: 'No puede ser negativo',
        },
        max: {
          value: 999,
          message: 'No puede superar el valor de 999',
        },
        validate: (v) => !Number.isNaN(v) || 'Valor inválido',
      });

  const submitHandler = async (data: any) => {
    try {
      await onSubmit({
        ...data,
        seriesCode: !isEdit
          ? generateSerie(
              Number(data.seriesCode),
              findVoucherType(data.voucherTypeId).name.toUpperCase().includes('B') ? 'BOL' : 'FACT'
            )
          : data.seriesCode,
      });

      await Swal.fire({
        icon: 'success',
        title: OkTagText,
        html: isEdit ? VoucherSerieUpdatedText : VoucherSerieCreatedText,
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
          const field = e.field as 'seriesCode' | 'currentNumber' | 'voucherTypeId';

          setError(field, {
            message: field === 'seriesCode' ? DuplicatedVoucherSerieText : e.message,
          });
        });
        return;
      }

      await Swal.fire({
        icon: 'error',
        title: OpRollbackText,
        text: ErrorTagText,
      }).then((r) => {
        if (r.dismiss) window.location.reload();
      });
    }
  };

  const findVoucherType = (id: number) => {
    return voucherTypes.find((v) => v.id === id);
  };

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      const [voucherTypesResult] = await Promise.allSettled([voucherTypeService.list('available')]);

      if (!mounted) return;

      const voucherTypesFailed = voucherTypesResult.status === 'rejected';

      let voucherTypesData: VoucherType[] = [];

      if (!voucherTypesFailed) voucherTypesData = voucherTypesResult.value;

      if (!voucherTypesFailed) {
        reset((prev) => ({
          ...prev,
          voucherTypeId: prev.voucherTypeId || voucherTypesResult.value[0]?.id || 0,
        }));
      }

      setVoucherTypes(voucherTypesData);

      if (voucherTypesFailed || voucherTypesData.length === 0) {
        setIsLocked(true);
      }

      setLoading(false);
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Loading loadMessage={LoadingForm} color={isEdit ? 'text-info' : 'text-success'}></Loading>
    );
  }

  if (!loading && isLocked) {
    return <div className='p-4 text-center text-error font-semibold'>{FormLoadFailed}</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className='w-full space-y-2 md:grid md:grid-cols-1 md:gap-2 md:space-y-0'
    >
      <Select
        options={voucherTypes.map((e) => ({ label: e.name, value: e.id }))}
        {...register('voucherTypeId', {
          required: isEdit ? false : 'Debe seleccionar un tipo de comprobante de pago.',
          valueAsNumber: true,
        })}
        width='w-full'
        disabled={isSubmitting || isEdit}
        errorMessage={errors.voucherTypeId?.message}
      ></Select>

      <Input
        placeholder={SeriesCodeText}
        icon={NumericValueIcon}
        errorMessage={errors.seriesCode?.message}
        disabled={isSubmitting || isEdit}
        {...seriesCodeRegister}
      />

      <Input
        placeholder={CorrelativeText}
        icon={CorrelativeIcon}
        errorMessage={errors.currentNumber?.message}
        disabled={isSubmitting}
        {...register('currentNumber', {
          required: 'Debe ingresar un correlativo numérico.',
          valueAsNumber: true,
          min: {
            value: 1,
            message: 'No puede ser negativo',
          },
          max: {
            value: 999999,
            message: 'No puede superar el valor de 999.999',
          },
          validate: (v) => !Number.isNaN(v) || 'Valor inválido',
        })}
      />

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
            disabled={
              isSubmitting ||
              !hasAbilities(authStore?.abilityKeys, [
                'sys:admin',
                'voucherSerie:store',
                'voucherSerie:update',
              ])
            }
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

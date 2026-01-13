import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import type { VoucherType } from '~/types/voucherType';
import type { PaymentType } from '~/types/paymentType';
import Loading from '~/components/Loading';
import {
  CancelText,
  CashReceivedText,
  ChangeText,
  ErrorTagText,
  FinishSaleText,
  LoadingPaymentModal,
  OkTagText,
  PaymentHashText,
  PaymentProcessFailedText,
  PaymentTypeText,
  SaleSavedText,
  SaveText,
  SavingText,
  SubtotalText,
  TaxNameText,
  TotalText,
  VoucherTypeText,
} from '~/constants/strings';
import { voucherTypeService } from '~/features/voucherTypes/services/voucherTypeService';
import { paymentTypeService } from '~/features/paymentTypes/services/paymentTypeService';
import Select from '~/components/Select';
import Input from '~/components/Input';
import { CancelIcon, MakePaymentIcon, MoneyIcon } from '~/constants/iconNames';
import Button from '~/components/Button';
import { sunatRound } from '~/utils/helpers';
import Swal from 'sweetalert2';
import { longSwalDismissalTime } from '~/constants/values';

export type PrePaymentPayload = {
  igv: number;
  subtotal: number;
  total: number;
  storeId: number;
  customerId: number;
  userId: number;
  cartItems: { productId: number; quantity: number; unitPrice: number }[];
};

type Props = {
  prePayload: PrePaymentPayload;
  onSubmit: (data: any) => Promise<any>;
  onSubmittingChange?: (value: boolean) => void;
  closeParentModal?: () => void;
};

export default function MakePaymentForm({
  prePayload,
  onSubmit,
  onSubmittingChange,
  closeParentModal,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [voucherTypes, setVoucherTypes] = useState<VoucherType[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      voucherTypeId: 0,
      paymentTypeId: 0,
      change: 0,
      cashReceived: 0,
      paymentHash: '',
    },
    shouldUnregister: true,
  });

  const cashReceived = watch('cashReceived');
  const paymentTypeId = watch('paymentTypeId');
  const paymentHash = watch('paymentHash');

  const selectedPaymentType = useMemo(
    () => paymentTypes.find((e) => e.id === paymentTypeId),
    [paymentTypes, paymentTypeId]
  );

  const isDigital = selectedPaymentType?.action?.toUpperCase() === 'DIGITAL';
  const isCashInvalid = !isDigital && (cashReceived ?? 0) < prePayload.total;

  const submitHandler = async (data: any) => {
    try {
      await onSubmit({
        ...prePayload,
        ...data,
        cashReceived: cashReceived ?? 0,
        paymentHash: paymentHash ?? '',
      });
      await Swal.fire({
        icon: 'success',
        title: OkTagText,
        html: SaleSavedText,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      }).then((r) => {
        //TODO: SALE DETAIL - VOUCHER PDF!
        if (r.dismiss) window.location.reload();
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: ErrorTagText,
        html: PaymentProcessFailedText,
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      const [voucherResult, paymentResult] = await Promise.allSettled([
        voucherTypeService.list('available'),
        paymentTypeService.list('available'),
      ]);

      if (!mounted) return;

      const voucherFailed = voucherResult.status === 'rejected';
      const paymentFailed = paymentResult.status === 'rejected';

      let vouchersData: VoucherType[] = [];
      let paymentsData: PaymentType[] = [];

      if (!voucherFailed) vouchersData = voucherResult.value;
      if (!paymentFailed) paymentsData = paymentResult.value;

      if (!voucherFailed && !paymentFailed) {
        reset((prev) => ({
          ...prev,
          voucherTypeId: prev.voucherTypeId || voucherResult.value[0]?.id || 0,
          paymentTypeId: prev.paymentTypeId || paymentResult.value[0]?.id || 0,
        }));
      }

      setVoucherTypes(vouchersData);
      setPaymentTypes(paymentsData);

      if (
        voucherFailed ||
        paymentFailed ||
        vouchersData.length === 0 ||
        paymentsData.length === 0
      ) {
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
    if (!prePayload) {
      setLoading(false);
      setIsLocked(true);
    }
  }, [prePayload]);

  useEffect(() => {
    if (selectedPaymentType?.action?.toUpperCase() === 'DIGITAL') {
      setValue('change', 0);
      return;
    }

    if (typeof cashReceived === 'number' && cashReceived >= 0) {
      const calculated = sunatRound(cashReceived - prePayload.total);
      setValue('change', calculated > 0 ? calculated : 0);
    } else {
      setValue('change', 0);
    }
  }, [cashReceived, prePayload, selectedPaymentType, setValue]);

  if (loading) {
    return <Loading loadMessage={LoadingPaymentModal} color='text-success'></Loading>;
  }

  if (!loading && isLocked) {
    return (
      <div>
        <h1>Formulario bloqueado....!!! Intente nuevamente.</h1>
      </div>
    );
  }
  return (
    <form className='grid grid-cols-1 md:grid-cols-2 gap-2' onSubmit={handleSubmit(submitHandler)}>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{VoucherTypeText}</legend>
        <Select
          options={voucherTypes.map((e) => ({ value: e.id, label: e.name }))}
          {...register('voucherTypeId', {
            valueAsNumber: true,
            required: 'Debe seleccionar un tipo de comprobante de pago válido.',
          })}
          errorMessage={errors.voucherTypeId?.message}
          width='w-full'
        />
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{PaymentTypeText}</legend>
        <Select
          options={paymentTypes.map((e) => ({ value: e.id, label: e.name }))}
          {...register('paymentTypeId', {
            valueAsNumber: true,
            required: 'Debe seleccionar un tipo de pago válido.',
          })}
          errorMessage={errors.paymentTypeId?.message}
          width='w-full'
        />
      </fieldset>

      {!isDigital && (
        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>{CashReceivedText}</legend>
          <Input
            icon={MoneyIcon}
            {...register('cashReceived', {
              required: 'Debe ingresar el monto recibido',
              valueAsNumber: true,
              min: {
                value: prePayload.total,
                message: 'El monto recibido no puede ser menor al total',
              },
            })}
            errorMessage={errors.cashReceived?.message}
          />
        </fieldset>
      )}

      {isDigital && (
        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>{PaymentHashText}</legend>
          <Input
            {...register('paymentHash', {
              required: 'Debe ingresar el código de operación',
            })}
            errorMessage={errors.paymentHash?.message}
          />
        </fieldset>
      )}

      {!isDigital && (
        <fieldset className='fieldset'>
          <legend className='fieldset-legend'>{ChangeText}</legend>
          <Input
            icon={MoneyIcon}
            {...register('change', {
              required: true,
              valueAsNumber: true,
            })}
            errorMessage={errors.change?.message}
            readOnly
          />
        </fieldset>
      )}

      <div className='flex flex-col items-end col-span-full'>
        <h1 className='font-bold text-xl'>
          {SubtotalText.toUpperCase()}{' '}
          <span className='font-normal'>{sunatRound(prePayload.subtotal)}</span>
        </h1>
        <h1 className='font-bold text-xl'>
          {TaxNameText.toUpperCase()}{' '}
          <span className='font-normal'>{sunatRound(prePayload.igv)}</span>
        </h1>
        <h1 className='font-bold text-success text-2xl underline'>
          {TotalText.toUpperCase()}{' '}
          <span className='font-normal'>{sunatRound(prePayload.total)}</span>
        </h1>
      </div>

      <div className='flex flex-col items-center col-span-full'>
        <div className='join join-vertical md:join-horizontal'>
          <Button
            color='btn-error'
            label={CancelText}
            icon={CancelIcon}
            disabled={isSubmitting}
            type='button'
            className='join-item'
            onClick={() => closeParentModal?.()}
          />
          <Button
            color='btn-success'
            label={FinishSaleText}
            icon={MakePaymentIcon}
            disabled={isSubmitting || isCashInvalid}
            type='submit'
            className='join-item'
          />
        </div>
      </div>
    </form>
  );
}

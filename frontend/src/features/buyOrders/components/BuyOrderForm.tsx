import { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import Alert from '~/components/Alert';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import Modal from '~/components/Modal';
import Select from '~/components/Select';
import { BUY_ORDER_STATUS } from '~/constants/arrays';
import { CancelIcon, ClearIcon, DeleteIcon, SaveIcon, UpdateIcon } from '~/constants/iconNames';
import {
  ActionsText,
  AddProductText,
  BuyOrderCreatedText,
  BuyOrderUpdatedText,
  CancelText,
  ClearText,
  ErrorTagText,
  FormLoadFailed,
  IdText,
  InvalidBuyOrderDetailsPayload,
  InvalidStoreIdText,
  InvalidSupplierIdText,
  LoadingForm,
  LockStoreOnBuyOrderMgmtText,
  OkTagText,
  OpRollbackText,
  ProductSearchText,
  ProductText,
  QuantityText,
  SaveText,
  SavingText,
  ShortBarcodeText,
  StatusText,
  StoreText,
  SubtotalText,
  SupplierText,
  TaxNameText,
  TotalText,
  UnitPriceText,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import { storeService } from '~/features/stores/services/storeService';
import { supplierService } from '~/features/suppliers/services/supplierService';
import type { BuyOrder } from '~/types/buyOrder';
import type { Store } from '~/types/store';
import type { Supplier } from '~/types/supplier';
import ProductSearchComponent from './ProductSearchComponent';
import type { Product } from '~/types/product';
import Swal from 'sweetalert2';
import { ADMIN_ABILITY_KEY, swalDismissalTime } from '~/constants/values';

interface BuyOrderFormProps {
  buyOrder?: BuyOrder;
  onSubmit: (data: any) => Promise<any>;
}

export default function BuyOrderForm({ buyOrder, onSubmit }: BuyOrderFormProps) {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [showProductSearchModal, setShowProductSearchModal] = useState(false);
  const authStore = useAuth();

  const isEdit = Boolean(buyOrder);

  const isAdmin = authStore.abilityKeys?.includes(ADMIN_ABILITY_KEY) ?? false;

  const defaultStoreId =
    !isEdit && !isAdmin ? authStore.user?.store?.id : (buyOrder?.storeId ?? stores[0]?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
    control,
  } = useForm({
    defaultValues: {
      storeId: defaultStoreId,
      supplierId: buyOrder?.supplierId ?? suppliers[0]?.id ?? '',
      status: buyOrder?.status ?? BUY_ORDER_STATUS[0].value ?? '',
      subtotal: buyOrder?.subtotal ?? '0',
      igv: buyOrder?.igv ?? '0',
      total: buyOrder?.total ?? '0',
      buyOrderDetails: buyOrder?.buyOrderDetails ?? [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'buyOrderDetails',
  });

  const details = useWatch({
    control,
    name: 'buyOrderDetails',
  });

  const subtotal = useWatch({ control, name: 'subtotal' });
  const igv = useWatch({ control, name: 'igv' });

  useEffect(() => {
    const safeSubtotal = Number(subtotal) || 0;
    const safeIgv = Number(igv) || 0;

    const total = Number((safeSubtotal + safeIgv).toFixed(2));

    setValue('total', total, {
      shouldDirty: true,
      shouldValidate: false,
    });
  }, [subtotal, igv, setValue]);

  const subtotalFromDetails = (details ?? []).reduce((sum, d) => {
    const lineTotal = Number(d?.total ?? 0);
    return sum + (Number.isFinite(lineTotal) ? lineTotal : 0);
  }, 0);

  useEffect(() => {
    if (!details) return;

    details.forEach((detail, index) => {
      const quantity = detail?.quantity ?? 0;
      const unitCost = detail?.unitCost ?? 0;

      const computedTotal = Number((quantity * unitCost).toFixed(2));

      if (detail.total !== computedTotal) {
        setValue(`buyOrderDetails.${index}.total`, computedTotal, {
          shouldValidate: false,
          shouldDirty: true,
          shouldTouch: false,
        });
      }
    });
  }, [details, setValue]);

  const submitHandler = async (data: any) => {
    if (!data.buyOrderDetails || data.buyOrderDetails.length === 0) {
      setError('buyOrderDetails', {
        type: 'manual',
        message: 'La orden de compra debe tener al menos un producto.',
      });

      return;
    }
    try {
      !isAdmin
        ? (data = { ...data, storeId: authStore.user?.store?.id ?? data.storeId })
        : (data = data);
      await onSubmit(data).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? BuyOrderUpdatedText : BuyOrderCreatedText,
          timer: swalDismissalTime,
          showConfirmButton: false,
        }).then((r) => {
          if (r.dismiss || r.isDismissed) {
            window.location.reload();
          }
        });
      });
    } catch (err: any) {
      if (err?.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => {
          const field = e.field as
            | 'status'
            | 'subtotal'
            | 'igv'
            | 'total'
            | 'supplierId'
            | 'storeId'
            | 'buyOrderDetails';
          setError(field, {
            message:
              field === 'storeId'
                ? InvalidStoreIdText
                : field === 'supplierId'
                  ? InvalidSupplierIdText
                  : field.includes('buyOrderDetails')
                    ? InvalidBuyOrderDetailsPayload
                    : e.message,
          });
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
    let mounted = true;

    async function loadData() {
      const [storesResult, suppliersResult] = await Promise.allSettled([
        storeService.list('available'),
        supplierService.list('available'),
      ]);

      if (!mounted) return;

      const storeFailed = storesResult.status === 'rejected';
      const supplierFailed = suppliersResult.status === 'rejected';

      let storesData: Store[] = [];
      let suppliersData: Supplier[] = [];

      if (!storeFailed) storesData = storesResult.value;
      if (!supplierFailed) suppliersData = suppliersResult.value;

      if (!storeFailed && !supplierFailed) {
        reset((prev) => ({
          ...prev,
          storeId: prev.storeId || storesResult.value[0]?.id || '',
          supplierId: prev.supplierId || suppliersResult.value[0]?.id || '',
        }));
      }

      setStores(storesData);
      setSuppliers(suppliersData);

      if (storeFailed || supplierFailed || storesData.length === 0 || suppliersData.length === 0) {
        setIsLocked(true);
      }

      setLoading(false);
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleProductSelected = (product: Product) => {
    const exists = fields.some((d) => d.productId === product.id);
    if (exists) {
      setShowProductSearchModal(false);
      return;
    }

    append({
      productId: product.id!,
      product: product,
      quantity: 1,
      unitCost: 0,
      total: 0,
    });
    clearErrors('buyOrderDetails');

    setShowProductSearchModal(false);
  };

  if (loading)
    return (
      <Loading loadMessage={LoadingForm} color={`${isEdit ? 'text-accent' : 'text-success'}`} />
    );

  if (isLocked)
    return <div className='p-4 text-center text-error font-semibold'>{FormLoadFailed}</div>;

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className='w-full space-y-2 md:grid md:grid-cols-3 md:gap-2 md:space-y-0'
    >
      {!isEdit && !isAdmin && (
        <Alert
          type='info'
          variant='soft'
          message={LockStoreOnBuyOrderMgmtText}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{StoreText}</legend>
        <Select
          options={stores.map((s) => ({ label: s.name!, value: s.id! }))}
          width='w-full'
          disabled={isSubmitting || !isAdmin || isEdit}
          errorMessage={errors.storeId?.message}
          {...register('storeId', {
            required: 'Debe seleccionar una tienda.',
            valueAsNumber: true,
          })}
        />
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{SupplierText}</legend>
        <Select
          options={suppliers.map((r) => ({ label: r.name!, value: r.id! }))}
          width='w-full'
          disabled={isSubmitting}
          errorMessage={errors.supplierId?.message}
          {...register('supplierId', {
            required: 'Debe seleccionar un proveedor.',
            valueAsNumber: true,
          })}
        />
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{StatusText}</legend>
        <Select
          options={BUY_ORDER_STATUS.map((e) => ({ label: e.label, value: e.value }))}
          width='w-full'
          disabled={isSubmitting}
          errorMessage={errors.supplierId?.message}
          {...register('status', {
            required: 'Debe seleccionar un estado de orden.',
          })}
        />
      </fieldset>

      <div className='col-start-2 cold-end-2'>
        <Button
          width='w-full'
          color='btn-success'
          className='btn-sm'
          label={AddProductText.toUpperCase()}
          onClick={() => setShowProductSearchModal(true)}
        ></Button>
      </div>

      <div className='col-span-full'>
        <div className='overflow-x-auto border border-base-content/30 bg-base-100'>
          <table className='table table-sm'>
            <thead>
              <tr className='text-black'>
                <th>{IdText}</th>
                <th>
                  {ProductText} - {ShortBarcodeText}
                </th>
                <th>{QuantityText}</th>
                <th>{UnitPriceText}</th>
                <th>{TotalText}</th>
                <th>{ActionsText}</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                return (
                  <tr key={field.id} className='hover:bg-base-300'>
                    <th>{field.productId}</th>

                    <td>
                      {field.product?.name} – {field.product?.barcode}
                    </td>

                    <td>
                      <Input
                        type='number'
                        className='input-sm w-20'
                        errorMessage={errors.buyOrderDetails?.[index]?.quantity?.message}
                        {...register(`buyOrderDetails.${index}.quantity`, {
                          required: 'Cantidad obligatoria',
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: 'Debe ser al menos 1',
                          },
                          validate: {
                            integer: (v) => Number.isInteger(v) || 'Debe ser un número entero',
                            positive: (v) => v > 0 || 'Debe ser positivo',
                          },
                        })}
                      />
                    </td>

                    <td>
                      <Input
                        type='number'
                        step='any'
                        className='input-sm w-24'
                        errorMessage={errors.buyOrderDetails?.[index]?.unitCost?.message}
                        {...register(`buyOrderDetails.${index}.unitCost`, {
                          required: 'Precio obligatorio',
                          valueAsNumber: true,
                          min: {
                            value: 0.1,
                            message: 'No puede ser negativo',
                          },
                          validate: (v) => !Number.isNaN(v) || 'Valor inválido',
                        })}
                      />
                    </td>

                    <td>
                      <Input
                        type='number'
                        className='input-sm w-24'
                        disabled
                        {...register(`buyOrderDetails.${index}.total`, {
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: 'Total inválido',
                          },
                          validate: (v) => v >= 0 || 'No puede ser negativo',
                        })}
                      />
                    </td>

                    <td>
                      <Button
                        icon={DeleteIcon}
                        className='btn-sm'
                        color='btn-error'
                        onClick={() => {
                          remove(index);
                          if (fields.length - 1 > 0) clearErrors('buyOrderDetails');
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
              {errors.buyOrderDetails?.message && (
                <tr>
                  <td colSpan={6} className='py-4 text-center text-lg font-light text-error'>
                    {errors.buyOrderDetails.message}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{SubtotalText}</legend>
        <Input
          type='number'
          step='any'
          inputMode='decimal'
          disabled={isSubmitting}
          errorMessage={errors.subtotal?.message}
          {...register('subtotal', {
            required: 'El subtotal es obligatorio.',
            valueAsNumber: true,
            min: {
              value: 0.01,
              message: 'El subtotal debe ser mayor a 0.',
            },
            validate: {
              validNumber: (v) => {
                const value = Number(v);
                return !Number.isNaN(value) || 'El subtotal debe ser un número válido.';
              },
              coversDetails: (v) => {
                const value = Number(v);
                return (
                  value >= subtotalFromDetails ||
                  `El subtotal no puede ser menor a ${subtotalFromDetails.toFixed(2)}`
                );
              },
            },
          })}
        ></Input>
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{TaxNameText.toUpperCase()}</legend>
        <Input
          type='number'
          step='any'
          inputMode='decimal'
          disabled={isSubmitting}
          errorMessage={errors.igv?.message}
          {...register('igv', {
            required: 'El IGV es obligatorio.',
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'El IGV debe ser mayor o igual a 0.',
            },
            validate: (v) => !Number.isNaN(v) || 'El IGV debe ser un número válido.',
          })}
        ></Input>
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{TotalText}</legend>
        <Input
          type='number'
          step='any'
          inputMode='decimal'
          disabled
          errorMessage={errors.total?.message}
          {...register('total', {
            required: 'El total es obligatorio.',
            valueAsNumber: true,
            min: {
              value: 0.01,
              message: 'El total debe ser mayor a 0.',
            },
            validate: {
              validNumber: (v) => {
                const value = Number(v);
                return !Number.isNaN(value) || 'El total debe ser un número válido';
              },
              matchesSum: (v) => {
                const value = Number(v);
                if (Number.isNaN(value)) return true;

                const subtotal = Number(watch('subtotal') ?? 0);
                const igv = Number(watch('igv') ?? 0);
                const expected = Number((subtotal + igv).toFixed(2));

                return (
                  Number(value.toFixed(2)) === expected ||
                  `El total debe ser ${expected.toFixed(2)}`
                );
              },
            },
          })}
        ></Input>
      </fieldset>

      <div className='col-span-full flex w-full flex-col items-center md:w-auto md:mt-3'>
        <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
          <Button
            type='button'
            className='join-item'
            color='btn-error'
            label={CancelText}
            icon={CancelIcon}
            disabled={isSubmitting}
            onClick={() => history.back()}
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
      <Modal
        open={showProductSearchModal}
        onClose={() => setShowProductSearchModal(false)}
        title={ProductSearchText}
        width='max-w-3xl'
      >
        <ProductSearchComponent onSelectProduct={handleProductSelected}></ProductSearchComponent>
      </Modal>
    </form>
  );
}

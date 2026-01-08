import Modal from '~/components/Modal';
import type { StoreProduct } from '~/types/storeProduct';
import { useState, useEffect } from 'react';
import {
  AffectedByIGVText,
  BuyPriceText,
  CancelText,
  ClearText,
  ContinueText,
  CurrentTaxValueText,
  DuplicatedStoreProductMessage,
  EditText,
  ErrorTagText,
  FormLoadFailed,
  InvalidStoreIdText,
  LoadingForm,
  LoadingText,
  OkTagText,
  OpRollbackText,
  ProductSearchText,
  ProductText,
  ProfitText,
  QuestionText,
  SalableText,
  SaveText,
  SavingText,
  SelectProductText,
  SelectText,
  SellPriceText,
  StockText,
  StoreProductUpdatedText,
  StoreText,
  TaxNameText,
  UpdateText,
  UpdatingText,
  UsingDefaultTaxMessage,
  WarningText,
} from '~/constants/strings';
import Select from '~/components/Select';
import { useAuth } from '~/context/authContext';
import { useForm } from 'react-hook-form';
import type { Store } from '~/types/store';
import {
  ADMIN_ABILITY_KEY,
  DEFAULT_TAX_SETTING_KEY,
  DEFAULT_TAX_VALUE,
  ErrorColor,
  SuccessColor,
  swalDismissalTime,
} from '~/constants/values';
import Button from '~/components/Button';
import { AddIcon, CancelIcon, ClearIcon, SaveIcon, UpdateIcon } from '~/constants/iconNames';
import ProductSearchComponent from '~/features/buyOrders/components/ProductSearchComponent';
import type { Product } from '~/types/product';
import Loading from '~/components/Loading';
import { storeService } from '~/features/stores/services/storeService';
import { settingService } from '~/features/settings/services/settingService';
import type { Setting } from '~/types/setting';
import Swal from 'sweetalert2';
import Input from '~/components/Input';
import { STORE_PRODUCT_SALE_STATUS } from '~/constants/arrays';
import { storeProductService } from '../services/storeProductService';
import { useNavigate } from 'react-router';

interface StoreProductFormProps {
  storeProduct?: StoreProduct;
  onSubmit: (data: any) => Promise<any>;
}

export default function StoreProductForm({ storeProduct, onSubmit }: StoreProductFormProps) {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [taxSetting, setTaxSetting] = useState<Setting>();
  const [usingDefaultTax, setUsingDefaultTax] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showProductSearchModal, setShowProductSearchModal] = useState(false);
  const [isSearchingSp, setIsSearchingSp] = useState(false);
  const authStore = useAuth();
  const navigate = useNavigate();

  const isEdit = Boolean(storeProduct);

  const isAdmin = authStore.abilityKeys?.includes(ADMIN_ABILITY_KEY) ?? false;

  const igvRate = usingDefaultTax
    ? DEFAULT_TAX_VALUE
    : Number(taxSetting?.value ?? DEFAULT_TAX_VALUE);

  const defaultStoreId =
    !isEdit && !isAdmin
      ? authStore.user?.store?.id
      : (storeProduct?.storeId ?? stores[0]?.id ?? '');

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      storeId: defaultStoreId,
      buyPrice: 0.5,
      sellPrice: 1,
      igv: 0,
      profit: 0,
      stock: 1,
      salable: STORE_PRODUCT_SALE_STATUS[0].value,
      igvStatus: true,
    },
  });

  const selectedStore = watch('storeId');
  const igvStatus = watch('igvStatus');
  const buyPrice = watch('buyPrice');
  const sellPrice = watch('sellPrice');

  const submitHandler = async (data: any) => {
    try {
      await onSubmit({ ...data, productId: selectedProduct.id }).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? StoreProductUpdatedText : StoreProductUpdatedText,
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
            | 'storeId'
            | 'buyPrice'
            | 'sellPrice'
            | 'igv'
            | 'profit'
            | 'stock'
            | 'salable';

          setError(field, {
            message: field === 'storeId' ? InvalidStoreIdText : e.message,
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
      const [storesResult, taxSettingResult] = await Promise.allSettled([
        storeService.list('available'),
        settingService.showByKey(DEFAULT_TAX_SETTING_KEY),
      ]);

      if (!mounted) return;

      const storeFailed = storesResult.status === 'rejected';
      const taxSettingFailed = taxSettingResult.status === 'rejected';

      let storesData: Store[] = [];
      let taxSettingValue: Setting = null;

      if (!storeFailed) storesData = storesResult.value;
      if (!taxSettingFailed) taxSettingValue = taxSettingResult.value;

      if (!storeFailed) {
        reset((prev) => ({
          ...prev,
          storeId: prev.storeId || storesResult.value[0]?.id || '',
        }));
      }

      setStores(storesData);
      setTaxSetting(taxSettingValue);

      if (storeFailed || storesData.length === 0) {
        setIsLocked(true);
      }

      if (taxSettingFailed || !taxSettingValue || Number.isNaN(Number(taxSettingValue.value))) {
        setTaxSetting(null);
        setUsingDefaultTax(true);
        showDefaultTaxAlert();
      }
      setLoading(false);
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isEdit || !storeProduct) return;
    setSelectedProduct(storeProduct.product);
    reset({
      storeId: storeProduct.storeId,
      buyPrice: storeProduct.buyPrice,
      sellPrice: storeProduct.sellPrice,
      igv: storeProduct.igv,
      profit: storeProduct.profit,
      stock: storeProduct.stock,
      salable: Boolean(storeProduct.salable).toString(),
      igvStatus: storeProduct.igv <= 0 ? false : true,
    });
  }, [isEdit, storeProduct, reset]);

  useEffect(() => {
    if (!selectedStore) return;
    if (!selectedProduct || selectedProduct.id == 0) return;
    if (isEdit) return;
    handleProductSelected(selectedProduct);
  }, [selectedStore]);

  useEffect(() => {
    if (Number.isNaN(buyPrice) || Number.isNaN(sellPrice)) return;

    let igv = 0;
    let profit = 0;

    if (igvStatus) {
      const base = sellPrice / (1 + igvRate);

      igv = Number((sellPrice - base).toFixed(2));
      profit = Number((base - buyPrice).toFixed(2));

      if (profit < 0) profit = 0;
    } else {
      igv = 0;
      profit = Number((sellPrice - buyPrice).toFixed(2));
      if (profit < 0) profit = 0;
    }

    setValue('igv', igv, { shouldValidate: true });
    setValue('profit', profit, { shouldValidate: true });
  }, [buyPrice, sellPrice, igvStatus, igvRate, setValue, selectedProduct]);

  const handleProductSelected = async (product: Product) => {
    setSelectedProduct(product);
    if (!isEdit) {
      reset({
        ...getValues(),
        buyPrice: 0.5,
        sellPrice: 1,
        stock: 1,
        salable: 'true',
      });
    }
    if (!isEdit) {
      setShowProductSearchModal(false);
      setIsSearchingSp(true);
      try {
        await storeProductService.Show(getValues().storeId, product.id);
        Swal.fire({
          title: QuestionText.toUpperCase(),
          html: DuplicatedStoreProductMessage(
            product,
            stores.find((s) => s.id === Number(getValues().storeId))
          ),
          icon: 'question',
          showCancelButton: true,
          cancelButtonColor: ErrorColor,
          confirmButtonColor: SuccessColor,
          confirmButtonText: EditText.toUpperCase(),
          cancelButtonText: CancelText.toUpperCase(),
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          reverseButtons: true,
        }).then((r) => {
          if (r.isConfirmed)
            navigate(`/dashboard/store-product/${getValues().storeId}/${product.id}/edit`);
          else {
            reset();
            setSelectedProduct(undefined);
          }
        });
      } catch {
      } finally {
        setIsSearchingSp(false);
      }
    }
  };

  const showDefaultTaxAlert = () => {
    Swal.fire({
      title: WarningText.toUpperCase(),
      html: UsingDefaultTaxMessage,
      icon: 'info',
      confirmButtonColor: SuccessColor,
      confirmButtonText: ContinueText.toUpperCase(),
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      reverseButtons: true,
    });
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
      className='w-full space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0'
    >
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{StoreText}</legend>
        <Select
          options={stores.map((s) => ({ label: s.name!, value: s.id! }))}
          width='w-full'
          disabled={isSubmitting || !isAdmin || isEdit || isSearchingSp}
          errorMessage={errors.storeId?.message}
          {...register('storeId', {
            required: 'Debe seleccionar una tienda.',
            valueAsNumber: true,
          })}
        />
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{ProductText}</legend>
        <div className='join join-vertical md:join-horizontal'>
          <div className='input input-bordered w-full font-bold join-item text-wrap'>
            {!selectedProduct
              ? SelectProductText.toUpperCase()
              : `${selectedProduct.name} - ${selectedProduct.barcode}`}
          </div>
          <Button
            icon={!isSearchingSp ? AddIcon : ''}
            isLoading={isSearchingSp}
            title={!isSearchingSp ? SelectText : LoadingText}
            className='join-item'
            color='btn-success'
            onClick={() => setShowProductSearchModal(true)}
            disabled={isSubmitting || isSearchingSp || isEdit}
          ></Button>
        </div>
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{BuyPriceText}</legend>
        <Input
          type='number'
          step='any'
          errorMessage={errors.buyPrice?.message}
          {...register('buyPrice', {
            required: 'Precio de compra obligatorio',
            valueAsNumber: true,
            min: {
              value: 0.1,
              message: 'No puede ser negativo',
            },
            validate: (v) => !Number.isNaN(v) || 'Valor inválido',
          })}
          disabled={isSubmitting || isSearchingSp}
        ></Input>
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{SellPriceText}</legend>
        <Input
          type='number'
          step='any'
          errorMessage={errors.sellPrice?.message}
          {...register('sellPrice', {
            required: 'Precio de venta obligatorio',
            valueAsNumber: true,
            min: {
              value: 0.1,
              message: 'No puede ser negativo',
            },
            validate: (v) => !Number.isNaN(v) || 'Valor inválido',
          })}
          disabled={isSubmitting || isSearchingSp}
        ></Input>
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{TaxNameText.toUpperCase()}</legend>
        <Input
          type='number'
          step='any'
          errorMessage={errors.igv?.message}
          {...register('igv', {
            required: 'IGV obligatorio',
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'No puede ser negativo',
            },
            validate: (v) => !Number.isNaN(v) || 'Valor inválido',
          })}
          disabled
        ></Input>
      </fieldset>

      <label className='label cursor-pointer justify-start gap-2 md:mt-7'>
        <input
          type='checkbox'
          className='checkbox checkbox-sm checkbox-success'
          {...register('igvStatus')}
        />
        <span className='label-text text-black'>
          {AffectedByIGVText} - {igvStatus ? 'SI' : 'NO'}
        </span>
      </label>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{ProfitText}</legend>
        <Input
          type='number'
          step='any'
          errorMessage={errors.profit?.message}
          {...register('profit', {
            required: 'La ganancia es obligatoria',
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'No puede ser negativa',
            },
            validate: (v) => !Number.isNaN(v) || 'Valor inválido',
          })}
          disabled
        ></Input>
      </fieldset>

      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{StockText}</legend>
        <Input
          type='number'
          step='any'
          errorMessage={errors.stock?.message}
          {...register('stock', {
            required: 'Debe ingresar el stock.',
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'No puede ser negativo',
            },
            validate: (v) => !Number.isNaN(v) || 'Valor inválido',
          })}
          disabled={isSubmitting || isSearchingSp}
        ></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{SalableText}</legend>
        <Select
          options={STORE_PRODUCT_SALE_STATUS}
          {...register('salable', {
            setValueAs: (value) => value === 'true',
          })}
          disabled={isSubmitting || isSearchingSp}
          width='w-full'
        ></Select>
      </fieldset>

      <div className='col-span-full flex w-full flex-col items-center md:w-auto md:mt-3'>
        <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
          <Button
            type='button'
            className='join-item'
            color='btn-error'
            label={CancelText}
            icon={CancelIcon}
            disabled={isSubmitting || isSearchingSp}
            onClick={() => history.back()}
          />

          <Button
            type='button'
            className='join-item'
            label={ClearText}
            icon={ClearIcon}
            color='btn-secondary'
            onClick={() => window.location.reload()}
            disabled={isSubmitting || isSearchingSp}
          />

          <Button
            type='submit'
            className='join-item'
            disabled={isSubmitting || isSearchingSp || !selectedProduct}
            label={
              isSubmitting ? (isEdit ? UpdatingText : SavingText) : isEdit ? UpdateText : SaveText
            }
            icon={isEdit ? UpdateIcon : SaveIcon}
            color='btn-success'
          />
        </div>
      </div>
      <h1 className='text-error text-xs col-span-full text-center'>
        {CurrentTaxValueText(
          usingDefaultTax ? DEFAULT_TAX_VALUE : Number(taxSetting.value),
          usingDefaultTax
        )}
      </h1>
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

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { BarcodeIcon, SearchIcon } from '~/constants/iconNames';
import {
  BarcodeText,
  DisabledProductSale,
  ProductSearchByBarcodeFailedText,
  SearchText,
  ServerConnErrorText,
} from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import { storeProductService } from '~/features/storeProducts/services/storeProductService';
import type { StoreProduct } from '~/types/storeProduct';
import { hasAbilities } from '~/utils/helpers';

interface ProductScannerProps {
  storeId: number;
  onProductResolved: (storeProduct: StoreProduct) => void;
  onSubmittingChange?: (value: boolean) => void;
  isDisabled?: boolean;
}

export default function ProductScanner({
  storeId,
  onProductResolved,
  onSubmittingChange,
  isDisabled = false,
}: ProductScannerProps) {
  const authStore = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { barcode: '' },
  });

  const searchProduct = async (barcode: string) => {
    try {
      const product = await storeProductService.showByBarcode(barcode, storeId);
      if (!product.salable) {
        reset();
        onProductResolved(undefined);
        setErrorMessage(DisabledProductSale);
      } else onProductResolved(product);
    } catch (error: any) {
      if (error?.status === 404) {
        reset();
        onProductResolved(undefined);
        setErrorMessage(ProductSearchByBarcodeFailedText);
      } else {
        reset();
        onProductResolved(undefined);
        setErrorMessage(ServerConnErrorText);
      }
    }
  };

  const submitHandler = async (data: { barcode: string }) => {
    setErrorMessage('');
    await searchProduct(data.barcode);
  };

  useEffect(() => {
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange]);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className='w-full join join-vertical md:join-horizontal'>
        <Input
          className='join-item'
          icon={BarcodeIcon}
          placeholder={BarcodeText}
          width='w-full'
          {...register('barcode', {
            required: 'Debe ingresar un código de barras.',
            pattern: {
              value: /^[A-Za-z0-9]{8,30}$/,
              message: 'El código de barras debe tener entre 8 y 30 carácteres.',
            },
          })}
          errorMessage={errors.barcode?.message}
          disabled={isSubmitting}
        />
        <Button
          className='join-item'
          color='btn-success'
          icon={!isSubmitting ? SearchIcon : ''}
          isLoading={isSubmitting}
          type='submit'
          disabled={
            isSubmitting ||
            isDisabled ||
            !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:store'])
          }
          title={SearchText.toUpperCase()}
        />
      </div>
      <div className='flex flex-col items-center'>
        <h1 className='text-xs text-error p-1'>{errorMessage}</h1>
      </div>
    </form>
  );
}

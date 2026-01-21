import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { BarcodeIcon, RandomizeIcon } from '~/constants/iconNames';
import {
  AssignText,
  BarcodeGenerationFailed,
  BarcodeText,
  CancelText,
  ContinueText,
  ErrorTagText,
  ProductFoundByBarcodeMessage,
  QuestionText,
  RandomizeBarcodeText,
  ServerErrorText,
} from '~/constants/strings';
import { productService } from '../services/productService';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor } from '~/constants/values';
import { useAuth } from '~/context/authContext';
import { hasAbilities } from '~/utils/helpers';

interface BarcodeScannerProps {
  onBarcodeResolved: (barcode: string) => void;
}

export default function BarcodeScanner({ onBarcodeResolved }: BarcodeScannerProps) {
  const authStore = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { barcode: '' },
  });

  const searchProduct = async (barcode: string) => {
    try {
      const product = await productService.showByBarcode(barcode);
      Swal.fire({
        title: QuestionText.toUpperCase(),
        html: ProductFoundByBarcodeMessage(product),
        icon: 'question',
        showCancelButton: true,
        cancelButtonColor: ErrorColor,
        confirmButtonColor: SuccessColor,
        confirmButtonText: ContinueText.toUpperCase(),
        cancelButtonText: CancelText.toUpperCase(),
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        reverseButtons: true,
      }).then((r) => {
        if (r.isConfirmed) navigate(`/dashboard/product/${product.id}/edit`);
        else window.location.reload();
      });
    } catch (error: any) {
      if (error?.status === 404) {
        onBarcodeResolved(barcode);
        return;
      }
      Swal.fire(ErrorTagText, ServerErrorText, 'error').then((r) => {
        if (r.dismiss || r.isDismissed || r.isConfirmed) window.location.reload();
      });
    }
  };

  const generateRandomBarcode = async () => {
    try {
      const response = await productService.generateRandomBarcode();
      onBarcodeResolved(response.barcode);
    } catch {
      Swal.fire(ErrorTagText, BarcodeGenerationFailed, 'error').then((r) => {
        if (r.dismiss || r.isDismissed || r.isConfirmed) window.location.reload();
      });
    }
  };

  const submitHandler = async (data: { barcode: string }) => {
    await searchProduct(data.barcode);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className='w-full join join-vertical md:join-horizontal'>
        <Input
          className='join-item'
          icon={BarcodeIcon}
          placeholder={BarcodeText}
          width='w-full'
          {...register('barcode', {
            required: 'Debe ingresar un código de barras o generar uno aleatorio.',
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
          color='btn-warning'
          icon={RandomizeIcon}
          title={RandomizeBarcodeText}
          onClick={generateRandomBarcode}
          disabled={
            isSubmitting ||
            !hasAbilities(authStore?.abilityKeys, [
              'sys:admin',
              'product:store',
              'utils:generateRandomBarcode',
              'product:generateRandomBarcode',
            ])
          }
        />
        <Button
          className='join-item'
          color='btn-info'
          label={AssignText}
          type='submit'
          disabled={
            isSubmitting || !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'product:store'])
          }
        />
      </div>
    </form>
  );
}

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Loading from '~/components/Loading';
import Select from '~/components/Select';
import {
  BarcodeIcon,
  CancelIcon,
  ClearIcon,
  DescriptionIcon,
  NameIcon,
  RucIcon,
  SaveIcon,
  UpdateIcon,
} from '~/constants/iconNames';
import {
  BarcodeText,
  CancelText,
  ClearText,
  CreateProductWarning,
  DescriptionText,
  ErrorTagText,
  FormLoadFailed,
  LoadingForm,
  NameText,
  OkTagText,
  OpRollbackText,
  ProductBarcodeTaken,
  ProductCreatedText,
  ProductUpdatedText,
  RucText,
  SaveText,
  SavingText,
  UpdateProductWarning,
  UpdateText,
  UpdatingText,
} from '~/constants/strings';
import { swalDismissalTime } from '~/constants/values';
import { presentationService } from '~/features/presentations/services/presentationService';
import type { Presentation } from '~/types/presentation';
import BarcodeScanner from './BarcodeScanner';
import Alert from '~/components/Alert';

export interface ProductFormData {
  name: string;
  barcode: string;
  description: string;
  presentation?: Presentation;
  presentationId?: number;
}

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<any>;
}

export default function ProductForm({ defaultValues, onSubmit }: ProductFormProps) {
  const isEdit = Boolean(defaultValues?.name);
  const [loading, setLoading] = useState(true);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [barcodeLocked, setBarcodeLocked] = useState(isEdit);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ProductFormData>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const submitHandler = async (data: ProductFormData) => {
    try {
      await onSubmit(data).then(() => {
        Swal.fire({
          icon: 'success',
          title: OkTagText,
          html: isEdit ? ProductUpdatedText : ProductCreatedText,
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
          const field = e.field as keyof ProductFormData;
          setError(field, { message: field === 'barcode' ? ProductBarcodeTaken : e.message });
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

  const loadPresentations = async () => {
    try {
      setLoading(true);
      const response = await presentationService.list('available');
      if (response.length === 0) {
        setIsLocked(true);
        return;
      }
      setPresentations(response);
    } catch {
      setIsLocked(true);
      setPresentations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresentations();
  }, []);

  const handleBarcodeResolved = (barcode: string) => {
    reset({
      ...defaultValues,
      barcode,
    });

    setBarcodeLocked(true);
  };

  if (!barcodeLocked)
    return (
      <div className='w-full'>
        <BarcodeScanner onBarcodeResolved={handleBarcodeResolved} />
      </div>
    );

  if (loading) return <Loading loadMessage={LoadingForm} />;

  if (isLocked)
    return <div className='p-4 text-center text-error font-semibold'>{FormLoadFailed}</div>;

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className='w-full space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0'
    >
      {!isEdit && (
        <Alert
          type='info'
          variant='outline'
          message={CreateProductWarning}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}
      {isEdit && (
        <Alert
          type='error'
          variant='outline'
          message={UpdateProductWarning}
          width='w-full'
          className='col-span-full'
        ></Alert>
      )}

      <Input
        disabled={isSubmitting}
        placeholder={NameText}
        icon={NameIcon}
        {...register('name', {
          required: 'El nombre es obligatorio.',
          validate: {
            notBlank: (v) =>
              v.trim().length > 0 || 'El nombre no puede estar vacío ni contener solo espacios.',
            noLeadingSpace: (v) => !v.startsWith(' ') || 'El nombre no debe comenzar con espacios.',
          },
          maxLength: { value: 100, message: 'Máximo 100 caracteres.' },
        })}
        errorMessage={errors.name?.message}
      />

      <Input
        disabled={isSubmitting || barcodeLocked}
        placeholder={BarcodeText}
        icon={BarcodeIcon}
        {...register('barcode', {
          required: 'Debe ingresar un código de barras o generar uno aleatorio.',
          pattern: {
            value: /^[A-Za-z0-9]{8,30}$/,
            message: 'El código de barras debe tener entre 8 y 30 carácteres.',
          },
        })}
        errorMessage={errors.barcode?.message}
      />

      <div className='col-span-full'>
        <Select
          options={presentations.map((p) => ({ label: p.name!, value: p.id! }))}
          width='w-full'
          disabled={isSubmitting}
          errorMessage={errors.presentationId?.message}
          {...register('presentationId', {
            required: 'Debe seleccionar una presentación.',
            valueAsNumber: true,
          })}
        />
      </div>

      <div className='col-span-full'>
        <Input
          disabled={isSubmitting}
          placeholder={DescriptionText}
          icon={DescriptionIcon}
          {...register('description', {
            required: 'La descripción es obligatoria.',
            validate: {
              notBlank: (v) =>
                v.trim().length > 0 ||
                'La descripción no puede estar vacía ni contener solo espacios.',
              noLeadingSpace: (v) =>
                !v.startsWith(' ') || 'La descripción no debe comenzar con espacios.',
            },
            maxLength: { value: 150, message: 'Máximo 150 caracteres.' },
          })}
          errorMessage={errors.description?.message}
        />
      </div>

      <div className='col-span-full flex w-full flex-col items-center md:w-auto'>
        <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
          <Button
            disabled={isSubmitting}
            type='button'
            className='join-item'
            color='btn-error'
            onClick={() => history.back()}
            label={CancelText}
            icon={CancelIcon}
          />

          <Button
            disabled={isSubmitting}
            type='button'
            className='join-item'
            onClick={() => reset(defaultValues)}
            label={ClearText}
            icon={ClearIcon}
            color='btn-secondary'
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

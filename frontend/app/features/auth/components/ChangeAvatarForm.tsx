import { useAuth } from '~/context/authContext';
import defaultPfp from '../../../../assets/images/defaultPfp.png';
import Input from '~/components/Input';
import FileInput from '~/components/FileInput';
import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import {
  CancelText,
  CurrenAvatarText,
  ErrorTagText,
  NoFileSelected,
  OkTagText,
  PreviewText,
  ServerErrorText,
  UpdateText,
  UpdatingText,
  UserAvatarUpdatedText,
} from '~/constants/strings';
import { CancelIcon, UpdateIcon } from '~/constants/iconNames';
import { updateProfilePictureService } from '../services/authService';
import Swal from 'sweetalert2';
import { longSwalDismissalTime } from '~/constants/values';
const API_URL = import.meta.env.VITE_API_URL;
import { useState, useEffect } from 'react';

type Props = {
  onBusyStart?: () => void;
  onBusyEnd?: () => void;
};

type FormValues = {
  avatar: FileList;
};

export default function ChangeAvatarForm({ onBusyStart, onBusyEnd }: Props) {
  const { user } = useAuth();

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    mode: 'onChange',
  });

  const fileWatch = watch('avatar');

  useEffect(() => {
    const files = fileWatch;
    if (!files || files.length === 0) {
      setPreview(null);
      return;
    }

    const file = files[0];

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [fileWatch]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (onBusyStart) onBusyStart();
      const file = data.avatar[0];
      await updateProfilePictureService(file);

      onBusyEnd?.();
      Swal.fire({
        title: OkTagText,
        html: UserAvatarUpdatedText,
        icon: 'success',
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: ServerErrorText,
        icon: 'error',
        timer: longSwalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='grid md:grid-cols-2 grid-cols-1 gap-4 '>
        <div className='flex flex-col items-center'>
          <img
            className='rounded-box shadow-lg border-black border rounded-full max-w-[150px]!'
            alt='Current Avatar'
            src={
              user?.profilePicture
                ? `${API_URL}/storage/profile-picture/${user.profilePicture}`
                : defaultPfp
            }
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => {
              if (e.currentTarget.src !== defaultPfp) {
                e.currentTarget.src = defaultPfp;
              }
            }}
          />
          <h1 className='text-md font-semibold'>{CurrenAvatarText}</h1>
        </div>

        <div className='flex flex-col items-center'>
          <img
            className={`rounded-box shadow-lg border-black border rounded-full max-w-[150px]! ${preview ?? 'border-none'}`}
            alt=''
            src={preview ?? '#'}
            onContextMenu={(e) => e.preventDefault()}
          />

          <div className={`text-gray-400 italic mt-6 ${preview ? 'hidden' : ''}`}>
            {preview ? null : NoFileSelected}
          </div>

          <h1 className='text-md font-semibold'>{PreviewText}</h1>
        </div>

        <div className='col-span-full'>
          <FileInput
            width='w-full'
            className='overflow-hidden max-w-[300px]'
            error={!!errors.avatar}
            errorMessage={errors.avatar?.message}
            type='file'
            accept='image/png, image/jpg, image/jpeg, image/webp'
            {...register('avatar', {
              required: 'Debes seleccionar una imagen válida.',
              validate: {
                acceptedFormats: (files) =>
                  ['image/jpeg', 'image/png', 'image/webp', 'image/jpeg'].includes(
                    files?.[0]?.type
                  ) || 'Solo se permiten los formatos: .jpg, .jpeg, .png y .webp',
                maxSize: (files) =>
                  (files?.[0]?.size ?? 0) <= 4 * 1024 * 1024 ||
                  'El tamaño de la imagen no debe superar los 4MB.',
              },
            })}
            disabled={isSubmitting}
          />
        </div>

        <div className='flex flex-col items-center col-span-full'>
          <div className='join join-vertical md:join-horizontal w-full md:w-auto'>
            <Button
              label={CancelText}
              className='join-item'
              width='w-full md:w-auto'
              color='btn-error'
              icon={CancelIcon}
              onClick={() => window.location.reload()}
              disabled={isSubmitting}
            />
            <Button
              type='submit'
              label={isSubmitting ? UpdatingText : UpdateText}
              className='join-item'
              width='w-full md:w-auto'
              color='btn-success'
              icon={UpdateIcon}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

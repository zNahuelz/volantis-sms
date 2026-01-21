import { useForm } from 'react-hook-form';
import Button from '~/components/Button';
import Select from '~/components/Select';
import { SearchIcon } from '~/constants/iconNames';
import { NoStoresAvailableText, SelectText } from '~/constants/strings';
import { useAuth } from '~/context/authContext';
import type { Store } from '~/types/store';
import { hasAbilities } from '~/utils/helpers';

interface StoreSelectorProps {
  onSelectionResolved: (store: Store) => void;
  stores: Store[];
}

export default function StoreSelector({ onSelectionResolved, stores }: StoreSelectorProps) {
  const authStore = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { storeId: stores[0].id },
  });

  const submitHandler = (data: { storeId: number }) => {
    onSelectionResolved(stores.find((s) => s.id === data.storeId));
  };

  if (!stores || stores.length === 0) {
    return (
      <div>
        <h1 className='text-error text-center font-bold'>{NoStoresAvailableText}</h1>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className='w-full join join-vertical md:join-horizontal'>
        <Select
          options={stores.map((s) => ({ value: s.id, label: s.name }))}
          className='join-item w-full'
          {...register('storeId', {
            required: 'Debe seleccionar una tienda válida.',
            valueAsNumber: true,
          })}
          errorMessage={errors.storeId?.message}
          disabled={isSubmitting}
        ></Select>
        <Button
          className='join-item'
          color='btn-success'
          icon={!isSubmitting ? SearchIcon : ''}
          type='submit'
          disabled={
            isSubmitting || !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'sale:store'])
          }
          title={SelectText.toUpperCase()}
        />
      </div>
    </form>
  );
}

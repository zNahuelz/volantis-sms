import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import type { StoreFormData } from '../components/StoreForm';
import { useNavigate } from 'react-router';
import { isInteger } from '~/utils/helpers';
import { storeService } from '../services/storeService';
import Loading from '~/components/Loading';
import { EditStoreText, LoadingStoreText, StoreNotFoundText } from '~/constants/strings';
import StoreTable from '../components/StoreTable';
import StoreForm from '../components/StoreForm';

export default function StoreEditView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<Partial<StoreFormData> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStore = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/store');
      }
      try {
        const res = await storeService.show(Number(id!));
        setStore({
          name: res.name,
          ruc: res.ruc,
          phone: res.phone,
          address: res.address,
        });
      } catch (error) {
        navigate('/dashboard/store');
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingStoreText}></Loading>;
  }

  if (!store) {
    return <p className='text-center text-error'>{StoreNotFoundText}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[500px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditStoreText} #{id}
          </h1>
        </div>
        <div className='p-4'>
          <StoreForm
            defaultValues={store}
            onSubmit={(data) => storeService.update(Number(id!), data)}
          ></StoreForm>
        </div>
      </div>
    </div>
  );
}

import { CreateStoreText } from '~/constants/strings';
import StoreForm from '../components/StoreForm';
import { storeService } from '../services/storeService';

export default function StoreCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[500px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateStoreText}</h1>
        </div>
        <div className='p-4'>
          <StoreForm onSubmit={(data) => storeService.create(data)}></StoreForm>
        </div>
      </div>
    </div>
  );
}

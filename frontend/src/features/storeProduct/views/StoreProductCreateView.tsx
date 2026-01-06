import { CreateStoreProductText } from '~/constants/strings';
import StoreProductForm from '../components/StoreProductForm';
import { storeProductService } from '../services/storeProductService';

export default function StoreProductCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[700px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateStoreProductText}</h1>
        </div>
        <div className='p-4'>
          <StoreProductForm
            onSubmit={(data) => storeProductService.create(data)}
          ></StoreProductForm>
        </div>
      </div>
    </div>
  );
}

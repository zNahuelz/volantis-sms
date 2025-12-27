import { CreateProductText } from '~/constants/strings';
import ProductForm from '../components/ProductForm';
import { productService } from '../services/productService';

export default function ProductCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[600px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateProductText}</h1>
        </div>
        <div className='p-4'>
          <ProductForm onSubmit={(data) => productService.create(data)}></ProductForm>
        </div>
      </div>
    </div>
  );
}

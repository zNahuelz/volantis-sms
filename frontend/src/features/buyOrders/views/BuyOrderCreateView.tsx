import { CreateBuyOrderText } from '~/constants/strings';
import BuyOrderForm from '../components/BuyOrderForm';
import { buyOrderService } from '../services/buyOrderService';

export default function BuyOrderCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[1000px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateBuyOrderText}</h1>
        </div>
        <div className='p-4'>
          <BuyOrderForm onSubmit={(data) => buyOrderService.create(data)}></BuyOrderForm>
        </div>
      </div>
    </div>
  );
}

import { CreatePaymentTypeText } from '~/constants/strings';
import { paymentTypeService } from '../services/paymentTypeService';
import PaymentTypeForm from '../components/PaymentTypeForm';

export default function PaymentTypeCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[500px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreatePaymentTypeText}</h1>
        </div>
        <div className='p-4'>
          <PaymentTypeForm onSubmit={(data) => paymentTypeService.create(data)}></PaymentTypeForm>
        </div>
      </div>
    </div>
  );
}

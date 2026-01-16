import { CreateCustomerText } from '~/constants/strings';
import CustomerForm from '../components/CustomerForm';
import { customerService } from '../services/customerService';

export default function CustomerCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[800px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateCustomerText}</h1>
        </div>
        <div className='p-4'>
          <CustomerForm onSubmit={(data) => customerService.create(data)}></CustomerForm>
        </div>
      </div>
    </div>
  );
}

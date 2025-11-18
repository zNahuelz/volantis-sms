import { CreateSupplierAreaText, CreateSupplierText } from '~/constants/strings';
import SupplierForm from '../components/SupplierForm';
import type { Route } from '.react-router/types/app/routes/+types/home';
import { supplierService } from '../services/supplierService';

export function meta({}: Route.MetaArgs) {
  return [{ title: CreateSupplierAreaText }];
}

export default function SupplierCreateView() {
  return (
    <div>
      <h1 className='mb-2 text-center text-2xl font-semibold'>{CreateSupplierText}</h1>
      <div className='flex flex-col items-center'>
        <div className='card bg-base-100 border-secondary/20 flex w-full flex-col items-center border p-6 shadow-xl md:w-[600px]'>
          <SupplierForm onSubmit={(data) => supplierService.create(data)}></SupplierForm>
        </div>
      </div>
    </div>
  );
}

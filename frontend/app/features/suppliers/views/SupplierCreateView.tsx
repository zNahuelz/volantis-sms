import { CreateSupplierAreaText, CreateSupplierText } from '~/constants/strings';
import SupplierForm from '../components/SupplierForm';
import { supplierService } from '../services/supplierService';
import type { Route } from '.react-router/types/app/+types/root';

export function meta({}: Route.MetaArgs) {
  return [{ title: CreateSupplierAreaText }];
}

export default function SupplierCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[800px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateSupplierText}</h1>
        </div>
        <div className='p-4'>
          <SupplierForm onSubmit={(data) => supplierService.create(data)}></SupplierForm>
        </div>
      </div>
    </div>
  );
}

import type { Route } from '.react-router/types/app/routes/+types/home';
import {
  EditSupplierAreaText,
  EditSupplierText,
  LoadingSupplierText,
  SupplierNotFound,
} from '~/constants/strings';
import SupplierForm, { type SupplierFormData } from '../components/SupplierForm';
import { supplierService } from '../services/supplierService';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Loading from '~/components/Loading';
import { isInteger } from '~/utils/helpers';
import Swal from 'sweetalert2';
export function meta({}: Route.MetaArgs) {
  return [{ title: EditSupplierAreaText }];
}

export default function SupplierEditView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [supplier, setSupplier] = useState<Partial<SupplierFormData> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSupplier = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/supplier');
      }
      try {
        const res = await supplierService.show(Number(id!));
        setSupplier({
          name: res.name,
          ruc: res.ruc,
          phone: res.phone,
          email: res.email,
          address: res.address,
        });
      } catch (error) {
        navigate('/dashboard/supplier');
      } finally {
        setLoading(false);
      }
    };

    loadSupplier();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingSupplierText}></Loading>;
  }

  if (!supplier) {
    return <p className='text-center text-error'>{SupplierNotFound}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[800px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditSupplierText} #{id}
          </h1>
        </div>
        <div className='p-4'>
          <SupplierForm
            defaultValues={supplier}
            onSubmit={(data) => supplierService.update(Number(id!), data)}
          ></SupplierForm>
        </div>
      </div>
    </div>
  );
}

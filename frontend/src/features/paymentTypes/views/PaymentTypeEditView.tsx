import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import type { PaymentTypeFormData } from '../components/PaymentTypeForm';
import { useNavigate } from 'react-router';
import { isInteger } from '~/utils/helpers';
import { paymentTypeService } from '../services/paymentTypeService';
import Loading from '~/components/Loading';
import {
  EditPaymentTypeText,
  LoadingPaymentTypeText,
  PaymentTypeNotFound,
} from '~/constants/strings';
import PaymentTypeForm from '../components/PaymentTypeForm';

export default function PaymentTypeEditView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState<Partial<PaymentTypeFormData> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPaymentType = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/payment-type');
      }
      try {
        const res = await paymentTypeService.show(Number(id!));
        setPaymentType({
          name: res.name,
          action: res.action,
        });
      } catch (error) {
        navigate('/dashboard/payment-type');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentType();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingPaymentTypeText}></Loading>;
  }

  if (!paymentType) {
    return <p className='text-center text-error'>{PaymentTypeNotFound}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[500px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditPaymentTypeText} #{id}
          </h1>
        </div>
        <div className='p-4'>
          <PaymentTypeForm
            defaultValues={paymentType}
            onSubmit={(data) => paymentTypeService.update(Number(id!), data)}
          ></PaymentTypeForm>
        </div>
      </div>
    </div>
  );
}

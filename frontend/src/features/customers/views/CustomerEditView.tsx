import { CustomerNotFoundText, EditCustomerText, LoadingCustomerText } from '~/constants/strings';
import CustomerForm, { type CustomerFormData } from '../components/CustomerForm';
import { customerService } from '../services/customerService';
import Loading from '~/components/Loading';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { isInteger } from '~/utils/helpers';

export default function CustomerEditView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Partial<CustomerFormData> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomer = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/customer');
      }
      try {
        const res = await customerService.show(Number(id!));
        setCustomer({
          names: res.names,
          surnames: res.surnames,
          dni: res.dni,
          phone: res.phone,
          email: res.email,
          address: res.address!,
        });
      } catch (error) {
        navigate('/dashboard/customer');
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingCustomerText}></Loading>;
  }

  if (!customer) {
    return <p className='text-center text-error'>{CustomerNotFoundText}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[800px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditCustomerText} #{id}
          </h1>
        </div>
        <div className='p-4'>
          <CustomerForm
            defaultValues={customer}
            onSubmit={(data) => customerService.update(Number(id!), data)}
          ></CustomerForm>
        </div>
      </div>
    </div>
  );
}

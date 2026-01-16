import { BuyOrderNotFound, EditBuyOrderText, LoadingBuyOrderText } from '~/constants/strings';
import BuyOrderForm from '../components/BuyOrderForm';
import { buyOrderService } from '../services/buyOrderService';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { BuyOrderDetail } from '~/types/buyOrder';
import { useNavigate } from 'react-router';
import { isInteger } from '~/utils/helpers';
import Loading from '~/components/Loading';

export default function BuyOrderEditView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [buyOrder, setBuyOrder] = useState<
    Partial<{
      storeId: number;
      supplierId: number;
      status: string;
      subtotal: number;
      igv: number;
      total: number;
      buyOrderDetails: BuyOrderDetail[];
    }>
  >();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBuyOrder = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/buy-order');
      }
      try {
        const res = await buyOrderService.show(Number(id!));
        setBuyOrder({
          storeId: res.storeId,
          supplierId: res.supplierId,
          status: res.status,
          subtotal: res.subtotal,
          igv: res.igv,
          total: res.total,
          buyOrderDetails: res.buyOrderDetails,
        });
      } catch (error) {
        navigate('/dashboard/buy-order');
      } finally {
        setLoading(false);
      }
    };

    loadBuyOrder();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingBuyOrderText} color='text-primary'></Loading>;
  }

  if (!buyOrder) {
    return <p className='text-center text-error'>{BuyOrderNotFound}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[1000px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditBuyOrderText} #{id}
          </h1>
        </div>
        <div className='p-4'>
          <BuyOrderForm
            buyOrder={buyOrder}
            onSubmit={(data) => buyOrderService.update(Number(id!), data)}
          ></BuyOrderForm>
        </div>
      </div>
    </div>
  );
}

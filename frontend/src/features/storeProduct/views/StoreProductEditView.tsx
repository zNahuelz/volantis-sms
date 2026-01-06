import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { StoreProduct } from '~/types/storeProduct';
import { isInteger } from '~/utils/helpers';
import { storeProductService } from '../services/storeProductService';
import Loading from '~/components/Loading';
import {
  EditStoreProductText,
  LoadingStoreProductText,
  StoreProductNotFoundText,
} from '~/constants/strings';
import StoreProductForm from '../components/StoreProductForm';

export default function StoreProductEditView() {
  const { storeId, productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [storeProduct, setStoreProduct] = useState<StoreProduct | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!isInteger(productId!) || !isInteger(storeId)!) {
        navigate('/dashboard/store-product');
      }
      try {
        const res = await storeProductService.Show(Number(storeId!), Number(productId!));
        setStoreProduct({
          storeId: Number(storeId),
          productId: Number(productId),
          buyPrice: res.buyPrice,
          sellPrice: res.sellPrice,
          igv: res.igv,
          profit: res.profit,
          stock: res.stock,
          salable: res.salable,
          product: res.product,
        });
      } catch (error) {
        navigate('/dashboard/store-product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [storeId, productId]);

  if (loading) {
    return <Loading loadMessage={LoadingStoreProductText}></Loading>;
  }

  if (!storeProduct) {
    return <p className='text-center text-error'>{StoreProductNotFoundText}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[700px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditStoreProductText} - #TIENDA: {storeId} #PRODUCTO: {productId}
          </h1>
        </div>
        <div className='p-4'>
          <StoreProductForm
            storeProduct={storeProduct}
            onSubmit={(data) =>
              storeProductService.Update(Number(storeId!), Number(productId!), data)
            }
          ></StoreProductForm>
        </div>
      </div>
    </div>
  );
}

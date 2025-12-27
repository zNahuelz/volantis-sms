import { EditProductText, LoadingProductText, ProductNotFound } from '~/constants/strings';
import ProductForm, { type ProductFormData } from '../components/ProductForm';
import { productService } from '../services/productService';
import Loading from '~/components/Loading';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { isInteger } from '~/utils/helpers';

export default function ProductEditView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Partial<ProductFormData> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/product');
      }
      try {
        const res = await productService.show(Number(id!));
        setProduct({
          name: res.name,
          barcode: res.barcode,
          description: res.description,
          presentation: res.presentation,
          presentationId: res.presentationId,
        });
      } catch (error) {
        navigate('/dashboard/product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingProductText}></Loading>;
  }

  if (!product) {
    return <p className='text-center text-error'>{ProductNotFound}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[600px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditProductText} #{id}
          </h1>
        </div>
        <div className='p-4'>
          <ProductForm
            defaultValues={product}
            onSubmit={(data) => productService.update(Number(id!), data)}
          ></ProductForm>
        </div>
      </div>
    </div>
  );
}

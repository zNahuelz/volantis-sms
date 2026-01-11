import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Product } from '~/types/product';
import { formatAsDatetime, isInteger } from '~/utils/helpers';
import { productService } from '../services/productService';
import Button from '~/components/Button';
import {
  BarcodeText,
  BuyPriceText,
  CancelText,
  ConfirmActionText,
  CreatedAtText,
  DeleteText,
  DeletedAtText,
  DescriptionText,
  DetailsText,
  EditText,
  EmptyStoreProductsListText,
  ErrorTagText,
  GoBackText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LoadingProductText,
  NameText,
  OkTagText,
  ProductDetailText,
  ProductIdText,
  ProductNotFound,
  ProductStatusChangeMessage,
  ProductStatusUpdatedText,
  ProductText,
  ProfitText,
  RestoreText,
  SellPriceText,
  StateText,
  StockText,
  StoreIdText,
  StoreProductsText,
  StoreText,
  SupplierStatusUpdateFailedText,
  UpdatedAtText,
} from '~/constants/strings';
import Loading from '~/components/Loading';
import Input from '~/components/Input';
import { supplierService } from '~/features/suppliers/services/supplierService';
import { DeleteIcon, DetailsIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import { Table, type Column } from '~/components/Table';
import type { StoreProduct } from '~/types/storeProduct';
import { storeProductService } from '~/features/storeProducts/services/storeProductService';

export default function ProductDetailView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[] | null>(null);
  const navigate = useNavigate();

  const columns: Column<StoreProduct>[] = [
    { key: 'storeId', label: StoreIdText },
    {
      key: 'store',
      label: StoreText,
      render: (storeProduct) => storeProduct.store?.name ?? 'N/A',
    },
    { key: 'buyPrice', label: BuyPriceText },
    { key: 'sellPrice', label: SellPriceText },
    { key: 'profit', label: ProfitText },
    { key: 'stock', label: StockText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'deletedAt', label: StateText },
  ];

  useEffect(() => {
    const loadProduct = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/product');
      }
      try {
        const res = await productService.show(Number(id!));
        setProduct(res);
      } catch (error) {
        navigate('/dashboard/product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    loadStoreProduct();
  }, [product]);

  const loadStoreProduct = async () => {
    if (!product) return;
    try {
      const res = await storeProductService.showByProductId(Number(id!));
      setStoreProducts(res);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const showStatusChangeModal = async (product: Product) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: ProductStatusChangeMessage(product),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        product.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(product.id!);
    }
  };

  const performStatusChange = async (id: number) => {
    try {
      const res = await productService.destroy(id);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? ProductStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: SupplierStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  if (loading) {
    return <Loading loadMessage={LoadingProductText}></Loading>;
  }

  if (!product) {
    return <p className='text-center text-error'>{ProductNotFound}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {ProductDetailText} #{product.id}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={product.id} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{BarcodeText}</legend>
            <Input value={product.barcode} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{NameText}</legend>
            <Input value={product.name} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{DescriptionText}</legend>
            <Input value={product.description} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(product.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(product.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!product.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(product.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={product.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={product.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
            ></Input>
          </fieldset>

          <div className='col-span-full md:col-span-2 md:col-start-2'>
            <p className='text-center font-semibold text-sm'>{StoreProductsText.toUpperCase()}</p>
          </div>

          <div className='col-span-full md:col-span-full'>
            <Table
              columns={columns}
              data={storeProducts}
              size='table-sm'
              showActions={true}
              actions={(row) => (
                <div>
                  <Button
                    className='join-item btn-xs'
                    color='btn-primary'
                    icon={DetailsIcon}
                    title={DetailsText}
                    onClick={() => {
                      navigate(`/dashboard/store-product/${row.storeId}/${row.productId}`);
                    }}
                  />
                </div>
              )}
              errorMessage={EmptyStoreProductsListText}
            ></Table>
          </div>
        </div>

        <div className='flex flex-col items-center ps-4 pe-4 pb-4 w-full md:w-auto'>
          <div className='join md:join-horizontal join-vertical w-full md:w-auto'>
            <Button
              label={GoBackText}
              icon={GoBackIcon}
              color='btn-secondary'
              className='join-item'
              onClick={() => history.back()}
            ></Button>
            <Button
              label={EditText}
              color='btn-accent'
              icon={EditIcon}
              className='join-item'
              onClick={() => {
                navigate(`/dashboard/product/${product.id}/edit`);
              }}
            ></Button>
            <Button
              label={product.deletedAt ? RestoreText : DeleteText}
              icon={product.deletedAt ? RestoreIcon : DeleteIcon}
              color={product.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
              onClick={() => {
                showStatusChangeModal(product);
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

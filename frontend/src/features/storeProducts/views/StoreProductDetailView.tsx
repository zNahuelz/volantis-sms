import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { StoreProduct } from '~/types/storeProduct';
import { formatAsDatetime, hasAbilities, isInteger } from '~/utils/helpers';
import { storeProductService } from '../services/storeProductService';
import Loading from '~/components/Loading';
import {
  AddressText,
  BarcodeText,
  BuyPriceText,
  CancelText,
  ConfirmActionText,
  CreatedAtText,
  DeleteText,
  DeletedAtText,
  EditText,
  ErrorTagText,
  GoBackText,
  IsActiveText,
  IsDeletedText,
  LoadingStoreProductText,
  NameText,
  OkTagText,
  PresentationText,
  ProductIdText,
  ProductText,
  ProfitText,
  RestoreText,
  SalableText,
  SellPriceText,
  StateText,
  StockText,
  StoreIdText,
  StoreProductDetailText,
  StoreProductNotFoundText,
  StoreProductStatusChangeMessage,
  StoreProductStatusUpdateFailedText,
  StoreProductStatusUpdatedText,
  StoreText,
  TaxNameText,
  UpdatedAtText,
} from '~/constants/strings';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { DeleteIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';
import Swal from 'sweetalert2';
import { ErrorColor, SuccessColor, swalDismissalTime } from '~/constants/values';
import { useAuth } from '~/context/authContext';

export default function StoreProductDetailView() {
  const { storeId, productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [storeProduct, setStoreProduct] = useState<StoreProduct | null>(null);
  const navigate = useNavigate();
  const authStore = useAuth();

  useEffect(() => {
    const loadProduct = async () => {
      if (!isInteger(storeId!) || !isInteger(productId!)) {
        navigate('/dashboard/store-product');
      }
      try {
        const res = await storeProductService.Show(storeId, productId);
        setStoreProduct(res);
      } catch (error) {
        navigate('/dashboard/store-product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [storeId, productId]);

  const showStatusChangeModal = async (storeProduct: StoreProduct) => {
    const result = await Swal.fire({
      title: ConfirmActionText,
      html: StoreProductStatusChangeMessage(storeProduct),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: SuccessColor,
      cancelButtonColor: ErrorColor,
      confirmButtonText:
        storeProduct.deletedAt != null ? RestoreText.toUpperCase() : DeleteText.toUpperCase(),
      cancelButtonText: CancelText.toUpperCase(),
    });

    if (result.isConfirmed) {
      await performStatusChange(storeProduct.storeId, storeProduct.productId);
    }
  };

  const performStatusChange = async (storeId: number, productId: number) => {
    try {
      const res = await storeProductService.Destroy(storeId, productId);
      Swal.fire({
        title: OkTagText,
        html: !res.message ? StoreProductStatusUpdatedText : res.message,
        icon: 'success',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    } catch (error) {
      Swal.fire({
        title: ErrorTagText,
        html: StoreProductStatusUpdateFailedText,
        icon: 'error',
        timer: swalDismissalTime,
        showConfirmButton: false,
      }).then((e) => {
        if (e.dismiss) window.location.reload();
      });
    }
  };

  if (loading) {
    return <Loading loadMessage={LoadingStoreProductText}></Loading>;
  }

  if (!storeProduct || storeProduct === null) {
    return <p className='text-center text-error'>{StoreProductNotFoundText}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {StoreProductDetailText} ID. TIENDA: {storeProduct.storeId} ID. PRODUCTO:{' '}
            {storeProduct.productId}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StoreIdText}</legend>
            <Input value={storeProduct.storeId} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{ProductIdText}</legend>
            <Input value={storeProduct.productId} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{`${NameText} ${ProductText}`} </legend>
            <Input value={storeProduct.product?.name ?? 'N/A'} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{BarcodeText} </legend>
            <Input value={storeProduct.product?.barcode ?? 'N/A'} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{BuyPriceText}</legend>
            <Input value={storeProduct.buyPrice} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{TaxNameText.toUpperCase()}</legend>
            <Input value={storeProduct.igv} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SellPriceText}</legend>
            <Input value={storeProduct.sellPrice} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{ProfitText}</legend>
            <Input value={storeProduct.profit} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StockText}</legend>
            <Input
              value={`${storeProduct.stock} ${storeProduct.product?.presentation?.name}`}
              readOnly
            ></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{PresentationText}</legend>
            <Input
              value={`${storeProduct.product?.presentation?.name} (${storeProduct.product?.presentation?.numericValue}) | ${storeProduct.product?.presentation?.description}`}
              readOnly
            ></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SalableText}</legend>
            <Input
              value={storeProduct.salable ? 'SI' : 'NO'}
              className={storeProduct.salable ? 'font-bold text-success' : 'font-bold text-error'}
              readOnly
            ></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>
              {NameText} {StoreText}
            </legend>
            <Input value={storeProduct.store?.name ?? 'N/A'} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>
              {AddressText} {StoreText}
            </legend>
            <Input value={storeProduct.store?.address ?? 'N/A'} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(storeProduct.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(storeProduct.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!storeProduct.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(storeProduct.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={
                storeProduct.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()
              }
              readOnly
              className={storeProduct.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
            ></Input>
          </fieldset>
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
                navigate(
                  `/dashboard/store-product/${storeProduct.storeId}/${storeProduct.productId}/edit`
                );
              }}
              disabled={!hasAbilities(authStore?.abilityKeys, ['sys:admin', 'storeProduct:update'])}
            ></Button>
            <Button
              label={storeProduct.deletedAt ? RestoreText : DeleteText}
              icon={storeProduct.deletedAt ? RestoreIcon : DeleteIcon}
              color={storeProduct.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
              onClick={() => showStatusChangeModal(storeProduct)}
              disabled={
                !hasAbilities(authStore?.abilityKeys, ['sys:admin', 'storeProduct:destroy'])
              }
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

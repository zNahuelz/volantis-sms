import { useParams } from 'react-router';
import type { BuyOrder } from '~/types/buyOrder';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { formatAsDatetime, isInteger } from '~/utils/helpers';
import { buyOrderService } from '../services/buyOrderService';
import Loading from '~/components/Loading';
import {
  ActionsText,
  BarcodeText,
  BuyOrderDetailText,
  BuyOrderNotFound,
  CreatedAtText,
  DeleteText,
  DeletedAtText,
  DescriptionText,
  EditText,
  GoBackText,
  IdText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LoadingBuyOrderText,
  OrderStatusText,
  PresentationText,
  ProductText,
  QuantityText,
  RestoreText,
  ShortBarcodeText,
  StateText,
  StoreText,
  SubtotalText,
  SupplierText,
  TaxNameText,
  TotalText,
  UnitPriceText,
  UpdatedAtText,
} from '~/constants/strings';
import Button from '~/components/Button';
import { DeleteIcon, EditIcon, GoBackIcon, RestoreIcon } from '~/constants/iconNames';
import Input from '~/components/Input';

export default function BuyOrderDetailView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [buyOrder, setBuyOrder] = useState<BuyOrder | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBuyOrder = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/buy-order');
      }
      try {
        const res = await buyOrderService.show(Number(id!));
        setBuyOrder(res);
      } catch (error) {
        navigate('/dashboard/buy-order');
      } finally {
        setLoading(false);
      }
    };

    loadBuyOrder();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingBuyOrderText}></Loading>;
  }

  if (!buyOrder) {
    return <p className='text-center text-error'>{BuyOrderNotFound}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {BuyOrderDetailText} #{buyOrder.id}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={buyOrder.id} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StoreText}</legend>
            <Input
              value={buyOrder.store?.name ?? 'N/A'}
              className='hover:text-primary'
              readOnly
              onDoubleClick={() => navigate(`/dashboard/store/${buyOrder.store?.id}`)}
            ></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SupplierText}</legend>
            <Input
              value={buyOrder.supplier?.name ?? 'N/A'}
              className='hover:text-primary'
              onDoubleClick={() => navigate(`/dashboard/supplier/${buyOrder.supplier?.id}`)}
              readOnly
            ></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{OrderStatusText}</legend>
            <Input
              value={buyOrder.status}
              className={`${
                buyOrder.status === 'PENDIENTE'
                  ? 'text-neutral'
                  : buyOrder.status === 'ENVIADO'
                    ? 'text-info'
                    : buyOrder.status === 'CANCELADA'
                      ? 'text-error'
                      : buyOrder.status === 'FINALIZADA'
                        ? 'text-success'
                        : 'text-black'
              } font-bold`}
              readOnly
            ></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SubtotalText}</legend>
            <Input value={buyOrder.subtotal} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{TaxNameText.toUpperCase()}</legend>
            <Input value={buyOrder.igv} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{TotalText}</legend>
            <Input value={buyOrder.total} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(buyOrder.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(buyOrder.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!buyOrder.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(buyOrder.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={buyOrder.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={buyOrder.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
            ></Input>
          </fieldset>

          <div className='col-span-full'>
            <div className='overflow-x-auto border border-base-content/30 bg-base-100'>
              <table className='table table-sm'>
                <thead>
                  <tr className='text-black'>
                    <th>{IdText}</th>
                    <th>{ProductText}</th>
                    <th>{BarcodeText}</th>
                    <th>{PresentationText}</th>
                    <th className='text-end'>{QuantityText}</th>
                    <th className='text-end'>{UnitPriceText}</th>
                    <th className='text-end'>{TotalText} Est.</th>
                  </tr>
                </thead>
                <tbody>
                  {buyOrder.buyOrderDetails?.map((detail) => {
                    const product = detail.product;

                    return (
                      <tr key={detail.productId} className='hover:bg-secondary/10'>
                        <td>{detail.productId ?? 0}</td>
                        <td
                          className='hover:text-primary'
                          onDoubleClick={() =>
                            navigate(`/dashboard/product/${detail.productId ?? ''}`)
                          }
                        >
                          {product?.name ?? 'Prod. no disponible'}
                        </td>
                        <td>{product?.barcode ?? 'N/A'}</td>
                        <td>{product?.presentation?.name ?? 'N/A'}</td>

                        <td className='text-end'>{detail.quantity ?? 0}</td>

                        <td className='text-end'>{detail.unitCost ?? 0}</td>

                        <td className='text-end'>{detail.quantity * detail.unitCost}</td>
                      </tr>
                    );
                  })}

                  {(!buyOrder.buyOrderDetails || buyOrder.buyOrderDetails.length === 0) && (
                    <tr>
                      <td colSpan={6} className='text-center py-4 font-light'>
                        {BuyOrderNotFound}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
                navigate(`/dashboard/buy-order/${buyOrder.id}/edit`);
              }}
            ></Button>
            <Button
              label={buyOrder.deletedAt ? RestoreText : DeleteText}
              icon={buyOrder.deletedAt ? RestoreIcon : DeleteIcon}
              color={buyOrder.deletedAt ? 'btn-info' : 'btn-error'}
              className='join-item'
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

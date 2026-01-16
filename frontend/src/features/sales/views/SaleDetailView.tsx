import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { Sale } from '~/types/sale';
import { formatAsDatetime, isInteger, sunatRound } from '~/utils/helpers';
import { saleService } from '../services/saleService';
import Loading from '~/components/Loading';
import {
  AddressText,
  CashReceivedText,
  ChangeText,
  CorrelativeText,
  CreatedAtText,
  CustomerText,
  DeletedAtText,
  DescriptionText,
  DniText,
  EmptySaleText,
  GoBackText,
  IdText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  LoadingSaleText,
  NameText,
  PaymentHashText,
  PaymentTypeText,
  PresentationText,
  QuantityText,
  SaleDetailText,
  SaleNotFoundText,
  SeriesCodeText,
  SoldByText,
  StateText,
  StoreText,
  SubtotalText,
  SurnameText,
  TaxNameText,
  TotalText,
  UnitPriceText,
  UpdatedAtText,
  VoucherTypeText,
} from '~/constants/strings';
import Button from '~/components/Button';
import { GoBackIcon } from '~/constants/iconNames';
import Input from '~/components/Input';
import { useAuth } from '~/context/authContext';
import { Table, type Column } from '~/components/Table';
import type { SaleDetail } from '~/types/saleDetail';

export default function SaleDetailView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState<Sale | null>(null);
  const navigate = useNavigate();
  const authStore = useAuth();

  const columns: Column<SaleDetail>[] = [
    { key: 'id', label: IdText, render: (row) => row.product?.id },
    { key: 'name', label: NameText, render: (row) => row.product?.name ?? '' },
    { key: 'barcode', label: NameText, render: (row) => row.product?.barcode ?? '' },
    { key: 'description', label: DescriptionText, render: (row) => row.product?.description ?? '' },
    {
      key: 'presentation',
      label: PresentationText,
      render: (row) => row.product?.presentation?.name,
    },
    { key: 'quantity', label: QuantityText },
    { key: 'unitPrice', label: UnitPriceText },
    {
      key: 'subtotal',
      label: SubtotalText,
      render: (row) => sunatRound(row.quantity * row.unitPrice),
    },
  ];

  useEffect(() => {
    const loadSale = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/sale');
      }
      try {
        const res = await saleService.show(Number(id!));
        setSale(res);
      } catch (error) {
        navigate('/dashboard/sale');
      } finally {
        setLoading(false);
      }
    };

    loadSale();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingSaleText}></Loading>;
  }

  if (!sale) {
    return <p className='text-center text-error'>{SaleNotFoundText}</p>;
  }

  return (
    <div className='md:m-5'>
      <div className='border-primary border'>
        <div className='bg-linear-to-r from-primary to-primary/60 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {SaleDetailText} #{sale.id} - {`${sale.set}-${sale.correlative}`}
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 p-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{IdTextAlt}</legend>
            <Input value={sale.id} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SeriesCodeText}</legend>
            <Input value={sale.set} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CorrelativeText}</legend>
            <Input value={sale.correlative} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StoreText}</legend>
            <Input
              value={sale.store?.name ?? 'N/A'}
              className='hover:text-primary hover:font-bold'
              readOnly
              onDoubleClick={() => navigate(`/dashboard/store/${sale.store?.id}`)}
            ></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{`${NameText} ${CustomerText}`}</legend>
            <Input
              value={sale.customer?.names ?? 'N/A'}
              className='hover:text-primary hover:font-bold'
              readOnly
              onDoubleClick={() => navigate(`/dashboard/store/${sale.customer?.id}`)}
            ></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{`${SurnameText} ${CustomerText}`}</legend>
            <Input value={sale.customer?.surnames ?? 'N/A'} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{DniText.toUpperCase()}</legend>
            <Input value={sale.customer?.dni ?? 'N/A'} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{AddressText}</legend>
            <Input value={sale.customer?.address ?? 'N/A'} readOnly></Input>
          </fieldset>

          <fieldset className={`fieldset ${sale.cashReceived > 0 ? '' : 'hidden'}`}>
            <legend className='fieldset-legend'>{CashReceivedText}</legend>
            <Input value={sale.cashReceived} readOnly></Input>
          </fieldset>

          <fieldset className={`fieldset ${sale.change > 0 ? '' : 'hidden'}`}>
            <legend className='fieldset-legend'>{ChangeText}</legend>
            <Input value={sale.change} readOnly></Input>
          </fieldset>

          <fieldset className={`fieldset ${sale.paymentHash !== null ? '' : 'hidden'}`}>
            <legend className='fieldset-legend'>{PaymentHashText}</legend>
            <Input value={sale.paymentHash} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SubtotalText}</legend>
            <Input value={sale.subtotal} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{TaxNameText.toUpperCase()}</legend>
            <Input value={sale.igv} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{TotalText}</legend>
            <Input value={sale.total} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{VoucherTypeText}</legend>
            <Input value={sale.voucherType?.name ?? ''} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{PaymentTypeText}</legend>
            <Input value={sale.paymentType?.name ?? ''} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SoldByText}</legend>
            <Input
              value={`${sale.user?.names}, ${sale.user?.surnames} --- ${sale.user?.username}` ?? ''}
              onDoubleClick={() => navigate(`/dashboard/user/${sale.user?.id}`)}
              className='hover:text-primary hover:font-bold'
              disabled={sale.user?.id === authStore.user?.id}
              readOnly
            ></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{CreatedAtText}</legend>
            <Input value={formatAsDatetime(sale.createdAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UpdatedAtText}</legend>
            <Input value={formatAsDatetime(sale.updatedAt)} readOnly></Input>
          </fieldset>
          <fieldset className={`fieldset ${!sale.deletedAt ? 'hidden' : ''}`}>
            <legend className='fieldset-legend'>{DeletedAtText}</legend>
            <Input value={formatAsDatetime(sale.deletedAt)} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{StateText}</legend>
            <Input
              value={sale.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
              readOnly
              className={sale.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
            ></Input>
          </fieldset>

          <div className='col-span-full'>
            <Table
              columns={columns}
              data={sale.saleDetails!}
              size='table-sm'
              showActions={false}
              errorMessage={EmptySaleText}
            ></Table>
          </div>
          <div className='col-span-full'>
            <h1 className='text-end text-2xl text-success font-bold underline'>
              {TotalText.toUpperCase()} : {sale.total}
            </h1>
          </div>

          <div className='col-span-full'>
            <div className='flex flex-col items-center w-full md:w-auto'>
              <Button
                label={GoBackText}
                icon={GoBackIcon}
                color='btn-secondary'
                onClick={() => history.back()}
                width='md:w-auto w-full'
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

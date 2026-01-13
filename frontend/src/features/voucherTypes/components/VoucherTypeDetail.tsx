import Input from '~/components/Input';
import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  CurrentCorrelativeText,
  DeletedAtText,
  IdText,
  IdTextAlt,
  IsActiveText,
  IsDeletedText,
  NameText,
  SeriesCodeText,
  StateText,
  UpdatedAtText,
} from '~/constants/strings';
import type { VoucherSerie } from '~/types/voucherSerie';
import type { VoucherType } from '~/types/voucherType';
import { formatAsDatetime } from '~/utils/helpers';

type Props = {
  voucherType: VoucherType;
};

export default function VoucherTypeDetail({ voucherType }: Props) {
  const columns: Column<VoucherSerie>[] = [
    { key: 'id', label: IdText },
    { key: 'seriesCode', label: SeriesCodeText },
    { key: 'currentNumber', label: CurrentCorrelativeText },
    {
      key: 'isActive',
      label: StateText,
      render: (row) => {
        return (
          <span className={`${row.isActive ? 'text-success' : 'text-error'} font-bold`}>
            {row.isActive ? 'HABILITADA' : 'DESHABILITADA'}
          </span>
        );
      },
    },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
  ];
  if (!voucherType) {
    return null;
  }
  return (
    <div className='grid md:grid-cols-3 gap-2'>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{IdTextAlt}</legend>
        <Input value={voucherType.id} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{NameText}</legend>
        <Input value={voucherType.name} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{CreatedAtText}</legend>
        <Input value={formatAsDatetime(voucherType.createdAt)} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{UpdatedAtText}</legend>
        <Input value={formatAsDatetime(voucherType.updatedAt)} readOnly></Input>
      </fieldset>
      <fieldset className={`fieldset ${!voucherType.deletedAt ? 'hidden' : ''}`}>
        <legend className='fieldset-legend'>{DeletedAtText}</legend>
        <Input value={formatAsDatetime(voucherType.deletedAt)} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{StateText}</legend>
        <Input
          value={voucherType.deletedAt ? IsDeletedText.toUpperCase() : IsActiveText.toUpperCase()}
          readOnly
          className={voucherType.deletedAt ? 'text-error font-bold' : 'text-success font-bold'}
        ></Input>
      </fieldset>

      <div className='md:col-span-full overflow-auto'>
        <Table
          data={voucherType.voucherSeries}
          actions={(row) => ''}
          columns={columns}
          showActions={false}
          size='table-sm'
        ></Table>
      </div>
    </div>
  );
}

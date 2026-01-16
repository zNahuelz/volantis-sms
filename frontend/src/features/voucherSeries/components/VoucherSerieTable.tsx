import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  CurrentCorrelativeText,
  FetchFailedText,
  IdText,
  SeriesCodeText,
  StateText,
  UpdatedAtText,
  VoucherSeriesNotLoadedText,
  VoucherTypeText,
} from '~/constants/strings';
import type { VoucherSerie } from '~/types/voucherSerie';

type Props = {
  data: VoucherSerie[];
  actions: (row: VoucherSerie) => React.ReactNode;
  fetchFailed?: boolean;
  showActions?: boolean;
};

export default function VoucherSerieTable({
  data,
  actions,
  fetchFailed = false,
  showActions = true,
}: Props) {
  const columns = [
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
    {
      key: 'voucherType',
      label: VoucherTypeText,
      render: (row) => row.voucherType?.name,
    },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
  ] satisfies Column<VoucherSerie>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : VoucherSeriesNotLoadedText}
      showActions={showActions}
    />
  );
}

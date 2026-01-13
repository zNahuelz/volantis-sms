import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  FetchFailedText,
  IdText,
  NameText,
  SeriesAmountText,
  StateText,
  UpdatedAtText,
  VoucherTypesNotLoadedText,
} from '~/constants/strings';
import type { VoucherType } from '~/types/voucherType';

type Props = {
  data: VoucherType[];
  actions: (row: VoucherType) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function VoucherTypeTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    {
      key: 'seriesAmount',
      label: SeriesAmountText,
      render: (row) => row.voucherSeries.length ?? 'N/A',
    },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<VoucherType>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : VoucherTypesNotLoadedText}
    />
  );
}

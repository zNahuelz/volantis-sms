import { Table, type Column } from '~/components/Table';
import {
  BuyOrdersNotLoaded,
  CreatedAtText,
  FetchFailedText,
  IdText,
  StateText,
  StoreText,
  SupplierText,
  TotalText,
  UpdatedAtText,
} from '~/constants/strings';
import type { BuyOrder } from '~/types/buyOrder';

type Props = {
  data: BuyOrder[];
  actions: (row: BuyOrder) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function BuyOrderTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'store', label: StoreText, render: (buyOrder) => buyOrder.store?.name },
    { key: 'supplier', label: SupplierText, render: (buyOrder) => buyOrder.supplier?.name },
    { key: 'total', label: TotalText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'status', label: StateText },
  ] satisfies Column<BuyOrder>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : BuyOrdersNotLoaded}
    />
  );
}

import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  CustomerText,
  DniText,
  FetchFailedText,
  IdText,
  IdTextLong,
  SalesNotLoadedText,
  StoreText,
  TaxNameText,
  TotalText,
} from '~/constants/strings';
import type { Sale } from '~/types/sale';

type Props = {
  data: Sale[];
  actions: (row: Sale) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function SaleTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'idAlt', label: IdTextLong, render: (row) => `${row.set}-${row.correlative}` },
    {
      key: 'store',
      label: StoreText,
      render: (row) => row.store?.name,
    },
    {
      key: 'customer',
      label: CustomerText,
      render: (row) => `${row.customer?.names}, ${row.customer?.surnames}`,
    },
    {
      key: 'dni',
      label: DniText.toUpperCase(),
      render: (row) => row.customer?.dni,
    },
    { key: 'igv', label: TaxNameText.toUpperCase() },
    { key: 'total', label: TotalText },

    { key: 'createdAt', label: CreatedAtText },
  ] satisfies Column<Sale>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : SalesNotLoadedText}
    />
  );
}

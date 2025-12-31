import { Table, type Column } from '~/components/Table';
import {
  BarcodeText,
  FetchFailedText,
  IdText,
  NameText,
  PresentationText,
  ProductsNotLoaded,
  StateText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Product } from '~/types/product';

type Props = {
  data: Product[];
  actions: (row: Product) => React.ReactNode;
  hiddenCols?: string[];
  fetchFailed?: boolean;
};

export default function ProductTable({ data, actions, hiddenCols, fetchFailed = false }: Props) {
  let columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    { key: 'barcode', label: BarcodeText },
    {
      key: 'presentation',
      label: PresentationText,
      render: (product) => product.presentation.name,
    },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Product>[];

  if (hiddenCols != undefined && hiddenCols.length >= 1) {
    columns = columns.filter((col) => !hiddenCols.includes(col.key));
  }

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : ProductsNotLoaded}
    />
  );
}

import { Table, type Column } from '~/components/Table';
import {
  BarcodeText,
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
};

export default function ProductTable({ data, actions }: Props) {
  const columns = [
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

  return <Table columns={columns} data={data} actions={actions} errorMessage={ProductsNotLoaded} />;
}

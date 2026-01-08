import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  FetchFailedText,
  ProductIdText,
  ProductText,
  SellPriceText,
  StateText,
  StockText,
  StoreIdText,
  StoreProductsNotLoaded,
  StoreText,
} from '~/constants/strings';
import type { StoreProduct } from '~/types/storeProduct';

type Props = {
  data: StoreProduct[];
  actions: (row: StoreProduct) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function StoreProductTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'storeId', label: StoreIdText },
    { key: 'productId', label: ProductIdText },
    {
      key: 'store',
      label: StoreText,
      render: (storeProduct) => storeProduct.store?.name ?? 'N/A',
    },
    {
      key: 'product',
      label: ProductText,
      render: (storeProduct) => storeProduct.product?.name ?? 'N/A',
    },
    { key: 'sellPrice', label: SellPriceText },
    { key: 'stock', label: StockText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<StoreProduct>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : StoreProductsNotLoaded}
    />
  );
}

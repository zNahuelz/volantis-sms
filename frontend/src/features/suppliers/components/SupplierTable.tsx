import { Table, type Column } from '~/components/Table';
import {
  FetchFailedText,
  IdText,
  NameText,
  PhoneText,
  RucText,
  StateText,
  SuppliersNotLoaded,
  UpdatedAtText,
} from '~/constants/strings';
import type { Supplier } from '~/types/supplier';

type Props = {
  data: Supplier[];
  actions: (row: Supplier) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function SupplierTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    { key: 'ruc', label: RucText.toUpperCase() },
    { key: 'phone', label: PhoneText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Supplier>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : SuppliersNotLoaded}
    />
  );
}

import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  NameText,
  PhoneText,
  RucText,
  StateText,
  SuppliersNotLoaded,
} from '~/constants/strings';
import type { Supplier } from '~/types/supplier';

type Props = {
  data: Supplier[];
  actions: (row: Supplier) => React.ReactNode;
};

export default function SupplierTable({ data, actions }: Props) {
  const columns = [
    { key: 'name', label: NameText },
    { key: 'ruc', label: RucText.toUpperCase() },
    { key: 'phone', label: PhoneText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Supplier>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={SuppliersNotLoaded}
    />
  );
}

import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  CustomersNotLoaded,
  DniText,
  FetchFailedText,
  IdText,
  NamesText,
  PhoneText,
  StateText,
  SurnamesText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Customer } from '~/types/customer';

type Props = {
  data: Customer[];
  actions: (row: Customer) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function CustomerTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'names', label: NamesText },
    { key: 'surnames', label: SurnamesText },
    { key: 'dni', label: DniText.toUpperCase() },
    { key: 'phone', label: PhoneText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Customer>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : CustomersNotLoaded}
    />
  );
}

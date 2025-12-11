import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  CustomersNotLoaded,
  DniText,
  IdText,
  NameText,
  NamesText,
  PhoneText,
  RucText,
  StateText,
  SurnamesText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Customer } from '~/types/customer';

type Props = {
  data: Customer[];
  actions: (row: Customer) => React.ReactNode;
};

export default function CustomerTable({ data, actions }: Props) {
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
    <Table columns={columns} data={data} actions={actions} errorMessage={CustomersNotLoaded} />
  );
}

import { Table, type Column } from '~/components/Table';
import {
  BehaviourText,
  CreatedAtText,
  FetchFailedText,
  IdText,
  NameText,
  PaymentTypesNotLoaded,
  StateText,
  UpdatedAtText,
} from '~/constants/strings';
import type { PaymentType } from '~/types/paymentType';

type Props = {
  data: PaymentType[];
  actions: (row: PaymentType) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function PaymentTypeTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    {
      key: 'action',
      label: BehaviourText,
      render: (row) => {
        const action = row.action.toUpperCase();

        const className =
          action === 'CASH'
            ? 'text-success font-bold'
            : action === 'DIGITAL'
              ? 'text-info font-bold'
              : 'text-black font-bold';

        const label =
          action === 'CASH' ? 'HASH NO REQ.' : action === 'DIGITAL' ? 'HASH REQ.' : action;

        return <span className={className}>{label}</span>;
      },
    },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<PaymentType>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : PaymentTypesNotLoaded}
    />
  );
}

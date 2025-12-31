import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  DescriptionText,
  FetchFailedText,
  IdText,
  NameText,
  NumericValueText,
  PresentationsNotLoadedText,
  StateText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Presentation } from '~/types/presentation';

type Props = {
  data: Presentation[];
  actions: (row: Presentation) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function PresentationTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    { key: 'numericValue', label: NumericValueText },
    { key: 'description', label: DescriptionText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Presentation>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : PresentationsNotLoadedText}
    />
  );
}

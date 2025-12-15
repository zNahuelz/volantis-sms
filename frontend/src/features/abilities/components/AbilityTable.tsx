import { Table, type Column } from '~/components/Table';
import {
  AbilitiesNotLoadedText,
  CreatedAtText,
  DescriptionText,
  IdText,
  KeyText,
  NameText,
  StateText,
  UpdatedAtText,
} from '~/constants/strings';
import type { Ability } from '~/types/ability';

type Props = {
  data: Ability[];
  actions: (row: Ability) => React.ReactNode;
};

export default function AbilityTable({ data, actions }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'name', label: NameText },
    { key: 'description', label: DescriptionText },
    { key: 'key', label: KeyText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
    { key: 'deletedAt', label: StateText },
  ] satisfies Column<Ability>[];

  return (
    <Table columns={columns} data={data} actions={actions} errorMessage={AbilitiesNotLoadedText} />
  );
}

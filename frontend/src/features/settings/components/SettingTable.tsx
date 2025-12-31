import { Table, type Column } from '~/components/Table';
import {
  CreatedAtText,
  DescriptionText,
  FetchFailedText,
  IdText,
  KeyText,
  SettingsNotLoaded,
  UpdatedAtText,
  ValueText,
  ValueType,
} from '~/constants/strings';
import type { Setting } from '~/types/setting';

type Props = {
  data: Setting[];
  actions: (row: Setting) => React.ReactNode;
  fetchFailed?: boolean;
};

export default function SettingTable({ data, actions, fetchFailed = false }: Props) {
  const columns = [
    { key: 'id', label: IdText },
    { key: 'key', label: KeyText },
    { key: 'value', label: ValueText },
    { key: 'description', label: DescriptionText },
    { key: 'createdAt', label: CreatedAtText },
    { key: 'updatedAt', label: UpdatedAtText },
  ] satisfies Column<Setting>[];

  return (
    <Table
      columns={columns}
      data={data}
      actions={actions}
      errorMessage={fetchFailed ? FetchFailedText : SettingsNotLoaded}
    />
  );
}

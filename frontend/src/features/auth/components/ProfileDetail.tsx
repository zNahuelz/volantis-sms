import { useAuth } from '~/context/authContext';
import defaultPfp from '../../../assets/images/defaultPfp.png';
import Input from '~/components/Input';
import {
  AdminAssignedStoreText,
  AssignedStoreText,
  DescriptionText,
  EmailText,
  EmptyAbilityListText,
  NameText,
  NamesText,
  RegisterDateText,
  RoleText,
  SurnamesText,
  UserUpdatedAtText,
  UsernameText,
} from '~/constants/strings';
import Alert from '~/components/Alert';
import { Table, type Column } from '~/components/Table';
import type { Ability } from '~/types/ability';
import { formatAsDatetime } from '~/utils/helpers';
const API_URL = import.meta.env.VITE_API_URL;

type Props = {
  onBusyStart?: () => void;
  onBusyEnd?: () => void;
  abilities?: Ability[];
};

export default function ProfileDetail({ onBusyStart, onBusyEnd, abilities }: Props) {
  const { user } = useAuth();

  const columns: Column<Ability>[] = [
    { key: 'name', label: NameText },
    { key: 'description', label: DescriptionText },
  ];
  return (
    <div>
      <div className='flex flex-col items-center'>
        <img
          alt='User Avatar'
          className='rounded-box shadow-lg border-black border rounded-full max-w-[120px]'
          src={
            user?.profilePicture != null
              ? `${API_URL}/storage/profile-picture/${user?.profilePicture}`
              : defaultPfp
          }
          onContextMenu={(e) => e.preventDefault()}
          onError={(e) => {
            if (e.currentTarget.src !== defaultPfp) {
              e.currentTarget.src = defaultPfp;
            }
          }}
        />
        <div className='grid md:grid-cols-2 grid-cols-1 gap-2 mt-4 w-full px-4'>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{NamesText}</legend>
            <Input value={user?.names} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{SurnamesText}</legend>
            <Input value={user?.surnames} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UsernameText}</legend>
            <Input value={user?.username} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{EmailText}</legend>
            <Input value={user?.email} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{RoleText}</legend>
            <Input
              value={user?.role?.name}
              readOnly
              className={`${user?.role?.name?.toUpperCase() === 'ADMINISTRADOR' ? 'text-error font-bold' : ''}`}
            ></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{AssignedStoreText}</legend>
            <Input value={user?.store?.name?.toUpperCase()} readOnly></Input>
          </fieldset>
          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{RegisterDateText}</legend>
            <Input value={formatAsDatetime(user?.createdAt)} readOnly></Input>
          </fieldset>

          <fieldset className='fieldset'>
            <legend className='fieldset-legend'>{UserUpdatedAtText}</legend>
            <Input value={formatAsDatetime(user?.updatedAt)} readOnly></Input>
          </fieldset>
        </div>
        <div className='w-full px-4 mt-2'>
          <Table
            columns={columns}
            data={abilities!}
            size='table-sm'
            showActions={false}
            errorMessage={EmptyAbilityListText}
          ></Table>
        </div>

        <div className='w-full p-4'>
          <Alert type='info' message={AdminAssignedStoreText} className='alert-sm'></Alert>
        </div>
      </div>
    </div>
  );
}

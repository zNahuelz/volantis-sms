import { CreateRoleText } from '~/constants/strings';
import { roleService } from '../services/roleService';
import RoleForm from '../components/RoleForm';

export default function RoleCreateView() {
  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-success border md:w-[1000px]'>
        <div className='bg-linear-to-r from-success to-success/75 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>{CreateRoleText}</h1>
        </div>
        <div className='p-4'>
          <RoleForm onSubmit={(data) => roleService.create(data)}></RoleForm>
        </div>
      </div>
    </div>
  );
}

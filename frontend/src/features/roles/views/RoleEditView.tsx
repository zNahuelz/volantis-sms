import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { useNavigate } from 'react-router';
import { isInteger } from '~/utils/helpers';
import { roleService } from '../services/roleService';
import Loading from '~/components/Loading';
import { EditRoleText, LoadingRoleText, RoleNotFound } from '~/constants/strings';
import RoleForm, { type RoleFormData, type RoleFormProps } from '../components/RoleForm';

export default function RoleEditView() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Partial<RoleFormData> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRole = async () => {
      if (!isInteger(id!)) {
        navigate('/dashboard/role');
      }
      try {
        const res = await roleService.show(Number(id!));

        setRole({
          name: res.name,
          abilities: res.abilities,
          abilitiesIds: res.abilities.map((e) => e.id),
        });
      } catch (error) {
        navigate('/dashboard/role');
      } finally {
        setLoading(false);
      }
    };

    loadRole();
  }, [id]);

  if (loading) {
    return <Loading loadMessage={LoadingRoleText}></Loading>;
  }

  if (!role) {
    return <p className='text-center text-error'>{RoleNotFound}</p>;
  }

  return (
    <div className='md:m-5 md:flex md:flex-col md:items-center'>
      <div className='border-accent border md:w-[1000px]'>
        <div className='bg-linear-to-r from-accent to-accent/70 text-white font-bold text-center md:text-start'>
          <h1 className='p-1 md:ms-3'>
            {EditRoleText} #{id}
          </h1>
        </div>
        <div className='p-4'>
          <RoleForm
            defaultValues={role}
            onSubmit={(data) => roleService.update(Number(id!), data)}
          ></RoleForm>
        </div>
      </div>
    </div>
  );
}

import Input from '~/components/Input';
import {
  CreatedAtText,
  DescriptionText,
  IdTextAlt,
  KeyText,
  UpdatedAtText,
  ValueText,
} from '~/constants/strings';
import type { Setting } from '~/types/setting';
import { formatAsDatetime } from '~/utils/helpers';

interface SettingDetailProps {
  setting?: Setting;
}

export default function SettingDetails({ setting }: SettingDetailProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{IdTextAlt}</legend>
        <Input value={setting.id} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{KeyText}</legend>
        <Input value={setting.key} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{ValueText}</legend>
        <Input value={setting.value} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{DescriptionText}</legend>
        <Input value={setting.description} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{CreatedAtText}</legend>
        <Input value={formatAsDatetime(setting.createdAt)} readOnly></Input>
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend'>{UpdatedAtText}</legend>
        <Input value={formatAsDatetime(setting.updatedAt)} readOnly></Input>
      </fieldset>
    </div>
  );
}

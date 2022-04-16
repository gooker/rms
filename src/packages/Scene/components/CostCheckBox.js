import React, { memo } from 'react';
import { Checkbox } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { CostOptions } from '@/packages/Scene/MapEditor/editorEnums';
import { formatMessage } from '@/utils/util';

const CostCheckBox = (props) => {
  const { value, onChange } = props;
  const plainOptions = [10, 20, 100, 1000];

  const onCheckAllChange = (e) => {
    onChange(e.target.checked ? plainOptions : []);
  };

  const onCheckBoxChange = (list) => {
    onChange(list);
  };

  return (
    <div>
      <Checkbox
        indeterminate={value.length !== 4}
        onChange={onCheckAllChange}
        checked={value.length === 4}
      >
        <FormattedMessage id={'app.common.all'} />
      </Checkbox>
      <br />
      <Checkbox.Group
        value={value}
        onChange={onCheckBoxChange}
        options={CostOptions.map((item) => ({
          ...item,
          label: formatMessage({ id: item.label }),
        }))}
      />
    </div>
  );
};
export default memo(CostCheckBox);

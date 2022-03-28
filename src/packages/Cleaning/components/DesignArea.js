import React, { memo, useState } from 'react';
import { Form, Checkbox, Select } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const DesignArea = (props) => {
  const { value, onChange, functionArea, key } = props;
  const [isDesigne, setIsDesigne] = useState(true);

  function onInputChange(ev, key) {
    const newValue = { ...value, cleanPriority: value?.cleanPriority ?? 5 };
    newValue[key] = ev;
    onChange && onChange(newValue);
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexFlow: 'row nowrap', margin: '3px 0' }} key={key}>
      <Form.Item>
        <Checkbox
          checked={isDesigne}
          onChange={(v) => {
            const flag = v.target.checked;
            if (!flag) {
              onInputChange([], 'area');
            }
            setIsDesigne(flag);
          }}
        >
          <FormattedMessage id={'cleaninCenter.designatedarea'} />
        </Checkbox>
      </Form.Item>

      {isDesigne && (
        <Form.Item>
          <Select
            value={value?.area ?? []}
            mode="tags"
            placeholder={formatMessage({ id: 'cleaningCenter.pleaseSelect' })}
            style={{ width: '250px' }}
            onChange={(values) => {
              onInputChange(values, 'area');
            }}
          >
            {functionArea?.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}
    </div>
  );
};
export default memo(DesignArea);

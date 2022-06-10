import React, { memo } from 'react';
import { Checkbox, Col, Row } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { CostOptions } from '@/packages/Scene/MapEditor/editorEnums';

const CostCheckBox = (props) => {
  const { value, onChange, style = {} } = props;
  const plainOptions = [10, 20, 100, 1000];

  const onCheckAllChange = (e) => {
    onChange(e.target.checked ? plainOptions : []);
  };

  const onCheckBoxChange = (list) => {
    onChange(list);
  };

  return (
    <Row gutter={[0, 14]} style={style}>
      <Col span={24}>
        <Checkbox
          indeterminate={value.length !== 4}
          onChange={onCheckAllChange}
          checked={value.length === 4}
        >
          <FormattedMessage id={'app.common.all'} />
        </Checkbox>
      </Col>
      <Col span={24}>
        <Checkbox.Group style={{ width: '100%' }} value={value} onChange={onCheckBoxChange}>
          <Row gutter={8}>
            {CostOptions.map(({ value, label }, index) => (
              <Col key={index} span={6}>
                <Checkbox value={value}>
                  <FormattedMessage id={label} />
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Col>
    </Row>
  );
};
export default memo(CostCheckBox);

import React, { PureComponent } from 'react';
import { Select, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import commonStyle from '@/common.module.less';
import { isNull } from '@/utils/util';

class SelectTagComponent extends PureComponent {
  render() {
    const { value, currentCellId, icon, onChange } = this.props;
    let newValue = [];
    if (value != null) {
      newValue = value;
    } else {
      newValue = [];
    }

    return (
      <Row gutter={4}>
        <Col span={isNull(icon) ? 21 : 18}>
          <Select
            allowClear
            mode="tags"
            value={newValue}
            notFoundContent={null}
            onChange={(changedValue) => {
              onChange && onChange(changedValue);
            }}
          />
        </Col>
        {!isNull(icon) && (
          <Col span={3} className={commonStyle.flexCenter}>
            {icon}
          </Col>
        )}

        <Col span={3}>
          <Button
            onClick={() => {
              onChange && onChange(currentCellId);
            }}
            disabled={currentCellId.length === 0}
            icon={<PlusOutlined />}
          >
            {/*  */}
          </Button>
        </Col>
      </Row>
    );
  }
}
export default SelectTagComponent;

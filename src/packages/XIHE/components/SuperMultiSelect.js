import React, { PureComponent } from 'react';
import { Select, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import commonStyle from '@/common.module.less';

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
      <Row>
        <Col span={18}>
          <Select
            mode="tags"
            value={newValue}
            onChange={(changedValue) => {
              onChange && onChange(changedValue);
            }}
          />
        </Col>
        <Col span={3} className={commonStyle.flexCenter}>
          {icon || null}
        </Col>
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

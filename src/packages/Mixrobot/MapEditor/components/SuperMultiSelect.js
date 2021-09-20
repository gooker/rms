import React, { PureComponent } from 'react';
import { Select, Row, Col, Button } from 'antd';
import MenuIcon from '@/MenuIcon';

class SelectTagComponent extends PureComponent {
  render() {
    const { value, currentCellId, icon } = this.props;
    let newValue = [];
    if (value != null) {
      newValue = value;
    } else {
      newValue = [];
    }

    return (
      <Row>
        <Col span={17}>
          <Select
            onChange={(changedValue) => {
              const { onChange } = this.props;
              onChange && onChange(changedValue);
            }}
            value={newValue}
            mode="tags"
          />
        </Col>
        <Col span={3} style={{ textAlign: 'center' }}>
          {icon || null}
        </Col>
        <Col span={3} offset={1} style={{ textAlign: 'end' }}>
          <Button
            onClick={() => {
              if (this.props.onChange) {
                this.props.onChange(currentCellId);
              }
            }}
            icon={MenuIcon.plus}
            disabled={currentCellId.length === 0}
          >
            {/* 当前点 */}
          </Button>
        </Col>
      </Row>
    );
  }
}
export default SelectTagComponent;

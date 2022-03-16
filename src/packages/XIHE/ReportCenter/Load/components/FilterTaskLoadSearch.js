import React, { memo, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import HealthCarSearchForm from '../../HealthRobot/components/HealthCarSearchForm';

const FilterTaskLoadSearch = (props) => {
  const { searchChange } = props;

  const [togglesCode, setTogglesCode] = useState(0);

  return (
    <div key="a" style={{ margin: '0 10px' }}>
      {togglesCode === 1 ? (
        <>
          <HealthCarSearchForm type="taskload" key={'2'} search={searchChange} />
          <Row>
            <Col span={24} style={{ padding: '10px 0', borderTop: '1px solid #e8e8e8' }}>
              <Button
                type="text"
                onClick={() => {
                  setTogglesCode(0);
                }}
              >
                <UpOutlined />
                <FormattedMessage id="app.reportCenter.packUp" />
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col span={24}>
            <Button
              type="text"
              style={{ padding: '10px 0' }}
              onClick={() => {
                setTogglesCode(1);
              }}
            >
              <DownOutlined />
              <FormattedMessage id="app.reportCenter.expand" />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};
export default memo(FilterTaskLoadSearch);

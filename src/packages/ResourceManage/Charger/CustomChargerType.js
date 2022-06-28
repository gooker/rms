import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Row, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { findChargerAdapter } from '@/services/resourceService';
import styles from '../Vehicle/vehicle.module.less';
import commonStyle from '@/common.module.less';

const CustomChargerType = (props) => {
  const [loading, setLoading] = useState(false);
  const [datasource, setDatasource] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const response = await findChargerAdapter();
    if (!dealResponse(response)) {
      setDatasource(response);
    }
    setLoading(false);
  }

  return (
    <Spin spinning={loading}>
      <div className={commonStyle.commonPageStyle}>
        <div className={commonStyle.tableToolLeft}>
          <Button type={'primary'} onClick={fetchData}>
            <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
          </Button>
        </div>
        {datasource?.length === 0 && (
          <div className={styles.customVehicleTypesNoData}>
            <Empty />
          </div>
        )}
        {datasource.length > 0 &&
          datasource.map((adapter, index) => (
            <Card
              key={index}
              title={`${formatMessage({ id: 'app.configInfo.header.adapter' })}: ${adapter.name}`}
            >
              {adapter.chargerAdapterTypes?.map((item, innerIndex) => (
                <Card
                  key={innerIndex}
                  type="inner"
                  title={`${formatMessage({ id: 'app.common.name' })}: ${item.name}`}
                  style={innerIndex > 0 ? { marginTop: 16 } : {}}
                >
                  <Row>
                    <Col span={12}>
                      <span>
                        <FormattedMessage id="app.common.type" /> : {item?.type}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        <FormattedMessage id="charger.manufacturer" /> : {item?.manufacturer}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        <FormattedMessage id="charger.maximumCurrent" /> : {item?.maxElectricity}{' '}
                        {'A'}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        <FormattedMessage id="charger.maximumVoltage" /> : {item?.maxVoltage}
                        {'V'}
                      </span>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Card>
          ))}
      </div>
    </Spin>
  );
};
export default memo(CustomChargerType);

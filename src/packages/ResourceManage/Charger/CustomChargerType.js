import React, { memo, useState, useEffect } from 'react';
import { Button, Card, Empty, Row, Col, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { findChargerAdapter } from '@/services/resourceManageAPI';
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
            <Card key={index} title={`适配器: ${adapter.name}`}>
              {adapter.chargerAdapterTypes?.map((item, innerIndex) => (
                <Card
                  key={innerIndex}
                  type="inner"
                  title={`充电桩类型: ${item.name}`}
                  style={innerIndex > 0 ? { marginTop: 16 } : {}}
                >
                  <Row>
                    <Col span={12}>
                      <span>
                        {'类型'}: {item?.type}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        {'厂商'}: {item?.manufacturer}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        最大电流: {item?.maxElectricity} {'A'}
                      </span>
                    </Col>
                    <Col span={12}>
                      <span>
                        {'最大电压'}: {item?.maxVoltage}
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

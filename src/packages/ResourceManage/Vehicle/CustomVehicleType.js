import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Modal, Row, Space, Spin } from 'antd';
import { CopyOutlined, EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleTypeDetail from './components/VehicleTypeDetail';
import { fetchAllAdaptor } from '@/services/resourceService';
import commonStyle from '@/common.module.less';
import styles from './vehicle.module.less';

const CustomVehicleType = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setLoading(true);
    fetchAllAdaptor()
      .then((response) => {
        if (!dealResponse(response)) {
          setDatasource(Object.values(response));
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function checkTypeDetail(adapterType) {
    setVisible(true);
    setDetail(adapterType);
  }

  function renderOthersInfo(adapterType) {
    if (isPlainObject(adapterType?.otherInfo)) {
      return (
        <Row gutter={24}>
          {Object.entries(adapterType.otherInfo).map(([key, value], index) => (
            <Col key={index}>{`${key}: ${value}`}</Col>
          ))}
        </Row>
      );
    }
  }

  return (
    <Spin spinning={loading}>
      <div className={commonStyle.commonPageStyle}>
        <div className={commonStyle.tableToolLeft}>
          <Button type={'primary'} onClick={fetchData}>
            <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
          </Button>
        </div>
        {datasource.length === 0 && (
          <div className={styles.customVehicleTypesNoData}>
            <Empty />
          </div>
        )}
        {datasource.length > 0 &&
          datasource.map(({ adapterType }, index) => (
            <Card
              key={index}
              title={`${formatMessage({ id: 'app.configInfo.header.adapter' })}: ${
                adapterType.name
              }`}
              extra={renderOthersInfo(adapterType)}
            >
              {adapterType.vehicleTypes?.map((vehicleType, innerIndex) => (
                <Card
                  key={innerIndex}
                  type='inner'
                  title={`${formatMessage({ id: 'app.vehicleType' })}: ${vehicleType.name}`}
                  extra={
                    <Space>
                      {vehicleType.isReadOnly ? (
                        <CopyOutlined className={styles.customVehicleTypeToolItem} />
                      ) : (
                        <EditOutlined className={styles.customVehicleTypeToolItem} />
                      )}
                      <EyeOutlined
                        onClick={() => {
                          checkTypeDetail(vehicleType);
                        }}
                        className={styles.customVehicleTypeToolItem}
                        style={{ marginLeft: 8 }}
                      />
                    </Space>
                  }
                  style={innerIndex > 0 ? { marginTop: 16 } : {}}
                >
                  Inner Card content
                </Card>
              ))}
            </Card>
          ))}
      </div>

      <Modal
        visible={visible}
        title={<FormattedMessage id={'app.vehicleType.detail'} />}
        width={'55%'}
        footer={null}
        style={{ top: 20 }}
        onCancel={() => {
          setDetail(null);
          setVisible(false);
        }}
      >
        <VehicleTypeDetail dataSource={detail} />
      </Modal>
    </Spin>
  );
};
export default memo(CustomVehicleType);

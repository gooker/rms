import React, { memo, useState, useEffect } from 'react';
import { Spin, Button, Empty, Row, Col, Space, Card } from 'antd';
import { ReloadOutlined, FormOutlined } from '@ant-design/icons';
import { dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { findAllDeviceTypes } from '@/services/resourceManageAPI';
import EquipmentTypeConfigsModal from './components/EquipmentTypeConfigsModal';
import commonStyle from '@/common.module.less';
import styles from './equip.module.less';

const CustomEquipmentType = () => {
  const [loading, setLoading] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [configVisible, setConfigVisible] = useState(false); //

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    setLoading(true);
    findAllDeviceTypes()
      .then((response) => {
        if (!dealResponse(response)) {
          setDatasource(response);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <Spin spinning={loading}>
      <div className={commonStyle.commonPageStyle}>
        <div className={commonStyle.tableToolLeft}>
          <Button type={'primary'} onClick={fetchData}>
            <ReloadOutlined /> <FormattedMessage id={'app.button.refresh'} />
          </Button>
        </div>
        {datasource.length === 0 && <Empty className={styles.customTypesNoData} />}
        {datasource.length > 0 &&
          datasource.map((deviceType, index) => (
            <Card
              type="inner"
              key={index}
              extra={
                <Space>
                  <FormOutlined
                    className={styles.toolItem}
                    onClick={() => {
                      setConfigVisible(true);
                    }}
                  />
                  {/* <EditOutlined className={styles.toolItem} /> */}
                </Space>
              }
              style={index > 0 ? { marginTop: 16 } : {}}
            >
              <Row>
                <Col span={12}>
                  <span>
                    {'名称'}: {deviceType.name}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    {'code'}: {deviceType.code}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    {'描述'}: {deviceType.desc}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    {'适配器'}: {deviceType.deviceAdapterTypeCode}
                  </span>
                </Col>
              </Row>
            </Card>
          ))}

        {/* 配置设备类型的config */}
        {configVisible && (
          <EquipmentTypeConfigsModal
            visible={configVisible}
            cancelModal={() => {
              setConfigVisible(false);
            }}
          />
        )}
      </div>
    </Spin>
  );
};
export default memo(CustomEquipmentType);

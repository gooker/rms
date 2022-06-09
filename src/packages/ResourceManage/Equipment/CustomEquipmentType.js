import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Col, Empty, Row, Space, Spin, Tooltip } from 'antd';
import { FormOutlined, ReloadOutlined, SnippetsOutlined } from '@ant-design/icons';
import { dealResponse, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { findAllDeviceTypes, saveDeviceTypeActions, saveDeviceTypeConfigs } from '@/services/resourceService';
import EquipmentTypeConfigsModal from './components/EquipmentTypeConfigsModal';
import EquipmentTypeActionsModal from './components/EquipmentTypeActionsModal';
import commonStyle from '@/common.module.less';
import styles from './equip.module.less';

const CustomEquipmentType = () => {
  const [loading, setLoading] = useState(false);
  const [datasource, setDatasource] = useState([]);
  const [currentConfig, setCurrentConfig] = useState(null); //设备类型配置信息
  const [selectedActions, setSelectedActions] = useState({}); // 动作模版
  const [actionsVisible, setActionsVisible] = useState(false); // 动作模版visible

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

  async function onSave(values) {
    const { deviceTypeCode } = currentConfig;
    const response = await saveDeviceTypeConfigs({
      deviceTypeCode,
      keyValue: values,
    });

    if (!dealResponse(response, 1)) {
      setCurrentConfig(null);
      fetchData();
    }
  }

  async function onSubmit(values) {
    const response = await saveDeviceTypeActions(values);
    if (!dealResponse(response, 1)) {
      setSelectedActions({});
      setActionsVisible(false);
      fetchData();
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
        {datasource.length === 0 && <Empty className={styles.customTypesNoData} />}
        {datasource.length > 0 &&
          datasource.map(({ deviceType, deviceActionList, keyValue = {} }, index) => (
            <Card
              type="inner"
              key={index}
              title={deviceType?.name}
              extra={
                <Space>
                  <Tooltip title={'配置信息'}>
                    <FormOutlined
                      className={styles.toolItem}
                      onClick={() => {
                        setCurrentConfig({ deviceTypeCode: deviceType.code, keyValue });
                      }}
                    />
                  </Tooltip>
                  {deviceType?.hasCustomAction && (
                    <Tooltip title={'配置动作'}>
                      <SnippetsOutlined
                        className={styles.toolItem}
                        onClick={() => {
                          setSelectedActions({
                            deviceTypeCode: deviceType.code,
                            deviceActionList,
                          });
                          setActionsVisible(true);
                        }}
                      />
                    </Tooltip>
                  )}
                </Space>
              }
              style={{ margin: '16px 16px 0 0' }}
            >
              <Row>
                <Col span={12}>
                  <span>
                    {'code'}: {deviceType?.code}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    {'描述'}: {deviceType?.desc}
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    {'适配器'}: {deviceType?.deviceAdapterTypeCode}
                  </span>
                </Col>
              </Row>
            </Card>
          ))}

        {/* 配置设备类型的config */}
        {!isNull(currentConfig) && (
          <EquipmentTypeConfigsModal
            data={currentConfig}
            visible={!isNull(currentConfig)}
            cancelModal={() => {
              setCurrentConfig(null);
            }}
            onSubmit={onSave}
          />
        )}

        {/* 配置动作模版 */}
        {actionsVisible && (
          <EquipmentTypeActionsModal
            visible={actionsVisible}
            data={selectedActions}
            onCancel={() => {
              setSelectedActions({});
              setActionsVisible(false);
            }}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </Spin>
  );
};
export default memo(CustomEquipmentType);

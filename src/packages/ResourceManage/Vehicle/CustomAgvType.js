/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Empty, Modal, Space, Spin } from 'antd';
import { CopyOutlined, EyeOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { dealResponse, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import VehicleTypeDetail from './components/VehicleTypeDetail';
import { fetchAllAdaptor } from '@/services/resourceManageAPI';
import styles from './vehicle.module.less';
import commonStyle from '@/common.module.less';
import { AllAdapters } from '@/mockData';

const CustomVehicleType = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [datasource, setDatasource] = useState(Object.values(AllAdapters));
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
              title={`适配器: ${adapterType.name}`}
              extra={
                <>
                  {!isNull(adapterType?.otherInfo?.version) &&
                    `版本:${adapterType?.otherInfo?.version}`}
                </>
              }
            >
              {adapterType.vehicleTypes?.map((vehicleType, innerIndex) => (
                <Card
                  key={innerIndex}
                  type="inner"
                  title={`车辆类型: ${vehicleType.name}`}
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
        title={'车辆类型详情'}
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

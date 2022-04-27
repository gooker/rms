/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Button, Card, Empty, Modal, Space, Spin } from 'antd';
import { CopyOutlined, EyeOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { dealResponse } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAllAdaptor } from '@/services/resourceManageAPI';
import styles from './agv.module.less';
import commonStyle from '@/common.module.less';
import { AllAdapters } from '@/mockData';
import AgvTypeDetail from '@/packages/ResourceManage/Agv/components/AgvTypeDetail';

const CustomAgvType = (props) => {
  const {} = props;

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
        // setDatasource(Object.values(AllAdapters));
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
          <div className={styles.customAgvTypesNoData}>
            <Empty />
          </div>
        )}
        {datasource.length > 0 &&
          datasource.map(({ adapterType }, index) => (
            <Card key={index} title={adapterType.name}>
              {adapterType.agvTypes?.map((agvType, innerIndex) => (
                <Card
                  key={innerIndex}
                  type='inner'
                  title={agvType.name}
                  extra={
                    <Space>
                      {agvType.isReadOnly ? (
                        <CopyOutlined className={styles.customAgvTypeToolItem} />
                      ) : (
                        <EditOutlined className={styles.customAgvTypeToolItem} />
                      )}
                      <EyeOutlined
                        onClick={() => {
                          checkTypeDetail(agvType);
                        }}
                        className={styles.customAgvTypeToolItem}
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
        <AgvTypeDetail dataSource={detail} />
      </Modal>
    </Spin>
  );
};
export default memo(CustomAgvType);

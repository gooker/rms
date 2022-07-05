import React, { memo } from 'react';
import { Modal, Progress, Table, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import { VehicleUpgradeState } from '@/packages/ResourceManage/Vehicle/upgradeConst';

const UpgradeVehicleModal = (props) => {
  const { visible, onCancel, upgradeOrder } = props;

  const columns = [
    {
      title: '批次',
      render: (text, record, index) => index + 1,
      align: 'center',
    },
    {
      title: '固件',
      dataIndex: 'hardware',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      dataIndex: 'creatTime',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.creator' }),
      dataIndex: 'creatUser',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      dataIndex: 'updateTime',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.updater' }),
      dataIndex: 'updateUser',
      align: 'center',
    },
    {
      title: '下载进度',
      dataIndex: 'state',
      align: 'center',
      render: (text, record) => {
        if (text === VehicleUpgradeState.downloading) {
          return <Progress type="circle" width={40} percent={getOrderProgress(record)} />;
        } else {
          return <Typography.Link>开始升级</Typography.Link>;
        }
      },
    },
  ];

  function getOrderProgress(record) {
    const { vehicles } = record;
    const done = vehicles.filter((item) =>
      [VehicleUpgradeState.ready, VehicleUpgradeState.downloadFail].includes(item.state),
    );
    return Math.trunc((done.length / vehicles.length) * 100);
  }

  function expandedRowRender(record) {
    if (Array.isArray(record.vehicles)) {
      return (
        <div>
          {record.vehicles.map((item) => {
            if (item.state === VehicleUpgradeState.downloading) {
              return (
                <Tag icon={<SyncOutlined spin />} color="processing">
                  [{item.id}]: 下载中
                </Tag>
              );
            }
            if (item.state === VehicleUpgradeState.ready) {
              return (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  [{item.id}]: 下载完成
                </Tag>
              );
            }
            if (item.state === VehicleUpgradeState.downloadFail) {
              return (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  [{item.id}]: 下载失败
                </Tag>
              );
            }
            if (item.state === VehicleUpgradeState.upgradeSuccess) {
              return (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  [{item.id}]: 升级成功
                </Tag>
              );
            }
            if (item.state === VehicleUpgradeState.upgradeFail) {
              return (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  [{item.id}]: 升级失败
                </Tag>
              );
            }
          })}
        </div>
      );
    }
  }

  return (
    <>
      <Modal
        title={formatMessage({ id: 'hardware.upgrading' })}
        width={'80vw'}
        style={{ maxWidth: 1300, top: 30 }}
        bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
        visible={visible}
        maskClosable={false}
        footer={null}
        onCancel={onCancel}
      >
        <Table
          columns={columns}
          dataSource={upgradeOrder}
          rowKey={({ id }) => id}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.vehicles.length > 0,
          }}
        />
      </Modal>
    </>
  );
};
export default connect(({ vehicleList }) => ({
  upgradeOrder: vehicleList.upgradeOrder,
}))(memo(UpgradeVehicleModal));

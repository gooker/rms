/*TODO：I18N**/
import React, { memo, useEffect, useState } from 'react';
import { Modal, Popconfirm, Table, Tag, Typography } from 'antd';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchVehicleUpgradeList } from '@/services/resourceService';

const UpgradeHistoryModal = (props) => {
  const { visible, onCancel, selectedRows } = props;
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    if (visible) {
      init();
    }
  }, [visible]);

  async function init() {
    const { vehicleId, vehicleType } = selectedRows[0];
    const response = await fetchVehicleUpgradeList({ vehicleId, vehicleType });
    if (!dealResponse(response)) {
      setHistoryList(response);
    }
  }

  const columns = [
    {
      title: <FormattedMessage id="firmdware.fileName" />,
      dataIndex: 'firmwareName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="firmdware.file.version" />,
      dataIndex: 'versionNumber',
      align: 'center',
    },
    {
      title: <FormattedMessage id="vehicle.id" />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'vehicleFileTaskType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.status" />,
      dataIndex: 'fileStatus',
      align: 'center',
      render: (text, record) => {
        if (text === '2') {
          return (
            <Tag color="error">
              <FormattedMessage id="app.common.failed" />
            </Tag>
          );
        }
        if (text === '0') {
          return (
            <Tag color="#87d068">
              <FormattedMessage id="app.common.success" />
            </Tag>
          );
        }
        return (
          <Tag color="#108ee9">
            {record.vehicleFileTaskType === 'DOWNLOAD' ? (
              <FormattedMessage id={'firmdware.inDownloading'} />
            ) : (
              <FormattedMessage id={'firmdware.restarting'} />
            )}
          </Tag>
        );
      },
    },
    {
      title: formatMessage({ id: 'app.common.creationTime' }),
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return (
    <Modal
      visible={visible}
      title={formatMessage({ id: 'firmdware.upgrade.history' })}
      width={750}
      maskClosable={false}
      footer={null}
      onCancel={onCancel}
    >
      <Table
        bordered
        rowKey={(record, index) => index}
        columns={columns}
        dataSource={historyList}
        pagination={false}
      />
    </Modal>
  );
};
export default memo(UpgradeHistoryModal);

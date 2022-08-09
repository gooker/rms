import React, { memo } from 'react';
import { Button, Typography } from 'antd';
import { connect } from '@/utils/RmsDva';
import { convertToUserTimezone, formatMessage, isNull } from '@/utils/util';
import CommonModal from '@/components/CommonModal';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import { SourceLockCategory } from './SourceLockPanel';

const SourceLockDetailModal = (props) => {
  const { dispatch, mapRef, visible, sourceLock } = props;

  const { category, lockList } = sourceLock;

  function getTitle() {
    if (visible) {
      return formatMessage({ id: `menu.resourceLock.${category}` });
    }
  }

  function onCancel() {
    dispatch({
      type: 'monitorView/saveSourceLock',
      payload: null,
    });
  }

  function deleteSourceLock(record) {
    console.log(record);
  }

  function getColumns() {
    if (category === SourceLockCategory.targetLock) {
      return {
        columns: [
          {
            title: formatMessage({ id: 'app.map.cell' }),
            dataIndex: 'cellId',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'vehicle.id' }),
            dataIndex: 'vehicleId',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'app.task.id' }),
            dataIndex: 'taskId',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'app.common.operation' }),
            align: 'center',
            render: (text, record) => (
              <Typography.Link
                onClick={() => {
                  deleteSourceLock(record);
                }}
              >
                <FormattedMessage id={'app.button.delete'} />
              </Typography.Link>
            ),
          },
        ],
        expandColumns: [
          {
            title: formatMessage({ id: 'app.vehicleType' }),
            dataIndex: 'vehicleType',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'monitor.sourceLock.lockTime' }),
            dataIndex: 'lockedTimestamp',
            align: 'center',
            render: (lockedTimestamp) =>
              convertToUserTimezone(lockedTimestamp).format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      };
    }
    if (category === SourceLockCategory.storageLock) {
      return {
        columns: [
          {
            title: formatMessage({ id: 'app.map.cell' }),
            dataIndex: 'cellId',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'resource.load.id' }),
            dataIndex: 'loadId',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'app.common.operation' }),
            align: 'center',
            render: (text, record) => (
              <Typography.Link
                onClick={() => {
                  deleteSourceLock(record);
                }}
              >
                <FormattedMessage id={'app.button.delete'} />
              </Typography.Link>
            ),
          },
        ],
        expandColumns: [
          {
            title: formatMessage({ id: 'resource.load.type' }),
            dataIndex: 'loadType',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'resource.storage.code' }),
            dataIndex: 'storeCode',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'monitor.sourceLock.lockTime' }),
            dataIndex: 'lockedTimestamp',
            align: 'center',
            render: (lockedTimestamp) =>
              convertToUserTimezone(lockedTimestamp).format('YYYY-MM-DD HH:mm:ss'),
          },
        ],
      };
    }
  }

  return (
    <CommonModal
      title={getTitle()}
      visible={visible}
      width={700}
      footer={[
        <Button key={'close'} type={'primary'} onClick={onCancel}>
          <FormattedMessage id={'app.button.turnOff'} />
        </Button>,
      ]}
    >
      <TableWithPages
        pagination={false}
        {...getColumns()}
        footer={null}
        dataSource={lockList}
        rowKey={({ key }) => key}
      />
    </CommonModal>
  );
};
export default connect(({ monitor, monitorView }) => ({
  mapRef: monitor.mapContext,
  sourceLock: monitorView.sourceLock ?? {},
  visible: !isNull(monitorView.sourceLock),
}))(memo(SourceLockDetailModal));

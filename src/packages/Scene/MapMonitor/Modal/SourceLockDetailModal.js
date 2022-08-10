import React, { memo, useEffect, useState } from 'react';
import { Button, message, Typography } from 'antd';
import { connect } from '@/utils/RmsDva';
import { convertToUserTimezone, dealResponse, formatMessage, isNull } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import CommonModal from '@/components/CommonModal';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import { SourceLockCategory } from './SourceLockPanel';
import {
  batchDeletePodTaskLock,
  batchDeleteStorageLock,
  fetchBatchDeleteTargetCellLock,
  fetchLoadTaskLockList,
  fetchStorageLockList,
  fetchTargetCellLockList,
} from '@/services/commonService';

const SourceLockDetailModal = (props) => {
  const { mapRef, dispatch, visible, sourceLock } = props;
  const { category, lockList } = sourceLock;

  const [datasource, setDatasource] = useState([]);

  useEffect(() => {
    if (visible) {
      setDatasource(lockList);
    }
  }, [visible]);

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
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        let response;
        if (category === SourceLockCategory.targetLock) {
          response = await fetchBatchDeleteTargetCellLock([record]);
        } else if (category === SourceLockCategory.storageLock) {
          response = await batchDeleteStorageLock([record]);
        } else {
          response = await batchDeletePodTaskLock([record]);
        }
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          // 更新表格数据
          setDatasource(datasource.filter((item) => item !== record));
          // 刷新地图锁格显示
          refreshLock();
        } else {
          message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        }
      },
    });
  }

  async function refreshLock() {
    let response;
    switch (category) {
      case SourceLockCategory.targetLock: {
        response = await fetchTargetCellLockList();
        break;
      }
      case SourceLockCategory.loadLock: {
        response = await fetchLoadTaskLockList();
        break;
      }
      default: {
        response = await fetchStorageLockList();
      }
    }
    if (!dealResponse(response)) {
      response = response.map((item, index) => ({ ...item, key: index }));
      mapRef.renderSourceLock(category, response);
    }
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
    if (category === SourceLockCategory.loadLock) {
      return {
        columns: [
          {
            title: formatMessage({ id: 'resource.load.id' }),
            dataIndex: 'loadId',
            align: 'center',
          },
          {
            title: formatMessage({ id: 'resource.load.type' }),
            dataIndex: 'loadType',
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
            title: formatMessage({ id: 'app.task.id' }),
            dataIndex: 'taskId',
            align: 'center',
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
        dataSource={datasource}
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

import React, { memo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { convertToUserTimezone, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import TableWithPages from '@/components/TableWithPages';
import styles from '../../monitorLayout.module.less';

const width = 600;
const height = 500;
const alertLevel = { ERROR: '#f50', WARN: 'gold', INFO: '#108ee9' };

const EmptyRun = (props) => {
  const { dispatch, vehicleAlarmList } = props;

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  const column = [
    {
      title: <FormattedMessage id="app.alarmCenter.code" />,
      dataIndex: 'alertCode',
      fixed: 'left',
    },

    { title: <FormattedMessage id="app.map.cell" />, dataIndex: 'cellId' },

    {
      title: <FormattedMessage id="app.alarmCenter.alertName" />,
      dataIndex: 'alertNameI18NKey',
    },
    {
      title: <FormattedMessage id="app.alarmCenter.alertContent" />,
      dataIndex: 'alertContentI18NKey',
      fixed: 'right',
    },
  ];

  const expandColumns = [
    {
      title: <FormattedMessage id="app.alarmCenter.level" />,
      dataIndex: 'alertItemLevel',
      render: (text) => {
        if (!isNull(text)) {
          return <span style={{ color: alertLevel[text] }}>{text}</span>;
        }
      },
    },
    {
      title: <FormattedMessage id="app.alarmCenter.count" />,
      dataIndex: 'alertCount',
      render: (text) => text || '-',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'alertItemType',
      render: (text) => text || '-',
    },
    {
      title: <FormattedMessage id="app.common.firstTime" />,
      dataIndex: 'createTime',
      render: (text) => {
        if (!isNull(text)) {
          return convertToUserTimezone(text).format('YYYY/MM/DD HH:mm:ss');
        }
      },
    },
  ];

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        right: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'app.alarmCenter.alert'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <TableWithPages
          columns={column}
          expandColumns={expandColumns}
          dataSource={vehicleAlarmList}
          rowKey={(_, index) => index}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};
export default connect(({ monitorView }) => ({
  vehicleAlarmList: monitorView.vehicleAlarmList,
}))(memo(EmptyRun));

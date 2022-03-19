import React, { memo, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import EStopOperation from './EStopOperation';
import EStopList from './EStopList';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../monitorLayout.module.less';
import EStopLog from '@/packages/Scene/MapMonitor/Modal/EmergencyStopModal/EStopLog';

const height = 600;
const width = 770;
const TabSelectedStyle = {
  background: 'rgba(8, 8, 8, 0.2)',
  borderBottom: '1px solid #1890ff',
};

const EmergencyManagerModal = (props) => {
  const { dispatch } = props;

  const [activeTab, setActiveTab] = useState('operation');

  const TabCollection = [
    {
      value: 'operation',
      label: <FormattedMessage id={'app.common.operation'} />,
    },
    {
      value: 'list',
      label: <FormattedMessage id={'app.common.list'} />,
    },
    {
      value: 'log',
      label: <FormattedMessage id={'editor.tools.history'} />,
    },
  ];

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.estop.manager'} />
        <CloseOutlined style={{ cursor: 'pointer' }} onClick={close} />
      </div>
      <div style={{ display: 'flex', height: '40px' }}>
        {TabCollection.map(({ value, label }) => (
          <span
            key={value}
            className={styles.monitorModalTab}
            onClick={() => setActiveTab(value)}
            style={{ ...(activeTab === value ? TabSelectedStyle : {}) }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className={styles.monitorModalBody}>
        {activeTab === 'operation' && <EStopOperation />}
        {activeTab === 'list' && <EStopList />}
        {activeTab === 'log' && <EStopLog />}
      </div>
    </div>
  );
};
export default memo(EmergencyManagerModal);

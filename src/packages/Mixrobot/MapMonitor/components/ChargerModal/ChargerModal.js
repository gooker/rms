import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/dva';
import { formatMessage } from '@/utils/utils';
import { dealResponse, isNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { UseMonitorModalSize } from '@/customHooks';
import ChargerRealTimeTab from './ChargerRealTimeTab';
import ChargerBindTab from './ChargerBindTab';
import ChargerActionTab from './ChargerActionTab';
import { fetchChargerState } from '@/services/mixrobot';
import commonStyle from '@/common.module.less';

const TabCollection = [
  {
    value: 'realTime',
    label: 'app.monitor.modal.charger.realTime',
  },
  {
    value: 'binding',
    label: 'app.monitor.modal.charger.binding',
  },
  {
    value: 'action',
    label: 'app.monitor.tab.operation',
  },
];
const TabSelectedStyle = {
  background: 'rgba(0, 0, 0, 0.2)',
  borderBottom: '1px solid #1890ff',
};

const ChargerModal = (props) => {
  const { name, mapId } = props;
  const [width, height] = UseMonitorModalSize();
  const [activeTab, setActiveTab] = useState('realTime');
  const [chargerRealtime, setChargerRealtime] = useState(null);

  useEffect(() => {
    refreshRealtime();
  }, [name]);

  async function refreshRealtime() {
    const response = await fetchChargerState({ mapId, name });
    if (!dealResponse(response)) {
      setChargerRealtime(response);
    }
  }

  function generateTitle() {
    if (chargerRealtime) {
      const { hardwareId, name } = chargerRealtime;
      if (isNull(hardwareId)) {
        return `${name} [${formatMessage({ id: 'app.monitor.modal.charger.virtual' })}]`;
      }
      return name;
    }
    return formatMessage({ id: 'app.monitor.modal.AGV.tip.loading' });
  }

  return (
    <div
      className={commonStyle.checkModal}
      style={{
        left: `calc(50% - ${width / 2}px)`,
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div className={commonStyle.header}>
        <div className={commonStyle.title}>{generateTitle()}</div>
      </div>
      <div style={{ display: 'flex', height: '40px' }}>
        {TabCollection.map(({ value, label }) => (
          <span
            key={value}
            className={commonStyle.tab}
            onClick={() => setActiveTab(value)}
            style={{ ...(activeTab === value ? TabSelectedStyle : {}) }}
          >
            <FormattedMessage id={label} />
          </span>
        ))}
      </div>
      <div className={commonStyle.body}>
        {activeTab === 'realTime' && <ChargerRealTimeTab data={chargerRealtime} />}
        {activeTab === 'binding' && (
          <ChargerBindTab mapId={mapId} data={chargerRealtime} refresh={refreshRealtime} />
        )}
        {activeTab === 'action' && (
          <ChargerActionTab data={chargerRealtime} refresh={refreshRealtime} />
        )}
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  mapId: monitor.currentMap?.id,
}))(memo(ChargerModal));

import React, { Component } from 'react';
import { find } from 'lodash';
import ActionTab from './ActionTab';
import TaskTab from './TaskTab';
import ControllerTab from './ControllerTab';
import ErrorTab from './ErrorTab';
import AgvRunninInfo from './AgvRunninInfo';
import ToteBinTab from './ToteBinTab';
import TotePoolTab from './TotePoolTab';
import ForkBin from './ForkBin';
import { formatMessage } from '@/utils/utils';
import { UseMonitorModalSize } from '@/customHooks';
import { hasPermission } from '@/utils/Permission';
import { AppCode } from '@/config/config';
import commonStyle from '@/common.module.less';

const TabSelectedStyle = {
  background: 'rgba(0, 0, 0, 0.2)',
  borderBottom: '1px solid #1890ff',
};

class AgvModal extends Component {
  sectionId = window.localStorage.getItem('sectionId');

  state = {
    activeTab: null,
    grantedTabs: [],
  };

  componentDidMount() {
    const TabCollection = [
      {
        value: 'action',
        label: formatMessage({ id: 'app.monitor.modal.AGV.action' }),
        authKey: '/map/monitor/agvModal/operation',
        agvType: 'ALL',
      },
      {
        value: 'task',
        label: formatMessage({ id: 'app.monitor.modal.AGV.task' }),
        authKey: '/map/monitor/agvModal/task',
        agvType: 'ALL',
      },
      {
        value: 'controller',
        label: formatMessage({ id: 'app.monitor.modal.AGV.controller' }),
        authKey: '/map/monitor/agvModal/controller',
        agvType: ['LatentLifting'],
      },
      {
        value: 'error',
        label: formatMessage({ id: 'app.monitor.modal.AGV.error' }),
        authKey: '/map/monitor/agvModal/error',
        agvType: 'ALL',
      },
      {
        value: 'runningInfo',
        label: formatMessage({ id: 'app.monitor.modal.AGV.runningInfo' }),
        authKey: '/map/monitor/agvModal/runningInfo',
        agvType: 'ALL',
      },
      {
        value: 'toteBin',
        label: formatMessage({ id: 'app.monitor.modal.AGV.toteBin' }),
        authKey: '/map/monitor/agvModal/toteBin',
        agvType: ['Tote'],
      },
      {
        value: 'totePoolTask',
        label: formatMessage({ id: 'app.monitor.modal.AGV.totePoolTask' }),
        authKey: '/map/monitor/agvModal/totePoolTask',
        agvType: ['Tote'],
      },
      {
        value: 'forkBin',
        label: formatMessage({ id: 'app.monitor.modal.AGV.forkBin' }),
        authKey: '/map/monitor/agvModal/forkBin',
        agvType: ['ForkLifting'],
      },
    ];
    // @权限控制
    const grantedTabs = TabCollection.filter((item) => hasPermission(item.authKey));
    if (grantedTabs.length > 0) {
      this.setState({ activeTab: grantedTabs[0].value });
    }
    this.setState({ grantedTabs });
  }

  generateTitle = () => {
    const { agv } = this.props;
    const { agvId, agvType } = JSON.parse(agv);
    const TypeNameMapping = {
      [AppCode.LatentLifting]: formatMessage({ id: 'app.monitor.modal.AGV.latent' }),
      [AppCode.Tote]: formatMessage({ id: 'app.monitor.modal.AGV.tote' }),
      [AppCode.ForkLifting]: formatMessage({ id: 'app.monitor.modal.AGV.fork' }),
      [AppCode.Sorter]: formatMessage({ id: 'app.monitor.modal.AGV.sorter' }),
    };
    return (
      <span
        onClick={this.openAgvDetailPage}
        style={{ cursor: 'pointer' }}
      >{`${TypeNameMapping[agvType]}  #${agvId}`}</span>
    );
  };

  switchTab = (tab) => {
    this.setState({ activeTab: tab });
  };

  openAgvDetailPage = () => {
    const { agv } = this.props;
    const { agvId, agvType } = JSON.parse(agv);
    const appContext = AppCode[agvType];
    const grantedAppStr = window.localStorage.getItem('grantedAPP') ?? [];
    const grantedApp = JSON.parse(grantedAppStr);
    if (grantedApp && Array.isArray(grantedApp)) {
      const app = find(grantedApp, { name: appContext });
      if (app) {
        const route = `${app.entry}/car/activityLogging?agvId=${agvId}&sectionId=${this.sectionId}`;
        window.parent.postMessage({ type: 'add_tab', payload: route }, '*');
      }
    }
  };

  render() {
    const { activeTab, grantedTabs } = this.state;
    const { agv } = this.props;
    const [width, height] = UseMonitorModalSize();

    // 根据小车类型对Tab再做一次筛选
    const { agvType } = JSON.parse(agv);
    const _grantedTabs = grantedTabs.filter(
      (item) => item.agvType === 'ALL' || item.agvType.includes(agvType),
    );
    return (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          left: `calc(50% - ${width / 2}px)`,
        }}
        className={commonStyle.checkModal}
      >
        <div className={commonStyle.header}>
          <div className={commonStyle.title} style={{ color: 'rgb(24, 144, 255)' }}>
            {this.generateTitle()}
          </div>
        </div>
        <div style={{ display: 'flex', height: '40px' }}>
          {_grantedTabs.map(({ value, label }) => (
            <span
              key={value}
              className={commonStyle.tab}
              onClick={() => this.switchTab(value)}
              style={{ ...(activeTab === value ? TabSelectedStyle : {}) }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className={commonStyle.body}>
          {activeTab === 'action' && <ActionTab agv={agv} sectionId={this.sectionId} />}
          {activeTab === 'task' && <TaskTab agv={agv} sectionId={this.sectionId} />}
          {activeTab === 'controller' && <ControllerTab agv={agv} sectionId={this.sectionId} />}
          {activeTab === 'error' && <ErrorTab agv={agv} sectionId={this.sectionId} />}
          {activeTab === 'runningInfo' && <AgvRunninInfo agv={agv} />}
          {activeTab === 'toteBin' && <ToteBinTab agv={agv} />}
          {activeTab === 'totePoolTask' && <TotePoolTab agv={agv} />}
          {activeTab === 'forkBin' && <ForkBin agv={agv} />}
        </div>
      </div>
    );
  }
}
export default AgvModal;

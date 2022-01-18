import React, { useState, memo } from 'react';
import HealthCarSearchForm from './components/HealthCarSearchForm';
import {
  getScanCodedata,
  getRobotOfflinedata,
  getRobotFaultdata,
  getRobotStatuserrordata,
} from './components/mockRobotData';
import ScanCodeComponent from './RobotScanCodeTab';
import RobotOfflineComponent from './RobotOfflineTab';
import RobotFaultComponent from './RobotFaultTab';
import RobotStatusErrorTab from './RobotStatusErrorTab';
import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';
import { getContentHeight } from '@/utils/utils';

const TabCollection = [
  {
    value: 'scan',
    label: '小车扫码',
  },
  {
    value: 'offline',
    label: '小车离线',
  },
  {
    value: 'statuserror',
    label: '状态错误',
  },
  {
    value: 'fault',
    label: '小车故障',
  },
];
const TabSelectedStyle = {
  color: '#1890ff',
  borderBottom: '2px solid #1890ff',
};

const HealthCar = (props) => {
  const [scanOriginData, setScanOriginData] = useState({}); // 原始数据 小车扫码
  const [offlineOriginData, setOfflineOriginData] = useState({}); // 原始数据 小车离线
  const [statuserrorOriginData, setStatuserrorOriginData] = useState({}); // 原始数据 状态错误
  const [faultOriginData, setFaultOriginData] = useState({}); // 原始数据 小车故障

  const [activeTab, setActivieTab] = useState('scan');

  // 搜索 调接口
  function submitSearch(value) {
    // TODO 调接口
    setScanOriginData(getScanCodedata());
    setOfflineOriginData(getRobotOfflinedata());
    setStatuserrorOriginData(getRobotStatuserrordata());
    setFaultOriginData(getRobotFaultdata());
    // formRef.current.clearForm();
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <HealthCarSearchForm search={submitSearch} />
      </div>

      <div style={{ display: 'flex', height: '40px' }}>
        {TabCollection.map(({ value, label }) => (
          <span
            key={value}
            className={style.tab}
            onClick={() => setActivieTab(value)}
            style={{ ...(activeTab === value ? TabSelectedStyle : {}) }}
          >
            {label}
          </span>
        ))}
      </div>
      <div className={style.body}>
        {activeTab === 'scan' && <ScanCodeComponent originData={scanOriginData} />}
        {activeTab === 'offline' && <RobotOfflineComponent originData={offlineOriginData} />}
        {activeTab === 'statuserror' && <RobotStatusErrorTab originData={statuserrorOriginData} />}
        {activeTab === 'fault' && <RobotFaultComponent originData={faultOriginData} />}
      </div>
    </div>
  );
};
export default memo(HealthCar);

import React, { useState, memo, useRef } from 'react';
import HealthCarSearchForm from './components/HealthCarSearchForm';
import { getScanCodedata, getRobotOfflinedata } from './components/mockRobotData';
import ScanCodeComponent from './RobotScanCodeTab';
import RobotOfflineComponent from './RobotOfflineTab';
import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';

const TabCollection = [
  {
    value: 'scancar',
    label: '小车扫码',
  },
  {
    value: 'offlinecar',
    label: '小车离线',
  },
  {
    value: 'statuscar',
    label: '状态错误',
  },
  {
    value: 'faultcar',
    label: '小车故障',
  },
];
const TabSelectedStyle = {
  color: '#1890ff',
  borderBottom: '2px solid #1890ff',
};

const HealthCar = (props) => {
  const [scanCarOriginData, setScanCarOriginData] = useState({}); // 原始数据 小车扫码
  const [offlineCarOriginData, setOfflineCarOriginData] = useState({}); // 原始数据 小车离线
  const [statusCarOriginData, setStatusCarOriginData] = useState({}); // 原始数据 状态错误
  const [faultCarOriginData, setFaultCarOriginData] = useState({}); // 原始数据 小车故障

  const [activeTab, setActivieTab] = useState('scancar');
  const formRef = useRef(null);

  // 搜索 调接口
  function submitSearch(value) {
    // TODO 调接口
    setScanCarOriginData(getScanCodedata());
    setOfflineCarOriginData(getRobotOfflinedata());
    // setStatusCarOriginData(statusCarData);
    // setFaultCarOriginData(faultCarData);
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
        {activeTab === 'scancar' && (
          <ScanCodeComponent originData={scanCarOriginData} ref={formRef} />
        )}
        {activeTab === 'offlinecar' && <RobotOfflineComponent originData={offlineCarOriginData} />}
      </div>
    </div>
  );
};
export default memo(HealthCar);

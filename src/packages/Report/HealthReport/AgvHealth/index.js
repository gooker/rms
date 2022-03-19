import React, { useState, memo, useEffect } from 'react';
import HealthCarSearchForm from '../../components/HealthCarSearchForm';
import moment from 'moment';
import XLSX from 'xlsx';
import { getDatBysortTime } from '@/packages/Report/components/GroundQrcodeEcharts';
import { forIn, sortBy } from 'lodash';
import { fetchAGVHealth } from '@/services/api';
import { isStrictNull, convertToUserTimezone, dealResponse, formatMessage, isNull } from '@/utils/util';
import ScanCodeComponent from './RobotScanCodeTab';
import AgvOfflineComponent from './RobotOfflineTab';
import RobotFaultComponent from './RobotFaultTab';
import AgvErrorComponent from './RobotStatusErrorTab';
import commonStyles from '@/common.module.less';
import style from '../../report.module.less';

const colums = {
  agvId: formatMessage({ id: 'app.agv' }),
  time: formatMessage({ id: 'app.time' }),
};

const TabCollection = [
  {
    value: 'scan',
    label: formatMessage({ id: 'reportCenter.agv.scancode' }),
  },
  {
    value: 'offline',
    label: formatMessage({ id: 'reportCenter.agv.offline' }),
  },
  {
    value: 'statuserror',
    label: formatMessage({ id: 'reportCenter.agv.error' }),
  },
  {
    value: 'fault',
    label: formatMessage({ id: 'reportCenter.agv.fault' }),
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

  const [keyCodeData, setKeyCodeData] = useState({}); // 扫码 - {key:value}
  // TODO: 获取所有故障号以及对应的翻译
  const [keyFaultData, setKeyFaultData] = useState({}); // 故障key - {key:value}

  const [keyOfflineData, setKeyOfflineData] = useState({}); // 离线key - {key:value}
  const [keyErrorData, setKeyErrorData] = useState({}); // 状态错误key - {key:value}

  const [activeTab, setActivieTab] = useState('scan');

  useEffect(() => {
    async function initCodeData() {
      const startTime = convertToUserTimezone(moment()).format('YYYY-MM-DD HH:00:00');
      const endTime = convertToUserTimezone(moment()).format('YYYY-MM-DD HH:mm:ss');
      submitSearch({ startTime, endTime, agvSearch: { type: 'AGV_ID', code: [] } });
    }
    initCodeData();
  }, []);

  // 调整故障数据
  function generateFaultData(data) {
    const newData = { ...data };
    Object.values(newData).forEach((record) => {
      record?.forEach((item) => {
        return { ...item, ...item.errorCodeMap };
      });
    });
    console.log('current', data);
    console.log('new', newData);
  }

  // 获取所有的故障key
  function getFaultKey(data) {
    const resultMap = {};
    const currentRusult = [...data].sort((a, b) => a - b);
    currentRusult.map((item) => {
      resultMap[item] = item;
    });
    return resultMap;
  }

  function getOfflineKey() {
    return {
      offlineTime: formatMessage({ id: 'reportCenter.offlineTime' }),
      offlineTimes: formatMessage({ id: 'reportCenter.offlineTimes' }),
    };
  }

  function getErrorKey() {
    return {
      errorTime: formatMessage({ id: 'reportCenter.offlineTime' }),
      errorTimes: formatMessage({ id: 'reportCenter.offlineTimes' }),
    };
  }

  // 搜索 调接口
  async function submitSearch(value) {
    const {
      startTime,
      endTime,
      agvSearch: { code: agvSearchTypeValue, type: agvSearchType },
    } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      const response = await fetchAGVHealth({
        startTime,
        endTime,
        agvSearchTypeValue,
        agvSearchType,
      });
      if (!dealResponse(response)) {
        const newCode = getDatBysortTime(response?.code ?? {});
        const newOffline = getDatBysortTime(response?.offline ?? {});
        const newError = getDatBysortTime(response?.error ?? {});
        const newMalfunction = getDatBysortTime(response?.malfunction ?? {});

        setScanOriginData(newCode);
        setOfflineOriginData(newOffline);
        setStatuserrorOriginData(newError);
        setFaultOriginData(newMalfunction);

        setKeyCodeData(response?.codeTranslate ?? {});
        setKeyFaultData(getFaultKey(response?.errorCode ?? {})); // // 获取返回的故障码key;
        setKeyOfflineData(getOfflineKey());
        setKeyErrorData(getErrorKey());
      }
    }
  }

  function generateEveryType(data, keyMap) {
    const typeResult = [];
    Object.entries(data).forEach(([key, typeData]) => {
      if (!isStrictNull(typeData)) {
        typeData.forEach((record) => {
          let currentTime = {};
          let _record = { ...record };
          currentTime.agvId = record.agvId;
          currentTime[colums.time] = key;
          if (record?.robotType) {
            currentTime.robotType = formatMessage({ id: `app.app.module.${record.robotType}` });
          }

          forIn(_record, (value, parameter) => {
            if (!isNull(keyMap[parameter])) {
              currentTime[keyMap[parameter]] = value;
            }
          });
          typeResult.push(currentTime);
        });
      }
    });
    return sortBy(typeResult, 'agvId');
  }

  // 下载数据
  function exportData() {
    const wb = XLSX.utils.book_new(); /*新建book*/

    const code = XLSX.utils.json_to_sheet(generateEveryType(scanOriginData, keyCodeData));
    const offline = XLSX.utils.json_to_sheet(generateEveryType(offlineOriginData, keyOfflineData));
    const error = XLSX.utils.json_to_sheet(generateEveryType(statuserrorOriginData, keyErrorData));
    const fault = XLSX.utils.json_to_sheet(generateEveryType(faultOriginData, keyFaultData));

    XLSX.utils.book_append_sheet(wb, code, formatMessage({ id: 'reportCenter.agv.scancode' }));
    XLSX.utils.book_append_sheet(wb, offline, formatMessage({ id: 'reportCenter.agv.offline' }));
    XLSX.utils.book_append_sheet(wb, error, formatMessage({ id: 'reportCenter.agv.error' }));
    XLSX.utils.book_append_sheet(wb, fault, formatMessage({ id: 'reportCenter.agv.fault' }));
    XLSX.writeFile(wb, `${formatMessage({ id: 'menu.reportCenter.healthRobot' })}.xlsx`);
  }
  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <HealthCarSearchForm search={submitSearch} downloadVisible={true} exportData={exportData} />
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
        {activeTab === 'scan' && (
          <ScanCodeComponent
            originData={scanOriginData}
            keyDataMap={keyCodeData}
            activeTab={activeTab}
          />
        )}
        {activeTab === 'offline' && (
          <AgvOfflineComponent
            originData={offlineOriginData}
            keyDataMap={keyOfflineData}
            activeTab={activeTab}
          />
        )}
        {activeTab === 'statuserror' && (
          <AgvErrorComponent
            originData={statuserrorOriginData}
            keyDataMap={keyErrorData}
            activeTab={activeTab}
          />
        )}
        {activeTab === 'fault' && (
          <RobotFaultComponent
            originData={faultOriginData}
            keyDataMap={keyFaultData}
            activeTab={activeTab}
          />
        )}
      </div>
    </div>
  );
};
export default memo(HealthCar);

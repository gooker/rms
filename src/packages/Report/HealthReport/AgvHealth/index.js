import React, { useState, memo, useEffect } from 'react';
import { Spin } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';

import { forIn, sortBy } from 'lodash';
import { fetchAGVHealth } from '@/services/api';
import {
  isStrictNull,
  convertToUserTimezone,
  dealResponse,
  formatMessage,
  isNull,
} from '@/utils/util';
import { getDatBysortTime, getAllCellId } from '@/packages/Report/components/GroundQrcodeEcharts';
import HealthCarSearchForm from '../../components/HealthCarSearchForm';
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
  const [loading, setLoading] = useState(false);

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
      const defaultHour = moment().subtract(1, 'hours');
      const startTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:00:00');
      const endTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:59:59');
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
      setLoading(true);
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

        setKeyCodeData(response?.codeTranslate ?? {});
        setKeyFaultData(getFaultKey(response?.errorCode ?? {})); // // 获取返回的故障码key;
        setKeyOfflineData(getOfflineKey());
        setKeyErrorData(getErrorKey());

        setScanOriginData(newCode);
        setOfflineOriginData(newOffline);
        setStatuserrorOriginData(newError);
        setFaultOriginData(newMalfunction);
      }
      setLoading(false);
    }
  }

  function generateEveryType(data, keyMap) {
    const typeResult = [];
    Object.entries(data).forEach(([key, typeData]) => {
      if (!isStrictNull(typeData)) {
        const currentTypeData = sortBy(typeData, 'agvId');
        currentTypeData.forEach((record) => {
          let currentTime = {};
          let _record = { ...record };
          currentTime.agvId = record.agvId;
          currentTime[colums.time] = key;
          if (record?.robotType) {
            currentTime.robotType = formatMessage({ id: `app.agvType.${record.robotType}` });
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
    return typeResult;
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
    XLSX.writeFile(wb, `${formatMessage({ id: 'menu.healthReport.agv' })}.xlsx`);
  }
  return (
    <div className={commonStyles.commonPageStyle}>
      <HealthCarSearchForm search={submitSearch} downloadVisible={true} exportData={exportData} />

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
        <Spin spinning={loading}>
          {activeTab === 'scan' && (
            <ScanCodeComponent
              originData={scanOriginData}
              originIds={getAllCellId(scanOriginData, 'agvId')}
              keyDataMap={keyCodeData}
              activeTab={activeTab}
            />
          )}
          {activeTab === 'offline' && (
            <AgvOfflineComponent
              originData={offlineOriginData}
              originIds={getAllCellId(offlineOriginData, 'agvId')}
              keyDataMap={keyOfflineData}
              activeTab={activeTab}
            />
          )}
          {activeTab === 'statuserror' && (
            <AgvErrorComponent
              originData={statuserrorOriginData}
              originIds={getAllCellId(statuserrorOriginData, 'agvId')}
              keyDataMap={keyErrorData}
              activeTab={activeTab}
            />
          )}
          {activeTab === 'fault' && (
            <RobotFaultComponent
              originData={faultOriginData}
              originIds={getAllCellId(faultOriginData, 'agvId')}
              keyDataMap={keyFaultData}
              activeTab={activeTab}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};
export default memo(HealthCar);

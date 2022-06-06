import React, { memo, useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import { forIn, sortBy } from 'lodash';
import { fetchVehicleHealth } from '@/services/commonService';
import { convertToUserTimezone, dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import { getAllCellId, getDatBysortTime } from '@/packages/Report/components/GroundQrcodeEcharts';
import HealthCarSearchForm from '../../components/HealthCarSearchForm';
import ScanCodeComponent from './VehicleScanCodeTab';
import VehicleOfflineComponent from './VehicleOfflineTab';
import VehicleFaultComponent from './VehicleFaultTab';
import VehicleErrorComponent from './VehicleStatusErrorTab';
import commonStyles from '@/common.module.less';

const { TabPane } = Tabs;
const colums = {
  vehicleId: formatMessage({ id: 'app.vehicle' }),
  time: formatMessage({ id: 'app.time' }),
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

  const [activeTab, setActiveTab] = useState('scan');

  useEffect(() => {
    async function initCodeData() {
      const defaultHour = moment().subtract(1, 'hours');
      const startTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:00:00');
      const endTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:59:59');
      submitSearch({ startTime, endTime, vehicleSearch: { type: 'Vehicle_ID', code: [] } });
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
      vehicleSearch: { code: vehicleSearchTypeValue, type: vehicleSearchType },
    } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      setLoading(true);
      const response = await fetchVehicleHealth({
        startTime,
        endTime,
        vehicleSearchTypeValue,
        vehicleSearchType,
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
        const currentTypeData = sortBy(typeData, 'vehicleId');
        currentTypeData.forEach((record) => {
          let currentTime = {};
          let _record = { ...record };
          currentTime.vehicleId = record.vehicleId;
          currentTime[colums.time] = key;
          if (record?.vehicleType) {
            currentTime.vehicleType = formatMessage({ id: `app.vehicleType.${record.vehicleType}` });
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

    XLSX.utils.book_append_sheet(wb, code, formatMessage({ id: 'reportCenter.vehicle.scancode' }));
    XLSX.utils.book_append_sheet(wb, offline, formatMessage({ id: 'reportCenter.vehicle.offline' }));
    XLSX.utils.book_append_sheet(wb, error, formatMessage({ id: 'reportCenter.vehicle.error' }));
    XLSX.utils.book_append_sheet(wb, fault, formatMessage({ id: 'reportCenter.vehicle.fault' }));
    XLSX.writeFile(wb, `${formatMessage({ id: 'menu.healthReport.vehicle' })}.xlsx`);
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <HealthCarSearchForm search={submitSearch} downloadVisible={true} exportData={exportData} />

      <Spin spinning={loading}>
        <Tabs centered defaultActiveKey="1" onChange={setActiveTab}>
          <TabPane key={'scan'} tab={formatMessage({ id: 'reportCenter.vehicle.scancode' })}>
            <ScanCodeComponent
              originData={scanOriginData}
              originIds={getAllCellId(scanOriginData, 'vehicleId')}
              keyDataMap={keyCodeData}
              activeTab={activeTab}
            />
          </TabPane>
          <TabPane key={'offline'} tab={formatMessage({ id: 'reportCenter.vehicle.offline' })}>
            <VehicleOfflineComponent
              originData={offlineOriginData}
              originIds={getAllCellId(offlineOriginData, 'vehicleId')}
              keyDataMap={keyOfflineData}
              activeTab={activeTab}
            />
          </TabPane>
          <TabPane key={'statuserror'} tab={formatMessage({ id: 'reportCenter.vehicle.error' })}>
            <VehicleErrorComponent
              originData={statuserrorOriginData}
              originIds={getAllCellId(statuserrorOriginData, 'vehicleId')}
              keyDataMap={keyErrorData}
              activeTab={activeTab}
            />
          </TabPane>
          <TabPane key={'fault'} tab={formatMessage({ id: 'reportCenter.vehicle.fault' })}>
            <VehicleFaultComponent
              originData={faultOriginData}
              originIds={getAllCellId(faultOriginData, 'vehicleId')}
              keyDataMap={keyFaultData}
              activeTab={activeTab}
            />
          </TabPane>
        </Tabs>
      </Spin>
    </div>
  );
};
export default memo(HealthCar);

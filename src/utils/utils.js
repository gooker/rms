import { message } from 'antd';
import XLSX from 'xlsx';
import { Parser } from 'json2csv';
import { split } from 'lodash';
import moment from 'moment-timezone';
import requestAPI from '@/utils/RequestAPI';
import { formatMessage } from '@/utils/Lang';
import { fetchAgvHardwareInfoById } from '@/services/api';
import dictionary from '@/utils/Dictionary';

export function getDomainNameByUrl(url) {
  const apis = requestAPI();
  const array = url.split('/');
  if (array.length < 2) {
    message.error(formatMessage({ id: 'app.request.addressError' }));
    return url;
  }
  if (apis && array[1] != null && apis[array[1]] != null) {
    return `${apis[array[1]]}${url}`;
  }

  const messageContent = formatMessage({ id: 'app.require.namespace' }, { namespace: array[1] });
  return { code: '-1', data: null, message: messageContent };
}

export function isStandardApiResponse(response) {
  return (
    response.hasOwnProperty('code') &&
    response.hasOwnProperty('data') &&
    response.hasOwnProperty('message')
  );
}

export function dealResponse(response, notification, successMessage, failedMessage) {
  // 如果后台发错误，那么response对象就会是标准的后台返回对象, {code:'-1', data:***, message:****}
  if (response && response.code === '-1') {
    const { data, message: errorMessage } = response;
    const defaultMessage = formatMessage({ id: 'app.common.systemError' });
    message.error(errorMessage || failedMessage || defaultMessage);
    if (data === 'logout') {
      // history.push('/login');
    }
    return true;
  }

  // 正常请求后返回false, 表示当前请求无错误
  notification &&
    message.success(successMessage || formatMessage({ id: 'app.common.operationFinish' }));
  return false;
}

export function dateFormat(value, type) {
  //获取服务器端的时区偏移量
  let date = null;
  if (value == null) {
    return {
      format: () => {
        return '';
      },
    };
  }
  let timeZone = 'GMT';
  if (sessionStorage.getItem('timeZone') != null) {
    timeZone = sessionStorage.getItem('timeZone');
  }

  if (type) {
    //将本地时间转化服务时间
    if (localStorage.getItem('userTimeZone') != null) {
      moment.tz.setDefault(localStorage.getItem('userTimeZone'));
    } else {
      moment.tz.setDefault(moment.tz.guess());
    }
    if (value.format) {
      date = new moment(value.format('YYYY-MM-DD HH:mm:ss')).tz(timeZone);
    } else {
      date = new moment(value).tz(timeZone);
    }
  } else {
    //将服务器时间转化成本地时间
    //获取当前时区偏移量
    moment.tz.setDefault(timeZone); //将服务器的时间和服务器返回的时区转回成带有时区的时间格式
    if (localStorage.getItem('userTimeZone') != null) {
      date = new moment(value).tz(localStorage.getItem('userTimeZone'));
    } else {
      date = new moment(value).tz(moment.tz.guess());
    }
  }
  if (date == null) {
    return {
      format: () => {
        return '';
      },
    };
  } else {
    return date;
  }
}

export function getSuffix(value, suffix, props) {
  if (value != null) {
    return (
      <span>
        <span {...props}>{value}</span>
        <span style={{ marginLeft: 1, fontSize: 14 }}>{suffix}</span>
      </span>
    );
  } else {
    return null;
  }
}

export function adjustModalWidth() {
  const maxWidth = 1200;
  const width = document.body.clientWidth * 0.8;
  return width >= maxWidth ? maxWidth : width;
}

export function isNull(value) {
  return value === null || value === undefined;
}

export function isStrictNull(value) {
  return value === null || value === undefined || value === '';
}

export function getContentHeight() {
  const layoutContentDOM = document.getElementById('layoutContent');
  const layoutContentDOMRect = layoutContentDOM.getBoundingClientRect();
  return document.body.offsetHeight - layoutContentDOMRect.top;
}

export function exportAgvModuleInfo(nameSpace, agvList) {
  return new Promise(async (resolve, reject) => {
    let nameArray = [
      'app.activity.model.LeftWheelMotor',
      'app.activity.model.rightWheelMotor',
      'app.activity.model.RotatingMotor',
      'app.activity.model.JackingMotor',
      'app.activity.model.camera',
      'app.activity.model.radar',
      'app.activity.model.ins',
      'app.activity.model.wifi',
    ];
    const AgvInfos = [];
    const fields = [];
    fields.push({
      value: 'agvId',
      label: formatMessage({ id: 'app.chargeManger.AgvId' }),
    });
    nameArray.forEach((record) => {
      fields.push({
        value: record,
        label: formatMessage({ id: 'app.activity.modelName' }),
      });
      fields.push({
        value: `${record}.type`,
        label: formatMessage({ id: 'app.activity.firmwareType' }),
      });
      fields.push({
        value: `${record}.softVersion`,
        label: formatMessage({ id: 'app.activity.softwareVersion' }),
      });
      fields.push({
        value: `${record}.hardwareVersion`,
        label: formatMessage({ id: 'app.activity.firewareVersion' }),
      });
    });
    for (let index = 0; index < agvList.length; index++) {
      const element = agvList[index];
      const { robotId, sectionId } = element;
      const response = await fetchAgvHardwareInfoById(nameSpace, { agvId: robotId, sectionId });
      if (dealResponse(response)) {
        continue;
      }
      const { moduleInfoList } = response;
      const info = { agvId: robotId };
      if (moduleInfoList) {
        moduleInfoList.forEach((record) => {
          const { id, type, softVersion, hardwareVersion } = record;
          const modelInfo = nameArray[id];
          info[modelInfo] = formatMessage({ id: modelInfo });
          info[`${modelInfo}.type`] = type;
          info[`${modelInfo}.softVersion`] = softVersion;
          info[`${modelInfo}.hardwareVersion`] = hardwareVersion;
        });
        AgvInfos.push(info);
      } else {
        message.warning(formatMessage({ id: 'app.agv.hardwareError' }, { robotId }));
      }
    }
    const opts = { fields };
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(AgvInfos);
      const splitString = '\n';
      const arrayCSV = split(csv, splitString).map((record) => {
        return split(record, ',').map((obj) => {
          return obj.replace(/"/g, '');
        });
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(arrayCSV);
      XLSX.utils.book_append_sheet(wb, ws, 'AGV');
      XLSX.writeFile(wb, `Hardware Information.xlsx`);
      resolve();
    } catch (err) {
      reject();
    }
  });
}

export function exportAgvInfo(agvList) {
  return new Promise((resolve, reject) => {
    const fields = [
      {
        label: formatMessage({ id: 'app,agv.id' }),
        value: 'robotId',
      },
      {
        label: formatMessage({ id: 'app.agv.serverIdentity' }),
        value: 'clusterIndex',
      },
      {
        label: formatMessage({ id: 'app.activity.ip' }),
        value: 'ip',
      },
      {
        label: formatMessage({ id: 'app.activity.port' }),
        value: 'port',
      },
      {
        label: formatMessage({ id: 'app.agv.position' }),
        value: 'currentCellId',
      },
      {
        label: formatMessage({ id: 'app.agv.direction' }),
        value: (row) => {
          return formatMessage({ id: dictionary('agvDirection', row.currentDirection) });
        },
      },
      {
        label: formatMessage({ id: 'app.agv.addingTime' }),
        value: (row) => {
          return dateFormat(row.createDate).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        label: formatMessage({ id: 'app.agv.maintenanceState' }),
        value: (row) => {
          if (row.disabled) {
            return formatMessage({ id: 'app.agv.underMaintenance' });
          } else {
            return formatMessage({ id: 'app.agv.normal' });
          }
        },
      },
      {
        label: formatMessage({ id: 'app.agv.type' }),
        align: 'center',
        value: (row) => {
          if (row.isDummy) {
            return formatMessage({
              id: 'app.agv.threeGenerationsOfVehicles(Virtual)',
            });
          } else if (row.robotType === 3) {
            return formatMessage({
              id: 'app.agv.threeGenerationOfTianma',
            });
          } else {
            return row.robotType;
          }
        },
      },
      {
        label: formatMessage({ id: 'app.agv.state' }),
        value: (row) => {
          const { agvStatus } = row;
          const key = dictionary('agvStatus', [agvStatus]);
          return formatMessage({ id: key });
        },
      },
      {
        label: formatMessage({ id: 'app.agv.battery' }),
        value: (row) => {
          return `${row.battery} %`;
        },
      },
      {
        label: formatMessage({ id: 'app.agv.batteryVoltage' }),
        value: (row) => {
          return `${row.batteryVoltage / 1000} v`;
        },
      },
      {
        label: formatMessage({ id: 'app.agv.version' }),
        value: 'version',
      },
      {
        label: formatMessage({ id: 'app.agv.batteryType' }),
        value: (row) => {
          return formatMessage({ id: dictionary('batteryType', row.batteryType) });
        },
      },
      {
        label: formatMessage({ id: 'app.agv.maxChargeCurrent' }),
        value: 'maxChargingCurrent',
      },
    ];
    try {
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(agvList);
      const splitString = '\n';
      const arrayCSV = split(csv, splitString).map((record) => {
        return split(record, ',').map((obj) => obj.replace(/"/g, ''));
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(arrayCSV);
      XLSX.utils.book_append_sheet(wb, ws, 'AGV');
      XLSX.writeFile(wb, `AGV Information.xlsx`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

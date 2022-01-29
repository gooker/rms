// 页面通用功能代码片段(封装多个页面都会使用的功能性代码片段，比如导出小车信息等等)
import { message } from 'antd';
import XLSX from 'xlsx';
import { Parser } from 'json2csv';
import { split } from 'lodash';
import { fetchAgvHardwareInfo } from '@/services/api';
import { GMT2UserTimeZone, dealResponse, formatMessage } from '@/utils/util';
import Dictionary from '@/utils/Dictionary';

/**
 * 导出小车模块信息
 * @param {*} nameSpace
 * @param {*} agvList
 * @returns
 */
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
      const response = await fetchAgvHardwareInfo(nameSpace, { agvId: robotId, sectionId });
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

/**
 * 导出小车实时信息
 * @param {*} agvList
 * @returns
 */
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
        label: formatMessage({ id: 'app.common.position' }),
        value: 'currentCellId',
      },
      {
        label: formatMessage({ id: 'app.agv.direction' }),
        value: (row) => {
          return formatMessage({ id: Dictionary('agvDirection', row.currentDirection) });
        },
      },
      {
        label: formatMessage({ id: 'app.agv.addingTime' }),
        value: (row) => {
          return GMT2UserTimeZone(row.createDate).format('YYYY-MM-DD HH:mm:ss');
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
          const key = Dictionary('agvStatus', agvStatus);
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
          return formatMessage({ id: Dictionary('batteryType', row.batteryType) });
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

// 页面通用功能代码片段(封装多个页面都会使用的功能性代码片段，比如导出小车信息等等)
import { message } from 'antd';
import XLSX from 'xlsx';
import { Parser } from 'json2csv';
import { split } from 'lodash';
import { fetchVehicleHardwareInfo } from '@/services/commonService';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import Dictionary from '@/utils/Dictionary';

/**
 * 导出小车模块信息
 * @param {*} nameSpace
 * @param {*} vehicleList
 * @returns
 */
export function exportVehicleModuleInfo(nameSpace, vehicleList) {
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
    const VehicleInfos = [];
    const fields = [];
    fields.push({
      value: 'vehicleId',
      label: formatMessage({ id: 'app.chargeManger.VehicleId' }),
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
    for (let index = 0; index < vehicleList.length; index++) {
      const element = vehicleList[index];
      const { vehicleId, sectionId } = element;
      const response = await fetchVehicleHardwareInfo(nameSpace, { vehicleId, sectionId });
      if (dealResponse(response)) {
        continue;
      }
      const { moduleInfoList } = response;
      const info = { vehicleId };
      if (moduleInfoList) {
        moduleInfoList.forEach((record) => {
          const { id, type, softVersion, hardwareVersion } = record;
          const modelInfo = nameArray[id];
          info[modelInfo] = formatMessage({ id: modelInfo });
          info[`${modelInfo}.type`] = type;
          info[`${modelInfo}.softVersion`] = softVersion;
          info[`${modelInfo}.hardwareVersion`] = hardwareVersion;
        });
        VehicleInfos.push(info);
      } else {
        message.warning(formatMessage({ id: 'app.vehicle.hardwareError' }, { vehicleId }));
      }
    }
    const opts = { fields };
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(VehicleInfos);
      const splitString = '\n';
      const arrayCSV = split(csv, splitString).map((record) => {
        return split(record, ',').map((obj) => {
          return obj.replace(/"/g, '');
        });
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(arrayCSV);
      XLSX.utils.book_append_sheet(wb, ws, 'Vehicle');
      XLSX.writeFile(wb, `Hardware Information.xlsx`);
      resolve();
    } catch (err) {
      reject();
    }
  });
}

/**
 * 导出小车实时信息
 * @param {*} vehicleList
 * @returns
 */
export function exportVehicleInfo(vehicleList) {
  return new Promise((resolve, reject) => {
    const fields = [
      {
        label: formatMessage({ id: 'app,vehicle.id' }),
        value: 'vehicleId',
      },
      {
        label: formatMessage({ id: 'vehicle.serverIdentity' }),
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
        label: formatMessage({ id: 'vehicle.direction' }),
        value: (row) => {
          return formatMessage({ id: Dictionary('vehicleDirection', row.currentDirection) });
        },
      },
      {
        label: formatMessage({ id: 'app.vehicle.addingTime' }),
        value: (row) => {
          return convertToUserTimezone(row.createDate).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        label: formatMessage({ id: 'vehicle.maintenanceState' }),
        value: (row) => {
          if (row.disabled) {
            return formatMessage({ id: 'app.vehicle.underMaintenance' });
          } else {
            return formatMessage({ id: 'app.vehicle.normal' });
          }
        },
      },
      {
        label: formatMessage({ id: 'app.vehicleType' }),
        align: 'center',
        value: (row) => {
          if (row.isDummy) {
            return formatMessage({
              id: 'app.vehicle.threeGenerationsOfVehicles(Virtual)',
            });
          } else if (row.vehicleType === 3) {
            return formatMessage({
              id: 'app.vehicle.threeGenerationOfTianma',
            });
          } else {
            return row.vehicleType;
          }
        },
      },
      {
        label: formatMessage({ id: 'app.vehicle.state' }),
        value: (row) => {
          const { vehicleStatus } = row;
          const key = Dictionary('vehicleStatus', vehicleStatus);
          return formatMessage({ id: key });
        },
      },
      {
        label: formatMessage({ id: 'app.vehicle.battery' }),
        value: (row) => {
          return `${row.battery} %`;
        },
      },
      {
        label: formatMessage({ id: 'app.vehicle.batteryVoltage' }),
        value: (row) => {
          return `${row.batteryVoltage / 1000} v`;
        },
      },
      {
        label: formatMessage({ id: 'app.vehicle.version' }),
        value: 'version',
      },
      {
        label: formatMessage({ id: 'app.vehicle.batteryType' }),
        value: (row) => {
          return formatMessage({ id: Dictionary('batteryType', row.batteryType) });
        },
      },
      {
        label: formatMessage({ id: 'app.vehicle.maxChargeCurrent' }),
        value: 'maxChargingCurrent',
      },
    ];
    try {
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(vehicleList);
      const splitString = '\n';
      const arrayCSV = split(csv, splitString).map((record) => {
        return split(record, ',').map((obj) => obj.replace(/"/g, ''));
      });
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(arrayCSV);
      XLSX.utils.book_append_sheet(wb, ws, 'Vehicle');
      XLSX.writeFile(wb, `Vehicle Information.xlsx`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

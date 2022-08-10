// ****************** 自定义任务 ****************** //
import { cloneDeep, find, isEmpty, isPlainObject } from 'lodash';
import { CustomNodeType, CustomNodeTypeFieldMap } from '@/packages/SmartTask/CustomTask/customTaskConfig';
import { VehicleOptionType } from '@/packages/SmartTask/CustomTask/components/VehicleSelector';
import { extractMapValueToMap, formatMessage, isNull, isStrictNull } from '@/utils/util';

const targetProgramingKeys = [
  'afterFirstActions',
  'beforeLastActions',
  'firstActions',
  'lastActions',
];

// 将表单数据转化为后台数据结构
export function generateCustomTaskForm(_value, taskSteps, programing, preTasksCode) {
  const value = cloneDeep(_value);
  const customTaskData = {
    code: value.code,
    name: value.name,
    desc: value.desc,
    priority: value.priority,

    type: 'CUSTOM_TASK',
    codes: taskSteps.map(({ code }) => code),
    sectionId: window.localStorage.getItem('sectionId'),
  };
  Object.keys(value).forEach((key) => {
    if (key.includes('_')) {
      let taskNodeType = key.split('_')[0];
      const customTaskDataKey =
        CustomNodeTypeFieldMap[preTasksCode.includes(key) ? CustomNodeType.PLUS : taskNodeType];
      if (!customTaskData[customTaskDataKey]) {
        customTaskData[customTaskDataKey] = {};
      }
      if (CustomNodeType.ACTION === taskNodeType) {
        let configValue = { ...value[key] };
        // 防止前置任务选择框出现奇怪的东西
        if (isNull(configValue.preActionCodes)) {
          configValue.preActionCodes = [];
        }
        // 检查资源锁
        if (isEmpty(configValue.lockTime)) {
          configValue.lockTime = null;
        } else {
          const lockTimeMapValue = {};
          for (const item of configValue.lockTime) {
            if (!isNull(item[0])) {
              lockTimeMapValue[item[0]] = {};
              if (!isNull(item[1])) {
                lockTimeMapValue[item[0]].LOCK = item[1];
              }
              if (!isNull(item[2])) {
                lockTimeMapValue[item[0]].UNLOCK = item[2];
              }
            }
          }
          configValue.lockTime = lockTimeMapValue;
        }

        // 检查路径函数配置，扁平化处理
        let _pathProgramming = [];
        if (Array.isArray(configValue.pathProgramming)) {
          _pathProgramming = fillFormValueToAction(configValue.pathProgramming, programing);
        }
        configValue.pathProgramming = _pathProgramming;

        // 检查关键点动作配置
        const _targetAction = { ...configValue.targetAction };
        targetProgramingKeys.forEach((fieldKey) => {
          if (!isNull(_targetAction[fieldKey])) {
            _targetAction[fieldKey] = fillFormValueToAction(_targetAction[fieldKey], programing);
          }
        });
        configValue.targetAction = _targetAction;
        customTaskData[customTaskDataKey][value[key].code] = configValue;
      } else {
        customTaskData[customTaskDataKey][value[key].code] = { ...value[key] };
      }
    } else {
      if (!isNull(CustomNodeTypeFieldMap[key])) {
        if (key === CustomNodeType.START) {
          const startConfig = { ...value[CustomNodeType.START] };
          if (startConfig.vehicle.type === VehicleOptionType.AUTO) {
            startConfig.vehicle.type = VehicleOptionType.VEHICLE;
            startConfig.vehicle.code = [];
          }
          customTaskData[CustomNodeTypeFieldMap[key]] = startConfig;
        } else {
          customTaskData[CustomNodeTypeFieldMap[key]] = value[key];
        }
      }
    }
  });

  // sample
  const { variable } = window.$$state().customTask;
  customTaskData.sample = JSON.stringify(variable);
  return customTaskData;
}

// 将后台返回的自定义任务数据转化为表单数据
export function restoreCustomTaskForm(customTask) {
  const result = { taskSteps: [], preTaskSteps: [], fieldsValue: {} };
  const { codes } = customTask;
  let preTaskCodes = [];
  if (!isNull(customTask.customPreActions)) {
    preTaskCodes = Object.keys(customTask.customPreActions);
  }

  // 提取基本信息
  result.fieldsValue.name = customTask.name;
  result.fieldsValue.code = customTask.code;
  result.fieldsValue.desc = customTask.desc;
  result.fieldsValue.priority = customTask.priority;

  [...codes, ...preTaskCodes].forEach((code) => {
    // 收集左侧的任务节点数据，区分正常任务节点和前置任务节点
    let taskNodeType = code.split('_')[0];
    if (preTaskCodes.includes(code)) {
      taskNodeType = CustomNodeType.PLUS;
    }
    const customTaskKey = CustomNodeTypeFieldMap[taskNodeType];
    if (code.includes('_')) {
      taskNodeType = code.split('_')[0]; // 防止PLUS被赋值到节点数据
      const configValue = customTask[customTaskKey][code];
      let stepsKey = 'taskSteps';
      if (preTaskCodes.includes(code)) {
        stepsKey = 'preTaskSteps';
      }
      result[stepsKey].push({
        code,
        type: taskNodeType,
        label: configValue.name ?? formatMessage({ id: `customTask.type.${taskNodeType}` }),
      });
    } else {
      result.taskSteps.push({
        code,
        type: code,
        label: formatMessage({ id: `customTask.type.${code}` }),
      });
    }

    // 收集表单数据
    if (taskNodeType === CustomNodeType.START) {
      const startValues = { ...customTask[customTaskKey] };
      const { vehicle } = startValues;
      if (
        isNull(vehicle) ||
        (vehicle.type === VehicleOptionType.VEHICLE && vehicle.code.length === 0)
      ) {
        startValues.vehicle = { type: VehicleOptionType.AUTO, code: [] };
      }
      result.fieldsValue[taskNodeType] = startValues;
    } else if (taskNodeType === CustomNodeType.END) {
      result.fieldsValue[taskNodeType] = customTask[customTaskKey];
    } else {
      let subTaskConfig = customTask[customTaskKey][code];
      subTaskConfig = { ...subTaskConfig };
      if (subTaskConfig.customType === CustomNodeType.ACTION) {
        // 处理资源锁
        const lockTimeFormValue = [];
        if (subTaskConfig.lockTime) {
          Object.entries(subTaskConfig.lockTime).forEach(([modelType, { LOCK, UNLOCK }]) => {
            lockTimeFormValue.push([modelType, LOCK ?? null, UNLOCK ?? null]);
          });
        }
        subTaskConfig.lockTime = lockTimeFormValue;

        // 处理路径函数配置
        let _pathProgramming = [];
        if (Array.isArray(subTaskConfig.pathProgramming)) {
          _pathProgramming = extractActionToFormValue(subTaskConfig.pathProgramming);
        }
        subTaskConfig.pathProgramming = _pathProgramming;

        // 处理关键点动作配置
        const _targetAction = { ...subTaskConfig.targetAction };
        targetProgramingKeys.forEach((fieldKey) => {
          if (!isNull(_targetAction[fieldKey])) {
            _targetAction[fieldKey] = extractActionToFormValue(_targetAction[fieldKey]);
          }
        });
        subTaskConfig.targetAction = _targetAction;
      }
      result.fieldsValue[code] = subTaskConfig;
    }
  });
  return result;
}

// 将地图编程配置的值回填到原action中
export function fillFormValueToAction(configuration, programing, withTiming = false) {
  function fill(configs, timing) {
    return configs.map(({ actionType, operateType, ...rest }) => {
      const [p1, p2] = actionType;
      const action = find(programing[p1], { actionId: p2 });
      const copyAction = cloneDeep(action);
      copyAction.operateType = operateType;
      // 将数据回填到action参数中
      if (Array.isArray(copyAction.actionParameters)) {
        copyAction.actionParameters.forEach((item) => {
          item.value = rest[item.code];
        });
      }
      if (!isStrictNull(timing)) {
        copyAction.timing = timing;
      }
      return copyAction;
    });
  }

  if (withTiming) {
    const result = [];
    configuration.forEach(({ timing, value }) => {
      result.push(...fill(value, timing));
    });
    return result;
  }
  return fill(configuration);
}

// 将action数据提取成编程弹窗可用的数据结构
export function extractActionToFormValue(actions) {
  const configurations = [];
  actions.forEach(({ actionId, adapterType, actionParameters }) => {
    const addedItem = { actionType: [adapterType, actionId] };
    if (Array.isArray(actionParameters)) {
      actionParameters.forEach(({ code, value }) => {
        addedItem[code] = value;
      });
    }
    configurations.push(addedItem);
  });
  return configurations;
}

/**
 * 提取sample数据
 * http://192.168.0.12:3000/project/52/interface/api/1573
 */
export function generateSample(
  { customStart, customActions, customPreActions, customEnd },
  taskNodes,
) {
  const result = {
    customStart: { vehicle: {}, vehicleLimit: {} },
    customAction: {},
    customEnd: { loadBackZone: [], backZone: [] },
  };

  // 任务开始
  const { type, code } = customStart.vehicle;
  result.customStart.vehicle[type] = code;
  result.customStart.vehicleLimit = Object.assign({}, customStart.customLimit);

  // 子任务
  // 1. 转换前置任务
  const preTaskParams = {};
  if (isPlainObject(customPreActions)) {
    Object.values(customPreActions).forEach((subTask) => {
      const {
        code,
        targetAction: { operatorAngle, loadAngle, target },
      } = subTask;
      preTaskParams[code] = {};
      if (['ROTATE', 'ROTATE_GROUP'].includes(target.type)) {
        if (!isNull(operatorAngle)) {
          preTaskParams[code]['loadAngle'] = isNull(loadAngle) ? null : loadAngle;
          preTaskParams[code]['operateAngle'] = operatorAngle;
        } else {
          preTaskParams[code]['loadAngle'] = isNull(loadAngle) ? null : loadAngle;
        }
      }
      preTaskParams[code]['params'] = {};
      preTaskParams[code]['params'][target.type] = target?.code ?? [];
    });
  }
  // 2. 子任务
  if (isPlainObject(customActions)) {
    Object.values(customActions).forEach((subTask) => {
      const {
        code,
        speed,
        preActionCodes,
        targetAction: { operatorAngle, loadAngle, target },
      } = subTask;
      const { index } = find(taskNodes, { code });
      const stepCode = `step${index}`;
      result['customAction'][stepCode] = { speed };
      if (['ROTATE', 'ROTATE_GROUP'].includes(target.type)) {
        // 如果操作者位置 (operatorAngle) 存在值，那么loadAngle指的是载具面
        if (!isNull(operatorAngle)) {
          result['customAction'][stepCode]['loadAngle'] = isNull(loadAngle) ? null : loadAngle;
          result['customAction'][stepCode]['operateAngle'] = operatorAngle;
        } else {
          result['customAction'][stepCode]['loadAngle'] = isNull(loadAngle) ? null : loadAngle;
        }
      }
      result['customAction'][stepCode]['params'] = {};
      result['customAction'][stepCode]['params'][target.type] = target?.code ?? [];

      // 合并前置任务的参数
      if (Array.isArray(preActionCodes)) {
        preActionCodes.forEach((subTaskCode) => {
          if (!isNull(preTaskParams[subTaskCode])) {
            const { params, ...rest1 } = result['customAction'][`step${index}`];
            const { params: preParams, ...rest2 } = preTaskParams[subTaskCode];
            result['customAction'][`step${index}`] = { ...rest1, ...rest2, params, preParams };
          }
        });
      }
    });
  }

  // 任务结束
  result.customEnd.backZone = customEnd.backZone
    ? extractMapValueToMap(customEnd.backZone, 'type', 'code')
    : [];
  result.customEnd.loadBackZone = customEnd.heavyBackZone
    ? extractMapValueToMap(customEnd.heavyBackZone, 'type', 'code')
    : [];

  return result;
}

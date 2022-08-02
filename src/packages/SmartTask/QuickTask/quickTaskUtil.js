import { isEmpty, isPlainObject } from 'lodash';
import { isStrictNull } from '@/utils/util';

/**
 * 点击执行时候判断是直接执行快捷任务还是打开表单弹窗
 */
export function checkQuickVariable(variable) {
  const { customStart, customAction, customEnd } = variable;

  // 任务开始
  const { vehicle, vehicleLimit } = customStart;
  if (vehicle.config.isRequired || vehicle.config.visible) {
    if (vehicle.config.isRequired) {
      if (isConfigEmpty(vehicle.value)) {
        return true;
      }
    }
  }
  if (vehicleLimit.config.isRequired || vehicleLimit.config.visible) {
    if (vehicleLimit.config.isRequired) {
      if (isConfigEmpty(vehicleLimit.value)) {
        return true;
      }
    }
  }

  // 子任务
  const subTaskCodes = Object.keys(customAction);
  for (const subTaskCode of subTaskCodes) {
    const fieldKeys = Object.keys(customAction[subTaskCode]);
    for (const fieldKey of fieldKeys) {
      const fieldValue = customAction[subTaskCode][fieldKey];
      if (fieldValue.config.isRequired || fieldValue.config.visible) {
        if (fieldValue.config.isRequired) {
          if (isConfigEmpty(fieldValue.value)) {
            return true;
          }
        }
      }
    }
  }

  // 任务结束
  const { backZone, loadBackZone } = customEnd;
  if (backZone.config.isRequired || backZone.config.visible) {
    if (backZone.config.isRequired) {
      if (isConfigEmpty(backZone.value)) {
        return true;
      }
    }
  }
  if (loadBackZone.config.isRequired || loadBackZone.config.visible) {
    if (loadBackZone.config.isRequired) {
      if (isConfigEmpty(loadBackZone.value)) {
        return true;
      }
    }
  }

  return false;
}

// 检查配置参数是否为空
function isConfigEmpty(item) {
  if (isPlainObject(item)) {
    const value = Object.values(item)[0];
    return isStrictNull(value) || isEmpty(value);
  } else if (Array.isArray(item)) {
    return isEmpty(item);
  } else {
    return isStrictNull(item);
  }
}

// 将快捷任务的变量字段转换成运行任务需要的结构
export function convertQuickTaskVarToRequestStruct(quickTaskVariable) {
  const { customStart, customAction, customEnd } = quickTaskVariable;
  //
  const _customStart = {};
  _customStart.vehicle = customStart.vehicle.value;
  _customStart.vehicleLimit = customStart.vehicleLimit.value;

  const _customAction = {};
  Object.entries(customAction).forEach(([nodeCode, nodeConfig]) => {
    _customAction[nodeCode] = {};
    Object.entries(nodeConfig).forEach(([field, { value }]) => {
      _customAction[nodeCode][field] = value;
    });
  });

  const _customEnd = {};
  _customEnd.backZone = customEnd.backZone.value;
  _customEnd.loadBackZone = customEnd.loadBackZone.value;

  return {
    ...quickTaskVariable,
    customStart: _customStart,
    customAction: _customAction,
    customEnd: _customEnd,
  };
}

// 提取变量表单数据并转换成合适的结构
export function formatVariableFormValues(values, hasPrefix = false) {
  function format(inputValue) {
    const result = {};
    const { customStart, customAction, customEnd } = inputValue;

    // 任务开始
    if (customStart) {
      result.customStart = {};
      const { vehicle, vehicleLimit } = customStart;
      if (vehicle) {
        result.customStart.vehicle = {};
        result.customStart['vehicle'][vehicle.type] = vehicle.code;
      }
      if (vehicleLimit) {
        result.customStart.vehicleLimit = vehicleLimit;
      }
    }

    // 子任务
    if (customAction) {
      result.customAction = {};
      Object.entries(customAction).forEach(([step, stepLoad]) => {
        if (result.customAction[step] === undefined) {
          result.customAction[step] = {};
        }
        Object.entries(stepLoad).forEach(([fieldKey, fieldValue]) => {
          if (result.customAction[step][fieldKey] === undefined) {
            result.customAction[step][fieldKey] = {};
          }
          if (isPlainObject(fieldValue)) {
            // 目标点只会有一种
            const key = Object.keys(fieldValue)[0];
            result.customAction[step][fieldKey][key] = fieldValue[key]['code'];
          } else {
            result.customAction[step][fieldKey] = fieldValue;
          }
        });
      });
    }

    // 任务结束
    if (customEnd) {
      result.customEnd = {};
      const { backZone, loadBackZone } = customEnd;
      if (backZone) {
        result.customEnd.backZone = backZone.map(({ type, code }) => ({ [type]: code }));
      }
      if (loadBackZone) {
        result.customEnd.loadBackZone = loadBackZone.map(({ type, code }) => ({ [type]: code }));
      }
    }
    return result;
  }

  if (hasPrefix) {
    const result = {};
    Object.entries(values).forEach(([prefix, inputValue]) => {
      result[prefix] = format(inputValue);
    });
    return result;
  }
  return format(values);
}

// 将两个快捷任务参数进行合并
export function mergeQuickTaskVar(obj, src) {
  const result = { ...obj };
  result.customStart = { ...result.customStart, ...src.customStart };
  result.customEnd = { ...result.customEnd, ...src.customEnd };
  Object.keys(src.customAction).forEach((subTaskKey) => {
    result.customAction[subTaskKey] = {
      ...result.customAction[subTaskKey],
      ...src.customAction[subTaskKey],
    };
  });
  return result;
}

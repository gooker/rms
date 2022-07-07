import { isNull } from '@/utils/util';
import { find } from 'lodash';

/**通过自定义任务的id 拿到sample**/
export function getDefaultVariableById(idcodes, allTaskList) {
  const dataMap = {};
  const paramIds = idcodes?.map((idcode) => idcode.split('-')[0]);
  const currentDataById = allTaskList?.filter(({ id }) => paramIds.includes(id));
  currentDataById?.map(({ id, code, sample, codes }) => {
    dataMap[`${id}-${code}`] = transformActionStepToCode(sample, codes);
  });
  return dataMap;
}

/* 把sample action的step 换成对应的code**
 *
 * codes 不为空
 * */
export function transformActionStepToCode(sample, codes) {
  const newResult = { ...sample };
  let newCustomAction = {};
  const { customAction } = sample;
  if (isNull(codes)) {
    return newResult;
  }
  Object.keys(customAction).forEach((nodeType) => {
    if (nodeType.startsWith('step')) {
      const stepIndex = Number.parseInt(nodeType.replace('step', ''));
      const taskNodeCode = codes[stepIndex];
      newCustomAction[taskNodeCode] = customAction[nodeType];
    }
  });
  newResult.customAction = { ...newCustomAction };
  return newResult;
}

/**编辑 转换数据
 * 1.根据code 有code 就用触发器的action覆盖**/
export function transformCurrentVariable(allTaskList, fixedVariable) {
  const dataMap = {};
  Object.keys(fixedVariable)?.map((idcode) => {
    const [id, code] = idcode.split('-');
    const currentFixVariable = fixedVariable[idcode];
    const currentTask = find(allTaskList, { id });
    if (!isNull(currentTask)) {
      if (currentTask.type === 'quick') {
        dataMap[idcode] = {
          id,
          code,
          ...fixedVariable[idcode],
        };
      } else {
        const newSample = transformActionStepToCode(currentTask.sample, currentTask.codes);
        const { customAction } = newSample;
        let currentCustomAction = {};
        Object.keys(customAction)?.forEach((nodeType) => {
          if (currentFixVariable.customAction[nodeType]) {
            currentCustomAction[nodeType] = currentFixVariable.customAction[nodeType];
          } else {
            currentCustomAction[nodeType] = customAction[nodeType];
          }
        });
        newSample.customAction = { ...currentCustomAction };

        dataMap[idcode] = {
          id,
          code,
          ...newSample,
        };
      }
    }
  });
  return dataMap;
}

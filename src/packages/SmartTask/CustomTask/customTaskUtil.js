import { formatMessage, isNull } from '@/utils/util';
import { CustomNodeType } from './customTaskConfig';
import { isEmpty } from 'lodash';

export function getInitialTaskSteps() {
  return [
    {
      type: CustomNodeType.BASE,
      code: CustomNodeType.BASE,
      label: formatMessage({ id: 'customTask.type.BASE' }),
    },
    {
      type: CustomNodeType.START,
      code: CustomNodeType.START,
      label: formatMessage({ id: 'customTask.type.START' }),
    },
    {
      type: CustomNodeType.END,
      code: CustomNodeType.END,
      label: formatMessage({ id: 'customTask.type.END' }),
    },
  ];
}

export function isStandardTab(type) {
  return [CustomNodeType.BASE, CustomNodeType.START, CustomNodeType.END].includes(type);
}

export function spliceUselessValue(list) {
  return list.filter((item) => !(isEmpty(item) || isNull(item)));
}

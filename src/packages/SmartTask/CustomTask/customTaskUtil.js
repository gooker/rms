import { formatMessage, isNull } from '@/utils/util';
import { CustomType } from './customTaskConfig';
import { isEmpty } from 'lodash';

export function getInitialTaskSteps() {
  return [
    {
      type: CustomType.BASE,
      code: CustomType.BASE,
      label: formatMessage({ id: 'customTask.type.BASE' }),
    },
    {
      type: CustomType.START,
      code: CustomType.START,
      label: formatMessage({ id: 'customTask.type.START' }),
    },
    {
      type: CustomType.END,
      code: CustomType.END,
      label: formatMessage({ id: 'customTask.type.END' }),
    },
  ];
}

export function isStandardTab(type) {
  return [CustomType.BASE, CustomType.START, CustomType.END].includes(type);
}

export function spliceUselessValue(list) {
  return list.filter((item) => !(isEmpty(item) || isNull(item)));
}

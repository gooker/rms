import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import { CustomNodeType } from './customTaskConfig';

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
      type: CustomNodeType.PLUS,
      code: -1,
      label: <PlusOutlined />,
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

import React from 'react';
import { isPlainObject } from 'lodash';
import { createFromIconfontCN } from '@ant-design/icons';

const ExtraIconCharge = createFromIconfontCN({
  // scriptUrl: '/iconfont.js',
  scriptUrl: '//at.alicdn.com/t/c/font_2597007_gwew4ttpaa.js',
});

export function getIconFont(icon, style) {
  if (isPlainObject(style)) {
    return <ExtraIconCharge style={style} type={icon} />;
  }
  return <ExtraIconCharge type={icon} />;
}

export function IconFont({ type, style }) {
  return getIconFont(type, style);
}

import React, { memo } from 'react';
import { Card } from 'antd';
import commonStyle from '@/common.module.less';

const ResourceBind = (props) => {
  const {} = props;
  return (
    <div className={commonStyle.commonPageStyle}>
      <Card title={'车辆'}></Card>
      <Card title={'载具'} style={{ marginTop: 32 }}></Card>
    </div>
  );
};
export default memo(ResourceBind);

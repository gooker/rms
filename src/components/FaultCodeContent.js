import React, { memo } from 'react';
import { Popover, Descriptions } from 'antd';
import { defineErrorColor, formatMessage } from '@/utils/utils';

const FaultCodeContent = (props) => {
  const { code, faultContent } = props;
  if (!faultContent) return code;

  // 标题颜色
  const color = defineErrorColor(faultContent.level);
  const content = (
    <div style={{ width: 400 }}>
      <Descriptions bordered size={'small'} labelStyle={{ width: 100 }}>
        <Descriptions.Item label={formatMessage({ id: 'app.fault.level' })} span={3}>
          {faultContent.level}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.fault.version' })} span={3}>
          {faultContent.version}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.fault.autoRecover' })} span={3}>
          {faultContent.autoRecover}
        </Descriptions.Item>
        <Descriptions.Item label={formatMessage({ id: 'app.fault.description' })} span={3}>
          {faultContent.description}
        </Descriptions.Item>
        {/* 故障附加数据1 */}
        <Descriptions.Item label={formatMessage({ id: 'app.fault.extraData1' })} span={3}>
          {faultContent.preDataDefinition}
        </Descriptions.Item>
        {/* 故障附加数据2 */}
        <Descriptions.Item label={formatMessage({ id: 'app.fault.extraData2' })} span={3}>
          {faultContent.curDataDefinition}
        </Descriptions.Item>
        {/* 额外信息 */}
        <Descriptions.Item label={formatMessage({ id: 'app.fault.additionalData' })} span={3}>
          {faultContent.additionalContent}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  return (
    <Popover placement="topLeft" content={content}>
      <span style={{ color, fontWeight: 500 }}>
        <span>{faultContent.errorName}</span>
        <span>[{code}]</span>
      </span>
    </Popover>
  );
};
export default memo(FaultCodeContent);

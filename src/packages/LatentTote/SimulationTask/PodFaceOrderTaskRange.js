import React, { memo } from 'react';
import { InputNumber, Input, message } from 'antd';
import style from './simulationTask.module.less';
import { formatMessage } from '@/utils/util';

const PodFaceOrderTaskRange = (props) => {
  const { value = [], onChange } = props;
  return (
    <>
      <Input.Group compact>
        <InputNumber
          style={{ width: 100, textAlign: 'center' }}
          placeholder="Min"
          min={1}
          value={value.podFacePileOnOrderTaskRange?.[0]}
          onChange={(ev) => {
            const rightValue = value[1] ?? 0;
            if (ev >= rightValue) {
              message.error(formatMessage({ id: 'app.simulateTask.maxmumInvalid' }));
            }

            onChange([ev, rightValue]);
          }}
        />

        <Input
          className={style.siteSplit}
          style={{
            width: 30,
            borderLeft: 0,
            borderRight: 0,
            pointerEvents: 'none',
          }}
          placeholder="~"
          disabled
        />

        <InputNumber
          className={style.siteRight}
          style={{
            width: 100,
            textAlign: 'center',
          }}
          min={2}
          placeholder="Max"
          value={value.podFacePileOnOrderTaskRange?.[1]}
          onChange={(ev) => {
            const leftValue = value[0] ?? 0;
            if (ev <= leftValue) {
              message.error(formatMessage({ id: 'app.simulateTask.minimumInvalid' }));
            }

            onChange([leftValue, ev]);
          }}
        />
      </Input.Group>
    </>
  );
};
export default memo(PodFaceOrderTaskRange);

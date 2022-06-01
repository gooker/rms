import React, { memo } from 'react';
import { Button, Slider, Tooltip } from 'antd';
import { InfoCircleOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import Battery from '@/components/Battery';
import styles from './batteryStrategy.module.less';

const ButtonGroup = Button.Group;

const BatteryStrategy = (props) => {
  const { electricity, voltage } = props;

  return (
    <div className={styles.batteryStrategy}>
      <div className={styles.electricity}>
        <div className={styles.electricityBattery}>
          <Tooltip placement="top" title={electricity.tip}>
            {electricity.title} <InfoCircleOutlined />
          </Tooltip>
          <Battery value={electricity.value || 0} onChange={electricity.onChange} />
        </div>
        <div className={styles.electricityButton}>
          <ButtonGroup>
            <Button
              icon={
                <MinusOutlined
                  onClick={() => {
                    if (electricity.value - 1 >= 0) {
                      electricity.onChange(electricity.value - 1);
                    }
                  }}
                />
              }
            />
            <Button
              icon={
                <PlusOutlined
                  onClick={() => {
                    if (electricity.value + 1 <= 100) {
                      electricity.onChange(electricity.value + 1);
                    }
                  }}
                />
              }
            />
          </ButtonGroup>
        </div>
      </div>
      <div className={styles.voltage}>
        {voltage && (
          <>
            <Tooltip placement="top" title={voltage.tip}>
              {voltage.title} <InfoCircleOutlined />
            </Tooltip>
            <div className={styles.voltageInfo}>{`${voltage?.value || 0} V`}</div>
            <Slider
              min={35}
              max={65}
              step={0.1}
              value={voltage?.value || 0}
              onChange={voltage.onChange}
              tooltipVisible={false}
            />
          </>
        )}
      </div>
    </div>
  );
};
export default memo(BatteryStrategy);

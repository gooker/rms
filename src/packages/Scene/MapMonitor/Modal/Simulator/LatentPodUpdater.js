import React, { memo } from 'react';
import { Input } from 'antd';
import PodPicture from '../../../../../../public/images/latent_pod.png'
import styles from './latentPodUpdater.module.less';

const InputLength = 90;
const LatentPodUpdater = (props) => {
  const { value = {}, angle, onChange, showInput } = props;

  const _angle = angle || 0;

  const rotateStyle = {
    transform: `rotate(-${_angle}deg)`,
  };

  function onSizeChange(key, __value) {
    onChange({ ...value, [key]: __value });
  }

  return (
    <div className={styles.latentPodUpdater}>
      <div style={{ transform: `rotate(${_angle}deg)` }} className={styles.content}>
        <div className={styles.firstRow} style={rotateStyle}>
          {showInput && (
            <Input
              value={value.width}
              style={{ width: InputLength }}
              onChange={(event) => {
                onSizeChange('width', event.target.value);
              }}
              suffix={'mm'}
            />
          )}
          <span className={styles.label}>A</span>
        </div>
        <div className={styles.midRow} style={showInput ? { paddingRight: 30 } : {}}>
          <div
            style={{
              display: 'flex',
              flexFlow: 'column nowrap',
              ...rotateStyle,
            }}
          >
            {showInput && (
              <Input
                style={{ width: InputLength }}
                value={value.height}
                onChange={(event) => {
                  onSizeChange('height', event.target.value);
                }}
                suffix={'mm'}
              />
            )}
            <span className={styles.label}>B</span>
          </div>
          <img src={PodPicture} style={{ width: 150, height: 'auto' }} alt=''/>
          <span className={styles.label} style={rotateStyle}>
            D
          </span>
        </div>
        <div className={styles.label} style={rotateStyle}>
          C
        </div>
      </div>
    </div>
  );
};
export default memo(LatentPodUpdater);

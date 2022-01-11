import React, { memo, useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { covertAngle2Direction, isNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';

const { Option } = Select;
const directionAngleMap = {
  0: 0,
  1: 90,
  2: 180,
  3: 270,
};

const AngleSelector = (props) => {
  const { addonLabel, value, onChange, getAngle } = props;
  const [angle, setAngle] = useState(null); // 角度
  const [direction, setDirection] = useState(null); // 方向

  useEffect(() => {
    if (!isNull(value)) {
      setAngle(value);
      setDirection(covertAngle2Direction(value));
    }
  }, []);

  function addonBeforeChanged(_direction) {
    const _angle = directionAngleMap[_direction];
    setDirection(_direction);
    setAngle(_angle);

    // getAngle 标记是否只输出角度数据
    if (getAngle) {
      onChange(_angle);
    } else {
      onChange({ dir: _direction, angle: _angle });
    }
  }

  function inputChanged(ev) {
    let _angle = ev.target.value;
    if (_angle === '') {
      _angle = null;
    } else {
      _angle = parseFloat(_angle);
    }
    setAngle(_angle);

    // 转换为 direction
    const _direction = covertAngle2Direction(_angle);
    setDirection(_direction);

    // getAngle 标记是否只输出角度数据
    if (getAngle) {
      onChange(_angle);
    } else {
      onChange({ dir: _direction, angle: _angle });
    }
  }

  const addonBefore = (
    <Select value={direction} onChange={addonBeforeChanged} style={{ width: '100px' }}>
      <Option value={0}>
        {/* 上方 */}
        {addonLabel ? addonLabel[0] : <FormattedMessage id="app.direction.toTop" />}
      </Option>
      <Option value={1}>
        {/* 右方 */}
        {addonLabel ? addonLabel[90] : <FormattedMessage id="app.direction.toRight" />}
      </Option>
      <Option value={2}>
        {/* 下方 */}
        {addonLabel ? addonLabel[180] : <FormattedMessage id="app.direction.toBottom" />}
      </Option>
      <Option value={3}>
        {/* 左方 */}
        {addonLabel ? addonLabel[270] : <FormattedMessage id="app.direction.toLeft" />}
      </Option>
    </Select>
  );

  return <Input addonBefore={addonBefore} addonAfter="°" value={angle} onChange={inputChanged} />;
};
export default memo(AngleSelector);

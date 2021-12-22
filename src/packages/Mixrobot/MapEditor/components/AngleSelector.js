import React, { memo, useState, useEffect } from 'react';
import FormattedMessage from '@/components/FormattedMessage';
import { covertAngle2Direction, isNull } from '@/utils/utils';
import { Input, Select } from 'antd';

const { Option } = Select;
const directionAngleMap = {
  0: 0,
  1: 90,
  2: 180,
  3: 270,
};

const AngleSelector = memo((props) => {
  const { labelMap } = props; // {0:"向上",...}
  const [angle, setAngle] = useState(null);
  const [direction, setDirection] = useState(null);

  useEffect(() => {
    const { value } = props;
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
    const { onChange, getAngle } = props;
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
    const _direction = covertAngle2Direction[_angle];
    setDirection(direction);

    // getAngle 标记是否只输出角度数据
    const { onChange, getAngle } = props;
    if (getAngle) {
      onChange(_angle);
    } else {
      onChange({ dir: _direction, angle: _angle });
    }
  }

  const addonBefore = (
    <Select value={direction} onChange={addonBeforeChanged} style={{ width: '80px' }}>
      <Option value={0}>
        {labelMap?.['0'] || <FormattedMessage id="app.direction.top" />}
      </Option>
      <Option value={1}>
        {labelMap?.['1'] || <FormattedMessage id="app.direction.right" />}
      </Option>
      <Option value={2}>
        {labelMap?.['2'] || <FormattedMessage id="app.direction.bottom" />}
      </Option>
      <Option value={3}>
        {labelMap?.['3'] || <FormattedMessage id="app.direction.left" />}
      </Option>
    </Select>
  );

  return <Input addonBefore={addonBefore} addonAfter="°" value={angle} onChange={inputChanged} />;
});

export default AngleSelector;

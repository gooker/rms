import React, { memo } from 'react';
import { Popover } from 'antd';
import Dictionary from '@/utils/Dictionary';

const { red } = Dictionary('color');

/**
 *  level 1 || leve2  --> blue
 *  level 3           --> yellow
 */
export default memo(function ErrorCodeFault(props) {
  const {
    record: { errorCode, errorCodeName, errorName, errorContent },
  } = props;
  const errorDesc = errorCodeName || errorName;
  return (
    <Popover placement="topLeft" content={errorContent}>
      <span style={{ cursor: 'pointer', color: red }}>{`${errorDesc} (${errorCode})`}</span>
    </Popover>
  );
});

import React, { memo, useState } from 'react';
import styles from './editableTable.module.less';

const EditableCell = (props) => {
  const { text, onChange } = props;
  const [focused, setFocused] = useState(false);

  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className={styles.tableCell}
      style={
        focused
          ? {
              boxShadow: '0 0 2px 2px rgb(2 141 255)',
              borderColor: 'rgb(2 141 255)',
            }
          : {}
      }
      onBlur={(ev) => {
        setFocused(false);
        onChange(ev.target.innerText);
      }}
      onFocus={() => {
        setFocused(true);
      }}
    >
      {text}
    </div>
  );
};
export default memo(EditableCell);

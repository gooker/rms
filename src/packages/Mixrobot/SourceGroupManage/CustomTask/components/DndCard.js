import React from 'react';
import classnames from 'classnames';
import { Draggable } from 'react-smooth-dnd';
import { CloseOutlined } from '@ant-design/icons';
import styles from '../customTask.module.less';

const DndCard = (props) => {
  const { name, active, disabled, onClick, onDelete } = props;
  return (
    <Draggable
      className={disabled ? classnames(styles.dndCard, 'dndDisabled') : styles.dndCard}
      style={active ? { background: '#0ad986' } : {}}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <div className={styles.dndCardContent}>
        <span>{name}</span>
        {!disabled && typeof onDelete === 'function' && (
          <div
            className={styles.dndCardDelete}
            onClick={(ev) => {
              ev.stopPropagation();
              onDelete();
            }}
          >
            <CloseOutlined />
          </div>
        )}
      </div>
    </Draggable>
  );
};
export default DndCard;

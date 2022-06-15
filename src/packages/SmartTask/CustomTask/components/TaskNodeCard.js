import React from 'react';
import classnames from 'classnames';
import { Draggable } from 'react-smooth-dnd';
import { CloseOutlined } from '@ant-design/icons';
import Dictionary from '@/utils/Dictionary';
import styles from '../customTask.module.less';
import { isNull } from '@/utils/util';

const Colors = Dictionary().color;

const TaskNodeCard = (props) => {
  const { dnd, disabled, onClick } = props;

  if (dnd) {
    return (
      <Draggable
        style={{ cursor: 'move' }}
        className={disabled ? classnames(styles.dndCard, 'dndDisabled') : styles.dndCard}
        onClick={() => {
          onClick && onClick();
        }}
      >
        <CommonDOM data={props} />
      </Draggable>
    );
  }
  return (
    <div
      className={styles.dndCard}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <CommonDOM data={props} />
    </div>
  );
};
export default TaskNodeCard;

const CommonDOM = (props) => {
  const {
    data: { index, name, active, disabled, onDelete },
  } = props;
  return (
    <div
      className={styles.dndCardContent}
      style={active ? { color: Colors.blue, fontWeight: 500 } : {}}
    >
      {!isNull(index) && <div className={styles.dndCardContentIndex}>{index}</div>}
      <div className={styles.dndCardContentLabel}>{name}</div>
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
  );
};

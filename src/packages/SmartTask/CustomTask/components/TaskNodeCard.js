import React from 'react';
import classnames from 'classnames';
import { Draggable } from 'react-smooth-dnd';
import { CloseOutlined } from '@ant-design/icons';
import Dictionary from '@/utils/Dictionary';
import styles from '../customTask.module.less';

const Colors = Dictionary().color;

const TaskNodeCard = (props) => {
  const { name, active, disabled, onClick, onDelete, dnd } = props;
  if (dnd) {
    return (
      <Draggable
        style={{ cursor: 'move' }}
        className={disabled ? classnames(styles.dndCard, 'dndDisabled') : styles.dndCard}
        onClick={() => {
          onClick && onClick();
        }}
      >
        <div
          className={styles.dndCardContent}
          style={active ? { color: Colors.blue, fontWeight: 500 } : {}}
        >
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
  }
  return (
    <div
      className={styles.dndCard}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <div
        className={styles.dndCardContent}
        style={active ? { color: Colors.blue, fontWeight: 500 } : {}}
      >
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
    </div>
  );
};
export default TaskNodeCard;

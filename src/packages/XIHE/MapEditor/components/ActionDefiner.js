import React, { memo } from 'react';
import { Select, Input, Button } from 'antd';
import { MinusOutlined, PlusOutlined, BarsOutlined } from '@ant-design/icons';
import { Container, Draggable } from 'react-smooth-dnd';
import { find } from 'lodash';
import { getRandomString } from '@/utils/util';
import styles from './actionDefiner.module.less';

const { Option } = Select;

const ActionDefiner = (props) => {
  const { data, value, onChange } = props;
  const currentValue = Array.isArray(value) && value.length > 0 ? [...value] : [];

  function addDynamicRow() {
    onChange([...currentValue, {}]);
  }

  function deleteDynamicRow(index) {
    currentValue.splice(index, 1);
    onChange([...currentValue]);
  }

  function onOrderChanged(ev) {
    const { removedIndex, addedIndex } = ev;
    const _currentValue = [...currentValue];
    let itemToAdd;
    if (removedIndex !== null) {
      itemToAdd = _currentValue.splice(removedIndex, 1)[0];
    }
    if (addedIndex !== null) {
      _currentValue.splice(addedIndex, 0, itemToAdd);
    }
    onChange(_currentValue);
  }

  // 切换动作类型
  function onTypeChange(index, code) {
    const { actionName } = find(data, { code });
    currentValue[index].code = code;
    currentValue[index].params = [];
    currentValue[index].type = actionName;
    onChange([...currentValue]);
  }

  // 动作参数更新
  function onParamChange(dataRowIndex, index, _value) {
    currentValue[dataRowIndex].params.splice(index, 1, _value);
    onChange(currentValue);
  }

  // 根据协议key找到对应的那条数据
  function getActionData(code) {
    return find(data, { code });
  }

  function getOptions(dataRowIndex, code) {
    const result = [];
    const actionData = getActionData(code);
    if (actionData && actionData.params) {
      Object.keys(actionData.params).forEach((labelKey, index) => {
        result.push(
          <Input
            key={index}
            style={{ width: 170 }}
            addonBefore={actionData.params[labelKey]}
            value={currentValue[dataRowIndex].params[index]}
            onChange={(ev) => {
              onParamChange(dataRowIndex, index, ev.target.value);
            }}
          />,
        );
      });
    }
    return result;
  }

  return (
    <div className={styles.actionDefiner}>
      {currentValue.length > 0 && (
        <Container
          orientation="vertical"
          onDrop={(e) => onOrderChanged(e)}
          dragHandleSelector={'.actionDefinerDrag'}
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
          }}
        >
          {currentValue.map((item, index) => (
            <Draggable key={item.code}>
              <div className={styles.dynamicRow}>
                <BarsOutlined className={'actionDefinerDrag'} style={{ cursor: 'move' }} />
                <div style={{ overflowX: 'auto', overflowY: 'hidden', display: 'flex' }}>
                  <div style={{ marginLeft: 5 }}>
                    <Select
                      style={{ width: 130 }}
                      value={currentValue[index].code}
                      onChange={(code) => {
                        onTypeChange(index, code);
                      }}
                    >
                      {data.map((action) => (
                        <Option key={getRandomString(6)} value={action.code}>
                          {action.actionName}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className={styles.dynamicValueInputs}>{getOptions(index, item.code)}</div>
                </div>
                <Button
                  className={styles.dynamicMinusButton}
                  onClick={() => {
                    deleteDynamicRow(index);
                  }}
                >
                  <MinusOutlined />
                </Button>
              </div>
            </Draggable>
          ))}
        </Container>
      )}

      <Button type="dashed" className={styles.dynamicAddButton} onClick={addDynamicRow}>
        <PlusOutlined />
      </Button>
    </div>
  );
};
export default memo(ActionDefiner);

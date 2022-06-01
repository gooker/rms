import React, { memo } from 'react';
import { Button, Input, Select } from 'antd';
import { BarsOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Container, Draggable } from 'react-smooth-dnd';
import styles from './formComponentStyle.module.less';

const { Option, OptGroup } = Select;

const ActionDefiner = (props) => {
  const { data, value, onChange } = props;
  const currentValue = Array.isArray(value) && value.length > 0 ? [...value] : [{}]; // [{code: "A2", value: null}, {code: "B", value: ["2"]]

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

  function onTypeChange(index, code) {
    currentValue[index].code = code;
    currentValue[index].value = [];
    onChange([...currentValue]);
  }

  function onParamChange(dataRowIndex, index, _value) {
    currentValue[dataRowIndex].value.splice(index, 1, _value);
    onChange(currentValue);
  }

  // 根据协议key找到对应的那条数据
  function getActionData(protocolKey) {
    for (let index = 0; index < data.length; index++) {
      const { actionList } = data[index];
      for (let index2 = 0; index2 < actionList.length; index2++) {
        if (actionList[index2].code === protocolKey) {
          return actionList[index2];
        }
      }
    }
  }

  function getOptions(dataRowIndex, code) {
    const result = [];
    const actionData = getActionData(code);
    if (actionData && actionData.params) {
      Object.keys(actionData.params).forEach((labelKey, index) => {
        result.push(
          <Input
            key={labelKey}
            style={{ width: 250 }}
            addonBefore={actionData.params[labelKey]}
            value={currentValue[dataRowIndex].value[index]}
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
              <Select
                allowClear
                style={{ width: 200, marginLeft: 10 }}
                value={currentValue[index].code}
                onChange={(code) => {
                  onTypeChange(index, code);
                }}
              >
                {data.map(({ groupName, actionList }) => (
                  <OptGroup key={groupName} label={groupName}>
                    {actionList.map((action) => (
                      <Option key={action.code} value={action.code}>
                        {action.actionName}
                      </Option>
                    ))}
                  </OptGroup>
                ))}
              </Select>
              <div className={styles.dynamicValueInputs}>{getOptions(index, item.code)}</div>
              {currentValue.length > 1 && (
                <Button
                  className={styles.dynamicMinusButton}
                  onClick={() => {
                    deleteDynamicRow(index);
                  }}
                >
                  <MinusOutlined />
                </Button>
              )}
            </div>
          </Draggable>
        ))}
      </Container>
      <Button type="dashed" className={styles.dynamicAddButton} onClick={addDynamicRow}>
        <PlusOutlined />
      </Button>
    </div>
  );
};
export default memo(ActionDefiner);

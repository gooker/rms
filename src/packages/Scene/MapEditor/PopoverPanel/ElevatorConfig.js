import React, { memo, useEffect, useState } from 'react';
import { Button, Form } from 'antd';
import { isPlainObject } from 'lodash';
import update from 'immutability-helper';
import { CheckOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, isNull } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/components/ButtonInput/ButtonInput';

const ElevatorConfig = (props) => {
  const { dispatch, mapContext } = props;
  const { flag, selections, logicAreaId, currentElevator, elevatorList } = props;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  const [formRef] = Form.useForm();
  const [isDouble, setIsDouble] = useState(false);

  function confirm() {
    formRef.validateFields().then((allValues) => {
      const { replaceCell, logicAreaId, innerCellId } = allValues;
      const innerMapping = { [innerCellId[0]]: replaceCell };
      let currentElevator =
        elevatorList?.length === 0 ? { ...allValues, flag } : { ...elevatorList[flag - 1], flag };
      currentElevator = update(currentElevator, {
        logicLocations: {
          [logicAreaId]: { $set: { doors: allValues.doors, innerMapping } },
        },
      });

      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'map', type: 'elevatorList', data: currentElevator },
      }).then((result) => {
        if (result.type === 'update') {
          const { pre, current } = result;
          pre && mapContext.removeElevator(pre);
          current && mapContext.renderElevator([current]);
          mapContext.refresh();
        }
      });
    });
  }

  function generateDoorsInitialValue() {
    if (isPlainObject(currentElevator?.logicLocations)) {
      const logicElevator = currentElevator.logicLocations[logicAreaId];
      return isNull(logicElevator) ? [{}] : logicElevator.doors;
    }
    return [{}];
  }

  useEffect(() => {
    // 获取电梯点默认值, 其实就是原始地图点位
    const defaultInnerMapping = currentElevator?.logicLocations[logicAreaId]?.innerMapping ?? {};
    const originalCellId = defaultInnerMapping[currentElevator?.innerCellId];

    formRef.setFieldsValue({
      logicAreaId,
      innerCellId: currentElevator?.innerCellId,
      replaceCell: originalCellId,
      doors: generateDoorsInitialValue(),
    });
  }, [logicAreaId]);

  return (
    <div>
      <div style={{ textAlign: 'end', marginBottom: 10 }}>
        <Button type={'primary'} onClick={confirm}>
          <CheckOutlined /> <FormattedMessage id={'app.button.confirm'} />
        </Button>
      </div>
      <Form form={formRef}>
        <Form.Item hidden name={'logicAreaId'} />
        <Form.Item hidden name={'innerCellId'} />

        {/* 替换点 */}
        <Form.Item name={'replaceCell'} label={currentElevator?.innerCellId[0]}>
          <ButtonInput
            type={'number'}
            data={selectCellIds[0]}
            btnDisabled={selectCellIds.length !== 1}
          />
        </Form.Item>

        {/* 电梯门 */}
        <Form.List name={'doors'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div
                  key={key}
                  style={{
                    marginBottom: '20px',
                    padding: '24px 10px 0 10px',
                    borderRadius: '5px',
                    border: '1px solid #e0dcdc',
                  }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'cellId']}
                    fieldKey={[fieldKey, 'cellId']}
                    label={formatMessage({ id: 'editor.cellType.entrance' })}
                  >
                    <ButtonInput
                      type={'number'}
                      data={selectCellIds[0]}
                      btnDisabled={selectCellIds.length !== 1}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'leaveCellId']}
                    fieldKey={[fieldKey, 'leaveCellId']}
                    label={formatMessage({ id: 'editor.cellType.exit' })}
                  >
                    <ButtonInput
                      type={'number'}
                      data={selectCellIds[0]}
                      btnDisabled={selectCellIds.length !== 1}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'waitCellId']}
                    fieldKey={[fieldKey, 'waitCellId']}
                    label={formatMessage({ id: 'editor.cellType.waiting' })}
                  >
                    <ButtonInput
                      type={'number'}
                      data={selectCellIds[0]}
                      btnDisabled={selectCellIds.length !== 1}
                    />
                  </Form.Item>
                </div>
              ))}
              <Form.Item>
                {isDouble ? (
                  <Button
                    type="dashed"
                    onClick={() => {
                      setIsDouble(false);
                      remove(fields[1]?.name);
                    }}
                    style={{ width: '100%' }}
                  >
                    <FormattedMessage id="editor.elevator.singleDoor" />
                  </Button>
                ) : (
                  <Button
                    type="dashed"
                    onClick={() => {
                      setIsDouble(true);
                      add();
                    }}
                    style={{ width: '100%' }}
                  >
                    <FormattedMessage id="editor.elevator.doubleDoor" />
                  </Button>
                )}
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </div>
  );
};
export default connect(({ editor }) => {
  const { selections, currentMap, mapContext, currentLogicArea } = editor;
  const { elevatorList } = currentMap;
  return { selections, mapContext, elevatorList, logicAreaId: currentLogicArea };
})(memo(ElevatorConfig));

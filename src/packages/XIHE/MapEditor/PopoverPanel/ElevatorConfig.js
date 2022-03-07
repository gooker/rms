import React, { memo, useState } from 'react';
import { Button, Divider, Form } from 'antd';
import { CheckOutlined, RollbackOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/components/ButtonInput/ButtonInput';

const ElevatorConfig = (props) => {
  const { dispatch, mapContext, replace, onBack } = props;
  const { flag, selectCellIds, logicAreaId, currentElevator, elevatorList } = props;

  const [formRef] = Form.useForm();
  const [isDouble, setIsDouble] = useState(false);

  function confirm() {
    formRef.validateFields().then((allValues) => {
      const { replaceCell, logicAreaId, innerCellId } = allValues;
      const innerMapping = {};
      for (let index = 0; index < replaceCell.length; index++) {
        const element = replaceCell[index];
        const { cellId } = element;
        innerMapping[innerCellId[index]] = cellId;
      }

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

  // 获取电梯点默认值, 其实就是原始地图点位
  const defaultInnerMapping = currentElevator?.logicLocations[logicAreaId]?.innerMapping ?? {};
  const originalCellId = defaultInnerMapping[currentElevator?.innerCellId];

  return (
    <div>
      <div>
        <Button onClick={onBack}>
          <RollbackOutlined /> <FormattedMessage id={'app.button.return'} />
        </Button>
        <Button type={'primary'} style={{ marginLeft: 15 }} onClick={confirm}>
          <CheckOutlined /> <FormattedMessage id={'app.button.confirm'} />
        </Button>
      </div>
      <Divider style={{ background: '#a3a3a3' }} />
      <Form form={formRef}>
        <Form.Item hidden name={'logicAreaId'} initialValue={logicAreaId} />
        <Form.Item hidden name={'innerCellId'} initialValue={currentElevator?.innerCellId} />

        {/* 替换点 */}
        <Form.List name={'replaceCell'} initialValue={[{ cellId: originalCellId }]}>
          {(fields) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                <Form.Item
                  key={key}
                  {...restField}
                  name={[name, 'cellId']}
                  fieldKey={[fieldKey, 'cellId']}
                  label={currentElevator?.innerCellId[index]}
                >
                  <ButtonInput data={selectCellIds[0]} btnDisabled={selectCellIds.length !== 1} />
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>

        {/* 电梯门 */}
        <Form.List
          name={'doors'}
          initialValue={
            currentElevator &&
            currentElevator?.logicLocations &&
            currentElevator.logicLocations[logicAreaId]
              ? currentElevator.logicLocations[logicAreaId]?.doors
              : [{}]
          }
        >
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
                    <ButtonInput data={selectCellIds[0]} btnDisabled={selectCellIds.length !== 1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'leaveCellId']}
                    fieldKey={[fieldKey, 'leaveCellId']}
                    label={formatMessage({ id: 'editor.cellType.exit' })}
                  >
                    <ButtonInput data={selectCellIds[0]} btnDisabled={selectCellIds.length !== 1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'waitCellId']}
                    fieldKey={[fieldKey, 'waitCellId']}
                    label={formatMessage({ id: 'editor.cellType.waiting' })}
                  >
                    <ButtonInput data={selectCellIds[0]} btnDisabled={selectCellIds.length !== 1} />
                  </Form.Item>
                </div>
              ))}
              <Form.Item>
                {isDouble ? (
                  <Button
                    type="primary"
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
                    type="primary"
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
  const { selections, currentMap, mapContext } = editor;
  const { elevatorList } = currentMap;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  return { selectCellIds, mapContext, elevatorList };
})(memo(ElevatorConfig));

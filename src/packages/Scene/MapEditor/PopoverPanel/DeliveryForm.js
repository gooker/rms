import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { MapSelectableSpriteType } from '@/config/consts';
import { covertDumpFormData2Param, getCurrentLogicAreaData, getOffsetDistance } from '@/utils/mapUtil';
import { formatMessage, isNull, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ButtonInput from '@/components/ButtonInput';
import DirectionSelector from '@/packages/Scene/components/DirectionSelector';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const formLayout2 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };

const DeliveryForm = (props) => {
  const { flag, dispatch, delivery, mapContext, dumpStations, selectCellIds, cellMap } = props;

  const [formRef] = Form.useForm();
  const [vehicleDirectionVisible, setVehicleDirectionVisible] = useState(false);

  useEffect(() => {
    setVehicleDirectionVisible(isNull(delivery?.targetCellId));
  }, []);

  function calculateDumpPosition(allFieldsValue) {
    if (allFieldsValue.baseCell) {
      const distance = parseInt(allFieldsValue.dumpDistance || 0, 10);
      if (allFieldsValue.targetCell) {
        setVehicleDirectionVisible(false);
        const result = getOffsetDistance(
          cellMap[`${allFieldsValue.baseCell}`],
          cellMap[`${allFieldsValue.targetCell}`],
          distance,
        );
        if (result === 0) {
          message.error(formatMessage({ id: 'editor.dump.aligned.required' }));
        }
        if (result === 1) {
          message.error(formatMessage({ id: 'editor.dump.different.required' }));
        }
        formRef.setFieldsValue({ dumpX: result.x, dumpY: result.y });
      } else {
        setVehicleDirectionVisible(true);
        const { x, y } = cellMap[`${allFieldsValue.baseCell}`];
        formRef.setFieldsValue({ dumpX: x, dumpY: y });
      }
    }
  }

  function onValuesChange(changedValues, allValues) {
    // 过滤掉动态表单新增动作
    if (
      changedValues.hasOwnProperty('dumpBasket') &&
      changedValues.dumpBasket[0] !== undefined &&
      changedValues.dumpBasket[changedValues.dumpBasket.length - 1] === undefined
    ) {
      return;
    }
    calculateDumpPosition(allValues);
    const allFieldsValue = formRef.getFieldsValue(true);
    const currentDump = covertDumpFormData2Param(allFieldsValue, dumpStations);
    if (!currentDump) return;

    // 处理dumpBasket名称为空的情况
    currentDump.dumpBasket = currentDump.dumpBasket.map((item, index) => {
      if (isStrictNull(item.key)) {
        return { ...item, key: `${currentDump.cellId}-${String.fromCharCode(65 + index)}` };
      }
      return item;
    });
    currentDump.flag = allFieldsValue.flag;
    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'logic', type: 'dumpStations', data: currentDump },
    }).then((result) => {
      if (result.type === 'add') {
        mapContext.renderDumpFunction([result.payload]);
      }
      if (result.type === 'update') {
        const { pre, current } = result;
        mapContext.removeDumpFunction(pre);
        mapContext.renderDumpFunction([current]);
      }
      mapContext.refresh();
    });
  }

  return (
    <Form form={formRef} onValuesChange={onValuesChange} style={{ width: '100%' }}>
      <Form.Item hidden name={'flag'} initialValue={flag} />

      {/* 抛物点名称 */}
      <Form.Item
        {...formLayout}
        label={formatMessage({ id: 'app.common.name' })}
        name={'name'}
        initialValue={delivery?.name}
      >
        <Input />
      </Form.Item>

      {/* 第一个基准点, 适用于抛物点在点位上 */}
      <Form.Item
        {...formLayout}
        name={'baseCell'}
        initialValue={delivery?.cellId}
        label={formatMessage({ id: 'editor.delivery.baseCell' })}
      >
        <ButtonInput
          type="number"
          data={selectCellIds[0]}
          btnDisabled={selectCellIds.length !== 1}
        />
      </Form.Item>

      {/* 第二个基准点, 适用于抛物点在线条上 */}
      <Form.Item
        {...formLayout}
        name={'targetCell'}
        initialValue={delivery?.targetCellId}
        label={formatMessage({ id: 'app.common.targetCell' })}
      >
        <ButtonInput
          type="number"
          data={selectCellIds[0]}
          btnDisabled={selectCellIds.length !== 1}
        />
      </Form.Item>

      {/* 小车在第一个基准点的方向，如果存在第二个基准点就不需要输入 */}
      {vehicleDirectionVisible && (
        <Form.Item
          {...formLayout}
          name={'vehicleDirection'}
          label={formatMessage({ id: 'vehicle.direction' })}
          initialValue={delivery?.vehicleDirection}
        >
          <DirectionSelector />
        </Form.Item>
      )}

      {/* 相对于第一个基准点的偏移距离，与小车方向互斥 */}
      {!vehicleDirectionVisible && (
        <Form.Item
          {...formLayout}
          name={'dumpDistance'}
          initialValue={delivery?.distance ?? 0}
          label={formatMessage({ id: 'editor.config.distance' })}
        >
          <Input suffix={'mm'} style={{ width: '60%' }} />
        </Form.Item>
      )}

      {/* 显示最终的抛物点坐标，不可手动输入，由上方输入换算 */}
      <Form.Item {...formLayout} label={formatMessage({ id: 'editor.delivery' })}>
        <Row gutter={4} style={{ width: '100%' }}>
          <Col span={12}>
            <Form.Item noStyle name={'dumpX'} initialValue={delivery?.x}>
              <Input prefix={'x'} disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item noStyle name={'dumpY'} initialValue={delivery?.y}>
              <Input prefix={'y'} disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      {/* 抛物框 */}
      <Form.List name="dumpBasket" initialValue={delivery?.dumpBasket || []}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div
                key={key}
                style={{
                  marginBottom: '20px',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #e0dcdc',
                }}
              >
                <div style={{ width: '100%' }}>
                  {/* 抛物框相对于抛物点角度 */}
                  <Form.Item
                    {...formLayout2}
                    {...restField}
                    name={[name, 'direction']}
                    fieldKey={[fieldKey, 'direction']}
                    label={formatMessage({ id: 'app.direction' })}
                  >
                    <DirectionSelector />
                  </Form.Item>

                  {/* 抛物框名称 */}
                  <Form.Item
                    {...formLayout2}
                    {...restField}
                    name={[name, 'key']}
                    fieldKey={[fieldKey, 'key']}
                    label={formatMessage({ id: 'app.common.name' })}
                  >
                    <Input style={{ width: '60%' }} />
                  </Form.Item>

                  {/* 抛物框相对于抛物点距离 */}
                  <Form.Item
                    {...formLayout2}
                    {...restField}
                    initialValue={700}
                    name={[name, 'distance']}
                    fieldKey={[fieldKey, 'distance']}
                    label={formatMessage({ id: 'editor.delivery.distance' })}
                  >
                    <Input suffix={'mm'} style={{ width: '60%' }} />
                  </Form.Item>

                  {/* 抛物速度 */}
                  <Form.Item
                    {...formLayout2}
                    {...restField}
                    name={[name, 'speed']}
                    fieldKey={[fieldKey, 'speed']}
                    label={formatMessage({ id: 'editor.delivery.speed' })}
                  >
                    <Input suffix={'rpm'} style={{ width: '60%' }} />
                  </Form.Item>
                </div>
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(name)}
                  style={{ marginTop: 10, width: '100%' }}
                />
              </div>
            ))}
            <Form.Item>
              <Button block type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                <FormattedMessage id="app.button.add" />
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};
export default connect(({ editor }) => {
  const { currentMap, selections, mapContext } = editor;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ naviId }) => naviId);

  const currentLogicAreaData = getCurrentLogicAreaData();
  const dumpStations = currentLogicAreaData?.dumpStations ?? [];

  return { cellMap: currentMap.cellMap, mapContext, selectCellIds, dumpStations };
})(memo(DeliveryForm));

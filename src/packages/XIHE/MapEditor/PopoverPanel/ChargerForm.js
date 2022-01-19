import React, { memo } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isNull } from '@/utils/utils';
import AngleSelector from '@/components/AngleSelector';
import ButtonInput from '@/components/ButtonInput/ButtonInput';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';

const ChargerForm = (props) => {
  const { dispatch, charger, mapContext, selectCellIds, allChargers, robotTypes } = props;

  const [formRef] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    if (
      !checkNameDuplicate(allValues.name) &&
      !isNull(allValues.angle) &&
      Array.isArray(allValues.chargingCells) &&
      JSON.stringify(allValues.chargingCells[0]) !== '{}'
    ) {
      // 删除无用的字段
      const currentCharger = { ...allValues };
      delete currentCharger.extraAngle;

      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'chargerList', data: currentCharger },
      }).then((result) => {
        const currentLogicAreaData = getCurrentLogicAreaData();
        if (result.type === 'add') {
          mapContext.renderChargers([result.payload]);
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          mapContext.removeCharger(pre, currentLogicAreaData.id);
          mapContext.renderChargers([current]);
        }
        mapContext.refresh();
      });
    }
  }

  function checkNameDuplicate(name) {
    const { tid } = formRef.getFieldValue();
    const existNames = allChargers.filter((item) => item.tid !== tid).map((item) => item.name);
    return existNames.includes(name);
  }

  return (
    <Form form={formRef} onValuesChange={onValueChange} style={{ width: '100%' }}>
      {/* 隐藏字段 */}
      <Form.Item hidden name={'direction'} initialValue={charger?.direction} />
      <Form.Item hidden name={'angle'} initialValue={charger?.angle} />

      {/* 名称 */}
      <Form.Item
        name={'name'}
        initialValue={charger?.name}
        label={formatMessage({ id: 'app.common.name' })}
        rules={[
          { required: true },
          () => ({
            validator(_, value) {
              const isDuplicate = checkNameDuplicate(value);
              if (!isDuplicate) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
            },
          }),
        ]}
      >
        <Input />
      </Form.Item>

      {/* 角度 */}
      <Form.Item
        name={'extraAngle'}
        initialValue={charger?.extraAngle}
        label={<FormattedMessage id="app.common.angle" />}
        getValueFromEvent={(value) => {
          formRef.setFieldsValue({
            direction: value.dir,
            angle: value.angle,
          });
        }}
      >
        <AngleSelector />
      </Form.Item>

      {/* 充电点 */}
      <Form.List
        name={'chargingCells'}
        initialValue={
          Array.isArray(charger?.chargingCells) && charger?.chargingCells.length > 0
            ? charger?.chargingCells
            : [{}]
        }
      >
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Row
                key={key}
                style={{
                  border: '1px solid #e0dcdc',
                  padding: '25px 10px 0 10px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                }}
                gutter={6}
              >
                <Col span={21}>
                  {/* 充电点 */}
                  <Form.Item
                    {...restField}
                    name={[name, 'cellId']}
                    fieldKey={[fieldKey, 'cellId']}
                    label={formatMessage({ id: 'editor.cellType.charging' })}
                  >
                    <ButtonInput
                      type={'number'}
                      data={selectCellIds[0]}
                      btnDisabled={selectCellIds.length !== 1}
                    />
                  </Form.Item>

                  {/* 小车类型 */}
                  <Form.Item
                    {...restField}
                    name={[name, 'agvTypes']}
                    fieldKey={[fieldKey, 'agvTypes']}
                    label={formatMessage({ id: 'app.agv.type' })}
                  >
                    <Select mode="multiple">
                      {robotTypes.map((record) => (
                        <Select.Option value={record} key={record}>
                          {record}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={3} style={{ textAlign: 'center' }}>
                  <Button type="danger" onClick={() => remove(name)}>
                    <DeleteOutlined />
                  </Button>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button block type="dashed" onClick={() => add()}>
                <PlusOutlined />
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  );
};
export default connect(({ editor }) => {
  const { selectCells, currentMap, mapContext } = editor;

  // 获取所有充电桩名称列表
  const allChargers = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const chargerList = item.chargerList || [];
    allChargers.push(...chargerList);
  });

  return { allChargers, mapContext, selectCellIds: selectCells };
})(memo(ChargerForm));

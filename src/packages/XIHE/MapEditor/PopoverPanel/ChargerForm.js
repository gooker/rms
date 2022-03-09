import React, { memo } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isNull } from '@/utils/util';
import AngleSelector from '@/components/AngleSelector';
import ButtonInput from '@/components/ButtonInput/ButtonInput';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { MapSelectableSpriteType } from '@/config/consts';
import styles from './popoverPanel.module.less';

const ChargerForm = (props) => {
  const { flag, dispatch, charger, mapContext, selectCellIds, allChargers, robotTypes } = props;

  const [formRef] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    if (
      !checkNameDuplicate(allValues.name) &&
      !isNull(allValues.angle) &&
      Array.isArray(allValues.chargingCells) &&
      JSON.stringify(allValues.chargingCells[0]) !== '{}'
    ) {
      const currentCharger = { ...allValues };
      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'chargerList', data: currentCharger },
      }).then((result) => {
        const currentLogicAreaData = getCurrentLogicAreaData();
        if (result.type === 'add') {
          mapContext.renderChargers([result.payload], null);
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
    const existNames = allChargers
      .filter((item, index) => index !== flag - 1)
      .map((item) => item.name);
    return existNames.includes(name);
  }

  return (
    <Form form={formRef} onValuesChange={onValueChange} style={{ width: '100%' }}>
      {/* 隐藏字段 */}
      <Form.Item hidden name={'flag'} initialValue={flag} />
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
        initialValue={charger?.angle}
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
              <div key={key} className={styles.chargerFormDynamicRow}>
                <div>
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
                </div>
                <Button
                  size={'small'}
                  type="danger"
                  onClick={() => remove(name)}
                  style={{ width: '100%' }}
                >
                  <DeleteOutlined />
                </Button>
              </div>
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
export default connect(({ global, editor }) => {
  const { selections, currentMap, mapContext } = editor;

  // 获取所有充电桩名称列表
  const allChargers = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const chargerList = item.chargerList || [];
    allChargers.push(...chargerList);
  });

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  return { allChargers, mapContext, selectCellIds, robotTypes: global.allAgvTypes };
})(memo(ChargerForm));

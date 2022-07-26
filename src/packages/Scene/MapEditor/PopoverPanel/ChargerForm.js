import React, { memo } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, getRandomString } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import AngleSelector from '@/components/AngleSelector';
import ButtonInput from '@/components/ButtonInput';
import styles from '../../popoverPanel.module.less';

const { formItemLayout } = getFormLayout(4, 20);
const { formItemLayout: formItemLayout2 } = getFormLayout(6, 18);

const ChargerForm = (props) => {
  const { dispatch, flag, cellMap, charger, mapContext, selectCellIds, allAdaptors } = props;
  const [formRef] = Form.useForm();

  function onValueChange() {
    setTimeout(() => {
      formRef
        .validateFields()
        .then((values) => {
          dispatch({
            type: 'editor/updateFunction',
            payload: { scope: 'logic', type: 'chargerList', data: values },
          }).then((result) => {
            if (result.type === 'add') {
              mapContext.renderChargers([result.payload], null, cellMap);
            }
            if (result.type === 'update') {
              mapContext.updateCharger(result.current, cellMap);
            }
            mapContext.refresh();
          });
        })
        .catch(() => {
        });
    });
  }

  function renderSupportTypesOptions() {
    return Object.values(allAdaptors).map(({ adapterType }) => {
      const { vehicleTypes } = adapterType;
      return (
        <Select.OptGroup
          key={adapterType.code}
          label={`${formatMessage({ id: 'app.configInfo.header.adapter' })}: ${adapterType.name}`}
        >
          {vehicleTypes.map((vehicleType, index) => (
            <Select.Option key={index} value={`${adapterType.code}@${vehicleType.code}`}>
              {vehicleType.name}
            </Select.Option>
          ))}
        </Select.OptGroup>
      );
    });
  }

  function getFormInitialValue() {
    if (charger) {
      return charger.chargingCells;
    } else {
      return [{ cellId: null, angle: null, supportTypes: [] }];
    }
  }

  return (
    <Form
      form={formRef}
      onValuesChange={debounce(onValueChange, 100)}
      style={{ width: '100%' }}
      {...formItemLayout}
    >
      {/* 隐藏字段 */}
      <Form.Item hidden name={'flag'} initialValue={flag} />
      <Form.Item
        hidden
        name={'code'}
        initialValue={charger?.code || `charger_${getRandomString(10)}`}
      />

      {/* ----------------------------------------------------------------------------------------- */}
      {/* 名称 */}
      <Form.Item
        name={'name'}
        initialValue={charger?.name}
        label={formatMessage({ id: 'app.common.name' })}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      {/* 优先级 */}
      <Form.Item
        name={'priority'}
        initialValue={5}
        label={formatMessage({ id: 'app.common.priority' })}
      >
        <InputNumber min={1} max={10} />
      </Form.Item>

      {/* 充电点 */}
      <Form.List name={'chargingCells'} initialValue={getFormInitialValue()}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div key={key} className={styles.chargerFormDynamicRow}>
                <div>
                  {/* 充电点 */}
                  <Form.Item
                    {...restField}
                    {...formItemLayout2}
                    name={[name, 'cellId']}
                    label={formatMessage({ id: 'editor.cellType.charging' })}
                    rules={[{ required: true }]}
                  >
                    <ButtonInput data={selectCellIds[0]} btnDisabled={selectCellIds.length !== 1} />
                  </Form.Item>

                  {/* 物理角度 */}
                  <Form.Item
                    {...restField}
                    {...formItemLayout2}
                    name={[name, 'angle']}
                    label={formatMessage({ id: 'app.common.angle' })}
                    rules={[{ required: true }]}
                  >
                    <AngleSelector
                      disabled
                      width={'100%'}
                      addonLabel={{
                        0: formatMessage({ id: 'app.direction.rightSide' }),
                        90: formatMessage({ id: 'app.direction.topSide' }),
                        180: formatMessage({ id: 'app.direction.leftSide' }),
                        270: formatMessage({ id: 'app.direction.bottomSide' }),
                      }}
                    />
                  </Form.Item>

                  {/* 距离 */}
                  <Form.Item
                    {...restField}
                    {...formItemLayout2}
                    name={[name, 'distance']}
                    label={formatMessage({ id: 'editor.config.distance' })}
                    rules={[{ required: true }]}
                  >
                    <InputNumber />
                  </Form.Item>

                  {/* 小车类型 */}
                  <Form.Item
                    {...restField}
                    {...formItemLayout2}
                    name={[name, 'supportTypes']}
                    label={formatMessage({ id: 'app.vehicleType' })}
                    rules={[{ required: true }]}
                  >
                    <Select mode='multiple'>{renderSupportTypesOptions()}</Select>
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
            <Button onClick={() => add()} style={{ width: '100%' }}>
              <PlusOutlined />
            </Button>
          </>
        )}
      </Form.List>
    </Form>
  );
};
export default connect(({ global, editor }) => {
  const { selections, currentMap, mapContext } = editor;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ naviId }) => naviId);

  return {
    mapContext,
    selectCellIds,
    cellMap: currentMap.cellMap,
    allAdaptors: global.allAdaptors,
  };
})(memo(ChargerForm));

import React, { memo } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import {
  formatMessage,
  getFormLayout,
  getRandomString,
  isEmptyPlainObject,
  isNull,
  isStrictNull,
} from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import AngleSelector from '@/components/AngleSelector';
import ButtonInput from '@/components/ButtonInput';
import styles from '../../popoverPanel.module.less';

const { formItemLayout } = getFormLayout(4, 20);
const { formItemLayout: formItemLayout2 } = getFormLayout(6, 18);

const ChargerForm = (props) => {
  const { flag, dispatch, charger, mapContext, selectCellIds, allChargers, allAdaptors } = props;
  console.log(charger);
  const [formRef] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    if (
      !checkNameDuplicate(allValues.name) &&
      !isNull(allValues.angle) &&
      validateChargingCells(allValues.chargingCells)
    ) {
      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'chargerList', data: allValues },
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

  function validateChargingCells(chargingCells) {
    if (!Array.isArray(chargingCells)) return false;
    if (chargingCells.includes(undefined)) return false;

    for (const chargingCell of chargingCells) {
      if (isEmptyPlainObject(chargingCell)) return;
      if (isStrictNull(chargingCell.cellId)) return;
      if (!Array.isArray(chargingCell.supportTypes) || chargingCell.supportTypes.length === 0) {
        return;
      }
    }

    // TODO: 校验多个充电点与图标必须在一条直线
    return true;
  }

  function checkNameDuplicate(name) {
    const existNames = allChargers
      .filter((item, index) => index !== flag - 1)
      .map((item) => item.name);
    return existNames.includes(name);
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

  function generateSupportTypes(data) {
    const newData = [];
    data?.map((item) => {
      const newTypes = [];
      item.supportTypes?.map(({ adapterType, vehicleTypes }) => {
        newTypes.push(`${adapterType}@${vehicleTypes}`);
      });
      newData.push({
        cellId: item.cellId,
        supportTypes: [...newTypes],
      });
    });
    return newData;
  }

  return (
    <Form
      form={formRef}
      onValuesChange={onValueChange}
      style={{ width: '100%' }}
      {...formItemLayout}
    >
      {/* 隐藏字段 */}
      <Form.Item hidden name={'flag'} initialValue={flag} />
      <Form.Item
        hidden
        name={'code'}
        initialValue={charger?.code || `charger_${getRandomString(6)}`}
      />

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
        name={'angle'}
        initialValue={charger?.angle}
        label={<FormattedMessage id="app.common.angle" />}
        rules={[{ required: true }]}
      >
        <AngleSelector
          disabled
          getAngle
          width={'100%'}
          addonLabel={{
            0: formatMessage({ id: 'app.direction.topSide' }),
            90: formatMessage({ id: 'app.direction.rightSide' }),
            180: formatMessage({ id: 'app.direction.bottomSide' }),
            270: formatMessage({ id: 'app.direction.leftSide' }),
          }}
        />
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
      <Form.List
        name={'chargingCells'}
        initialValue={
          Array.isArray(charger?.chargingCells) && charger?.chargingCells.length > 0
            ? generateSupportTypes(charger?.chargingCells)
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
                    {...formItemLayout2}
                    name={[name, 'cellId']}
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
                    {...formItemLayout2}
                    name={[name, 'supportTypes']}
                    label={formatMessage({ id: 'app.vehicleType' })}
                  >
                    <Select mode="multiple">{renderSupportTypesOptions()}</Select>
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

  return {
    mapContext,
    allChargers,
    selectCellIds,
    allAdaptors: global.allAdaptors,
  };
})(memo(ChargerForm));

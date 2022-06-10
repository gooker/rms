import React, { memo } from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import AngleSelector from '@/components/AngleSelector';
import ButtonInput from '@/components/ButtonInput';
import { MapSelectableSpriteType } from '@/config/consts';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 18);

const ChargerMultiForm = (props) => {
  const { dispatch, allChargers, selectCellIds, mapContext, allAdaptors, back } = props;

  const [formRef] = Form.useForm();

  function checkNameDuplicate(name) {
    const { tid } = formRef.getFieldValue();
    const existNames = allChargers.filter((item) => item.tid !== tid).map((item) => item.name);
    return existNames.includes(name);
  }

  function multiSubmit() {
    formRef.validateFields().then((values) => {
      dispatch({ type: 'editor/addChargerInBatches', payload: values }).then((result) => {
        mapContext.renderChargers(result);
        mapContext.refresh();
        back();
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

  return (
    <Form form={formRef} style={{ width: '100%' }} {...formItemLayout}>
      {/* 名称 */}
      <Form.Item
        name={'name'}
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
      <Form.Item name={'angle'} label={<FormattedMessage id="app.common.angle" />}>
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

      {/* 优先级 */}
      <Form.Item
        name={'priority'}
        initialValue={5}
        label={formatMessage({ id: 'app.common.priority' })}
      >
        <InputNumber min={1} max={10} />
      </Form.Item>

      {/* 充电点 */}
      <Form.Item name={'cellIds'} label={<FormattedMessage id="editor.cellType.charging" />}>
        <ButtonInput multi data={selectCellIds} btnDisabled={selectCellIds.length === 0} />
      </Form.Item>

      {/* 小车类型 */}
      <Form.Item name={'supportTypes'} label={formatMessage({ id: 'app.vehicleType' })}>
        <Select mode="multiple">{renderSupportTypesOptions()}</Select>
      </Form.Item>

      <Form.Item {...formItemLayoutNoLabel}>
        <Button type="primary" onClick={multiSubmit}>
          <FormattedMessage id="app.button.confirm" />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default connect(({ editor, global }) => {
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

  return { allChargers, mapContext, selectCellIds, allAdaptors: global.allAdaptors };
})(memo(ChargerMultiForm));

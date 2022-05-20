import React, { memo } from 'react';
import { Form, Select, InputNumber } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import { MapSelectableSpriteType } from '@/config/consts';
import SuperMultiSelect from '@/packages/Scene/components/SuperMultiSelect';
import { convertSupportTypesToDTO } from '@/utils/mapUtil';

const { formItemLayout } = getFormLayout(6, 18);

const RestForm = (props) => {
  const { flag, rest, dispatch, mapContext, allAdaptors, selectCellIds } = props;
  const [formRef] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    if (validateValues(allValues)) {
      const currentRestArea = {
        ...allValues,
        supportTypes: convertSupportTypesToDTO(allValues.supportTypes),
        cellIds: allValues.cellIds.map((item) => parseInt(item)),
      };
      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'restCells', data: currentRestArea },
      }).then((result) => {
        if (result.type === 'add') {
          mapContext.renderRestCells(result.payload, 'add');
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          pre && mapContext.renderRestCells(pre, 'remove');
          mapContext.renderRestCells(current, 'add');
        }
        mapContext.refresh();
      });
    }
  }

  function validateValues(values) {
    const { cellIds, supportTypes, priority } = values;
    if (!Array.isArray(cellIds) || cellIds.length === 0) return false;
    if (!Array.isArray(supportTypes) || supportTypes.length === 0) return false;
    // if (isStrictNull(priority)) return false;
    return true;
  }

  function renderSupportTypesOptions() {
    return Object.values(allAdaptors).map(({ adapterType }) => {
      const { agvTypes } = adapterType;
      return (
        <Select.OptGroup
          key={adapterType.code}
          label={`${formatMessage({ id: 'app.configInfo.header.adapter' })}: ${adapterType.name}`}
        >
          {agvTypes.map((agvType, index) => (
            <Select.Option key={index} value={`${adapterType.code}@${agvType.code}`}>
              {agvType.name}
            </Select.Option>
          ))}
        </Select.OptGroup>
      );
    });
  }

  return (
    <Form form={formRef} onValuesChange={onValueChange} {...formItemLayout}>
      {/* 隐藏字段 */}
      <Form.Item hidden name={'flag'} initialValue={flag} />

      <Form.Item
        name={'cellIds'}
        label={formatMessage({ id: 'editor.cellType.rest' })}
        initialValue={rest?.cellIds}
        rules={[{ required: true }]}
      >
        <SuperMultiSelect currentCellId={selectCellIds} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name={'supportTypes'}
        label={formatMessage({ id: 'app.agvType' })}
        initialValue={rest?.supportTypes}
        rules={[{ required: true }]}
      >
        <Select mode='multiple'>{renderSupportTypesOptions()}</Select>
      </Form.Item>

      {/*<Form.Item*/}
      {/*  name={'priority'}*/}
      {/*  label={formatMessage({ id: 'app.common.priority' })}*/}
      {/*  initialValue={rest?.priority}*/}
      {/*  rules={[{ required: true }]}*/}
      {/*>*/}
      {/*  <InputNumber min={1} max={10} />*/}
      {/*</Form.Item>*/}
    </Form>
  );
};
export default connect(({ global, editor }) => {
  const { mapContext, selections } = editor;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  return {
    mapContext,
    selectCellIds,
    allAdaptors: global.allAdaptors || [],
  };
})(memo(RestForm));

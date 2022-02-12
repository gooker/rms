import React, { memo } from 'react';
import { Form, Select, InputNumber } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';
import SuperMultiSelect from '@/packages/XIHE/components/SuperMultiSelect';
import { MapSelectableSpriteType } from '@/config/consts';

const { formItemLayout } = getFormLayout(5, 19);

const RestForm = (props) => {
  const { flag, rest, dispatch, mapContext, allAgvTypes, selectCellIds } = props;
  const [formRef] = Form.useForm();

  function onValueChange(changedValues, allValues) {
    const currentRestArea = {
      ...allValues,
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

  return (
    <Form form={formRef} onValuesChange={onValueChange} {...formItemLayout}>
      {/* 隐藏字段 */}
      <Form.Item hidden name={'flag'} initialValue={flag} />

      <Form.Item
        name={'cellIds'}
        label={formatMessage({ id: 'editor.restCells' })}
        initialValue={rest?.cellIds}
      >
        <SuperMultiSelect currentCellId={selectCellIds} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        name={'agvTypes'}
        label={formatMessage({ id: 'app.agv.type' })}
        initialValue={rest?.agvTypes}
      >
        <Select style={{ width: '100%' }} mode="multiple">
          {allAgvTypes.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={'priority'}
        label={formatMessage({ id: 'app.common.priority' })}
        initialValue={rest?.priority}
      >
        <InputNumber />
      </Form.Item>
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
    allAgvTypes: global.allAgvTypes || [],
  };
})(memo(RestForm));

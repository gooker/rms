import React, { memo, useEffect, useState } from 'react';
import { Checkbox, Divider, Form, Input, Switch } from 'antd';
import { MapSelectableSpriteType } from '@/config/consts';
import { connect } from '@/utils/RmsDva';
import { covertIntersectionFormData2Param, getCurrentLogicAreaData } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isNull } from '@/utils/util';
import ButtonInput from '@/components/ButtonInput/ButtonInput';
import Dictionary from '@/utils/Dictionary';

const FormLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const NoLabelFormLayout = { wrapperCol: { offset: 5, span: 19 } };

const IntersectionForm = (props) => {
  const { flag, dispatch, intersection, selectCellIds, mapContext } = props;

  const [formRef] = Form.useForm();
  const [isMultiDirection, setIsMultiDirection] = useState(false);

  useEffect(() => {
    if (!isNull(intersection)) {
      setIsMultiDirection(intersection.ip.length > 1);
    }
  }, []);

  function onValuesChange(changedValues, allValues) {
    const currentIntersection = covertIntersectionFormData2Param(allValues);
    currentIntersection.flag = allValues.flag;

    dispatch({
      type: 'editor/updateFunction',
      payload: { scope: 'logic', type: 'intersectionList', data: currentIntersection },
    }).then((result) => {
      if (result.type === 'add') {
        mapContext.renderIntersection([result.payload]);
      }
      if (result.type === 'update') {
        const { pre, current } = result;
        mapContext.removeIntersection(pre);
        mapContext.renderIntersection([current]);
      }
      mapContext.refresh();
    });
  }
  const ipInputValue = {};
  if (Array.isArray(intersection?.ip)) {
    intersection.ip.forEach(({ direction, value }) => {
      ipInputValue[`ip${direction}`] = value;
    });
  }

  return (
    <Form form={formRef} onValuesChange={onValuesChange} style={{ width: '100%' }}>
      <Form.Item hidden name={'flag'} initialValue={flag} />

      {/* 点位 */}
      <Form.Item {...NoLabelFormLayout}>
        <Checkbox
          checked={isMultiDirection}
          onChange={(ev) => {
            setIsMultiDirection(ev.target.checked);
          }}
        >
          <FormattedMessage id="editor.intersection.multiDirection" />
        </Checkbox>
      </Form.Item>
      <Form.Item
        {...FormLayout}
        name={'cellId'}
        initialValue={intersection?.cellId}
        label={formatMessage({ id: 'app.map.cell' })}
      >
        <ButtonInput
          type={'number'}
          data={selectCellIds[0]}
          btnDisabled={selectCellIds.length !== 1}
          icon={<img alt={'intersection'} style={{ width: 25 }} src={'/images/intersection.png'} />}
        />
      </Form.Item>
      <Form.Item
        {...FormLayout}
        name={'isTrafficCell'}
        initialValue={intersection?.isTrafficCell || false}
        valuePropName={'checked'}
        label={formatMessage({ id: 'editor.intersection.isTrafficCell' })}
      >
        <Switch />
      </Form.Item>

      {/* IP */}
      {isMultiDirection ? (
        <>
          <Divider orientation="left">IP</Divider>
          <Form.Item
            {...FormLayout}
            name={'ip0'}
            initialValue={ipInputValue.ip0}
            label={<FormattedMessage id={Dictionary('agvDirection', 0)} />}
          >
            <Input style={{ width: '100%' }} allowClear />
          </Form.Item>

          <Form.Item
            {...FormLayout}
            name={'ip1'}
            initialValue={ipInputValue.ip90}
            label={<FormattedMessage id={Dictionary('agvDirection', 90)} />}
          >
            <Input style={{ width: '100%' }} allowClear />
          </Form.Item>

          <Form.Item
            {...FormLayout}
            name={'ip2'}
            initialValue={ipInputValue.ip180}
            label={<FormattedMessage id={Dictionary('agvDirection', 180)} />}
          >
            <Input style={{ width: '100%' }} allowClear />
          </Form.Item>

          <Form.Item
            {...FormLayout}
            name={'ip3'}
            initialValue={ipInputValue.ip270}
            label={<FormattedMessage id={Dictionary('agvDirection', 270)} />}
          >
            <Input style={{ width: '100%' }} allowClear />
          </Form.Item>
        </>
      ) : (
        <Form.Item {...FormLayout} name={'ip'} initialValue={ipInputValue.ip0} label={'IP'}>
          <Input style={{ width: '100%' }} allowClear />
        </Form.Item>
      )}
    </Form>
  );
};
export default connect(({ editor }) => {
  const { selections, mapContext } = editor;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  const currentLogicAreaData = getCurrentLogicAreaData();
  const dumpStations = currentLogicAreaData?.dumpStations ?? [];

  return { mapContext, selectCellIds, dumpStations };
})(memo(IntersectionForm));

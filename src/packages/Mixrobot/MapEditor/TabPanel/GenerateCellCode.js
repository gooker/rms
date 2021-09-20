import React, { memo, useEffect, useContext, useState } from 'react';
import { connect } from '@/utils/dva';
import { Form, InputNumber, Drawer, Button, Select, Radio } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { GlobalDrawerWidth } from '@/Const';
import MapContext from '../MapEdit/component/MapContext';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const tailLayout = { wrapperCol: { offset: 6, span: 16 } };

const GenerateCellCode = (props) => {
  const { dispatch, selectCells, generateCellCode, rangeStart, rangeEnd } = props;
  const [form] = Form.useForm();

  const mapRef = useContext(MapContext);
  const [generateWay, setGenerateWay] = useState('increment');

  useEffect(() => {
    form.setFieldsValue({ cellIds: selectCells });
  }, [selectCells]);

  useEffect(() => {
    form.setFieldsValue({
      startCode: rangeStart,
      cellIds: [],
    });
  }, [rangeStart]);

  function onWayChanged(ev) {
    setGenerateWay(ev.target.value);
    form.setFieldsValue({
      startCode: ev.target.value === 'increment' ? rangeStart : rangeEnd,
    });
    form.validateFields();
  }

  function submit() {
    form.validateFields().then((value) => {
      dispatch({
        type: 'editor/generateCellCode',
        payload: value,
      }).then((result) => mapRef.updateCells({ type: 'code', payload: result }));
    });
  }

  return (
    <Drawer
      destroyOnClose
      mask={false}
      width={GlobalDrawerWidth}
      title={<FormattedMessage id="app.generateCode.generateAddressCode" />}
      visible={generateCellCode || false}
      onClose={() => {
        dispatch({
          type: 'editor/updateModalVisit',
          payload: { value: false, type: 'generateCellCode' },
        });
      }}
    >
      <Form form={form}>
        {/* 操作点 */}
        <Form.Item
          {...layout}
          name={'cellIds'}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'app.generateCode.operatingPoint' })}
        >
          <Select
            disabled
            maxTagCount={3}
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={formatMessage({
              id: 'app.generateCode.operatingPoint.require',
            })}
          />
        </Form.Item>

        {/* 递增/递减 */}
        <Form.Item
          {...layout}
          name={'way'}
          rules={[{ required: true }]}
          initialValue={generateWay}
          label={formatMessage({ id: 'app.generateCode.way' })}
          getValueFromEvent={(ev) => {
            onWayChanged(ev);
            return ev.target.value;
          }}
        >
          <Radio.Group>
            <Radio.Button value="increment">递增</Radio.Button>
            <Radio.Button value="subtract">递减</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* 起始码 */}
        <Form.Item
          {...layout}
          name={'startCode'}
          initialValue={rangeStart}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'app.generateCode.starteCode' })}
        >
          <InputNumber
            placeholder={formatMessage({ id: 'app.generateCode.starteCode.require' })}
            style={{ width: 200 }}
          />
        </Form.Item>

        {/* 递增/递减值 */}
        <Form.Item
          {...layout}
          name={'step'}
          initialValue={1}
          rules={[
            {
              required: true,
              message: formatMessage({ id: `app.generateCode.${generateWay}.require` }),
            },
          ]}
          label={formatMessage({ id: 'app.generateCode.increment' })}
        >
          <InputNumber
            placeholder={formatMessage({ id: 'app.generateCode.increment.require' })}
            style={{ width: 200 }}
          />
        </Form.Item>

        {/* 确定 */}
        <Form.Item {...tailLayout}>
          <Button type="primary" disabled={selectCells.length === 0} onClick={submit}>
            <FormattedMessage id="app.generateCode.sure" />
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
export default connect(({ editor }) => {
  const { selectCells, visible } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  return {
    selectCells,
    generateCellCode: visible.generateCellCode,
    rangeStart: currentLogicAreaData?.rangeStart,
    rangeEnd: currentLogicAreaData?.rangeEnd,
  };
})(memo(GenerateCellCode));

import React, { useEffect, useContext, useState, memo } from 'react';
import { connect } from '@/utils/dva';
import { Form, Row, Checkbox, Col, InputNumber, Drawer, Button, Select } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { InfoOutlined } from '@ant-design/icons';
import DirButton from './DirButton/DirButton';
import { GlobalDrawerWidth } from '@/Const';
import MapContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

const layout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

const AdjustSpace = (props) => {
  const { dispatch, selectCells, adjustSpaceVisible } = props;

  const mapRef = useContext(MapContext);
  const [form] = Form.useForm();
  const [isAll, setIsAll] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ cellIds: selectCells, isAll: false });
  }, [selectCells]);

  function submit() {
    form.validateFields().then((value) => {
      dispatch({
        type: 'editor/adjustSpace',
        payload: { ...value },
      }).then((result) => {
        const { cell, line } = result;
        mapRef.updateCells({ type: 'adjustSpace', payload: cell });
        mapRef.updateLines({ type: 'remove', payload: line.delete });
        mapRef.updateLines({ type: 'add', payload: line.add });
      });
    });
  }

  return (
    <Drawer
      destroyOnClose
      width={GlobalDrawerWidth}
      mask={false}
      title={<FormattedMessage id="app.cellMap.adjustSpacing" />}
      visible={adjustSpaceVisible || false}
      onClose={() => {
        dispatch({
          type: 'editor/updateModalVisit',
          payload: { value: false, type: 'adjustSpaceVisible' },
        });
      }}
    >
      <Form form={form}>
        <Form.Item {...layout} label={formatMessage({ id: 'app.generateCode.operatingPoint' })}>
          <Row gutter={10}>
            <Col span={16}>
              <Form.Item noStyle name={'cellIds'} initialValue={selectCells}>
                <Select mode="multiple" maxTagCount={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item
                noStyle
                name={'isAll'}
                valuePropName={'checked'}
                getValueFromEvent={(ev) => {
                  setIsAll(ev.target.checked);
                  return ev.target.checked;
                }}
              >
                <Checkbox>
                  <FormattedMessage id="app.cellMap.logicAll" />
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* 偏移方向 */}
        <Form.Item
          {...layout}
          name={'dir'}
          label={<FormattedMessage id="app.cellMap.adjustBaseline" />}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'app.cellMap.adjustBaseline.required' }),
            },
          ]}
        >
          <DirButton />
        </Form.Item>

        {/* 偏移距离 */}
        <Form.Item
          {...layout}
          name={'distance'}
          label={<FormattedMessage id="app.cellMap.cellSpaceing" />}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'app.cellMap.cellSpaceing.required' }),
            },
          ]}
        >
          <InputNumber style={{ width: 200 }} />
        </Form.Item>

        {/* 确定 */}
        <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
          <Button type="primary" disabled={selectCells.length === 0 && !isAll} onClick={submit}>
            <FormattedMessage id="app.generateCode.sure" />
          </Button>
        </Form.Item>

        {/* 警告 */}
        <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
          <InfoOutlined />.{' '}
          <span style={{ fontSize: 15, color: 'red' }}>
            <FormattedMessage id="app.cellMap.adjustSpacingWarning" />
          </span>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
export default connect(({ editor }) => {
  const { selectCells, visible } = editor;
  return {
    selectCells,
    adjustSpaceVisible: visible.adjustSpaceVisible,
  };
})(memo(AdjustSpace));

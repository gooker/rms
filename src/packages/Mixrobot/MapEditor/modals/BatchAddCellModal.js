import React, { memo, useEffect, useContext, useState } from 'react';
import { connect } from '@/utils/dva';
import { Form, Input, InputNumber, Drawer, Button, Radio, Divider } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { GlobalDrawerWidth } from '@/Const';
import DirButton from './DirButton';
import MapContext from '../MapEdit/component/MapContext';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const tailLayout = { wrapperCol: { offset: 6, span: 16 } };

const BatchAddCellModal = (props) => {
  const { dispatch } = props;
  const { selectCells, batchAddCellVisible, currentLogicArea } = props;
  const { rangeStart, rangeEnd } = currentLogicArea;

  const [form] = Form.useForm();
  const mapRef = useContext(MapContext);
  const [addWay, setAddWay] = useState('absolute');

  useEffect(() => {
    if (addWay === 'offset') {
      form.setFieldsValue({ cellIds: selectCells ?? [] });
    }
  }, [selectCells]);

  useEffect(() => {
    form.setFieldsValue({ autoGenCellIdStart: rangeStart });
  }, [currentLogicArea]);

  const submit = () => {
    form.validateFields().then((value) => {
      dispatch({
        type: 'editor/batchAddCells',
        payload: { ...value, addWay },
      }).then(({ centerMap, additionalCells }) => {
        mapRef.updateCells({ type: 'add', payload: additionalCells });
        if (centerMap) {
          const cellMap = {};
          additionalCells.forEach((item) => {
            cellMap[item.id] = item;
          });
          mapRef.centerView(cellMap);
        }
      });
    });
  };

  return (
    <Drawer
      destroyOnClose
      mask={false}
      width={GlobalDrawerWidth}
      title={<FormattedMessage id="app.batchAddCellModal.batchAddPoints" />}
      visible={batchAddCellVisible || false}
      onClose={() => {
        dispatch({
          type: 'editor/updateModalVisit',
          payload: { type: 'batchAddCellVisible', value: false },
        });
      }}
    >
      {/* 添加方式 */}
      <div>
        <span style={{ marginRight: 10 }}>
          <FormattedMessage id="app.batchAddCellModal.addWay" />:
        </span>
        <Radio.Group
          value={addWay}
          buttonStyle="solid"
          onChange={({ target: { value } }) => {
            setAddWay(value);
          }}
        >
          <Radio.Button value={'absolute'}>
            {/* 绝对值 */}
            <FormattedMessage id="app.batchAddCellModal.absoluteValue" />
          </Radio.Button>
          <Radio.Button value={'offset'}>
            {/* 偏移 */}
            <FormattedMessage id="app.batchAddCellModal.deviation" />
          </Radio.Button>
        </Radio.Group>
      </div>
      <Divider />

      {addWay === 'absolute' ? (
        <Form form={form}>
          {/* 起始点 */}
          <Form.Item
            {...layout}
            name="autoGenCellIdStart"
            initialValue={rangeStart}
            label={formatMessage({ id: 'app.batchAddCellModal.startPoint' })}
          >
            <InputNumber min={rangeStart} max={rangeEnd} style={{ width: 150 }} />
          </Form.Item>

          {/* 起始X轴坐标 */}
          <Form.Item
            {...layout}
            name="x"
            initialValue={0}
            label={formatMessage({ id: 'app.batchAddCellModal.startXCoordinate' })}
          >
            <InputNumber
              style={{ width: 80 }}
              placeholder={formatMessage({
                id: 'app.batchAddCellModal.XCoordinate.require',
              })}
            />
          </Form.Item>

          {/* 起始Y轴坐标 */}
          <Form.Item
            {...layout}
            name={'y'}
            initialValue={0}
            label={formatMessage({ id: 'app.batchAddCellModal.startYCoordinate' })}
          >
            <InputNumber
              style={{ width: 80 }}
              placeholder={formatMessage({
                id: 'app.batchAddCellModal.YCoordinate.require',
              })}
            />
          </Form.Item>

          {/* X轴码间距 */}
          <Form.Item
            {...layout}
            name={'distanceX'}
            initialValue={1225}
            label={formatMessage({ id: 'app.batchAddCellModal.XaxisCodeSpace' })}
          >
            <InputNumber
              style={{ width: 80 }}
              placeholder={formatMessage({
                id: 'app.batchAddCellModal.XaxisCodeSpace.require',
              })}
            />
          </Form.Item>

          {/* Y轴码间距 */}
          <Form.Item
            {...layout}
            name={'distanceY'}
            initialValue={1225}
            label={formatMessage({ id: 'app.batchAddCellModal.YaxisCodeSpace' })}
          >
            <InputNumber
              style={{ width: 80 }}
              placeholder={formatMessage({
                id: 'app.batchAddCellModal.YaxisCodeSpace.require',
              })}
            />
          </Form.Item>

          {/* 行数 */}
          <Form.Item
            {...layout}
            name={'rows'}
            initialValue={20}
            label={formatMessage({ id: 'app.batchAddCellModal.row' })}
          >
            <InputNumber style={{ width: 80 }} />
          </Form.Item>

          {/* 列数 */}
          <Form.Item
            {...layout}
            name={'cols'}
            initialValue={20}
            label={formatMessage({ id: 'app.batchAddCellModal.column' })}
          >
            <InputNumber style={{ width: 80 }} />
          </Form.Item>

          {/* 生成 */}
          <Form.Item {...tailLayout}>
            <Button type="primary" onClick={submit}>
              <FormattedMessage id="app.batchAddCellModal.generate" />
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form form={form}>
          {/* 偏移码 */}
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name={'cellIds'}
            initialValue={selectCells}
            label={formatMessage({ id: 'app.batchAddCellModal.offsetCode' })}
          >
            <Input disabled style={{ width: 150 }} />
          </Form.Item>

          {/* 方向 */}
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name={'dir'}
            initialValue={0}
            label={formatMessage({ id: 'app.batchAddCellModal.direction' })}
          >
            <DirButton />
          </Form.Item>

          {/* 码间距 */}
          <Form.Item
            {...layout}
            name={'distance'}
            initialValue={0}
            label={formatMessage({ id: 'app.batchAddCellModal.codeSpace' })}
          >
            <InputNumber style={{ width: 80 }} />
          </Form.Item>

          {/* 偏移个数 */}
          <Form.Item
            {...layout}
            name={'count'}
            initialValue={0}
            label={formatMessage({ id: 'app.batchAddCellModal.offsetsNumber' })}
          >
            <InputNumber style={{ width: 80 }} />
          </Form.Item>

          {/* 生成 */}
          <Form.Item {...tailLayout}>
            <Button type="primary" onClick={submit} disabled={selectCells.length === 0}>
              <FormattedMessage id="app.batchAddCellModal.generate" />
            </Button>
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};
export default connect(({ editor }) => {
  const { selectCells, visible } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  return {
    selectCells,
    currentLogicArea: currentLogicAreaData || {},
    batchAddCellVisible: visible.batchAddCellVisible,
  };
})(memo(BatchAddCellModal));

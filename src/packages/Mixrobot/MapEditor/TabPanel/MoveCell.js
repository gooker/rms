import React, { useEffect, useState, useContext, memo } from 'react';
import { connect } from '@/utils/dva';
import { Col, Row, Form, InputNumber, Drawer, Button, Select, Tabs } from 'antd';
import { InfoOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import DirButton from './DirButton/DirButton';
import { GlobalDrawerWidth } from '@/Const';
import MenuIcon from '@/utils/MenuIcon';
import MapContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const MoveCell = (props) => {
  const { dispatch, selectCells, moveCellVisible } = props;

  const mapRef = useContext(MapContext);
  const [form] = Form.useForm();
  const [type, setType] = useState('offset');

  useEffect(() => {
    form.setFieldsValue({ cellIds: selectCells });
  }, [selectCells]);

  function submit() {
    form.validateFields().then((value) => {
      if (type === 'offset') {
        dispatch({
          type: 'editor/moveCells',
          payload: {
            cellIds: value.cellIds,
            dir: value.dir,
            distance: value.distance,
          },
        }).then((result) => {
          const { cell, line } = result;
          mapRef.updateCells({ type: 'move', payload: cell });
          mapRef.updateLines({ type: 'remove', payload: line.delete });
          mapRef.updateLines({ type: 'add', payload: line.add });
        });
      } else {
        dispatch({
          type: 'mapEdit/copyCellsFromOrigin',
          payload: {
            cellIds: value.cellIds,
            moveCenter: value.moveCenter,
            markCellId: value.markCellId,
          },
        });
      }
    });
  }

  return (
    <Drawer
      destroyOnClose
      width={GlobalDrawerWidth}
      mask={false}
      title={<FormattedMessage id="app.cellMap.movePoint" />}
      visible={moveCellVisible || false}
      onClose={() => {
        dispatch({
          type: 'editor/updateModalVisit',
          payload: { value: false, type: 'moveCellVisible' },
        });
      }}
    >
      <Form form={form}>
        <Tabs activeKey={type} onChange={setType}>
          {/* 相对距离 */}
          <Tabs.TabPane key="offset" tab={formatMessage({ id: 'app.moveCell.relativeDistance' })}>
            {/* 操作点位 */}
            <Form.Item
              {...layout}
              name={'cellIds'}
              initialValue={selectCells}
              label={formatMessage({ id: 'app.generateCode.operatingPoint' })}
            >
              <Select disabled mode="multiple" style={{ width: '100%' }} />
            </Form.Item>

            {/* 偏移方向 */}
            <Form.Item
              {...layout}
              name={'dir'}
              initialValue={510}
              label={<FormattedMessage id="app.moveCell.offsetDirection" />}
            >
              <DirButton />
            </Form.Item>

            {/* 偏移距离 */}
            <Form.Item
              {...layout}
              name={'distance'}
              initialValue={510}
              label={<FormattedMessage id="app.moveCell.offsetDistance" />}
            >
              <InputNumber
                placeholder={formatMessage({ id: 'app.moveCell.offsetXDistance.require' })}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Tabs.TabPane>
          {/* 增量复制 */}
          <Tabs.TabPane
            key="additional"
            tab={formatMessage({ id: 'app.moveCell.incrementalCopy' })}
          >
            <Form.Item {...layout} label={<FormattedMessage id="app.moveCell.sourceCell" />}>
              <Row>
                <Col span={18}>
                  <Form.Item name={'moveCenter'} initialValue={510} noStyle>
                    <InputNumber
                      placeholder={formatMessage({
                        id: 'app.moveCell.offsetXDistance.require',
                      })}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Button
                    icon={MenuIcon.plus}
                    disabled={selectCells.length !== 1}
                    onClick={() => {
                      form.setFieldsValue({
                        moveCenter: selectCells[0],
                      });
                    }}
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item {...layout} label={<FormattedMessage id="app.moveCell.targetCell" />}>
              <Row>
                <Col span={18}>
                  <Form.Item name={'markCellId'} initialValue={510} noStyle>
                    <InputNumber
                      placeholder={formatMessage({
                        id: 'app.moveCell.offsetXDistance.require',
                      })}
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Button
                    onClick={() => {
                      form.setFieldsValue({
                        markCellId: selectCells[0],
                      });
                    }}
                    disabled={selectCells.length !== 1}
                    icon={MenuIcon.plus}
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item
              {...layout}
              name={'cellIds'}
              initialValue={selectCells}
              label={formatMessage({ id: 'app.generateCode.operatingPoint' })}
            >
              <Select disabled mode="multiple" style={{ width: '100%' }} />
            </Form.Item>
          </Tabs.TabPane>
        </Tabs>

        {/* 确定 */}
        <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
          <Button type="primary" disabled={selectCells.length === 0} onClick={submit}>
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
    moveCellVisible: visible.moveCellVisible,
  };
})(memo(MoveCell));

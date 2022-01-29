import React, { memo, useEffect, useState } from 'react';
import { Form, Select, Tabs, InputNumber, Row, Col, Button } from 'antd';
import { InfoOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import { formatMessage } from '@/utils/util';
import DirectionSelector from '@/packages/XIHE/components/DirectionSelector';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './popoverPanel.module.less';

const MoveCell = (props) => {
  const { dispatch, selectCells, mapContext } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    formRef.setFieldsValue({ cellIds: selectCells });
  }, [selectCells]);

  function submit() {
    formRef.validateFields().then((value) => {
      dispatch({
        type: 'editor/moveCells',
        payload: {
          cellIds: value.cellIds,
          dir: value.dir,
          distance: value.distance,
        },
      }).then((result) => {
        const { cell, line } = result;
        mapContext.updateCells({ type: 'move', payload: cell });
        mapContext.updateLines({ type: 'remove', payload: line.delete });
        mapContext.updateLines({ type: 'add', payload: line.add });
      });
    });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} layout={'vertical'}>
        {/* 操作点位 */}
        <Form.Item
          name={'cellIds'}
          initialValue={selectCells}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'app.map.cell' })}
        >
          <Select mode="multiple" style={{ width: 250 }} />
        </Form.Item>

        {/* 偏移方向 */}
        <Form.Item
          name={'dir'}
          initialValue={510}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'app.direction' })}
        >
          <DirectionSelector />
        </Form.Item>

        {/* 偏移距离 */}
        <Form.Item
          name={'distance'}
          initialValue={510}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'editor.moveCell.offsetDistance' })}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 确定 */}
        <Form.Item>
          <Button type="primary" onClick={submit}>
            <FormattedMessage id="app.button.confirm" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
  selectCells: editor.selectCells,
}))(memo(MoveCell));

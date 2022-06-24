import React, { memo, useEffect } from 'react';
import { Button, Form, InputNumber } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../popoverPanel.module.less';
import DirectionSelector from '@/packages/Scene/components/DirectionSelector';
import ButtonInput from '@/components/ButtonInput';
import { MapSelectableSpriteType } from '@/config/consts';

const MoveCell = (props) => {
  const { dispatch, selectCellIds, mapContext } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    formRef.setFieldsValue({ cellIds: selectCellIds });
  }, [selectCellIds]);

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

        const removePayload = { lines: [], arrows: [] };
        line.delete.forEach(({ source, target }) => {
          // line 正反都要删
          removePayload.lines.push(`${source}-${target}`);
          removePayload.lines.push(`${target}-${source}`);

          removePayload.arrows.push(`${source}-${target}`);
          removePayload.arrows.push(`${target}-${source}`);
        });
        mapContext.updateLines({ type: 'remove', payload: removePayload });
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
          initialValue={selectCellIds}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'app.map.cell' })}
        >
          <ButtonInput
            maxTagCount={100}
            multi={true}
            data={selectCellIds}
            btnDisabled={selectCellIds.length === 0}
          />
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
export default connect(({ editor, editorView }) => {
  const { selections, mapContext } = editor;
  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  return { selectCellIds, mapContext };
})(memo(MoveCell));

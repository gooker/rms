import React, { memo, useEffect } from 'react';
import { Button, Form, InputNumber, message } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../../popoverPanel.module.less';
import DirectionSelector from '@/packages/Scene/components/DirectionSelector';
import ButtonInput from '@/components/ButtonInput';
import { MapSelectableSpriteType } from '@/config/consts';
import { getNavigationTypes } from '@/utils/mapUtil';
import { NavigationType } from '@/config/config';

const MoveCell = (props) => {
  const { dispatch, selectCellIds, mapContext } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    formRef.setFieldsValue({ cellIds: selectCellIds });
  }, [selectCellIds]);

  function submit() {
    formRef.validateFields().then((value) => {
      const navigationTypes = getNavigationTypes();
      // 只能针对牧星点位
      if (navigationTypes.length === 1 && navigationTypes[0] === NavigationType.M_QRCODE) {
        dispatch({
          type: 'editor/moveCells',
          payload: value,
        }).then((result) => {
          const { cell, line } = result;
          mapContext.updateCells({ type: 'move', payload: cell });

          const removePayload = { lines: [], arrows: [] };
          line.delete.forEach(({ source, target }) => {
            removePayload.arrows.push(`${source}-${target}`);
            removePayload.arrows.push(`${target}-${source}`);
            removePayload.lines.push(`${source}-${target}`);
            removePayload.lines.push(`${target}-${source}`);
          });
          mapContext.updateLines({ type: 'remove', payload: removePayload });
          mapContext.updateLines({ type: 'add', payload: line.add });
        });
      } else {
        message.warn(formatMessage({ id: 'app.message.onlyMQRMove' }));
      }
    });
  }

  function validator(_, value) {
    if ([0, 90, 180, 270].includes(value)) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error(formatMessage({ id: 'app.message.angleRequired' })));
    }
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
          name={'angle'}
          initialValue={510}
          rules={[{ required: true }, { validator }]}
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

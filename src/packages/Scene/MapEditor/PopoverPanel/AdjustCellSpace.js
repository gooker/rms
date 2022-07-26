import React, { memo, useEffect } from 'react';
import { Button, Form, InputNumber, message, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import { getNavigationTypes } from '@/utils/mapUtil';
import FormattedMessage from '@/components/FormattedMessage';
import DirectionSelector from '@/packages/Scene/components/DirectionSelector';
import { NavigationType } from '@/config/config';
import { MapSelectableSpriteType } from '@/config/consts';
import styles from '../../popoverPanel.module.less';

const AdjustCellSpace = (props) => {
  const { dispatch, selectCells, mapContext } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    formRef.setFieldsValue({ naviIds: selectCells });
  }, [selectCells]);

  function submit() {
    formRef
      .validateFields()
      .then((value) => {
        const navigationTypes = getNavigationTypes();
        // 只能针对牧星点位
        if (navigationTypes.length === 1 && navigationTypes[0] === NavigationType.M_QRCODE) {
          dispatch({
            type: 'editor/adjustSpace',
            payload: { ...value },
          }).then((result) => {
            const { cell, line } = result;
            mapContext.updateCells({ type: 'adjustSpace', payload: cell });

            const removePayload = { lines: [], arrows: [] };
            removePayload.arrows = line.delete.map(({ source, target }) => `${source}-${target}`);
            removePayload.lines = removePayload.arrows;
            mapContext.updateLines({ type: 'remove', payload: removePayload });

            mapContext.updateLines({ type: 'add', payload: line.add });
          });
        } else {
          message.warn(formatMessage({ id: 'app.message.onlyMQRMove' }));
        }
      })
      .catch(() => {
      });
  }

  return (
    <div className={styles.formWhiteLabel}>
      <Form form={formRef} layout={'vertical'}>
        {/* 操作点位 */}
        <Form.Item
          name={'naviIds'}
          initialValue={selectCells}
          label={formatMessage({ id: 'app.map.cell' })}
        >
          <Select
            allowClear
            mode='tags'
            maxTagCount={10}
            style={{ width: '100%' }}
            placeholder={formatMessage({ id: 'app.form.allAsDefault' })}
          />
        </Form.Item>

        {/* 偏移方向 */}
        <Form.Item
          name={'dir'}
          initialValue={510}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'editor.adjustSpace.baseLine' })}
        >
          <DirectionSelector />
        </Form.Item>

        {/* 偏移距离 */}
        <Form.Item
          name={'distance'}
          initialValue={510}
          rules={[{ required: true }]}
          label={formatMessage({ id: 'editor.cell.space' })}
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
export default connect(({ editor }) => {
  const { selections, mapContext } = editor;
  const selectCells = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ naviId }) => naviId);
  return { selectCells, mapContext };
})(memo(AdjustCellSpace));

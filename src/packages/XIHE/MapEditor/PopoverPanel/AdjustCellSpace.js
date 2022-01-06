import React, { memo } from 'react';
import { Form, Select, InputNumber, Button } from 'antd';
import { connect } from '@/utils/dva';
import { formatMessage } from '@/utils/utils';
import DirectionSelector from '@/packages/XIHE/components/DirectionSelector';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './popoverPanel.module.less';

const AdjustCellSpace = (props) => {
  const { submit, selectCells } = props;

  const [formRef] = Form.useForm();

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
          label={formatMessage({ id: 'editor.adjustSpace.baseLine' })}
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
  selectCells: editor.selectCells,
}))(memo(AdjustCellSpace));

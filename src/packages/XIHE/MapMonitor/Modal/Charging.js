import React, { memo, useState } from 'react';
import { Form, Button, Input } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import { agvTryToCharge } from '@/services/monitor';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const Charging = (props) => {
  const { dispatch, allAGVs } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function charge() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        const agv = find(allAGVs, { robotId: values.robotId });
        if (agv) {
          agvTryToCharge(agv.robotType, { ...values }).then((response) => {
            if (!dealResponse(response, formatMessage({ id: 'app.message.sendCommandSuccess' }))) {
              close();
            }
          });
        }
        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <div style={getMapModalPosition(500, 222)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.charge'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef}>
          <Form.Item
            {...formItemLayout}
            name={'robotId'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...formItemLayoutNoLabel}>
            <Button onClick={charge} loading={executing} disabled={executing} type="primary">
              <SendOutlined /> <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
}))(memo(Charging));

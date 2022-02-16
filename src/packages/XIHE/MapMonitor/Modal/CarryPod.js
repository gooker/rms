import React, { memo, useState } from 'react';
import { Form, Button, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fetchPodToCell } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 300;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const CarryPod = (props) => {
  const { dispatch } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function emptyRun() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        fetchPodToCell({ ...values }).then((response) => {
          if (
            !dealResponse(response, true, formatMessage({ id: 'app.message.sendCommandSuccess' }))
          ) {
            close();
          }
        });
        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.carry'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef}>
          <Form.Item
            {...formItemLayout}
            name={'podId'}
            label={formatMessage({ id: 'app.pod' })}
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name={'targetCellId'}
            label={formatMessage({ id: 'app.map.targetCell' })}
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name={'robotId'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item {...formItemLayoutNoLabel}>
            <Button onClick={emptyRun} loading={executing} disabled={executing}>
              <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(() => ({}))(memo(CarryPod));

import React, { memo, useState } from 'react';
import { Form, Button, Input, Switch } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { agvEmptyRun } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 333;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const EmptyRun = (props) => {
  const { dispatch, allAGVs } = props;
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
        const agv = find(allAGVs, { robotId: values.robotId });
        if (agv) {
          agvEmptyRun(agv.robotType, { ...values }).then((response) => {
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
    <div style={getMapModalPosition(width, height)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.emptyRun'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form labelWrap form={formRef}>
          <Form.Item
            {...formItemLayout}
            name={'robotId'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            name={'targetCellId'}
            label={formatMessage({ id: 'app.common.targetCell' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={'emergencyAreaChecked'}
            label={'允许进入急停区'}
            valuePropName={'checked'}
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Form.Item {...formItemLayoutNoLabel}>
            <Button type={'primary'} onClick={emptyRun} loading={executing} disabled={executing}>
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
}))(memo(EmptyRun));

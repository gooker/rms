import React, { memo, useState } from 'react';
import { Form, Button, Input, Switch } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { agvEmptyRun } from '@/services/monitor';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import AgvFormComponent from '@/components/AgvFormComponent';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 17);

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
        let newValues={...values}
        newValues.robotId=values.agvId;
        delete newValues.agvId;
        agvEmptyRun({ ...newValues })
          .then((response) => {
            if (!dealResponse(response, formatMessage({ id: 'app.message.sendCommandSuccess' }))) {
              close();
            }
          })
          .finally(() => {
            setExecuting(false);
          });
      })
      .catch(() => {});
  }

  return (
    <div style={getMapModalPosition(550, 330)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.emptyRun'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form labelWrap form={formRef} {...formItemLayout}>
          <AgvFormComponent uiType="column" allAGVs={allAGVs} />
          <Form.Item
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

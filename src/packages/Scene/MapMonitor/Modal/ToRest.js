import React, { memo, useState } from 'react';
import { Form, Button } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { vehicleToRest } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import VehicleFormComponent from '@/components/VehicleFormComponent';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const ToRest = (props) => {
  const { dispatch, allVehicles } = props;
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
        const vehicle = find(allVehicles, { vehicleId: values.vehicleId });
        if (vehicle) {
          vehicleToRest({ ...values }).then((response) => {
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
    <div style={getMapModalPosition(400, 240)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.goRest.toRestArea'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <VehicleFormComponent />
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
  allVehicles: monitor.allVehicles,
}))(memo(ToRest));

import React, { memo, useState, useEffect } from 'react';
import { Radio, message, Form } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, getFormLayout, getMapModalPosition } from '@/utils/util';
import AdvancedCarryComponent from './AdvancedCarryComponent';
import AdvancedReleaseComponent from './AdvancedReleaseComponent';
import styles from '../../monitorLayout.module.less';

const { formItemLayoutNoLabel } = getFormLayout(5, 19);
const AdvancedCarry = (props) => {
  const { dispatch, allVehicles } = props;
  const [type, setType] = useState('carry');
  const [functionArea, setFunctionArea] = useState([]);

  useEffect(() => {
    getArea();
  }, []);

  async function getArea() {
    setFunctionArea([]);
    return [];
  }

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onTypeChange(e) {
    setType(e.target.value);
  }

  return (
    <div style={getMapModalPosition(550, 600)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.advancedCarry'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20, paddingLeft: 25 }}>
        <Form.Item {...formItemLayoutNoLabel}>
          <Radio.Group
            onChange={onTypeChange}
            defaultValue="carry"
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="carry">
              <FormattedMessage id="monitor.right.carry" />
            </Radio.Button>
            <Radio.Button value="release">
              <FormattedMessage id="monitor.advancedCarry.released" />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        {type === 'carry' ? (
          <AdvancedCarryComponent functionArea={functionArea} vehicleList={allVehicles} />
        ) : (
          <AdvancedReleaseComponent functionArea={functionArea} vehicleList={allVehicles} />
        )}
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  allVehicles: monitor.allVehicles,
}))(memo(AdvancedCarry));

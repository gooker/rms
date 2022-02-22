import React, { memo, useState } from 'react';
import { Form, Button, Input, Select, Checkbox, Card, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fetchSorterToThrow } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 600;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const Parabolic = (props) => {
  const { dispatch, dropBox } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  const [checkBoxValue, setCheckBoxValue] = useState([]);

  function onCheckBoxChange(value) {
    if (checkBoxValue.includes(value)) {
      setCheckBoxValue(checkBoxValue.filter((item) => item !== value));
    } else {
      if (value === 'bothRoller') {
        setCheckBoxValue(['bothRoller']);
      } else {
        const _checkBoxValue = checkBoxValue.filter((item) => item !== 'bothRoller');
        _checkBoxValue.push(value);
        setCheckBoxValue(_checkBoxValue);
      }
    }
  }

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function sendCommand() {
    formRef
      .validateFields()
      .then((values) => {
        setExecuting(true);
        const requestParam = {
          robotId: values.robotId,
          beltAction: {},
        };
        requestParam.beltAction['front'] = values.frontRoller || null;
        requestParam.beltAction['back'] = values.rearRoller || null;
        requestParam.beltAction['front_back'] = values.bothRoller || null;
        fetchSorterToThrow(requestParam).then((response) => {
          if (!dealResponse(response)) {
            message.success(formatMessage({ id: 'app.message.operateSuccess' }));
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
        <FormattedMessage id={'monitor.right.dumpCargo'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'robotId'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          {/* 选择器 */}
          <div
            style={{
              paddingLeft: 45,
              display: 'flex',
              flexFlow: 'row wrap',
              color: '#fff',
            }}
          >
            <Checkbox
              checked={checkBoxValue.includes('frontRoller')}
              onChange={() => onCheckBoxChange('frontRoller')}
            >
              <FormattedMessage id={'monitor.dumpCargo.frontRoller'} />
            </Checkbox>
            <Checkbox
              checked={checkBoxValue.includes('rearRoller')}
              onChange={() => onCheckBoxChange('rearRoller')}
            >
              <FormattedMessage id={'monitor.dumpCargo.rearRoller'} />
            </Checkbox>
            <Checkbox
              checked={checkBoxValue.includes('bothRoller')}
              onChange={() => onCheckBoxChange('bothRoller')}
            >
              <FormattedMessage id={'monitor.dumpCargo.bothRoller'} />
            </Checkbox>
          </div>

          {checkBoxValue.map((item) => (
            <Card
              key={item}
              title={formatMessage({ id: `monitor.dumpCargo.${item}` })}
              style={{ marginTop: 20 }}
            >
              <Form.Item
                name={[item, 'goods']}
                label={formatMessage({ id: 'monitor.operate.goodsCode' })}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name={[item, 'customId']} label={'Custom ID'}>
                <Input />
              </Form.Item>

              <Form.Item
                name={[item, 'targetStation']}
                label={formatMessage({ id: 'monitor.operate.targetStation' })}
                rules={[{ required: true }]}
              >
                <Select>
                  {dropBox.map((name) => (
                    <Select.Option key={name} value={name}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name={[item, 'actionType']}
                label={formatMessage({ id: 'monitor.operate.actionType' })}
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value={'WAIT_TASK'}>
                    <FormattedMessage id={'monitor.operate.actionType.WAIT_TASK'} />
                  </Select.Option>
                  <Select.Option value={'STOP_THROW'}>
                    <FormattedMessage id={'monitor.operate.actionType.STOP_THROW'} />
                  </Select.Option>
                  <Select.Option value={'NON_STOP_THROW'}>
                    <FormattedMessage id={'monitor.operate.actionType.NON_STOP_THROW'} />
                  </Select.Option>
                  <Select.Option value={'CONVEYOR'}>
                    <FormattedMessage id={'monitor.operate.actionType.CONVEYOR.put'} />
                  </Select.Option>
                </Select>
              </Form.Item>
            </Card>
          ))}
          <Form.Item {...formItemLayoutNoLabel} style={{ marginTop: 35 }}>
            <Button onClick={sendCommand} loading={executing} disabled={executing}>
              <FormattedMessage id={'app.button.execute'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => {
  const dropBox = [];
  const currentMap = monitor.currentMap;
  if (currentMap) {
    currentMap.logicAreaList.forEach(({ dumpStations }) => {
      dumpStations?.forEach(({ dumpBasket }) => {
        dropBox.push(...(dumpBasket?.map(({ key }) => key) || []));
      });
    });
  }
  return { dropBox };
})(memo(Parabolic));

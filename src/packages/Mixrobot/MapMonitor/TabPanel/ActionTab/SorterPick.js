/* eslint-disable camelcase */
import React from 'react';
import intl from 'react-intl-universal';
import { Form, Button, Switch, Col, Row, Input, InputNumber, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MenuIcon from '@/MenuIcon';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, isNull } from '@/utils/utils';
import { fetchSorterToPick } from '@/services/map';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export default class SorterPick extends React.Component {
  state = {
    frontRollerInputDisabled: true,
    rearRollerInputDisabled: true,
  };

  formRef = React.createRef();

  sendCommand = () => {
    this.formRef.current.validateFields().then(({ robotId, targetCellActionList }) => {
      if (!isNull(robotId) && !isNull(targetCellActionList)) {
        const param = { robotId, targetCellActionList: [] };
        targetCellActionList.forEach(
          ({ cellId, frontRoller, frontRollerBasket, rearRoller, rearRollerBasket }) => {
            const putBasket_0 = frontRoller && frontRollerBasket ? frontRollerBasket : '';
            const putBasket_1 = rearRoller && rearRollerBasket ? rearRollerBasket : '';
            param.targetCellActionList.push({
              cellId,
              // eslint-disable-next-line no-bitwise
              roller: [~~frontRoller, ~~rearRoller],
              putBasket: [putBasket_0, putBasket_1],
            });
          },
        );
        fetchSorterToPick({ sectionId: window.localStorage.getItem('sectionId'), ...param }).then(
          (response) => {
            if (!dealResponse(response)) {
              message.success(
                intl.formatMessage({ id: 'app.monitorOperation.sendPickTaskSuccess' }),
              );
            } else {
              message.error(intl.formatMessage({ id: 'app.monitorOperation.sendPickTaskFail' }));
            }
          },
        );
      }
    });
  };

  render() {
    const { frontRollerInputDisabled, rearRollerInputDisabled } = this.state;
    return (
      <div style={{ width: '100%' }}>
        <Form ref={this.formRef}>
          <Form.Item
            {...formLayout}
            name={'robotId'}
            label={intl.formatMessage({ id: 'app.lock.robotId' })}
          >
            <Input />
          </Form.Item>
          <Form.List name="targetCellActionList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row
                    key={field.key}
                    style={{
                      border: '1px solid #e0dcdc',
                      padding: '25px 10px 0 0',
                      borderRadius: '5px',
                      marginBottom: '20px',
                    }}
                  >
                    <Col span={22}>
                      <Form.Item
                        {...formLayout}
                        {...field}
                        label={intl.formatMessage({ id: 'app.lock.cellId' })}
                        name={[field.name, 'cellId']}
                        fieldKey={[field.fieldKey, 'cellId']}
                      >
                        <InputNumber />
                      </Form.Item>
                      <Form.Item
                        {...formLayout}
                        label={intl.formatMessage({ id: 'app.monitorOperation.frontRoller' })}
                      >
                        <Row>
                          <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Item
                              noStyle
                              {...field}
                              name={[field.name, 'frontRoller']}
                              fieldKey={[field.fieldKey, 'frontRoller']}
                              valuePropName={'checked'}
                              initialValue={false}
                              getValueFromEvent={(checked) => {
                                this.setState({ frontRollerInputDisabled: !checked });
                                return checked;
                              }}
                            >
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col span={19}>
                            <Form.Item
                              noStyle
                              {...field}
                              name={[field.name, 'frontRollerBasket']}
                              fieldKey={[field.fieldKey, 'frontRollerBasket']}
                            >
                              <Input disabled={frontRollerInputDisabled} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                      <Form.Item
                        {...formLayout}
                        label={intl.formatMessage({ id: 'app.monitorOperation.rearRoller' })}
                      >
                        <Row>
                          <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Item
                              noStyle
                              {...field}
                              name={[field.name, 'rearRoller']}
                              fieldKey={[field.fieldKey, 'rearRoller']}
                              valuePropName={'checked'}
                              initialValue={false}
                              getValueFromEvent={(checked) => {
                                this.setState({ rearRollerInputDisabled: !checked });
                                return checked;
                              }}
                            >
                              <Switch />
                            </Form.Item>
                          </Col>
                          <Col span={19}>
                            <Form.Item
                              noStyle
                              {...field}
                              name={[field.name, 'rearRollerBasket']}
                              fieldKey={[field.fieldKey, 'rearRollerBasket']}
                            >
                              <Input disabled={rearRollerInputDisabled} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        type="danger"
                        icon={MenuIcon.delete}
                        onClick={() => remove(field.name)}
                      />
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    <FormattedMessage id="app.workStationMap.add" />
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
        <div style={{ textAlign: 'end' }}>
          <Button onClick={this.sendCommand}>
            <FormattedMessage id={'app.monitorOperation.agvCommand.sendAgvCommand'} />
          </Button>
        </div>
      </div>
    );
  }
}

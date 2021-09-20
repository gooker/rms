import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { fetchBatchAgvLogin } from '@/services/simulator';
import { message, Button, Checkbox, Col, Divider, Form, InputNumber, Row, Select } from 'antd';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { dealResponse } from '@/utils/utils';
import { AGVSubTypeMap } from '@/Const';

const AddSimulatorAgvLayout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };

@connect(({ editor }) => {
  const { currentMap } = editor;
  const currentLogicArea = getCurrentLogicAreaData('monitor');
  return { currentMap, logicId: currentLogicArea?.id };
})
export default class AddSimulatorAgv extends Component {
  formRef = React.createRef();

  state = {
    addAgvNumber: 0,
    isIncrement: false, // 用于标记批量添加小车时候是否是增量添加
    currentDirection: 0, // 用于批量添加小车时设置小车方向,
    subTypes: [],
  };

  componentDidMount() {
    const { robotType } = this.props;
    const subTypeEnum = AGVSubTypeMap[robotType];
    let subTypes = [];
    if (subTypeEnum) {
      subTypes = subTypeEnum.map((item) => {
        return {
          ...item,
          label: formatMessage({ id: item.label }),
        };
      });
    }
    this.setState({ subTypes });
  }

  batchAddAGV = () => {
    const { addAgvNumber, isIncrement, currentDirection } = this.state;
    const { logicId, onCancel } = this.props;
    const { validateFields } = this.formRef.current;

    validateFields().then((value) => {
      if (addAgvNumber) {
        const params = {
          logicId,
          currentDirection,
          robotType: value.robotType,
          robotModel: value.robotModel,
          addFlag: isIncrement,
          robotSize: addAgvNumber,
        };
        fetchBatchAgvLogin(params).then((res) => {
          if (dealResponse(res)) {
            message.error(formatMessage({ id: 'app.simulator.action.addAMR.failed' }));
          } else {
            message.success(formatMessage({ id: 'app.simulator.action.addAMR.success' }));
            onCancel();
          }
        });
      }
    });
  };

  render() {
    const { robotType, robotTypes } = this.props;
    const { isIncrement, currentDirection, subTypes } = this.state;
    return (
      <div>
        {/* 添加小车 */}
        <Divider orientation="left">
          <FormattedMessage id="app.simulator.action.addAMR" />
        </Divider>
        <Form ref={this.formRef}>
          <Form.Item
            {...AddSimulatorAgvLayout}
            name={'robotType'}
            initialValue={robotType}
            label={formatMessage({ id: 'app.simulator.form.label.AMRType' })}
          >
            <Select disabled={true} style={{ width: '130px' }}>
              {robotTypes.map((record) => (
                <Select.Option value={record} key={record}>
                  {record}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {subTypes && subTypes.length > 0 && (
            <Form.Item
              {...AddSimulatorAgvLayout}
              name={'robotModel'}
              initialValue={'Normal'}
              label={formatMessage({ id: 'app.simulator.form.label.AMRSubType' })}
            >
              <Select style={{ width: '130px' }}>
                {subTypes.map((item) => (
                  <Select.Option value={item.value} key={item.value}>
                    <FormattedMessage id={item.label} />
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            {...AddSimulatorAgvLayout}
            name={'robotId'}
            label={formatMessage({ id: 'app.simulator.form.label.AMRID' })}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            {...AddSimulatorAgvLayout}
            name={'currentCellId'}
            label={formatMessage({ id: 'app.simulator.form.label.cell' })}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            {...AddSimulatorAgvLayout}
            name={'currentDirection'}
            initialValue={0}
            label={formatMessage({ id: 'app.simulator.form.label.direction' })}
          >
            <InputNumber min={0} max={360} />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 6 }}>
            <Button
              type="primary"
              onClick={() => {
                const { submit } = this.props;
                const { validateFields } = this.formRef.current;
                validateFields().then((value) => {
                  submit && submit(value);
                });
              }}
            >
              <FormattedMessage id="app.simulator.action.submit" />
            </Button>
            <Button style={{ marginLeft: 20 }} onClick={this.props.onCancel}>
              <FormattedMessage id="app.simulator.action.cancel" />
            </Button>
          </Form.Item>
        </Form>

        {/* 批量添加 */}
        <Divider orientation="left">
          <FormattedMessage id="app.simulator.action.batchAdd" />
        </Divider>

        <div>
          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            label={formatMessage({ id: 'app.simulator.form.label.AMRCount' })}
          >
            <InputNumber
              onChange={(value) => {
                this.setState({ addAgvNumber: value });
              }}
            />
            <span style={{ marginLeft: '20px' }}>
              <Checkbox
                checked={isIncrement}
                onChange={(ev) => {
                  this.setState({ isIncrement: ev.target.checked });
                }}
              >
                <FormattedMessage id="app.simulator.action.incrementAdd" />
              </Checkbox>
            </span>
          </Form.Item>

          <Form.Item
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            label={formatMessage({ id: 'app.simulator.form.label.direction' })}
          >
            <InputNumber
              min={0}
              max={360}
              value={currentDirection}
              onChange={(value) => {
                this.setState({ currentDirection: value });
              }}
            />
          </Form.Item>
        </div>
        <Row>
          <Col span={6} />
          <Col span={18}>
            <Button type="primary" onClick={this.batchAddAGV}>
              <FormattedMessage id="app.simulator.action.add" />
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import { connect } from '@/utils/dva';
import { find } from 'lodash';
import { Row, Col, Form, Select, InputNumber, Radio, Input, Button, message } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, dealResponse } from '@/utils/utils';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { toteToWorkstation } from '@/services/monitor';
import MenuIcon from '@/utils/MenuIcon';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

@connect(() => ({
  workstationList: getCurrentLogicAreaData('monitor')?.workstationList || [],
}))
class ToteWorkStationTask extends PureComponent {
  formRef = React.createRef();

  sendAgvCommand = () => {
    const { workstationList } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((value) => {
      const { workstation: workstationIndex, toteAGVTaskActionDTOS, robotId, agreement } = value;
      const params = { robotId, agreement };

      if (workstationIndex != null) {
        const { direction: workStationDirection, stopCellId: workStationStopCellId } = find(
          workstationList,
          (_, index) => index === workstationIndex,
        );
        params.workStationDirection = workStationDirection;
        params.workStationStopCellId = workStationStopCellId;
      }

      if (!toteAGVTaskActionDTOS || toteAGVTaskActionDTOS.length === 0) {
        message.error(
          formatMessage({
            id: 'app.monitorOperation.toteWorkStation.addWorkStationStep',
          }),
        );
        return;
      }

      const toteAGVTaskActionDTOSParams = [];
      toteAGVTaskActionDTOS.forEach((record) => {
        if (record.binCode && record.toteCode) {
          toteAGVTaskActionDTOSParams.push({
            toteAGVTaskActionType: record.toteAGVTaskActionType,
            binCode: record.binCode,
            toteInfoDTO: { toteCode: record.toteCode, weight: record.weight },
          });
        }
      });
      params.toteAGVTaskActionDTOS = toteAGVTaskActionDTOSParams;

      if (toteAGVTaskActionDTOSParams.length === 0) {
        message.error(
          formatMessage({
            id: 'app.monitorOperation.toteWorkStation.addWorkStationStep',
          }),
        );
      } else {
        toteToWorkstation(params).then((res) => {
          dealResponse(res, 1, '@@@工作站任务下发成功');
        });
      }
    });
  };

  render() {
    const { workstationList } = this.props;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...layout}
          name={'workstation'}
          label={formatMessage({ id: 'app.monitorOperation.workstation' })}
        >
          <Select style={{ width: '80%' }}>
            {workstationList.map((record, index) => {
              return (
                <Select.Option value={index} key={index}>
                  {record.stopCellId}-{record.angle}°
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          {...layout}
          name={'robotId'}
          label={formatMessage({ id: 'app.monitorOperation.toteWorkStation.appointAgv' })}
        >
          <InputNumber />
        </Form.Item>

        <Form.List name="toteAGVTaskActionDTOS">
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
                      {...layout}
                      {...field}
                      label={formatMessage({
                        id: 'app.monitorOperation.toteWorkStation.action',
                      })}
                      initialValue={'FETCH'}
                      name={[field.name, 'toteAGVTaskActionType']}
                      fieldKey={[field.fieldKey, 'toteAGVTaskActionType']}
                    >
                      <Radio.Group>
                        <Radio.Button value="FETCH">
                          <FormattedMessage id="app.monitorOperation.toteWorkStation.fetch" />
                        </Radio.Button>
                        <Radio.Button value="PUT">
                          <FormattedMessage id="app.monitorOperation.toteWorkStation.put" />
                        </Radio.Button>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      {...layout}
                      {...field}
                      label={formatMessage({
                        id: 'app.monitorOperation.toteWorkStation.toteCode',
                      })}
                      name={[field.name, 'toteCode']}
                      fieldKey={[field.fieldKey, 'toteCode']}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...layout}
                      {...field}
                      label={formatMessage({
                        id: 'app.monitorOperation.toteWorkStation.toteWeight',
                      })}
                      name={[field.name, 'weight']}
                      fieldKey={[field.fieldKey, 'weight']}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      {...layout}
                      {...field}
                      label={formatMessage({
                        id: 'app.monitorOperation.toteWorkStation.binCode',
                      })}
                      name={[field.name, 'binCode']}
                      fieldKey={[field.fieldKey, 'binCode']}
                    >
                      <Input />
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
                <Button type="dashed" onClick={() => add()} block icon={MenuIcon.plus}>
                  <FormattedMessage id="app.workStationMap.add" />
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item {...layout}>
          <Button type={'primary'} onClick={this.sendAgvCommand}>
            <FormattedMessage id="app.monitorOperation.agvCommand.sendAgvCommand" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default ToteWorkStationTask;

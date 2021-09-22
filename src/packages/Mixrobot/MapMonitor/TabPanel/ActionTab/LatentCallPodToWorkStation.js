import React from 'react';
import { Button, Col, Form, InputNumber, Radio, Select } from 'antd';
import intl from 'react-intl-universal';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const noLabelLayout = {
  wrapperCol: { span: 16, offset: 6 },
};

class LatentCallPodToWorkStation extends React.PureComponent {
  formRef = React.createRef();

  render() {
    const { dispatch, sectionId, workstationList } = this.props;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...layout}
          name={'podId'}
          label={intl.formatMessage({ id: 'app.monitorOperation.pod' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'targetDirection'}
          label={intl.formatMessage({ id: 'app.monitorOperation.targetDirection' })}
        >
          <Radio.Group>
            <Radio.Button key="a" value="0">
              <FormattedMessage id="app.monitorOperation.faceA" />
            </Radio.Button>
            <Radio.Button key="b" value="1">
              <FormattedMessage id="app.monitorOperation.faceB" />
            </Radio.Button>
            <Radio.Button key="c" value="2">
              <FormattedMessage id="app.monitorOperation.faceC" />
            </Radio.Button>
            <Radio.Button key="a" value="3">
              <FormattedMessage id="app.monitorOperation.faceD" />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          {...layout}
          name={'workstation'}
          label={intl.formatMessage({ id: 'app.monitorOperation.workstation' })}
        >
          <Select style={{ width: '80%' }}>
            {workstationList.map((record, index) => {
              return (
                <Select.Option value={index} key={record}>
                  {intl.formatMessage(
                    { id: 'app.monitorOperation.workstationPointPosition' },
                    { stopCellId: record.stopCellId, angle: record.angle },
                  )}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          {...layout}
          name={'robotId'}
          label={intl.formatMessage({ id: 'app.monitorOperation.robotId' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item {...noLabelLayout}>
          <Col span={12}>
            <Button
              type="primary"
              onClick={() => {
                const { validateFields } = this.formRef.current;
                validateFields().then((value) => {
                  const { workstation, targetDirection, podId, robotId } = value;
                  const { stopCellId, direction } = workstationList[workstation];
                  dispatch({
                    type: 'monitor/fetchPodToWorkStation',
                    payload: {
                      stopCellId,
                      targetDirection,
                      podId,
                      direction,
                      sectionId,
                      robotId,
                    },
                  });
                });
              }}
            >
              <FormattedMessage id="app.monitorOperation.callPodToWorkStation" />
            </Button>
          </Col>
        </Form.Item>
      </Form>
    );
  }
}
export default connect()(LatentCallPodToWorkStation);

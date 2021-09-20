import React, { Component } from 'react';
import { Form, InputNumber, Button } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const noLabelLayout = {
  wrapperCol: { span: 16, offset: 6 },
};

class EmptyRun extends Component {
  formRef = React.createRef();

  render() {
    const { appointHeight } = this.props;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...layout}
          name={'robotId'}
          label={formatMessage({ id: 'app.monitorOperation.robot' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'targetCellId'}
          label={formatMessage({ id: 'app.monitorOperation.targetCell' })}
        >
          <InputNumber />
        </Form.Item>
        {appointHeight ? (
          <Form.Item
            {...layout}
            name={'height'}
            label={formatMessage({ id: 'app.monitorOperation.targetCellHeight' })}
          >
            <InputNumber min={0} />
          </Form.Item>
        ) : null}
        <Form.Item {...noLabelLayout}>
          <Button
            onClick={() => {
              const { validateFields } = this.formRef.current;
              validateFields().then((value) => {
                const { submit } = this.props;
                const result = {};
                result.robotId = value.robotId;
                result.targetCellId = value.targetCellId;
                if (value.height != null && value.height !== 0) {
                  result.height = value.height;
                }
                submit(result);
              });
            }}
            type="primary"
          >
            <FormattedMessage id="app.monitorOperation.emptyRun" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default EmptyRun;

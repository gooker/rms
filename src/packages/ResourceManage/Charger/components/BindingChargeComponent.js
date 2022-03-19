import React, { Component } from 'react';
import { Button, Form, Select } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAvailableMapChargerList } from '@/services/api';

const { Option } = Select;
const FormLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };
const NoLabelFormLayout = { wrapperCol: { offset: 5, span: 19 } };

class BindingChargeComponent extends Component {
  formRef = React.createRef();

  state = {
    chargerList: [],
  };

  componentDidMount() {
    this.getAvailableChargeList();
  }

  submit = () => {
    const { submit } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((value) => {
      submit(value);
    });
  };

  /** 获取可用充电桩**/
  getAvailableChargeList = async () => {
    const response = await fetchAvailableMapChargerList();
    if (!dealResponse(response)) {
      this.setState({ response });
    }
  };

  render() {
    const { cancel, data } = this.props;
    const { chargerList } = this.state;
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...FormLayout}
          name={'nameAndMapId'}
          label={<FormattedMessage id="app.chargeManger.mapCharger" />}
          initialValue={data.toString()}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'app.chargeManger.chooseMapCharger' }),
            },
          ]}
        >
          <Select>
            {chargerList?.map((item) => (
              <Option key={item.nameAndMapId} value={item.nameAndMapId}>
                {`${item.name} [${item?.chargerCellIds?.join()}]`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item {...NoLabelFormLayout}>
          <Button onClick={cancel}>
            <FormattedMessage id="app.button.cancel" />
          </Button>
          <Button type="primary" onClick={this.submit} style={{ marginLeft: '20px' }}>
            <FormattedMessage id="app.button.confirm" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default BindingChargeComponent;

import React, { Component } from 'react';
import { Button, Col, Form, Input, Select } from 'antd';
import { fetchFirmWarList } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage } from '@/utils/util';

const formItemAddLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
  },
};
const formItemLayoutNoLabel = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16, offset: 7 },
    md: { offset: 5 },
  },
};

export default class DownloadFirmwareModal extends Component {
  state = {
    FileWarList: [],
  };
  formRef = React.createRef();
  async componentDidMount() {
    const { vehicletype } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    const response = await fetchFirmWarList(vehicletype, sectionId);
    if (!dealResponse(response)) {
      this.setState({
        FileWarList: response,
      });
    }
  }

  submit = () => {
    const {
      current: { validateFields },
    } = this.formRef;
    const { downloadFireware } = this.props;
    validateFields().then((value) => {
      downloadFireware(value);
    });
  };
  render() {
    const { selectedRow } = this.props;
    const { FileWarList } = this.state;
    return (
      <div>
        <Form {...formItemAddLayout} ref={this.formRef}>
          <Form.Item label={<FormattedMessage id="app.activity.selectedVehicle" />}>
            {selectedRow.map((record) => {
              return (
                <Col span={3} key={record.vehicleId}>
                  {record.vehicleId}
                </Col>
              );
            })}
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="app.activity.firmware" />}
            name="fileName"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'app.activity.selectFirmware' }),
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder={formatMessage({ id: 'app.activity.selectFirmware' })}
            >
              {FileWarList.map((element) => {
                return (
                  <Select.Option key={element} value={element}>
                    {element}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="app.activity.firmwareVersion" />}
            name="versionNumber"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'app.activity.enterFirmwareVersion' }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Col>
            <Form.Item {...formItemLayoutNoLabel}>
              <Button
                onClick={() => {
                  this.submit();
                }}
              >
                <FormattedMessage id="app.button.submit" />
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import { Select, Form, Checkbox, Button, InputNumber } from 'antd';
import intl from 'react-intl-universal';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse } from '@/utils/utils';
import { fetchEmptyAndFullStorage, forkPodToTarget } from '@/services/map';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const noLabelLayout = {
  wrapperCol: { span: 16, offset: 6 },
};

class ForkLiftTransportTask extends PureComponent {
  formRef = React.createRef();

  state = {
    empty: [],
    full: [],
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    fetchEmptyAndFullStorage().then((res) => {
      if (!dealResponse(res)) {
        this.setState({
          empty: res.emptyStorages.map((record) => {
            return record.storageCode;
          }),
          full: res.fullStorages.map((record) => {
            return record.storageCode;
          }),
        });
      }
    });
  };

  startTransport = async () => {
    const { validateFields } = this.formRef.current;
    const params = {
      sourceStorageCode: null,
      targetStorageCode: null,
      appointRobotId: null,
      isNeedToPile: null,
    };
    const value = await validateFields();
    params.sourceStorageCode = value.sourceStorageCode;
    params.targetStorageCode = value.targetStorageCode;
    params.appointRobotId = value.appointRobotId;
    params.isNeedToPile = value.isNeedToPile;

    forkPodToTarget(params).then((res) => {
      dealResponse(
        res,
        true,
        intl.formatMessage({
          id: 'app.monitorOperation.forkLiftTransportTask.forkPodToTargetSuccess',
        }),
      );
    });
  };

  render() {
    const { empty, full } = this.state;
    const locale = window.localStorage.getItem('umi_locale') || 'zh-CN';
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...layout}
          name={'sourceStorageCode'}
          label={intl.formatMessage({
            id: 'app.monitorOperation.forkLiftTransportTask.sourceStorageCode',
          })}
        >
          <Select allowClear showSearch>
            {full.map((record) => (
              <Select.Option value={record} key={record}>
                {record}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          {...layout}
          name={'targetStorageCode'}
          label={intl.formatMessage({
            id: 'app.monitorOperation.forkLiftTransportTask.targetStorageCode',
          })}
        >
          <Select allowClear showSearch>
            {empty.map((record) => (
              <Select.Option value={record} key={record}>
                {record}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          {...(locale === 'zh-CN'
            ? layout
            : {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
              })}
          name={'appointRobotId'}
          label={intl.formatMessage({
            id: 'app.monitorOperation.forkLiftTransportTask.appointRobotId',
          })}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          {...(locale === 'zh-CN'
            ? layout
            : {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
              })}
          name={'isNeedToPile'}
          initialValue={true}
          valuePropName={'checked'}
          label={intl.formatMessage({
            id: 'app.monitorOperation.forkLiftTransportTask.isNeedToPile',
          })}
        >
          <Checkbox disabled />
        </Form.Item>

        <Form.Item {...noLabelLayout}>
          <Button type="primary" onClick={this.startTransport}>
            <FormattedMessage id="app.monitorOperation.forkLiftTransportTask.startTransport" />
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
export default ForkLiftTransportTask;

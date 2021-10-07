import React, { Component } from 'react';
import { Card, Spin } from 'antd';
import { formatMessage, dealResponse } from '@/utils/utils';
import SystemParams from '@/components/SystemParams';
import { fetchSystemParamFormData, updateSystemParams } from '@/services/mixrobot';

export default class SystemParamsManager extends Component {
  state = {
    formJson: [],
    spinning: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType } = this.props;
    this.setState({ spinning: true });

    const formData = await fetchSystemParamFormData(agvType, {
      language: window.localStorage.getItem('language'),
    });
    if (!dealResponse(formData)) {
      this.setState({ formJson: formData });
    }
    this.setState({ spinning: false });
  };

  submit = async (value) => {
    const { agvType } = this.props;
    const responseData = await updateSystemParams(agvType, value);
    if (!dealResponse(responseData, 1, formatMessage({ id: 'app.common.operationFinish' }))) {
      this.getData();
    }
  };

  render() {
    const { formJson, spinning } = this.state;
    return (
      <>
        {spinning ? (
          <Spin spinning={true}>
            <Card bodyStyle={{ minHeight: 500 }} loading={true} />
          </Spin>
        ) : (
          <SystemParams
            formItemWapper={{
              wrapperCol: { span: 16 },
              labelCol: { span: 8 },
            }}
            refresh={this.getData}
            loading={spinning}
            systemFormData={formJson}
            submit={this.submit}
          />
        )}
      </>
    );
  }
}

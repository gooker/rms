import React, { Component } from 'react';
import { Card, Spin } from 'antd';
import { dealResponse, isNull } from '@/utils/util';
import SystemParams from '@/components/SystemParams';
import { fetchSystemParamFormData, updateSystemParams } from '@/services/api';

export default class SystemParamsManager extends Component {
  state = {
    formJson: [],
    spinning: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType, getApi } = this.props;
    this.setState({ spinning: true });

    let formData = [];
    const params = {
      language: window.localStorage.getItem('currentLocale'),
    };
    if (isNull(getApi)) {
      formData = await fetchSystemParamFormData(agvType, params);
    } else {
      formData = await getApi(agvType, params);
    }

    if (!dealResponse(formData)) {
      this.setState({ formJson: formData });
    }
    this.setState({ spinning: false });
  };

  submit = async (value) => {
    const { agvType, updateApi } = this.props;
    let responseData = null;
    if (isNull(updateApi)) {
      responseData = await updateSystemParams(agvType, value);
    } else {
      responseData = await updateApi(agvType, value);
    }

    if (!dealResponse(responseData, true)) {
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

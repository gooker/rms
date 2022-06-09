import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull } from 'lodash';

const SearchTargetLock = (props) => {
  const { search, verhicleHide, taskIdHide, data, loadType, allAdaptors } = props;
  const [form] = Form.useForm();
  const [allType, setAllType] = useState([]);

  useEffect(() => {
    async function init() {
      let allType = [];
      if (!isNull(data) && loadType) {
        allType = data.map(({ loadType }) => loadType);
      }
      setAllType([...new Set(allType)]);
    }

    init();
  }, []);

  function onFinish() {
    form.validateFields().then((values) => {
      const params = { ...values };
      search(data, { ...params });
    });
  }

  function onClear() {
    form.resetFields();
    search({});
  }

  return (
    <Form form={form}>
      <Row style={{ width: '100%' }} gutter={24}>
        {!verhicleHide && (
          <>
            <Col span={4}>
              {/* 小车id */}
              <Form.Item name={'vehicleId'} label={formatMessage({ id: 'vehicle.id' })}>
                <Input allowClear />
              </Form.Item>
            </Col>

            <Col span={6}>
              {/* 小车类型 */}
              <Form.Item name={'vehicleType'} label={formatMessage({ id: 'app.common.type' })}>
                <Select
                  allowClear
                  showSearch
                  maxTagCount={5}
                  mode="multiple"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {Object.values(allAdaptors).map(({ adapterType }) => {
                    const { vehicleTypes } = adapterType;
                    return (
                      <Select.OptGroup
                        key={adapterType.code}
                        label={`${formatMessage({ id: 'app.configInfo.header.adapter' })}: ${
                          adapterType.name
                        }`}
                      >
                        {vehicleTypes.map((vehicleType, index) => (
                          <Select.Option
                            key={index}
                            value={`${adapterType.code}@${vehicleType.code}`}
                          >
                            {vehicleType.name}
                          </Select.Option>
                        ))}
                      </Select.OptGroup>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </>
        )}

        {loadType && (
          <Col span={4}>
            {/* 类型 */}
            <Form.Item name={'loadType'} label={formatMessage({ id: 'app.common.type' })}>
              <Select
                allowClear
                showSearch
                maxTagCount={5}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {allType?.map((type) => (
                  <Select.Option key={type} value={type}>
                    {type}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}
        {/* 任务id */}
        {!taskIdHide && (
          <Col span={7}>
            <Form.Item name="taskId" label={formatMessage({ id: 'app.task.id' })}>
              <Input allowClear />
            </Form.Item>
          </Col>
        )}
        <Col>
          <Form.Item>
            <Row gutter={24}>
              <Col>
                <Button type="primary" onClick={onFinish}>
                  <SearchOutlined /> <FormattedMessage id="app.button.search" />
                </Button>
              </Col>
              <Col>
                <Button onClick={onClear}>
                  <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default connect(({ global }) => ({
  allAdaptors: global.allAdaptors,
}))(memo(SearchTargetLock));

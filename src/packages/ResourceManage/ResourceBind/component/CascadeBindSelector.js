import React, { memo, useState } from 'react';
import { Button, Col, Form, message, Row, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import MenuIcon from '@/utils/MenuIcon';
import { dealResponse, formatMessage } from '@/utils/util';
import { BindableResourceType } from '../resourceBind.contant';
import {
  fetchAllLoadType,
  fetchAllVehicleType,
  fetchResourceGroupByType,
  saveResourceBindMapping,
} from '@/services/resourceService';
import style from '../resourceBind.module.less';

const { LOAD, LOAD_TYPE, CHARGE_STRATEGY, STORE } = BindableResourceType;

const CascadeBindSelector = (props) => {
  const { datasource, refresh } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 左侧
  const [primary, setPrimary] = useState(null); // 第一个下拉框选中
  const [primaryResource, setPrimaryResource] = useState([]); // 数据源: [{code:xxx, name:xxx, }]

  // 右侧
  const [secondary, setSecondary] = useState(null); // 第二个下拉框选中
  const [secondaryResource, setSecondaryResource] = useState([]); // 数据源: [{code:xxx, name:xxx, }]

  async function add() {
    setLoading(true);
    try {
      const { bindType, bindCodes, resourceType, resourceCodes } = await formRef.validateFields();
      const result = [];
      for (const bindCode of bindCodes) {
        for (const resourceCode of resourceCodes) {
          // 类型名称
          const { name: bindTypeName, needBindResource } = find(datasource, {
            resourceType: bindType,
          });
          const { name: resourceTypeName } = find(needBindResource ?? [], {
            resourceType,
          });
          // 类型元素名称
          const { name: bindName } = find(primaryResource, { code: bindCode });
          const { name: resourceName } = find(secondaryResource, { code: resourceCode });

          result.push({
            bindType,
            bindTypeName,
            bindName,
            bindCode,
            resourceTypeName,
            resourceType,
            resourceName,
            resourceCode,
          });
        }
      }
      const response = await saveResourceBindMapping(result);
      if (!dealResponse(response, true)) {
        refresh();
      }
      formRef.setFieldsValue({ resourceCodes: [] });
    } catch (err) {
      console.log(err);
      message.error(formatMessage({ id: 'app.message.formIncomplete' }));
    }
    setLoading(false);
  }

  function onPrimaryChange(value) {
    formRef.setFieldsValue({ bindCodes: [], resourceType: null, resourceCodes: [] });
    setPrimary(value);
    if (value === BindableResourceType.VEHICLE_TYPE) {
      fetchAllVehicleType().then((response) => {
        const _primaryResource = response.map(({ id, name }) => ({ code: id, name }));
        setPrimaryResource(_primaryResource);
      });
    }
    if (value === BindableResourceType.LOAD_TYPE) {
      fetchAllLoadType().then((response) => {
        const _primaryResource = response.map(({ id, name }) => ({ code: id, name }));
        setPrimaryResource(_primaryResource);
      });
    }
    if ([BindableResourceType.VEHICLE, BindableResourceType.LOAD].includes(value)) {
      fetchResourceGroupByType(value).then((response) => {
        const _primaryResource = response.map(({ code, groupName: name }) => ({ code, name }));
        setPrimaryResource(_primaryResource);
      });
    }
  }

  function onSecondaryChange(value) {
    setSecondary(value);
    function getBindData() {
      const { needBindResource } = find(datasource, { resourceType: primary });
      if (Array.isArray(needBindResource) && needBindResource.length > 0) {
        const { bindData } = find(needBindResource, { resourceType: value });
        if (Array.isArray(bindData)) {
          // 统一一下数据格式: code, name
          if ([LOAD, CHARGE_STRATEGY, STORE].includes(value)) {
            return bindData.map(({ groupName, ...rest }) => ({ ...rest, name: groupName }));
          } else {
            return bindData;
          }
        }
      }
      return [];
    }

    setSecondaryResource(getBindData());
  }

  function getSecondaryOptions() {
    if (primary) {
      const { needBindResource } = find(datasource, { resourceType: primary });
      return needBindResource.map(({ name, resourceType }) => (
        <Select.Option key={resourceType} value={resourceType}>
          {name}
        </Select.Option>
      ));
    }
  }

  return (
    <Form form={formRef}>
      <div className={style.cascadeContainer}>
        <div>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                noStyle
                name={'bindType'}
                getValueFromEvent={(value) => {
                  onPrimaryChange(value);
                  return value;
                }}
                rules={[{ required: true }]}
              >
                <Select style={{ width: '100%' }}>
                  {datasource.map(({ name, resourceType }) => (
                    <Select.Option key={resourceType} value={resourceType}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item noStyle name={'bindCodes'} rules={[{ required: true }]}>
                <Select allowClear mode={'multiple'} style={{ width: '100%' }}>
                  {primaryResource.map(({ code, name }) => (
                    <Select.Option key={code} value={code}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div>{MenuIcon.binding}</div>
        <div>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                noStyle
                name={'resourceType'}
                getValueFromEvent={(value) => {
                  formRef.setFieldsValue({ resourceCodes: [] });
                  onSecondaryChange(value);
                  return value;
                }}
                rules={[{ required: true }]}
              >
                <Select style={{ width: '100%' }} value={secondary}>
                  {getSecondaryOptions()}
                </Select>
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item noStyle name={'resourceCodes'} rules={[{ required: true }]}>
                <Select mode={'multiple'} style={{ width: '100%' }}>
                  {secondaryResource.map(({ code, name }) => (
                    <Select.Option key={code} value={code}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div>
          <Button
            disabled={loading}
            icon={loading ? <LoadingOutlined /> : <PlusOutlined />}
            onClick={add}
          />
        </div>
      </div>
    </Form>
  );
};
export default memo(CascadeBindSelector);

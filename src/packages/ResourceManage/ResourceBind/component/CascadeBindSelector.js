import React, { memo, useState } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import MenuIcon from '@/utils/MenuIcon';
import { dealResponse } from '@/utils/util';
import {
  fetchAllLoadType,
  fetchAllVehicleType,
  fetchResourceGroupByType,
  saveResourceBindMapping,
} from '@/services/resourceService';
import style from '../resourceBind.module.less';

const CascadeBindSelector = (props) => {
  const { datasource, refresh } = props;

  const [formRef] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [primary, setPrimary] = useState(null);
  const [primaryResource, setPrimaryResource] = useState([]); // [{code:xxx, name:xxx, }]
  const [secondary, setSecondary] = useState(null);
  const [secondaryResource, setSecondaryResource] = useState([]); // [{code:xxx, name:xxx, }]

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
    }
    setLoading(false);
  }

  function onPrimaryChange(value) {
    setPrimary(value);
    if (value === 'VEHICLE_TYPE') {
      fetchAllVehicleType().then((response) => {
        const _primaryResource = response.map(({ id, name }) => ({ code: id, name }));
        setPrimaryResource(_primaryResource);
      });
    }
    if (value === 'LOAD_TYPE') {
      fetchAllLoadType().then((response) => {
        const _primaryResource = response.map(({ id, name }) => ({ code: id, name }));
        setPrimaryResource(_primaryResource);
      });
    }
    if (['VEHICLE', 'LOAD'].includes(value)) {
      fetchResourceGroupByType(value).then((response) => {
        const _primaryResource = response.map(({ code, groupName: name }) => ({ code, name }));
        setPrimaryResource(_primaryResource);
      });
    }
  }

  function onSecondaryChange(value) {
    setSecondary(value);
    fetchResourceGroupByType(value).then((response) => {
      if (['LOAD'].includes(value)) {
        const _primaryResource = response.map(({ code, groupName: name }) => ({ code, name }));
        setSecondaryResource(_primaryResource);
      }
    });
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
                  formRef.setFieldsValue({ bindCodes: [] });
                  onPrimaryChange(value);
                  return value;
                }}
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
              <Form.Item noStyle name={'bindCodes'}>
                <Select mode={'multiple'} style={{ width: '100%' }}>
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
              >
                <Select style={{ width: '100%' }} value={secondary}>
                  {getSecondaryOptions()}
                </Select>
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item noStyle name={'resourceCodes'}>
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

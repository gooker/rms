import React, { memo, useState } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import MenuIcon from '@/utils/MenuIcon';
import { fetchAllVehicleType, fetchResourceGroupByType } from '@/services/resourceManageAPI';
import style from '../resourceBind.module.less';
import { ChargerGroupResource } from '@/mockData';

const CascadeBindSelector = (props) => {
  const { datasource, onAdd } = props;

  const [formRef] = Form.useForm();
  const [primary, setPrimary] = useState(null);
  const [secondary, setSecondary] = useState(null);
  const [primaryResource, setPrimaryResource] = useState([]); // [{id:xxx, name:xxx, }]
  const [secondaryResource, setSecondaryResource] = useState([]); // [{code:xxx, groupName:xxx, }]

  async function add() {
    try {
      const { bindType, bindCodes, resourceType, resourceCodes } = await formRef.validateFields();
      const result = [];
      for (const bindCode of bindCodes) {
        for (const resourceCode of resourceCodes) {
          // 类型名称
          const dataSourceItem = find(datasource, { resourceType: bindType });
          const { name: resourceTypeName } = find(dataSourceItem.needBindResource ?? [], {
            resourceType,
          });
          // 元素名称
          const { name: bindName } = find(primaryResource, { id: bindCode });
          const { groupName: resourceName } = find(secondaryResource, { code: resourceCode });

          result.push({
            bindType,
            bindTypeName: dataSourceItem.name,
            bindName,
            bindCode,
            resourceTypeName,
            resourceType,
            resourceName,
            resourceCode,
          });
        }
      }
      onAdd(result);
      formRef.resetFields();
    } catch (err) {
      console.log(err);
    }
  }

  function onPrimaryChange(value) {
    setPrimary(value);
    if (['VEHICLE_GROUP', 'LOAD_GROUP'].includes(value)) {
      fetchResourceGroupByType(value).then((response) => {
        console.log(response);
      });
    }
    if (value === 'VEHICLE_TYPE') {
      fetchAllVehicleType().then((response) => {
        const _primaryResource = response.map(({ id, name }) => ({ id, name }));
        setPrimaryResource(_primaryResource);
      });
    }
    if (value === 'LOAD_TYPE') {
      //
    }
  }

  function onSecondaryChange(value) {
    setSecondary(value);
    setSecondaryResource(ChargerGroupResource);
    // fetchResourceGroupByType(value).then((response) => {
    //   console.log(response);
    // });
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
                  {primaryResource.map(({ id, name }) => (
                    <Select.Option key={id} value={id}>
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
                  {secondaryResource.map(({ code, groupName }) => (
                    <Select.Option key={code} value={code}>
                      {groupName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <div>
          <Button icon={<PlusOutlined />} onClick={add} />
        </div>
      </div>
    </Form>
  );
};
export default memo(CascadeBindSelector);

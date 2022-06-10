import React, { memo } from 'react';
import { Card, Descriptions, List, Tag } from 'antd';
import VehicleModelViewer from '@/packages/ResourceManage/Vehicle/components/VehicleModelViewer';
import { sortBy } from 'lodash';

const responsiveGrid = {
  gutter: 8,
  xs: 1,
  sm: 2,
  md: 2,
  lg: 2,
  xl: 2,
  xxl: 3,
};
const VehicleTypeDetail = (props) => {
  const { dataSource } = props;
  const { code, name, coefficient, supportScene, vehicleModel, actionTemplate } = dataSource;

  function renderListItem({ actionCode, actionName, speed, vehicleAction }) {
    const { actionList, actionParams, blockingType, simulatorIndex } = vehicleAction;
    return (
      <Card hoverable title={`${actionName} [ ${actionCode} ]`}>
        <Descriptions>
          <Descriptions.Item span={3} label="动作列表">
            {actionList?.map((item, index) => (
              <Tag key={index}>{item}</Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item span={1} label="动作参数">
            {actionParams}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="动作限制">
            {blockingType}
          </Descriptions.Item>
          <Descriptions.Item span={1} label="模拟序号">
            {simulatorIndex}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="模拟速度">
            {speed}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }

  function getDataSource() {
    const dataSource = Object.values(actionTemplate?.actionModels || {});
    return sortBy(dataSource, 'actionCode');
  }

  return (
    <div>
      <h3>基本信息</h3>
      <Descriptions bordered>
        <Descriptions.Item label="编码">{code}</Descriptions.Item>
        <Descriptions.Item label="名称">{name}</Descriptions.Item>
        <Descriptions.Item label="模拟倍数">{coefficient ?? 1}</Descriptions.Item>
        <Descriptions.Item label="场景支持">
          {supportScene?.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <h3>{actionTemplate.name}</h3>
      <List
        grid={responsiveGrid}
        dataSource={getDataSource()}
        renderItem={(item) => <List.Item>{renderListItem(item)}</List.Item>}
      />
      <h3>{vehicleModel.name}</h3>
      <VehicleModelViewer data={vehicleModel.geoModel} />
    </div>
  );
};
export default memo(VehicleTypeDetail);

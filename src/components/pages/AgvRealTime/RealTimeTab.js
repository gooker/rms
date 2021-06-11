import React from 'react';
import { Row, Col, Tag } from 'antd';
import { ToolOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/components/Lang';
import { getDirectionLocale, renderAgvStatus, dateFormat } from '@/utils/Utils';
import Dictionary from '@/utils/Dictionary';
import LabelComponent from '@/components/LabelComponent';

const RealTimeTab = (props) => {
  const { agvType, data } = props;
  console.log(agvType, data);

  function renderAgvDirection() {
    if (data.mongodbAGV) {
      return getDirectionLocale(data.mongodbAGV.currentCellId);
    }
  }

  function renderAddingTime() {
    if (data.mongodbAGV) {
      return dateFormat(data.mongodbAGV.createDate).format('YYYY-MM-DD HH:mm:ss');
    }
  }

  function renderMaintenanceState() {
    if (data.mongodbAGV) {
      if (data.mongodbAGV.disabled) {
        return (
          <Tag color="red">
            <ToolOutlined />
            <span style={{ marginLeft: 3 }}>
              {formatMessage({ id: 'app.agv.underMaintenance' })}
            </span>
          </Tag>
        );
      } else {
        return <Tag color="green">{formatMessage({ id: 'app.agv.normal' })}</Tag>;
      }
    }
  }

  function renderManualMode() {
    if (data.mongodbAGV) {
      return data.mongodbAGV.manualMode ? (
        <FormattedMessage id="app.common.true" />
      ) : (
        <FormattedMessage id="app.common.false" />
      );
    }
  }

  function renderAgvType() {
    if (data.mongodbAGV) {
      if (data.mongodbAGV.isDummy) {
        return formatMessage({ id: 'app.agv.threeGenerationsOfVehicles(Virtual)' });
      } else {
        return formatMessage({ id: `app.agvType.${data.mongodbAGV.robotType}` });
      }
    }
  }

  function _renderAgvStatus() {
    if (data.mongodbAGV) {
      const { agvStatus } = data.mongodbAGV;
      return renderAgvStatus(agvStatus);
    }
  }

  return (
    <Row style={{ width: '100%' }}>
      <Col span={12}>
        {/* 小车ID */}
        <LabelComponent label={formatMessage({ id: 'app.agv.id' })}>
          {data?.mongodbAGV?.robotId}
        </LabelComponent>
        {/* 小车类型 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.type' })}>
          {renderAgvType()}
        </LabelComponent>
        {/* 服务器标识 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.serverIdentity' })}>
          {data?.mongodbAGV?.clusterIndex}
        </LabelComponent>
        {/* IP */}
        <LabelComponent label={formatMessage({ id: 'app.agv.ip' })}>
          {data?.mongodbAGV?.ip}
        </LabelComponent>
        {/* 端口号 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.port' })}>
          {data?.mongodbAGV?.port}
        </LabelComponent>
        {/* 位置 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.position' })}>
          {data?.mongodbAGV?.currentCellId}
        </LabelComponent>
        {/* 车头方向 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.direction' })}>
          {renderAgvDirection()}
        </LabelComponent>
        {/* 加入时间 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.addingTime' })}>
          {renderAddingTime()}
        </LabelComponent>
        {/* 小车状态 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.status' })}>
          {_renderAgvStatus()}
        </LabelComponent>
        {/* 维护状态 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.maintenanceState' })}>
          {renderMaintenanceState()}
        </LabelComponent>
        {/* 手动模式 */}
        <LabelComponent label={formatMessage({ id: 'app.agv.manualMode' })}>
          {renderManualMode()}
        </LabelComponent>
      </Col>
      <Col span={12}>2</Col>
    </Row>
  );
};

export default React.memo(RealTimeTab);

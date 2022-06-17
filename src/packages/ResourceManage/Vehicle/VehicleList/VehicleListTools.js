/* TODO: I18N */
import React, { memo, useState } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import {
  DisconnectOutlined,
  DownloadOutlined,
  GroupOutlined,
  RedoOutlined,
  RiseOutlined,
  ScanOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { logOutVehicle } from '@/services/resourceService';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import ResourceGroupModal from '../../component/ResourceGroupModal';
import commonStyles from '@/common.module.less';

const Colors = Dictionary().color;
const VehicleListTools = (props) => {
  const { dispatch, allVehicles, selectedRows, allAdaptors, searchParams } = props;

  const registerVehicles = allVehicles.filter((item) => item.register);
  const unregisterVehicles = allVehicles.filter((item) => !item.register);

  const [visible, setVisible] = useState(false);

  function renderVehicleIdFilter() {
    return registerVehicles.map(({ vehicleId, vehicleType, id }) => (
      <Select.Option key={id} value={id}>
        {`${vehicleId}-${vehicleType}`}
      </Select.Option>
    ));
  }

  function renderVehicleStateFilter() {
    const vehicleStates = Dictionary('vehicleStatus');
    return Object.keys(vehicleStates).map((item) => (
      <Select.Option key={item} value={item}>
        <FormattedMessage id={vehicleStates[item]} />
      </Select.Option>
    ));
  }

  function moveOutVehicle() {
    const vehicleIds = selectedRows.map(({ vehicleId }) => vehicleId);
    RmsConfirm({
      content: formatMessage({ id: 'app.vehicle.moveOut.confirm' }),
      onOk: async () => {
        //
      },
    });
  }

  function updateSearchParam(key, value) {
    dispatch({
      type: 'vehicleList/updateSearchParams',
      payload: { ...searchParams, [key]: value },
    });
  }

  function cancelRegister() {
    const params = selectedRows.map(({ vehicleId, vehicleType, adapterType }) => ({
      vehicleId,
      vehicleType,
      vehicleAdapter: adapterType,
    }));
    RmsConfirm({
      content: formatMessage({ id: 'app.vehicle.moveOut.confirm' }),
      onOk: async () => {
        const response = await logOutVehicle(params);
        if (!dealResponse(response, 1)) {
          dispatch({ type: 'vehicleList/fetchInitialData' });
        }
      },
    });
  }

  async function vehicleGroup() {
    setVisible(true);
  }

  async function exportVehicleHardwareInfo() {
    //
  }

  async function exportVehicleInfo() {
    //
  }

  return (
    <div>
      <Row className={commonStyles.tableToolLeft} style={{ marginBottom: 0 }}>
        <Form.Item label={formatMessage({ id: 'vehicle.id' })}>
          <Select
            allowClear
            mode="multiple"
            style={{ width: 300 }}
            value={searchParams.id}
            onChange={(value) => {
              updateSearchParam('id', value);
            }}
          >
            {renderVehicleIdFilter()}
          </Select>
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.vehicleState' })}>
          <Select
            allowClear
            mode="multiple"
            style={{ width: 300 }}
            value={searchParams.state}
            onChange={(value) => {
              updateSearchParam('state', value);
            }}
          >
            {renderVehicleStateFilter()}
          </Select>
        </Form.Item>

        <Form.Item label={<FormattedMessage id={'app.common.type'} />}>
          <Select
            allowClear
            style={{ width: 300 }}
            value={searchParams.vehicleType}
            onChange={(value) => {
              updateSearchParam('vehicleType', value);
            }}
          >
            {Object.values(allAdaptors).map(({ adapterType }) => {
              const { id, name, vehicleTypes } = adapterType;
              return (
                <Select.OptGroup key={id} label={name}>
                  {vehicleTypes.map((item, index) => (
                    <Select.Option key={index} value={`${id}@${item.code}`}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              );
            })}
          </Select>
        </Form.Item>
      </Row>
      <Row justify={'space-between'}>
        <Col className={commonStyles.tableToolLeft}>
          <Button disabled={selectedRows.length === 0} onClick={vehicleGroup}>
            <GroupOutlined /> <FormattedMessage id={'app.common.groupMange'} />
          </Button>
          <Button disabled={selectedRows.length === 0} onClick={cancelRegister}>
            <DisconnectOutlined /> <FormattedMessage id={'app.button.logout'} />
          </Button>
          {/*<Button disabled={selectedRows.length === 0} onClick={moveOutVehicle}>*/}
          {/*  <ToTopOutlined /> <FormattedMessage id='app.vehicle.moveout' />*/}
          {/*</Button>*/}
          {/*<Dropdown*/}
          {/*  overlay={*/}
          {/*    <Menu*/}
          {/*      onClick={({ key }) => {*/}
          {/*        if (key === 'hardware') {*/}
          {/*          exportVehicleHardwareInfo();*/}
          {/*        } else {*/}
          {/*          exportVehicleInfo();*/}
          {/*        }*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <Menu.Item key="hardware">*/}
          {/*        <FormattedMessage id={'app.vehicle.exportHardwareInfo'} />*/}
          {/*      </Menu.Item>*/}
          {/*      <Menu.Item key="carInfo">*/}
          {/*        <FormattedMessage id={'app.vehicle.exportVehicleInfo'} />*/}
          {/*      </Menu.Item>*/}
          {/*    </Menu>*/}
          {/*  }*/}
          {/*>*/}
          {/*  <Button>*/}
          {/*    <FormattedMessage id={'app.vehicle.infoExport'} /> <DownOutlined />*/}
          {/*  </Button>*/}
          {/*</Dropdown>*/}
          <Button>
            <RiseOutlined /> <FormattedMessage id='firmware.upgrade' />
          </Button>
          <Button>
            <DownloadOutlined /> <FormattedMessage id='app.logDownload' />
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: 'vehicleList/fetchInitialData' });
            }}
          >
            <RedoOutlined /> <FormattedMessage id='app.button.refresh' />
          </Button>
        </Col>
        <Col>
          <Button
            type="dashed"
            onClick={() => {
              dispatch({ type: 'vehicleList/updateShowRegisterPanel', payload: true });
            }}
          >
            <ScanOutlined /> <FormattedMessage id="app.vehicle.found" />
            {unregisterVehicles.length > 0 && (
              <span style={{ marginLeft: 5, color: Colors.red, fontWeight: 600 }}>
                [{unregisterVehicles.length}]
              </span>
            )}
          </Button>
        </Col>
      </Row>
      <ResourceGroupModal
        visible={visible}
        title={<FormattedMessage id={'app.vehicleGroup'} />}
        members={selectedRows.map(({ id }) => id)}
        groupType={'VEHICLE'}
        onOk={() => {
          dispatch({ type: 'vehicleList/fetchInitialData' });
        }}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};
export default connect(({ vehicleList }) => ({
  allAdaptors: vehicleList.allAdaptors,
  allVehicles: vehicleList.allVehicles,
  searchParams: vehicleList.searchParams,
}))(memo(VehicleListTools));

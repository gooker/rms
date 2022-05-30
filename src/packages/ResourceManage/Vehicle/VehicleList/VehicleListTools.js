/* TODO: I18N */
import React, { memo } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { DisconnectOutlined, GroupOutlined, RedoOutlined, ScanOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { logOutVehicle } from '@/services/resourceManageAPI';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';

const VehicleListTools = (props) => {
  const { dispatch, allVehicles, selectedRows, searchParams } = props;

  const registerVehicles = allVehicles.filter((item) => item.register);
  const unregisterVehicles = allVehicles.filter((item) => !item.register);

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
    dispatch({ type: 'vehicleList/updateSearchParams', payload: { ...searchParams, [key]: value } });
  }

  function cancelRegister() {
    const vehicleIds = selectedRows.map(({ vehicleId }) => vehicleId);
    RmsConfirm({
      content: formatMessage({ id: 'app.vehicle.moveOut.confirm' }),
      onOk: async () => {
        const response = await logOutVehicle({ ids: vehicleIds });
        if (!dealResponse(response, 1)) {
          dispatch({ type: 'vehicleList/fetchInitialData' });
        }
      },
    });
  }

  async function exportVehicleHardwareInfo() {
    //
  }

  async function exportVehicleInfo() {
    //
  }

  return (
    <div>
      <Row className={commonStyles.tableToolLeft}>
        <Form.Item label={formatMessage({ id: 'app.vehicle.id' })}>
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
        <Form.Item label={formatMessage({ id: 'app.vehicleStatus' })}>
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
      </Row>
      <Row justify={'space-between'}>
        <Col className={commonStyles.tableToolLeft}>
          <Button disabled={selectedRows.length === 0}>
            <GroupOutlined /> 车辆分组
          </Button>
          <Button disabled={selectedRows.length === 0} onClick={cancelRegister}>
            <DisconnectOutlined /> 注销
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
          <Button
            onClick={() => {
              dispatch({ type: 'vehicleList/fetchInitialData' });
            }}
          >
            <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
        <Col>
          <Button
            type="dashed"
            onClick={() => {
              dispatch({ type: 'vehicleList/updateShowRegisterPanel', payload: true });
            }}
          >
            <ScanOutlined /> <FormattedMessage id="app.vehicleList.found" />
            {unregisterVehicles.length > 0 && (
              <span style={{ marginLeft: 5, color: 'red', fontWeight: 600 }}>
                [{unregisterVehicles.length}]
              </span>
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ vehicleList }) => ({
  allVehicles: vehicleList.allVehicles,
  searchParams: vehicleList.searchParams,
}))(memo(VehicleListTools));
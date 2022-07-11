import React, { memo } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { DisconnectOutlined, RedoOutlined, ScanOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage } from '@/utils/util';
import { logOutVehicle } from '@/services/resourceService';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import { GroupManager, GroupResourceMemberId } from '@/components/ResourceGroup';
import commonStyles from '@/common.module.less';

const Colors = Dictionary().color;

const VehicleListTools = (props) => {
  const { dispatch, allVehicles, allAdaptors, searchParams, selectedRows, cancelSelection } = props;

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
        <Form.Item label={<FormattedMessage id={'app.vehicleType'} />}>
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
      </Row>
      <Row justify={'space-between'}>
        <Col className={commonStyles.tableToolLeft}>
          <Button disabled={selectedRows.length === 0} onClick={cancelRegister}>
            <DisconnectOutlined /> <FormattedMessage id={'app.button.logout'} />
          </Button>
          <GroupManager
            type={'VEHICLE'}
            memberIdKey={GroupResourceMemberId.VEHICLE}
            selections={selectedRows}
            refresh={() => {
              dispatch({ type: 'vehicleList/fetchInitialData' });
            }}
            cancelSelection={cancelSelection}
          />

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
            <ScanOutlined /> <FormattedMessage id="app.vehicle.found" />
            {unregisterVehicles.length > 0 && (
              <span style={{ marginLeft: 5, color: Colors.red, fontWeight: 600 }}>
                [{unregisterVehicles.length}]
              </span>
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ vehicleList, global }) => ({
  allAdaptors: global.allAdaptors,
  allVehicles: vehicleList.allVehicles,
  searchParams: vehicleList.searchParams,
}))(memo(VehicleListTools));

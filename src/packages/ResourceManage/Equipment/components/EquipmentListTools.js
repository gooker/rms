/* TODO: I18N */
import React, { memo } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { DisconnectOutlined, ExportOutlined, RedoOutlined, ScanOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { unRegisterDevice } from '@/services/resourceManageAPI';
import { dealResponse, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';

const EquipmentListTools = (props) => {
  const { dispatch, allDevices, selectedRows, searchParams } = props;
  const unregisterDevices = allDevices.filter((item) => !item.hasRegistered);
  const registerDevices = allDevices.filter((item) => item.hasRegistered);

  function renderIdFilter() {
    return registerDevices.map(({ deviceID }) => (
      <Select.Option key={deviceID} value={deviceID}>
        {deviceID}
      </Select.Option>
    ));
  }

  function rendeConnectTypeFilter() {
    const connectTypes = {
      MODBUS_TCP: 'MODBUS_TCP',
      MODBUS_RTU: 'MODBUS_RTU',
      HTTP: 'HTTP',
      TCP: 'TCP',
      UDP: 'UDP',
    };
    return Object.keys(connectTypes).map((item) => (
      <Select.Option key={item} value={item}>
        {connectTypes[item]}
      </Select.Option>
    ));
  }

  function updateSearchParam(key, value) {
    dispatch({ type: 'equipList/updateSearchParams', payload: { ...searchParams, [key]: value } });
  }

  function cancelRegister() {
    const ids = selectedRows.map(({ deviceID }) => deviceID);
    RmsConfirm({
      content: formatMessage({ id: 'app.agv.moveOut.confirm' }),
      onOk: async () => {
        const response = await unRegisterDevice({ ids });
        if (!dealResponse(response, 1)) {
          dispatch({ type: 'equipList/fetchInitialData' });
        }
      },
    });
  }

  return (
    <div>
      <Row className={commonStyles.tableToolLeft}>
        <Form.Item label={'设备ID'}>
          <Select
            allowClear
            mode="multiple"
            style={{ width: 300 }}
            value={searchParams.id}
            onChange={(value) => {
              updateSearchParam('id', value);
            }}
          >
            {renderIdFilter()}
          </Select>
        </Form.Item>
        <Form.Item label={'连接方式'}>
          <Select
            allowClear
            mode="multiple"
            style={{ width: 300 }}
            value={searchParams.connectionType}
            onChange={(value) => {
              updateSearchParam('connectionType', value);
            }}
          >
            {rendeConnectTypeFilter()}
          </Select>
        </Form.Item>
      </Row>
      <Row justify={'space-between'}>
        <Col className={commonStyles.tableToolLeft}>
          <Button disabled={selectedRows.length === 0} onClick={cancelRegister}>
            <DisconnectOutlined /> 取消注册
          </Button>

          <Button>
            <ExportOutlined /> <FormattedMessage id={'app.agv.infoExport'} />
          </Button>
          <Button
            onClick={() => {
              dispatch({ type: 'equipList/fetchInitialData' });
            }}
          >
            <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
        <Col>
          <Button
            type="dashed"
            onClick={() => {
              dispatch({ type: 'equipList/updateShowRegisterPanel', payload: true });
            }}
          >
            <ScanOutlined /> <FormattedMessage id="app.agvList.found" />
            {unregisterDevices.length > 0 && (
              <span style={{ marginLeft: 5, color: 'red', fontWeight: 600 }}>
                [{unregisterDevices.length}]
              </span>
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ equipList }) => ({
  allDevices: equipList.allDevices,
  searchParams: equipList.searchParams,
}))(memo(EquipmentListTools));
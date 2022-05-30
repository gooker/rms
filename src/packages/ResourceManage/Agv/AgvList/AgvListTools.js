/* TODO: I18N */
import React, { memo } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { DisconnectOutlined, GroupOutlined, RedoOutlined, ScanOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { logOutRobot } from '@/services/resourceManageAPI';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';

const AgvListTools = (props) => {
  const { dispatch, allRobots, selectedRows, searchParams } = props;

  const registerRobots = allRobots.filter((item) => item.register);
  const unregisterRobots = allRobots.filter((item) => !item.register);

  function renderAgvIdFilter() {
    return registerRobots.map(({ agvId, agvType, id }) => (
      <Select.Option key={id} value={id}>
        {`${agvId}-${agvType}`}
      </Select.Option>
    ));
  }

  function renderAgvStateFilter() {
    const agvStates = Dictionary('agvStatus');
    return Object.keys(agvStates).map((item) => (
      <Select.Option key={item} value={item}>
        <FormattedMessage id={agvStates[item]} />
      </Select.Option>
    ));
  }

  function moveOutAgv() {
    const agvIds = selectedRows.map(({ robotId }) => robotId);
    RmsConfirm({
      content: formatMessage({ id: 'app.agv.moveOut.confirm' }),
      onOk: async () => {
        //
      },
    });
  }

  function updateSearchParam(key, value) {
    dispatch({ type: 'agvList/updateSearchParams', payload: { ...searchParams, [key]: value } });
  }

  function cancelRegister() {
    const agvIds = selectedRows.map(({ robotId }) => robotId);
    RmsConfirm({
      content: formatMessage({ id: 'app.agv.moveOut.confirm' }),
      onOk: async () => {
        const response = await logOutRobot({ ids: agvIds });
        if (!dealResponse(response, 1)) {
          dispatch({ type: 'agvList/fetchInitialData' });
        }
      },
    });
  }

  async function exportAgvHardwareInfo() {
    //
  }

  async function exportAgvInfo() {
    //
  }

  return (
    <div>
      <Row className={commonStyles.tableToolLeft}>
        <Form.Item label={formatMessage({ id: 'app.agv.id' })}>
          <Select
            allowClear
            mode="multiple"
            style={{ width: 300 }}
            value={searchParams.id}
            onChange={(value) => {
              updateSearchParam('id', value);
            }}
          >
            {renderAgvIdFilter()}
          </Select>
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.agvStatus' })}>
          <Select
            allowClear
            mode="multiple"
            style={{ width: 300 }}
            value={searchParams.state}
            onChange={(value) => {
              updateSearchParam('state', value);
            }}
          >
            {renderAgvStateFilter()}
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
          {/*<Button disabled={selectedRows.length === 0} onClick={moveOutAgv}>*/}
          {/*  <ToTopOutlined /> <FormattedMessage id='app.agv.moveout' />*/}
          {/*</Button>*/}
          {/*<Dropdown*/}
          {/*  overlay={*/}
          {/*    <Menu*/}
          {/*      onClick={({ key }) => {*/}
          {/*        if (key === 'hardware') {*/}
          {/*          exportAgvHardwareInfo();*/}
          {/*        } else {*/}
          {/*          exportAgvInfo();*/}
          {/*        }*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      <Menu.Item key="hardware">*/}
          {/*        <FormattedMessage id={'app.agv.exportHardwareInfo'} />*/}
          {/*      </Menu.Item>*/}
          {/*      <Menu.Item key="carInfo">*/}
          {/*        <FormattedMessage id={'app.agv.exportAgvInfo'} />*/}
          {/*      </Menu.Item>*/}
          {/*    </Menu>*/}
          {/*  }*/}
          {/*>*/}
          {/*  <Button>*/}
          {/*    <FormattedMessage id={'app.agv.infoExport'} /> <DownOutlined />*/}
          {/*  </Button>*/}
          {/*</Dropdown>*/}
          <Button
            onClick={() => {
              dispatch({ type: 'agvList/fetchInitialData' });
            }}
          >
            <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
        <Col>
          <Button
            type="dashed"
            onClick={() => {
              dispatch({ type: 'agvList/updateShowRegisterPanel', payload: true });
            }}
          >
            <ScanOutlined /> <FormattedMessage id="app.agvList.found" />
            {unregisterRobots.length > 0 && (
              <span style={{ marginLeft: 5, color: 'red', fontWeight: 600 }}>
                [{unregisterRobots.length}]
              </span>
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default connect(({ agvList }) => ({
  allRobots: agvList.allRobots,
  searchParams: agvList.searchParams,
}))(memo(AgvListTools));

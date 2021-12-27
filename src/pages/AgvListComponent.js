import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Row, Select, Dropdown, Table, Button, Menu, Modal, message } from 'antd';
import { DeleteOutlined, DownOutlined, RedoOutlined, ToTopOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import {
  fetchAgvList,
  fetchToteAgvList,
  fetchDeleteAgvList,
  fetchMoveoutAGVs,
} from '@/services/api';
import TableWidthPages from '@/components/TableWidthPages';
import { dealResponse, isNull } from '@/utils/utils';
import history from '@/history';
import { AGVType, NameSpace } from '@/config/config';
import { exportAgvModuleInfo, exportAgvInfo } from '@/utils/featureUtil';
import LabelComponent from '@/components/LabelComponent';
import Dictionary from '@/utils/Dictionary';
import TablePageWrapper from '@/components/TablePageWrapper';
import commonStyles from '@/common.module.less';

const { confirm } = Modal;
@connect()
class AgvListComponent extends Component {
  state = {
    loading: false,

    agvList: [],

    selectedRows: [],
    selectedRowKeys: [],

    searchAgvId: null,
    searchAgvState: null,
  };

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const { agvType } = this.props;
    this.setState({ loading: true });
    let response = null;
    if (agvType === 'Tote') {
      response = await fetchToteAgvList(agvType);
    } else {
      response = await fetchAgvList(agvType);
    }

    if (!dealResponse(response)) {
      this.setState({ agvList: response });
    }
    this.setState({ loading: false });
  };

  filterData = () => {
    const { agvList, searchAgvId, searchAgvState } = this.state;
    let result = [...agvList];
    if (!isNull(searchAgvId) && searchAgvId.length > 0) {
      result = result.filter((item) => searchAgvId.includes(item.robotId));
    }
    if (!isNull(searchAgvState) && searchAgvState.length > 0) {
      result = result.filter((item) => searchAgvState.includes(item.agvStatus));
    }
    return result;
  };

  renderAgvStateFilter = () => {
    const agvStates = Dictionary('agvStatus');
    return Object.keys(agvStates).map((item) => (
      <Select.Option key={item} value={item}>
        <FormattedMessage id={agvStates[item]} />
      </Select.Option>
    ));
  };

  deleteAgv = () => {
    const _this = this;
    const { selectedRows } = this.state;
    const { agvType } = this.props;
    const agvIds = selectedRows.map(({ robotId }) => robotId);
    confirm({
      title: formatMessage({ id: 'app.common.systemHint' }),
      content: formatMessage({ id: 'app.agv.delete.confirm' }),
      onOk: async () => {
        const response = await fetchDeleteAgvList(agvType, {
          sectionId: window.localStorage.getItem('sectionId'),
          agvIdList: agvIds,
        });
        if (dealResponse(response)) {
          message.error(formatMessage({ id: 'app.agv.delete.failed' }));
        } else {
          message.success(formatMessage({ id: 'app.agv.delete.success' }));
          _this.getData();
          _this.setState({ selectedRows: [], selectedRowKeys: [] });
        }
      },
    });
  };

  moveOutAgv = () => {
    const _this = this;
    const { selectedRows } = this.state;
    const { agvType } = this.props;
    const agvIds = selectedRows.map(({ robotId }) => robotId);
    confirm({
      title: formatMessage({ id: 'app.common.systemHint' }),
      content: formatMessage({ id: 'app.agv.moveOut.confirm' }),
      onOk: async () => {
        const response = await fetchMoveoutAGVs(agvType, agvIds);
        if (dealResponse(response)) {
          message.error(formatMessage({ id: 'app.agv.moveOut.failed' }));
        } else {
          message.success(formatMessage({ id: 'app.agv.moveOut.success' }));
          _this.getData();
          _this.setState({ selectedRows: [], selectedRowKeys: [] });
        }
      },
    });
  };

  exportAgvHardwareInfo = async () => {
    const { agvList } = this.state;
    const { agvType } = this.props;
    this.setState({ loading: true });
    await exportAgvModuleInfo(agvType, agvList);
    this.setState({ loading: false });
  };

  exportAgvInfo = async () => {
    const { agvList } = this.state;
    this.setState({ loading: true });
    await exportAgvInfo(agvList);
    this.setState({ loading: false });
  };

  checkAgvDetail = (agvId) => {
    const { agvType, dispatch } = this.props;
    const route = `/${NameSpace[agvType]}/agv/agvRealTime`;
    history.push({
      pathname: route,
      search: `agvId=${agvId}`,
    });
    dispatch({ type: 'global/saveSelectedKeys', payload: [route] });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
  };

  render() {
    const { loading, agvList, selectedRowKeys } = this.state;
    const { getColumn, deleteFlag, moveFlag, exportFlag, agvType } = this.props;
    return (
      <TablePageWrapper>
        <div>
          <Row className={commonStyles.tableToolLeft}>
            <LabelComponent label={formatMessage({ id: 'app.agv.id' })} width={500}>
              <Select
                allowClear
                showSearch
                mode="multiple"
                maxTagCount={6}
                style={{ width: '100%' }}
                onChange={(value) => {
                  this.setState({ searchAgvId: value });
                }}
              >
                {agvList.map(({ robotId }) => (
                  <Select.Option key={robotId} value={robotId}>
                    {robotId}
                  </Select.Option>
                ))}
              </Select>
            </LabelComponent>
            <LabelComponent label={formatMessage({ id: 'app.agv.status' })} width={500}>
              <Select
                allowClear
                mode="multiple"
                maxTagCount={3}
                style={{ width: '100%' }}
                onChange={(value) => {
                  this.setState({ searchAgvState: value });
                }}
              >
                {this.renderAgvStateFilter()}
              </Select>
            </LabelComponent>
          </Row>
          <Row className={commonStyles.tableToolLeft}>
            {deleteFlag && (
              <Button danger disabled={selectedRowKeys.length === 0} onClick={this.deleteAgv}>
                <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
              </Button>
            )}
            {moveFlag && (
              <Button disabled={selectedRowKeys.length === 0} onClick={this.moveOutAgv}>
                <ToTopOutlined /> <FormattedMessage id="app.agv.moveout" />
              </Button>
            )}
            {exportFlag && agvType === AGVType.LatentLifting && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={({ key }) => {
                      if (key === 'hardware') {
                        this.exportAgvHardwareInfo();
                      } else {
                        this.exportAgvInfo();
                      }
                    }}
                  >
                    <Menu.Item key="hardware">
                      {formatMessage({ id: 'app.agv.exportHardwareInfo' })}
                    </Menu.Item>
                    <Menu.Item key="carInfo">
                      {formatMessage({ id: 'app.agv.exportAgvInfo' })}
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  {formatMessage({ id: 'app.agv.infoExport' })}
                  <DownOutlined />
                </Button>
              </Dropdown>
            )}
            <Button type="primary" onClick={this.getData}>
              <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Row>
        </div>
        <TableWidthPages
          loading={loading}
          columns={getColumn(this.checkAgvDetail)}
          dataSource={this.filterData()}
          rowSelection={{
            selectedRowKeys,
            onChange: this.onSelectChange,
          }}
          rowKey={(record) => record.id}
        />
      </TablePageWrapper>
    );
  }
}
export default AgvListComponent;

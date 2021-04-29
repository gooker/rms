import React, { Component } from 'react';
import { Form, Table, Row, Col, Select, Dropdown, Button, Menu, Modal, message } from 'antd';
import { DeleteOutlined, DownOutlined, RedoOutlined, ToTopOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { fetchAgvList, fetchDeleteAgvList, fetchMoveoutAGVs } from '@/services/api';
import { dealResponse, isNull, exportAgvModuleInfo, exportAgvInfo } from '@/utils/utils';
import dictionary from '@/utils/Dictionary';
import TablePageHOC from '@/components/TablePageHOC';
import commonStyles from '@/common.module.less';

const { confirm } = Modal;

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
    const { nameSpace } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    this.setState({ loading: true });
    const response = await fetchAgvList(nameSpace, sectionId);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.agv.getListFail' }));
    } else {
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
    const agvStates = dictionary('agvStatus', 'all');
    return Object.keys(agvStates).map((item) => (
      <Select.Option key={item} value={item}>
        <FormattedMessage id={agvStates[item]} />
      </Select.Option>
    ));
  };

  deleteAgv = () => {
    const _this = this;
    const { selectedRows } = this.state;
    const { nameSpace } = this.props;
    const agvIds = selectedRows.map(({ robotId }) => robotId);
    confirm({
      title: formatMessage({ id: 'app.common.systemHint' }),
      content: formatMessage({ id: 'app.agv.delete.confirm' }),
      onOk: async () => {
        const response = await fetchDeleteAgvList(nameSpace, {
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
    const { nameSpace } = this.props;
    const agvIds = selectedRows.map(({ robotId }) => robotId);
    confirm({
      title: formatMessage({ id: 'app.common.systemHint' }),
      content: formatMessage({ id: 'app.agv.moveOut.confirm' }),
      onOk: async () => {
        const response = await fetchMoveoutAGVs(nameSpace, agvIds);
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
    const { nameSpace } = this.props;
    this.setState({ loading: true });
    await exportAgvModuleInfo(nameSpace, agvList);
    this.setState({ loading: false });
  };

  exportAgvInfo = async () => {
    const { agvList } = this.state;
    this.setState({ loading: true });
    await exportAgvInfo(agvList);
    this.setState({ loading: false });
  };

  checkAgvDetail = (agvId) => {};

  onSelectChange = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeys, selectedRow });
  };

  render() {
    const { loading, agvList, selectedRowKeys } = this.state;
    const { getColumn, pageHeight } = this.props;
    return (
      <div className={commonStyles.pageWrapper} style={{ height: pageHeight }}>
        <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
          <div style={{ flex: 10, display: 'flex' }}>
            <div style={{ marginRight: '24px' }}>
              <Button disabled={selectedRowKeys.length === 0} onClick={this.deleteAgv}>
                <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
              </Button>
            </div>
            <div style={{ marginRight: '24px' }}>
              <Button disabled={selectedRowKeys.length === 0} onClick={this.moveOutAgv}>
                <ToTopOutlined /> <FormattedMessage id="app.agv.moveout" />
              </Button>
            </div>
            <div style={{ marginRight: '24px' }}>
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
            </div>
            <Row style={{ width: 730 }} gutter={24}>
              <Col span={10}>
                <Form.Item label={formatMessage({ id: 'app.agv.id' })}>
                  <Select
                    allowClear
                    showSearch
                    mode="multiple"
                    maxTagCount={4}
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
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item label={formatMessage({ id: 'app.agv.status' })}>
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
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={this.search}>
              <RedoOutlined />
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </div>
        </div>
        <div className={commonStyles.tableWrapper}>
          <Table
            loading={loading}
            columns={getColumn(this.checkAgvDetail)}
            dataSource={this.filterData()}
            scroll={{ x: 'max-content' }}
            pagination={{
              responsive: true,
              defaultPageSize: 20,
              showTotal: (total) =>
                formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
            }}
            rowSelection={{
              selectedRowKeys,
              onChange: this.onSelectChange,
            }}
          />
        </div>
      </div>
    );
  }
}
export default TablePageHOC(AgvListComponent);

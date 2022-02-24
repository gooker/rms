import React, { Component } from 'react';
import { Button, Col, Row, Modal, message, Drawer } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { saveAs } from 'file-saver';
import { dealResponse, formatMessage } from '@/utils/util';
import {
  fetchAddRole,
  fetchUpdateRole,
  fetchUploadRoles,
  fetchAllRoleList,
  fetchDeleteRoleById,
  saveRoleAssignAuthority,
} from '@/services/SSO';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddRoleModal from './components/AddRoleModal';
import RoleAssignModal from './components/RoleAssignModal';
import UploadPanel from '@/components/UploadPanel';
import RmsConfirm from '@/components/RmsConfirm';
import { IconFont } from '@/components/IconFont';
import commonStyles from '@/common.module.less';

export default class index extends Component {
  state = {
    selectedRowKeys: [],
    selectedRow: [],
    roleList: [],
    loading: false,
    addRoleVisible: false,
    updateRoleFlag: false,
    uploadModal: false,
    authAssignVisible: false,
  };

  columns = [
    {
      title: <FormattedMessage id="app.common.code" />,
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.description" />,
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createDate',
      align: 'center',
      render: (text) => new moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: <FormattedMessage id="app.common.updateTime" />,
      dataIndex: 'updateDate',
      align: 'center',
      render: (text) => new moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  componentDidMount() {
    this.getRoleList();
  }

  getRoleList = async () => {
    this.setState({ loading: true });
    const roleList = await fetchAllRoleList();
    if (!dealResponse(roleList)) {
      this.setState({ roleList });
    }
    this.setState({ loading: false });
  };

  // 新增 编辑角色
  updateRole = async (values) => {
    const { selectedRow, updateRoleFlag } = this.state;
    let response = null;
    if (updateRoleFlag) {
      response = await fetchUpdateRole({ ...values, id: selectedRow[0].id });
    } else {
      response = await fetchAddRole(values);
    }
    if (!dealResponse(response)) {
      message.info(formatMessage({ id: 'app.message.operateSuccess' }));
      this.setState(
        {
          addRoleVisible: false,
          updateRoleFlag: false,
          selectedRow: [],
          selectedRowKeys: [],
        },
        this.getRoleList,
      );
    } else {
      message.error(response.message);
    }
  };

  // 删除
  deleteRole = () => {
    const { selectedRowKeys } = this.state;
    const this_ = this;
    RmsConfirm({
      content: '是否要删除所选择的角色',
      onOk: async () => {
        const deleteRes = await fetchDeleteRoleById({ id: selectedRowKeys[0] });
        if (!dealResponse(deleteRes)) {
          message.info(formatMessage({ id: 'app.message.operateSuccess' }));
          this_.setState({ selectedRow: [], selectedRowKeys: [] }, this_.getRoleList);
        }
      },
    });
  };

  // 权限分配
  submitAuthKeys = async (keys) => {
    const { selectedRowKeys } = this.state;
    const params = { id: selectedRowKeys[0], authorityKeys: [...keys] };
    const response = await saveRoleAssignAuthority(params);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      this.setState(
        { selectedRow: [], selectedRowKeys: [], authAssignVisible: false },
        this.getRoleList,
      );
    }
  };

  export = () => {
    const { selectedRow, roleList } = this.state;
    const exportData = selectedRow.length === 0 ? roleList : selectedRow;
    const blob = new Blob(['\uFEFF' + JSON.stringify(exportData, null, 4)], {
      type: 'text/plain;charset=utf-8;',
    });
    saveAs(blob, 'Role_Info.json');
  };

  analyzeFunction = async (evt) => {
    try {
      const fileJson = JSON.parse(evt.target.result);
      if (Array.isArray(fileJson)) {
        const response = await fetchUploadRoles(fileJson);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          this.setState({ uploadModal: false });
          this.getRoleList();
        }
      } else {
        message.error(formatMessage({ id: 'app.message.fileCorrupted' }));
      }
    } catch (error) {
      message.error(formatMessage({ id: 'app.message.fileCorrupted' }));
    }
  };

  render() {
    const {
      loading,
      roleList,
      selectedRow,
      selectedRowKeys,
      addRoleVisible,
      updateRoleFlag,
      authAssignVisible,
      uploadModal,
    } = this.state;
    return (
      <TablePageWrapper>
        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              onClick={() => {
                this.setState({ addRoleVisible: true });
              }}
            >
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Button
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                this.setState({ addRoleVisible: true, updateRoleFlag: true });
              }}
            >
              <EditOutlined /> <FormattedMessage id="app.button.edit" />
            </Button>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={this.deleteRole}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                this.setState({ authAssignVisible: true });
              }}
            >
              <IconFont type="icon-fenpei" /> <FormattedMessage id="sso.role.permissionAssign" />
            </Button>
            <Button disabled={roleList.length === 0} onClick={this.export}>
              <ExportOutlined /> <FormattedMessage id="app.button.export" />
            </Button>
            <Button
              onClick={() => {
                this.setState({ uploadModal: true });
              }}
            >
              <ImportOutlined /> <FormattedMessage id="app.button.import" />
            </Button>
          </Col>
          <Col>
            <Button type="primary" ghost onClick={this.getRoleList}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
        <TableWidthPages
          bordered
          columns={this.columns}
          dataSource={roleList}
          loading={loading}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRow) => {
              this.setState({ selectedRowKeys, selectedRow });
            },
          }}
        />

        {/* 新增修改 */}
        <Modal
          footer={null}
          visible={addRoleVisible}
          destroyOnClose
          title={
            updateRoleFlag ? (
              <FormattedMessage id="app.button.add" />
            ) : (
              <FormattedMessage id="app.button.edit" />
            )
          }
          onCancel={() => {
            this.setState({ addRoleVisible: false, updateRoleFlag: false });
          }}
        >
          <AddRoleModal onAddRoles={this.updateRole} updateRow={selectedRow} />
        </Modal>

        {/* 权限分配 */}
        <Drawer
          title={formatMessage({ id: 'sso.role.permissionAssign' })}
          destroyOnClose
          onClose={() => {
            this.setState({ authAssignVisible: false });
          }}
          width={'600'}
          visible={authAssignVisible}
          style={{ overflow: 'auto' }}
        >
          <RoleAssignModal submitAuthKeys={this.submitAuthKeys} />
        </Drawer>

        {/**角色导入***/}
        <Modal
          width={600}
          footer={null}
          destroyOnClose
          visible={uploadModal}
          title={'导入角色'}
          onCancel={() => {
            this.setState({
              uploadModal: false,
            });
          }}
        >
          <UploadPanel analyzeFunction={this.analyzeFunction} />
        </Modal>
      </TablePageWrapper>
    );
  }
}

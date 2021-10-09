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
import { saveAs } from 'file-saver';
import IconFont from '@/utils/ExtraIcon';
import { GMT2UserTimeZone, dealResponse, formatMessage } from '@/utils/utils';
import {
  fetchAllRoleList,
  fetchAddRole,
  fetchUpdateRole,
  fetchDeleteRoleById,
  saveRoleAssignAuthority,
  fetchUploadRoles,
} from '@/services/user';
import TablewidthPages from '@/components/TablewidthPages';
import FormattedMessage from '@/components/FormattedMessage';
import AddRoleModal from './components/AddRoleModal';
import RoleAssignModal from './components/RoleAssignModal';
import ImportModal from '@/packages/Translator/LanguageManage/component/ImportI18nLanguage';
import commonStyles from '@/common.module.less';
import RcsConfirm from '@/components/RcsConfirm';

export default class index extends Component {
  state = {
    selectedRowKeys: [],
    selectedRow: [],
    roleList: [],
    loading: false,
    addRoleVisble: false,
    updateRoleFlag: false,
    uploadModal: false,
    authAssignVisible: false,
  };

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
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
      this.setState(
        {
          addRoleVisble: false,
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
    RcsConfirm({
      content: '是否要删除所选择的角色',
      onOk: async () => {
        const deleteRes = await fetchDeleteRoleById({ id: selectedRowKeys[0] });
        if (!dealResponse(deleteRes)) {
          message.info(formatMessage({ id: 'app.tip.operationFinish' }));
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
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
      this.setState(
        { selectedRow: [], selectedRowKeys: [], authAssignVisible: false },
        this.getRoleList,
      );
    }
  };

  columns = [
    {
      title: <FormattedMessage id="rolemanager.code" />,
      dataIndex: 'code',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'label',
      align: 'center',
    },
    {
      title: <FormattedMessage id="rolemanager.description" />,
      dataIndex: 'description',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.taskDetail.createTime" />,
      dataIndex: 'createDate',
      align: 'center',
      render: (text) => {
        return text && GMT2UserTimeZone(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: <FormattedMessage id="rolemanager.updateTime" />,
      dataIndex: 'updateDate',
      align: 'center',
      render: (text) => {
        return text && GMT2UserTimeZone(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

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
          message.success(formatMessage({ id: 'app.tip.operationFinish' }));
          this.setState({ uploadModal: false });
          this.getRoleList();
        }
      } else {
        message.error(formatMessage({ id: 'rolemanager.fileCorrupted' }));
      }
    } catch (error) {
      console.error('文件格式不对,重新上传');
    }
  };

  render() {
    const {
      selectedRowKeys,
      selectedRow,
      roleList,
      loading,
      addRoleVisble,
      updateRoleFlag,
      authAssignVisible,
      uploadModal,
    } = this.state;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Row className={commonStyles.mb20}>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                this.setState({ addRoleVisble: true });
              }}
            >
              <FormattedMessage id="app.button.add" />
            </Button>
            <Button
              icon={<EditOutlined />}
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                this.setState({ addRoleVisble: true, updateRoleFlag: true });
              }}
            >
              <FormattedMessage id="sso.user.edit" />
            </Button>
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
              icon={<DeleteOutlined />}
              onClick={this.deleteRole}
            >
              <FormattedMessage id="app.button.delete" />
            </Button>
            <Button
              disabled={selectedRowKeys.length !== 1}
              onClick={() => {
                this.setState({ authAssignVisible: true });
              }}
            >
              <IconFont type="icon-fenpei" />
              <FormattedMessage id="rolemanager.authAssign" />
            </Button>
            <Button
              disabled={roleList.length === 0}
              icon={<ExportOutlined />}
              onClick={this.export}
            >
              <FormattedMessage id="app.button.export" />
            </Button>
            <Button
              icon={<ImportOutlined />}
              onClick={() => {
                this.setState({ uploadModal: true });
              }}
            >
              <FormattedMessage id="app.button.import" />
            </Button>
          </Col>
          <Col>
            <Button type="primary" ghost icon={<ReloadOutlined />} onClick={this.getRoleList}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>

        <div className={commonStyles.divContent}>
          <TablewidthPages
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
        </div>

        {/* 新增修改 */}
        <Modal
          footer={null}
          visible={addRoleVisble}
          destroyOnClose
          title={
            updateRoleFlag ? (
              <FormattedMessage id="app.button.add" />
            ) : (
              <FormattedMessage id="sso.user.edit" />
            )
          }
          onCancel={() => {
            this.setState({ addRoleVisble: false, updateRoleFlag: false });
          }}
        >
          <AddRoleModal onAddRoles={this.updateRole} updateRow={selectedRow} />
        </Modal>

        {/* 权限分配 */}
        <Drawer
          title="权限分配"
          destroyOnClose
          onClose={() => {
            this.setState({ authAssignVisible: false });
          }}
          width={'600'}
          visible={authAssignVisible}
          // bodyStyle={{ padding: '10px 30px' }}
          style={{
            overflow: 'auto',
          }}
        >
          <RoleAssignModal
            roleList={roleList}
            selectedRowKeys={selectedRowKeys}
            submitAuthKeys={this.submitAuthKeys}
          />
        </Drawer>

        {/**角色导入***/}
        <Modal
          width={600}
          footer={null}
          destroyOnClose
          visible={uploadModal}
          onCancel={() => {
            this.setState({
              uploadModal: false,
            });
          }}
        >
          <ImportModal analyzeFunction={this.analyzeFunction} />
        </Modal>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Row, Col, Select, Button, Tag, Popover, message, Modal, Form } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { IconFont } from '@/components/IconFont';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, adjustModalWidth, copyToBoard } from '@/utils/util';
import {
  fetchUserManagerList,
  updateUserManage,
  addUserManager,
  updateUserPassword,
  fetchDeleteUser,
  saveUserSections,
  saveUsersAssignedRole,
} from '@/services/SSO';
import RmsConfirm from '@/components/RmsConfirm';
import TableWithPages from '@/components/TableWithPages';
import { UserTColor, AdminTColor, AdminTLabelMap } from './userManagerUtils';
import StatusChoice from './components/StatusChoice';
import AddUserModal from './components/AddUser';
import UpdatePasswordModal from './components/UpdatePassword';
import SectionAssignModal from './components/SectionAssign';
import RoleAssignModal from './components/RoleAssign';
import commonStyles from '@/common.module.less';
import TablePageWrapper from '@/components/TablePageWrapper';

const AdminTypeLabelMap = AdminTLabelMap();
const { Option } = Select;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class UserManager extends Component {
  state = {
    loading: false,
    // 标记当前是否是编辑操作
    updateUserFlag: false,
    // 是否可以更新账户信息
    updateEnabled: false,
    updateItem: null,

    selectRow: [],
    selectRowKey: [],

    searchUsers: [],
    dataList: [],

    // 新增 & 更新用户Modal
    addUserVisible: false,
    // 重置用户密码Modal
    updatePwdVisible: false,
    // 区域分配Modal
    sectionAssignVisible: false,
    // 角色分配Modal
    roleAssignVisible: false,

    adminType: null,
  };

  columns = [
    {
      title: <FormattedMessage id="sso.user.name" />,
      dataIndex: 'username',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'userType',
      render: (text) => {
        return (
          <Tag color={UserTColor[text]}>
            {text === 'USER' ? (
              <FormattedMessage id="sso.user" />
            ) : (
              <FormattedMessage id="app.module" />
            )}
          </Tag>
        );
      },
      align: 'center',
    },
    {
      title: <FormattedMessage id="sso.user.adminType" />,
      dataIndex: 'adminType',
      render: (text) => {
        const adminType = text || 'USER';
        return <Tag color={AdminTColor[adminType]}>{AdminTypeLabelMap[adminType]}</Tag>;
      },
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.status" />,
      dataIndex: 'disable',
      align: 'center',
      render: (text, record) => {
        let disable = null;
        let content = (
          <StatusChoice
            onChange={() => {
              this.changeStatus(record.id);
            }}
            status={!text}
          />
        );
        if (text) {
          disable = (
            <span style={{ color: 'red', cursor: 'pointer' }}>
              <FormattedMessage id="sso.user.tip.disabled" />
            </span>
          );
        } else {
          disable = (
            <span style={{ color: 'green', cursor: 'pointer' }}>
              <FormattedMessage id="sso.user.tip.enabled" />
            </span>
          );
        }
        return (
          <Popover
            content={content}
            title={<FormattedMessage id="app.button.edit" />}
            trigger="hover"
            placement="left"
          >
            {disable}
          </Popover>
        );
      },
    },
    {
      title: <FormattedMessage id="sso.user.email" />,
      dataIndex: 'email',
      align: 'center',
      width: '15%',
    },
    {
      title: 'Token',
      dataIndex: 'token',
      align: 'center',
      with: '150',
      render: (text, record) => {
        if (record.userType === 'APP') {
          return (
            <div>
              <Popover content={text} trigger="click">
                <Button type="link">
                  <FormattedMessage id="app.map.view" />
                </Button>
              </Popover>
              <Button
                type="link"
                onClick={() => {
                  this.addToClipBoard(text);
                }}
              >
                <FormattedMessage id="app.button.copy" />
              </Button>
            </div>
          );
        } else {
          return <span />;
        }
      },
    },
    {
      title: <FormattedMessage id="translator.languageManage.language" />,
      dataIndex: 'language',
      align: 'center',
      with: '150',
    },
    {
      title: <FormattedMessage id="app.common.remark" />,
      dataIndex: 'description',
      ellipsis: true,
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createDate',
      align: 'center',
      fixed: 'right',
    },
  ];

  componentDidMount() {
    const { currentUser } = this.props;
    const adminType = currentUser.adminType || 'USER';
    this.setState({ adminType });
    this.getUserDataList();
  }

  getUserDataList = async () => {
    this.setState({ loading: true, selectRow: [], selectRowKey: [] });
    const response = await fetchUserManagerList();
    if (!dealResponse(response)) {
      this.setState({ dataList: response });
    }
    this.setState({ loading: false });
  };

  tableRowSelection = (selectRowKey, selectRow) => {
    const { currentUser } = this.props;
    let updateEnabled = false;
    if (selectRow === 0) {
      //
    } else {
      if (selectRow.length > 1) {
        this.setState({ updateItem: null, selectRowKey, selectRow });
      } else {
        const updateItem = { ...selectRow[0] };
        updateItem.adminType = updateItem.adminType ? updateItem.adminType : 'USER';

        // 当前管理员只能修改小于自己level的账户信息 或者 修改本身
        updateEnabled =
          currentUser.level > updateItem.level || updateItem.username === currentUser.username;
        this.setState({ updateItem, selectRowKey, selectRow, updateEnabled });
      }
    }
  };

  // 用户名搜索
  userHandleChange = (searchUsers) => {
    const { dataList } = this.state;
    const { currentUser } = this.props;
    const selectRow = dataList.filter((record) => searchUsers.includes(record.id));
    const selectRowKey = selectRow.map((record) => record.id);

    if (selectRow.length > 0) {
      if (selectRow.length === 1) {
        const updateItem = { ...selectRow[0] };
        updateItem.adminType = updateItem.adminType ? updateItem.adminType : 'USER';

        // 当前管理员只能修改小于自己level的账户信息 或者 修改本身
        const updateEnabled =
          currentUser.level > updateItem.level || updateItem.username === currentUser.username;
        this.setState({ searchUsers, updateItem, selectRowKey, selectRow, updateEnabled });
      } else {
        this.setState({ searchUsers, updateItem: null, selectRowKey, selectRow });
      }
    } else {
      this.setState({
        searchUsers: [],
        updateItem: null,
        selectRowKey: [],
        selectRow: [],
        updateEnabled: false,
      });
    }
  };

  // 重置密码
  submitUpdatedPwd = async (values) => {
    const { selectRowKey } = this.state;
    const params = {
      userId: selectRowKey[0],
      changePassword: values.password,
    };
    const updateRes = await updateUserPassword(params);
    if (!dealResponse(updateRes, true)) {
      this.setState(
        { updatePwdVisible: false, selectRow: [], selectRowKey: [] },
        this.getUserDataList,
      );
    }
  };

  // 用户表单提交
  onSubmit = async (values) => {
    const { updateUserFlag, selectRow } = this.state;

    // 后台不支持 adminType===USER, 这里删除
    const requestParams = { ...values };
    if (requestParams.adminType === 'USER') {
      delete requestParams.adminType;
    }
    let response;
    // 编辑
    if (updateUserFlag) {
      response = await updateUserManage({ ...requestParams, id: selectRow[0].id });
    } else {
      response = await addUserManager(requestParams);
    }
    if (!dealResponse(response, true)) {
      this.setState(
        {
          addUserVisible: false,
          updateUserFlag: false,
          selectRow: [],
          selectRowKey: [],
        },
        this.getUserDataList,
      );
    } else {
      message.error(response.message);
    }
  };

  // 注销用户
  deleteUser = () => {
    const { selectRow } = this.state;
    const content = (
      <>
        {formatMessage({ id: 'sso.user.deleteUser.snippet1', format: false })}
        <span style={{ margin: '0px 5px', color: 'red' }}>{selectRow[0].username}</span>
        {formatMessage({ id: 'sso.user.deleteUser.snippet2', format: false })}
      </>
    );
    const this_ = this;
    RmsConfirm({
      content: content,
      onOk: async () => {
        const deleteRes = await fetchDeleteUser({ id: selectRow[0].id });
        if (!dealResponse(deleteRes, true)) {
          this_.setState({ selectRow: [], selectRowKey: [] }, this_.getUserDataList);
        }
      },
    });
  };

  // 状态更改
  changeStatus = async (id) => {
    const { dataList } = this.state;
    const currentRow = dataList.filter((record) => record.id === id)[0];
    const params = {
      ...currentRow,
      disable: !currentRow.disable,
    };
    const updateRes = await updateUserManage(params);
    if (!dealResponse(updateRes, true)) {
      this.getUserDataList();
    }
  };

  // 区域分配
  updateSectionList = async (values) => {
    const { selectRow } = this.state;
    const selectionRes = await saveUserSections({
      sections: [...values],
      userId: selectRow[0].id,
    });
    if (!dealResponse(selectionRes, true)) {
      this.setState(
        { sectionAssignVisible: false, selectRow: [], selectRowKey: [] },
        this.getUserDataList,
      );
    }
  };

  // 角色分配
  updateRoleList = async (values) => {
    const { selectRow } = this.state;
    const rolesRes = await saveUsersAssignedRole({
      roleIds: [...values],
      userId: selectRow[0].id,
    });
    if (!dealResponse(rolesRes, true)) {
      this.setState(
        { roleAssignVisible: false, selectRow: [], selectRowKey: [] },
        this.getUserDataList,
      );
    }
  };

  addToClipBoard = (content) => {
    copyToBoard(content);
  };

  render() {
    const {
      loading,
      dataList,
      selectRow,
      selectRowKey,
      updateUserFlag,
      updateEnabled,
      searchUsers,
      adminType,
      updateItem,
      addUserVisible,
      roleAssignVisible,
      sectionAssignVisible,
    } = this.state;
    const showUsersList = dataList.filter((record) => {
      if (searchUsers.length > 0) {
        return searchUsers.includes(record.id);
      } else {
        return true;
      }
    });
    return (
      <TablePageWrapper>
        <div>
          <Form.Item label={<FormattedMessage id="sso.user.name" />}>
            <Select
              showSearch
              allowClear
              mode="multiple"
              style={{ width: '50%' }}
              onChange={this.userHandleChange}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {dataList.map((rec) => {
                return (
                  <Option key={rec.id} value={rec.id}>
                    {rec.username}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Row>
            <Col flex="auto" className={commonStyles.tableToolLeft}>
              {/* 新增用户 */}
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ addUserVisible: true, updateUserFlag: false });
                }}
              >
                <PlusOutlined /> <FormattedMessage id="app.button.add" />
              </Button>

              {/* 编辑 */}
              <Button
                disabled={selectRowKey.length !== 1 || !updateEnabled}
                onClick={() => {
                  this.setState({ addUserVisible: true, updateUserFlag: true });
                }}
              >
                <EditOutlined /> <FormattedMessage id="app.button.edit" />
              </Button>

              {/* 重置密码 */}
              <Button
                disabled={selectRowKey.length !== 1 || !updateEnabled}
                onClick={() => {
                  this.setState({ updatePwdVisible: true });
                }}
              >
                <EditOutlined /> <FormattedMessage id="sso.user.action.resetPwd" />
              </Button>

              {/* 删除用户 */}
              <Button
                danger
                disabled={selectRowKey.length !== 1 || !updateEnabled}
                onClick={this.deleteUser}
              >
                <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
              </Button>

              {/* 分配区域 */}
              <Button
                disabled={selectRowKey.length !== 1 || !updateEnabled}
                onClick={() => {
                  this.setState({ sectionAssignVisible: true });
                }}
              >
                <IconFont type="icon-fenpei" /> <FormattedMessage id="sso.user.sectionAssign" />
              </Button>

              {/* 分配角色 */}
              <Button
                disabled={selectRowKey.length !== 1 || !updateEnabled}
                onClick={() => {
                  this.setState({ roleAssignVisible: true });
                }}
              >
                <IconFont type="icon-fenpei" /> <FormattedMessage id="sso.user.roleAssign" />
              </Button>
            </Col>
            <Col>
              <Button onClick={this.getUserDataList}>
                <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
              </Button>
            </Col>
          </Row>
        </div>
        <TableWithPages
          bordered
          columns={this.columns}
          rowKey={(record) => record.id}
          dataSource={showUsersList}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectRowKey,
            onChange: this.tableRowSelection,
          }}
        />

        {/* 新建编辑用户 */}
        <Modal
          destroyOnClose
          footer={null}
          maskClosable={false}
          style={{ top: 30 }}
          width={600}
          visible={addUserVisible}
          title={
            updateUserFlag ? (
              <FormattedMessage id="sso.user.updateUserInfo" />
            ) : (
              <FormattedMessage id="sso.user.newUser" />
            )
          }
          onCancel={() => {
            this.setState({ addUserVisible: false, updateUserFlag: false });
          }}
        >
          <AddUserModal type={adminType} updateRow={updateItem} onAddUser={this.onSubmit} />
        </Modal>

        {/**修改密码***/}
        <Modal
          width={400}
          footer={null}
          title={formatMessage({ id: 'sso.user.action.resetPwd', format: false })}
          destroyOnClose
          visible={this.state.updatePwdVisible}
          onCancel={() => {
            this.setState({ updatePwdVisible: false });
          }}
        >
          <UpdatePasswordModal onSubmit={this.submitUpdatedPwd} />
        </Modal>

        {/* 区域分配 */}
        <Modal
          destroyOnClose
          style={{ top: 20 }}
          footer={null}
          title={<FormattedMessage id="sso.user.sectionAssign" />}
          width={adjustModalWidth() * 0.58 < 500 ? 500 : adjustModalWidth() * 0.58}
          onCancel={() => {
            this.setState({ sectionAssignVisible: false });
          }}
          visible={sectionAssignVisible}
        >
          <SectionAssignModal selectRow={selectRow} onSubmit={this.updateSectionList} />
        </Modal>

        {/* 角色分配 */}
        <Modal
          destroyOnClose
          style={{ top: 20 }}
          footer={null}
          title={<FormattedMessage id="sso.user.roleAssign" />}
          width={adjustModalWidth() * 0.58 < 550 ? 550 : adjustModalWidth() * 0.58}
          onCancel={() => {
            this.setState({ roleAssignVisible: false });
          }}
          visible={roleAssignVisible}
        >
          <RoleAssignModal selectRow={selectRow} onSubmit={this.updateRoleList} />
        </Modal>
      </TablePageWrapper>
    );
  }
}
export default UserManager;

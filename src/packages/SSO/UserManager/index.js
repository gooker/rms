import React, { Component } from 'react';
import { Row, Col, Select, Button, Tag, Popover, message, Modal, Form } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, adjustModalWidth, copyToBoard } from '@/utils/utils';
import {
  fetchUserManagerList,
  updateUserManage,
  addUserManager,
  updateUserPassword,
  fetchDeleteUser,
  saveUserSections,
  saveUsersAssignedRole,
} from '@/services/user';
import IconFont from '@/utils/ExtraIcon';
import RcsConfirm from '@/components/RcsConfirm';
import TableWidthPages from '@/components/TableWidthPages';
import { UserTColor, AdminTColor, AdminTLabelMap } from './userManagerUtils';
import StatusChoice from './components/StatusChoice';
import AddUserModal from './components/AddUser';
import UpdatePasswordModal from './components/UpdatePassword';
import SectionAssignModal from './components/SectionAssign';
import RoleAssignModal from './components/RoleAssign';
import commonStyles from '@/common.module.less';
import styles from './userManager.module.less';

const UserTypeColor = UserTColor();
const AdminTypeColor = AdminTColor();
const AdminTypeLabelMap = AdminTLabelMap();
const { Option } = Select;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class UserManager extends Component {
  state = {
    selectRow: [],
    selectRowKey: [],
    searchUsers: [], // 用户名搜索 为空不用filter
    addUserVisible: false,
    updateUserFlag: false, // 点击修改编辑时候为true
    updatePwdVisible: false, // 重置用户密码
    sectionDistriVisble: false, // 区域分配
    rolesDistriVisible: false, // 角色分配
    loading: false,
    dataList: [],
    adminType: null,
  };

  columns = [
    {
      title: <FormattedMessage id="sso.user.type.username" />,
      dataIndex: 'username',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="sso.user.list.userType" />,
      dataIndex: 'userType',
      render: (text) => {
        return (
          <Tag color={UserTypeColor[text]}>
            {text === 'USER' ? (
              <FormattedMessage id="sso.user.type.user" />
            ) : (
              <FormattedMessage id="translator.languageManage.application" />
            )}
          </Tag>
        );
      },
      align: 'center',
    },
    {
      title: <FormattedMessage id="sso.user.list.adminType" />,
      dataIndex: 'adminType',
      render: (text) => {
        const adminType = text || 'USER';
        return <Tag color={AdminTypeColor[adminType]}>{AdminTypeLabelMap[adminType]}</Tag>;
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
            title={<FormattedMessage id="sso.user.edit" />}
            trigger="hover"
            placement="left"
          >
            {disable}
          </Popover>
        );
      },
    },
    {
      title: <FormattedMessage id="sso.user.list.email" />,
      dataIndex: 'email',
      align: 'center',
      width: '15%',
    },
    {
      title: <FormattedMessage id="sso.user.list.token" />,
      dataIndex: 'token',
      align: 'center',
      with: '150',
      render: (text, record) => {
        if (record.userType === 'APP') {
          return (
            <div>
              <Popover content={text} trigger="click">
                <Button type="link">
                  <FormattedMessage id="sso.user.action.view" />
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
      title: <FormattedMessage id="app.taskDetail.createTime" />,
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
      this.setState({
        dataList: response,
      });
    }
    this.setState({ loading: false });
  };

  // 用户名搜索
  userHandleChange = (value) => {
    const { dataList } = this.state;
    const selectRow = dataList.filter((record) => value.includes(record.id));
    this.setState({
      selectRow,
      searchUsers: value,
      selectRowKey: selectRow.map((record) => record.id),
    });
  };

  // 重置密码
  submitUpdatedPwd = async (values) => {
    const { selectRowKey } = this.state;
    const params = {
      userId: selectRowKey[0],
      changePassword: values.password,
    };
    const updateRes = await updateUserPassword(params);
    if (!dealResponse(updateRes)) {
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
      this.setState(
        { updatePwdVisible: false, selectRow: [], selectRowKey: [] },
        this.getUserDataList,
      );
    }
  };

  // 新增编辑用户弹框
  onAddUserSubmit = async (values) => {
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
    if (!dealResponse(response)) {
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
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
    RcsConfirm({
      content: content,
      onOk: async () => {
        const deleteRes = await fetchDeleteUser({ id: selectRow[0].id });
        if (!dealResponse(deleteRes)) {
          message.info(formatMessage({ id: 'app.tip.operationFinish' }));
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
    if (!dealResponse(updateRes)) {
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
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
    if (!dealResponse(selectionRes)) {
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
      this.setState(
        { sectionDistriVisble: false, selectRow: [], selectRowKey: [] },
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
    if (!dealResponse(rolesRes)) {
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
      this.setState(
        { rolesDistriVisible: false, selectRow: [], selectRowKey: [] },
        this.getUserDataList,
      );
    }
  };

  addToClipBoard = (content) => {
    copyToBoard(content);
  };

  render() {
    const {
      selectRowKey,
      selectRow,
      updateUserFlag,
      loading,
      dataList,
      searchUsers,
      addUserVisible,
      adminType,
      sectionDistriVisble,
      rolesDistriVisible,
    } = this.state;
    const showUsersList = dataList.filter((record) => {
      if (searchUsers.length > 0) {
        return searchUsers.includes(record.id);
      } else {
        return true;
      }
    });
    const updateItem = updateUserFlag ? selectRow[0] : null;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Form.Item label={<FormattedMessage id="sso.user.type.username" />}>
          <Select
            showSearch
            allowClear
            mode="multiple"
            style={{ width: '50%' }}
            onChange={this.userHandleChange}
            placeholder={formatMessage({
              id: 'sso.user.require.searchByUsername',
            })}
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
        <Row style={{ display: 'flex', marginBottom: '20px' }}>
          <Button
            type="primary"
            className={commonStyles.mr10}
            onClick={() => {
              this.setState({
                addUserVisible: true,
              });
            }}
          >
            <PlusOutlined /> <FormattedMessage id="app.button.add" />
          </Button>
          <Button
            className={commonStyles.mr10}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({
                addUserVisible: true,
                updateUserFlag: true,
              });
            }}
          >
            <EditOutlined /> <FormattedMessage id="sso.user.edit" />
          </Button>
          <Button
            className={commonStyles.mr10}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({ updatePwdVisible: true });
            }}
          >
            <EditOutlined /> <FormattedMessage id="sso.user.action.resetPwd" />
          </Button>
          <Button
            danger
            className={commonStyles.mr10}
            disabled={selectRowKey.length !== 1}
            onClick={this.deleteUser}
          >
            <DeleteOutlined /> <FormattedMessage id="sso.user.action.delete" />
          </Button>
          <Button
            className={commonStyles.mr10}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({ sectionDistriVisble: true });
            }}
          >
            <IconFont type="icon-fenpei" /> <FormattedMessage id="sso.user.sectionAssign" />
          </Button>
          <Button
            className={commonStyles.mr10}
            onClick={() => {
              this.setState({ rolesDistriVisible: true });
            }}
            disabled={selectRowKey.length !== 1}
          >
            <IconFont type="icon-fenpei" /> <FormattedMessage id="sso.user.roleAssign" />
          </Button>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <Button onClick={this.getUserDataList}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </div>
        </Row>
        <div className={styles.userManagerTable}>
          <TableWidthPages
            bordered
            columns={this.columns}
            rowKey={(record) => record.id}
            dataSource={showUsersList}
            loading={loading}
            rowSelection={{
              selectedRowKeys: selectRowKey,
              onChange: (selectRowKey, selectRow) => {
                this.setState({ selectRowKey, selectRow });
              },
            }}
          />
        </div>

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
          <AddUserModal type={adminType} updateRow={updateItem} onAddUser={this.onAddUserSubmit} />
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
          footer={null}
          width={adjustModalWidth() * 0.58 < 500 ? 500 : adjustModalWidth() * 0.58}
          onCancel={() => {
            this.setState({ sectionDistriVisble: false });
          }}
          visible={sectionDistriVisble}
        >
          <SectionAssignModal selectRow={selectRow} onSubmit={this.updateSectionList} />
        </Modal>

        {/* 角色分配 */}
        <Modal
          destroyOnClose
          footer={null}
          width={adjustModalWidth() * 0.58 < 550 ? 550 : adjustModalWidth() * 0.58}
          onCancel={() => {
            this.setState({ rolesDistriVisible: false });
          }}
          visible={rolesDistriVisible}
        >
          <RoleAssignModal selectRow={selectRow} onSubmit={this.updateRoleList} />
        </Modal>
      </div>
    );
  }
}

export default UserManager;

import React, { Component } from 'react';
import { Row, Col, Select, Button, Table, Tag, Popover, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, adjustModalWidth } from '@/utils/utils';
import { fetchUserManagerList, updateUserManage } from '@/services/user';
import { UserTColor, AdminTColor, AdminTLabelMap } from './userManagerUtils';
import StatusChoice from './components/StatusChoice';
import AddUserModal from './components/AddUser';
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
    userList: [],
    selectRow: [],
    selectRowKey: [],
    searchUsers: [], // 用户名搜索 为空不用filter
    addUserVisible: false,
    updateUserFlag: null,
    loading: false,
    dataList: [],
    adminType: null,
  };

  componentDidMount() {
    const { currentUser } = this.props;
    const adminType = currentUser.adminType || 'USER';
    this.setState({ adminType });
    this.getUserDataList();
  }

  getUserDataList = async () => {
    this.setState({ loading: true });
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
  resetPassWord = () => {};
  // 区域分配
  sectionDistribution = () => {};
  // 角色分配
  roleDistribution = () => {};
  // 刷新
  refresh = () => {};

  // 状态更改
  changeStatus = async (id) => {
    const { dataList } = this.state;
    const currentRow = dataList.filter((record) => record.id === id);
    const params = {
      ...currentRow,
      disable: !currentRow.disable,
    };
    const updateRes = await updateUserManage(params);
    if (!dealResponse(updateRes)) {
      this.getUserDataList();
    }
  };

  addToClipBoard = (content) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', content);
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      document.body.removeChild(input);
      message.info(formatMessage({ id: 'sso.user.tip.copySuccess' }));
    } else {
      document.body.removeChild(input);
      message.warn(formatMessage({ id: 'sso.user.tip.unsupportCopyAPI' }));
    }
  };

  rowSelectionChange = (selectRowKey, selectRow) => {
    this.setState({ selectRowKey, selectRow });
  };
  getColumn = () => {
    const columns = [
      {
        title: formatMessage({ id: 'sso.user.type.username' }),
        dataIndex: 'username',
        align: 'center',
        fixed: 'left',
      },
      {
        title: formatMessage({ id: 'sso.user.list.userType' }),
        dataIndex: 'userType',
        render: (text) => {
          return (
            <Tag color={UserTypeColor[text]}>
              {text === 'USER'
                ? formatMessage({ id: 'sso.user.type.user' })
                : formatMessage({ id: 'translator.languageManage.application' })}
            </Tag>
          );
        },
        align: 'center',
      },
      {
        title: formatMessage({ id: 'sso.user.list.adminType' }),
        dataIndex: 'adminType',
        render: (text) => {
          const adminType = text || 'USER';
          return <Tag color={AdminTypeColor[adminType]}>{AdminTypeLabelMap[adminType]}</Tag>;
        },
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.common.status' }),
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
                {formatMessage({ id: 'sso.user.tip.disabled' })}
              </span>
            );
          } else {
            disable = (
              <span style={{ color: 'green', cursor: 'pointer' }}>
                {formatMessage({ id: 'sso.user.tip.enabled' })}
              </span>
            );
          }
          return (
            <Popover content={content} title="修改" trigger="hover" placement="left">
              {disable}
            </Popover>
          );
        },
      },
      {
        title: formatMessage({ id: 'sso.user.list.email' }),
        dataIndex: 'email',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'sso.user.list.token' }),
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
        title: formatMessage({ id: 'translator.languageManage.language' }),
        dataIndex: 'language',
        align: 'center',
      },
      {
        title: formatMessage({ id: 'sso.user.list.description' }),
        dataIndex: 'description',
        ellipsis: true,
        align: 'center',
      },
      {
        title: formatMessage({ id: 'app.taskDetail.createTime' }),
        dataIndex: 'createDate',
        align: 'center',
        fixed: 'right',
      },
    ];
    return columns;
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
        <Row>
          <Col span={12}>
            <FormattedMessage id="sso.user.type.username" />{' '}
            <Select
              mode="multiple"
              style={{ width: '60%' }}
              onChange={this.userHandleChange}
              showSearch
              allowClear
              placeholder={formatMessage({
                id: 'sso.user.require.searchByUsername',
                format: false,
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
          </Col>
        </Row>
        <Row style={{ display: 'flex', padding: 20 }}>
          <Button
            className={commonStyles.mr20}
            icon={<PlusOutlined />}
            onClick={() => {
              this.setState({
                addUserVisible: true,
              });
            }}
          >
            <FormattedMessage id="app.taskStatus.New" />
          </Button>
          <Button
            className={commonStyles.mr20}
            icon={<EditOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({
                addUserVisible: true,
                updateUserFlag: true,
              });
            }}
          >
            {' '}
            <FormattedMessage id="sso.user.action.updateUser" />
          </Button>
          <Button
            className={commonStyles.mr20}
            icon={<EditOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={this.resetPassWord}
          >
            <FormattedMessage id="sso.user.action.resetPwd" />
          </Button>
          <Button
            className={commonStyles.mr20}
            icon={<DeleteOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({ deleteVisible: true });
            }}
          >
            <FormattedMessage id="sso.user.action.delet" />
          </Button>
          <Button
            className={commonStyles.mr20}
            disabled={selectRowKey.length !== 1}
            onClick={this.sectionDistribution}
          >
            <FormattedMessage id="sso.user.action.sectionAssign" />
          </Button>
          <Button
            className={commonStyles.mr20}
            onClick={this.roleDistribution}
            disabled={selectRowKey.length !== 1}
          >
            <FormattedMessage id="sso.user.action.roleAssign" />
          </Button>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={this.refresh}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </div>
        </Row>
        <Row className={styles.userManagerTable}>
          <Table
            bordered
            pagination={false}
            columns={this.getColumn()}
            rowKey="id"
            dataSource={showUsersList}
            loading={loading}
            rowSelection={{
              selectedRowKeys: selectRowKey,
              onChange: this.rowSelectionChange,
            }}
          />
        </Row>
        {/* 新建编辑用户 */}
        <Modal
          destroyOnClose
          footer={null}
          maskClosable={false}
          width={adjustModalWidth() * 0.4 < 400 ? 400 : adjustModalWidth() * 0.4}
          visible={addUserVisible}
          title={<FormattedMessage id="sso.user.newUser" />}
          onCancel={() => {
            this.setState({ addUserVisible: false, updateUserFlag: false });
          }}
        >
          <AddUserModal type={adminType} updateRow={updateItem} />
        </Modal>
      </div>
    );
  }
}

export default UserManager;

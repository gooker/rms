import React, { Component } from 'react';
import { Row, Col, Select, Button, Table, Tag, Popover } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';
import {
  UserTColor,
  AdminTColor,
  AdminTLabelMap,
  generateAdminTypeOptions,
  generateLevelOptions,
} from './userManagerUtils';
import StatusChoice from './components/StatusChoice';
import commonStyles from '@/common.module.less';

const UserTypeColor = UserTColor();
const AdminTypeColor = AdminTColor();
const AdminTypeLabelMap = AdminTLabelMap();

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class UserManager extends Component {
  state = {
    userList: [],
    selectRow: [],
    selectRowKey: [],
    addUserVisible: false,
    loading: false,
    dataList: [],
    adminTypeOptions: [],
    levelOptions: [],
  };

  componentDidMount() {
    const { currentUser } = this.props;
    const adminType = currentUser.adminType || 'USER';
    const adminTypeOptions = generateAdminTypeOptions(adminType);
    const levelOptions = generateLevelOptions(adminType);
    this.setState({ adminTypeOptions, levelOptions });
    this.dataList();
  }

  dataList = () => {
    
  };

  // 用户名搜索
  userHandleChange = (value) => {
    const { userList } = this.state;
    const selectRow = userList.filter((record) => value.includes(record.id));
    this.setState({
      selectRow,
      selectRowKey: selectRow.map((record) => record.id),
    });
  };

  // 修改用户信息
  updateUserInfo = () => {};
  // 重置密码
  resetPassWord = () => {};
  // 区域分配
  sectionDistribution = () => {};
  // 角色分配
  roleDistribution = () => {};
  // 刷新
  refresh = () => {};

  rowSelectionChange = () => {};
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
                this.changeDisabled(record.id);
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
        with:'150',
        render: (text, record) => {
          if (record.userType === 'APP') {
            return (
              <div>
                <Popover
                  content={text}
                  trigger="click"
                  visible={this.state[`${record.username}TokenShown`]}
                  onVisibleChange={(visible) => this.handleVisibleChange(record.username, visible)}
                >
                  <Button>
                    <FormattedMessage id="sso.user.action.view" />
                  </Button>
                </Popover>
                <Button
                  onClick={() => {
                    this.addToClipBoard(text);
                  }}
                >
                  <FormattedMessage id="sso.user.action.copy" />
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
    const { selectRowKey, loading, dataList } = this.state;
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
            ></Select>
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
            disabled={selectRowKey.length > 1}
            onClick={this.updateUserInfo}
          >
            {' '}
            <FormattedMessage id="sso.user.action.updateUser" />
          </Button>
          <Button
            className={commonStyles.mr20}
            icon={<EditOutlined />}
            disabled={selectRowKey.length > 1}
            onClick={this.resetPassWord}
          >
            <FormattedMessage id="sso.user.action.resetPwd" />
          </Button>
          <Button
            className={commonStyles.mr20}
            icon={<DeleteOutlined />}
            disabled={selectRowKey.length > 1}
            onClick={() => {
              this.setState({ deleteVisible: true });
            }}
          >
            <FormattedMessage id="sso.user.action.delet" />
          </Button>
          <Button
            className={commonStyles.mr20}
            disabled={selectRowKey.length > 1}
            onClick={this.sectionDistribution}
          >
            <FormattedMessage id="sso.user.action.sectionAssign" />
          </Button>
          <Button
            className={commonStyles.mr20}
            onClick={this.roleDistribution}
            disabled={selectRowKey.length > 1}
          >
            <FormattedMessage id="sso.user.action.roleAssign" />
          </Button>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={this.refresh}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </div>
        </Row>
        <Row>
          <Table
            bordered
            pagination={false}
            columns={this.getColumn()}
            rowKey="id"
            dataSource={dataList}
            loading={loading}
            rowSelection={{
              selectedRowKeys: selectRowKey,
              onChange: this.rowSelectionChange,
            }}
          />
        </Row>
      </div>
    );
  }
}

export default UserManager;

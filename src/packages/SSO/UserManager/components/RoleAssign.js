import React, { Component } from 'react';
import { Button, Card, message, Transfer } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchAllUserRoleList, fetchUserAssignedRoleList } from '@/services/SSOService';
import FormattedMessage from '@/components/FormattedMessage';
import { AdminTColor } from '../userManagerUtils';

export default class RoleAssign extends Component {
  state = {
    allSource: [],
    rightSource: [],
    name: null,
  };

  componentDidMount() {
    this.getRoleSource();
  }

  // 角色分配
  getRoleSource = () => {
    const { selectRow } = this.props;
    const userId = selectRow[0].id;
    // 获取所有角色/当前角色;
    Promise.all([fetchAllUserRoleList(), fetchUserAssignedRoleList({ userId: userId })])
      .then((response) => {
        const [allSource, currentAssigned] = response;
        if (dealResponse(allSource) || dealResponse(currentAssigned)) {
          message.error(formatMessage({ id: 'sso.user.getRolesFailed' }));
          return;
        }
        const rightSource =
          currentAssigned && currentAssigned.roles ? currentAssigned.roles.map(({ id }) => id) : [];
        this.setState({ allSource, rightSource });
      })
      .catch((err) => {
        message.error(err);
      });
  };

  handleChange = (targetKeys) => {
    this.setState({ rightSource: targetKeys });
  };

  submit = () => {
    const { rightSource } = this.state;
    this.props.onSubmit(rightSource);
  };

  render() {
    const { allSource, rightSource } = this.state;
    const { selectRow } = this.props;
    const type = selectRow ? selectRow[0].adminType || 'USER' : '';
    return (
      <div>
        <Card
          title={<span style={{ color: AdminTColor[type] }}>{selectRow[0].username}</span>}
          extra={
            <Button type="primary" onClick={this.submit}>
              <FormattedMessage id="app.button.submit" />
            </Button>
          }
        >
          <Transfer
            dataSource={allSource}
            targetKeys={rightSource}
            showSearch
            operations={[
              <FormattedMessage key={'add'} id="app.button.add" />,
              <FormattedMessage key={'delete'} id="app.button.delete" />,
            ]}
            titles={[
              <FormattedMessage key={'roleUnassigned'} id="sso.user.tip.roleUnassigned" />,
              <FormattedMessage key={'roleAssigned'} id="sso.user.tip.roleAssigned" />,
            ]}
            render={(item) => `${item.code}(${item.label})`}
            rowKey={(record) => record.id}
            onChange={this.handleChange}
            listStyle={{ width: '44%', height: 400 }}
          />
        </Card>
      </div>
    );
  }
}

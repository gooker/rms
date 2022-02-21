import React, { Component } from 'react';
import { Card, Button, Transfer, Modal, message } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchAllUserRoleList, fetchUserAssignedRoleList } from '@/services/SSO';
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
    const { rightSource, allSource } = this.state;
    const { onSubmit, selectRow } = this.props;
    const level = selectRow[0].level;

    // 校验已选的角色中是否存在level比user的level高
    const selectRoles = allSource.filter((item) => rightSource.includes(item.id));

    const invalidRoles = [];
    selectRoles.map((item) => {
      if (item.level > level) {
        invalidRoles.push(item);
      }
    });

    if (invalidRoles.length === 0) {
      if (onSubmit) {
        onSubmit(rightSource);
      }
    } else {
      const ModalErrorConfig = {
        title: formatMessage({ id: 'sso.user.tip.roleLevelGreater', format: false }),
        content: (
          <>
            <ul style={{ listStyle: 'disc' }}>
              {invalidRoles.map((item) => (
                <li key={item.key}>{item.code}</li>
              ))}
            </ul>
          </>
        ),
      };
      Modal.error(ModalErrorConfig);
    }
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
            listStyle={{
              width: '44%',
              height: 400,
            }}
          />
        </Card>
      </div>
    );
  }
}

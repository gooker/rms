import React, { Component } from 'react';
import { Card, Button, Transfer, Modal } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/Lang';
import { AdminTColor } from '../userManagerUtils';
const AdminTypeColor = AdminTColor();

export default class RoleAssign extends Component {
  state = {
    rightSource: [],
    name: null,
  };

  componentDidMount() {
    const { currentSource = [] } = this.props;
    const rightSource = currentSource.map(({ id }) => id);
    this.setState({ rightSource });
  }

  handleChange = (targetKeys) => {
    this.setState({ rightSource: targetKeys });
  };
  submit = () => {
    const { rightSource } = this.state;
    const { onSubmit, allSource, selectRow } = this.props;
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
        title: formatMessage({ id: 'sso.user.tip.roleLevelGreater' }),
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
    const { rightSource } = this.state;
    const { selectRow, allSource } = this.props;
    const type = selectRow ? selectRow[0].adminType || 'USER' : '';
    return (
      <div>
        <Card
          title={
            <span>
              <FormattedMessage id="sso.user.roleAssign" />
              {selectRow ? (
                <span style={{ marginLeft: 10, fontSize: 13, color: AdminTypeColor[type] }}>
                  {`( ${selectRow[0].username} )`}
                </span>
              ) : (
                ''
              )}
            </span>
          }
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
              <FormattedMessage id="sso.user.action.add" />,
              <FormattedMessage id="sso.user.action.remove" />,
            ]}
            titles={[
              <FormattedMessage id="sso.user.tip.roleUnassigned" />,
              <FormattedMessage id="sso.user.tip.roleAssigned" />,
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

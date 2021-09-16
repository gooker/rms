import React, { Component } from 'react';
import { Tabs, Tree, Empty, Button } from 'antd';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import allMouduleRouter from '@/config/router';
import { isStrictNull } from '@/utils/utils';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class RoleAssignModal extends Component {
  state = {
    activeKey: null,
    permissionList: [],
    checkedKeys: [],
  };

  componentDidMount() {
    const allRoutersMap = { ...allMouduleRouter };

    const currentRoutesMap = {};
    Object.keys(allRoutersMap).map((key) => {
      const currentRoutes = this.getRoute(allRoutersMap[key] || []);
      currentRoutesMap[key] = currentRoutes;
    });
    console.log(currentRoutesMap);
  }

  getRoute = (data, routesArr = []) => {
    const { currentUser } = this.props;
    const adminType = currentUser.adminType || 'USER';
    routesArr = data.filter((route) => {
      // authority不存在或为空 就没有
      if (route.routes) {
        this.getRoute(route.routes, routesArr);
      } else {
        if (isStrictNull(route.authority) || route.authority.length === 0) {
          return false;
        } else {
          return route.authority.includes(adminType);
        }
      }
    });
    return routesArr;
  };

  render() {
    const { activeKey, permissionList, checkedKeys } = this.state;
    return (
      <div>
        <div>
          <Tabs
            activeKey={activeKey}
            onChange={(key) => {
              this.setState({
                activeKey: key,
              });
            }}
            style={{ marginBottom: 50 }}
          >
            {permissionList.map((permission) => {
              // 防止Tab不显示名称
              const key = permission.modelCode;
              return (
                <Tabs.TabPane key={key} tab={key}>
                  {permission?.permissions.length !== 0 ? (
                    <Tree
                      autoExpandParent
                      checkable
                      checkStrictly
                      defaultExpandAll
                      onCheck={this.onCheck}
                      checkedKeys={checkedKeys}
                    >
                      {this.renderTreeNodes(permission.permissions)}
                    </Tree>
                  ) : (
                    <Empty />
                  )}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              textAlign: 'right',
            }}
          >
            <Button type="primary">
              <FormattedMessage id="app.button.submit" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default RoleAssignModal;

import React, { Component } from 'react';
import { Tabs, Tree, Empty, Button } from 'antd';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isStrictNull } from '@/utils/utils';
import { filterMenuData } from '@/utils/init';
import { transform } from 'lodash';
import allMouduleRouter from '@/config/router';
import allMoudulePemission from '@/config/permission';
import { filterPermission, showLabelMenu } from './assignUtils';

const { TreeNode } = Tree;

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
    const { roleList, selectedRowKeys } = this.props;

    const allRoutes = Object.keys(allRoutersMap).map((key) => {
      const currentRoutes = allRoutersMap[key] || [];
      return { appCode: key, appMenu: currentRoutes };
    });

    const allAuthorityData = allRoutes.map((appRoute) => {
      // 处理menu
      const { appMenu, appCode } = appRoute;
      const labelAppMenu = showLabelMenu(appMenu);
      const menuData = filterMenuData(labelAppMenu);

      // 处理permission
      const codePermission = filterPermission(allMoudulePemission[appCode]);
      const codePermissionMap = transform(
        codePermission,
        (result, record) => {
          const { page, children } = record;
          result[page] = children;
        },
        {},
      );

      // 根据authrity
      const authRoutes = this.filterAuthRoute(menuData, codePermissionMap);
      return {
        appCode,
        appMenu: [
          {
            children: [...authRoutes],
            title: '页面',
            key: `/${appCode}/page1`,
            label: '页面',
          },
        ],
      };
    });

    // TODO: authoritykeys
    let authoritykeys = roleList.filter(({ id }) => id === selectedRowKeys[0]);
    // TODO: 测试用
    if (selectedRowKeys[0] === '61445b634530fb00017f5e44') {
      authoritykeys = authoritykeys[0].authorityKeys;
    } else {
      authoritykeys = [];
    }
    this.setState({
      permissionList: allAuthorityData,
      activeKey: allAuthorityData[0].appCode,
      checkedKeys: authoritykeys,
    });
  }

  getSubMenu = (item, codePermission) => {
    const { currentUser } = this.props;
    const adminType = currentUser.adminType || 'USER';
    if (item.routes && !item.hideInMenu) {
      return {
        ...item,
        key: item.path || item.name,
        title: formatMessage({ id: `${item.label}` }),
        routes: this.filterAuthRoute(item.routes, codePermission),
        children: this.filterAuthRoute(item.routes, codePermission),
      };
    } else {
      if (
        !isStrictNull(item.authority) &&
        item.authority.length > 0 &&
        item.authority.includes(adminType)
      ) {
        return {
          ...item,
          children: codePermission[item.path],
          key: item.path || item.name,
          title: formatMessage({ id: `${item.label}` }),
        };
      }
    }
  };

  filterAuthRoute = (menuData, codePermission) => {
    if (!menuData) {
      return [];
    }
    return menuData.map((item) => this.getSubMenu(item, codePermission));
  };

  //点击复选框触发
  onCheck = (checkedKeysValue, { checked }) => {
    const { activeKey, checkedKeys: oldKeys } = this.state;
    let currentKeys = [];
    if (checked) {
      // checkedKeysValue拿到的是每次点击的tab的所有数据  所以如果oldKeys中存在的话 就不要放进去
      checkedKeysValue.map((item) => {
        if (!oldKeys.includes(item)) {
          oldKeys.push(item);
        }
      });
      currentKeys = [...oldKeys];
    } else {
      // 需注意: 理论上来说 每个appcode都是该模块的 其他模块不会有存在该appcode
      currentKeys = oldKeys.filter((item) => item.indexOf(`/${activeKey}`));
      currentKeys.push(...checkedKeysValue);
    }
    this.setState({ checkedKeys: [...currentKeys] });
  };

  //渲染树节点
  renderTreeNodes = (data) => {
    return (
      data &&
      data.map((item) => {
        if (!item) return;
        if (item && item.children) {
          return (
            <TreeNode title={<FormattedMessage id={item.label} />} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={<FormattedMessage id={item.label} />} />;
      })
    );
  };

  render() {
    const { activeKey, permissionList, checkedKeys } = this.state;
    const { submitAuthKeys } = this.props;
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
            {permissionList.map((permission, index) => {
              // 防止Tab不显示名称
              const key = permission.appCode;
              return (
                <Tabs.TabPane key={key} tab={key}>
                  {permission?.appMenu.length !== 0 ? (
                    <Tree
                      checkable
                      defaultExpandAll
                      onCheck={this.onCheck}
                      autoExpandParent
                      checkedKeys={checkedKeys}
                      // treeData={permission.appMenu}
                    >
                      {this.renderTreeNodes(permission.appMenu)}
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
            <Button
              type="primary"
              onClick={() => {
                submitAuthKeys(checkedKeys);
              }}
            >
              <FormattedMessage id="app.button.submit" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default RoleAssignModal;

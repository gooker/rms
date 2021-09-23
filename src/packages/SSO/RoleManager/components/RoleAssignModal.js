import React, { Component } from 'react';
import { Tabs, Tree, Empty, Button } from 'antd';
import { connect } from '@/utils/dva';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isStrictNull } from '@/utils/utils';
import { filterMenuData } from '@/utils/init';
import { transform, difference } from 'lodash';
import allMouduleRouter from '@/config/router';
import allMoudulePemission from '@/config/permission';
import { filterPermission, showLabelMenu, handlePermissions } from './assignUtils';

const { TreeNode } = Tree;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class RoleAssignModal extends Component {
  state = {
    activeKey: null,
    permissionList: [], // treedata
    checkedKeys: [],
    permissionMap: {}, // 所有父级下的自己
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
      const authRoutes = this.filterAuthRoute(menuData, codePermissionMap) || [];
      return {
        appCode,
        appMenu: [
          {
            children: [...authRoutes],
            title: '页面',
            key: `${appCode}/page1`, // TODO: 这里与filterAppByAuthorityKeys方法筛选授权的app对应 存在只勾选页面 但是不勾选其他节点树的情况 要优化下！
            label: '页面',
          },
        ],
      };
    });

    // 展示的树节点数据 sso不展示
    const permissionList = allAuthorityData.filter(({ appCode }) => appCode !== 'sso');

    // 权限扁平化 每个父节点的value是下面所有的子集
    const permissionMap = transform(
      permissionList,
      (result, record) => {
        const { appCode, appMenu } = record;
        const temp = {};
        handlePermissions(appMenu, temp);
        result[appCode] = {
          ...temp,
          moduleName: appCode,
        };
      },
      {},
    );

    // TODO: authoritykeys
    let authoritykeys = roleList.filter(({ id }) => id === selectedRowKeys[0]);
    // TODO: 测试用
    if (selectedRowKeys[0] === '61445b634530fb00017f5e44') {
      authoritykeys = authoritykeys[0].authorityKeys;
    } else {
      authoritykeys = [];
    }
    this.setState({
      permissionList: permissionList, //allAuthorityData,
      permissionMap: permissionMap,
      activeKey: allAuthorityData[0].appCode,
      checkedKeys: { checked: [...authoritykeys], halfChecked: [] }, //authoritykeys,
    });
  }

  // 处理menu
  getSubMenu = (item, codePermission) => {
    const { currentUser } = this.props;
    const adminType = currentUser.adminType || 'USER';
    if (item.routes && !item.hideInMenu) {
      return {
        ...item,
        key: item.path || item.name,
        title: formatMessage({ id: `${item.label}` }),
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
          children: codePermission && codePermission[item.path],
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

    const listArray = [];
    // 因为如果 item.authority为空或者 item.authority 不包含adminType-那么返回undefined
    menuData.map(
      (item) =>
        this.getSubMenu(item, codePermission) &&
        listArray.push(this.getSubMenu(item, codePermission)),
    );
    return listArray;
  };

  //点击复选框触发
  onCheck_ = (checkedKeysValue, { checked, halfCheckedKeys }) => {
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

  hasParentNode = (node, permissionsMap) => {
    const result = [];
    Object.keys(permissionsMap).forEach((key) => {
      if (permissionsMap[key] != null && permissionsMap[key].indexOf(node) !== -1) {
        result.push(key);
      }
    });
    if (result.length === 0) {
      return [];
    } else {
      return Array.from(new Set([...result]));
    }
  };

  //点击复选框触发
  onCheck = (checkedKeys, { checked }) => {
    const { permissionMap, activeKey, checkedKeys: oldCheckedKeys } = this.state;
    const permissions = permissionMap[activeKey];
    let diffKey = null;
    if (checked) {
      //当前点击的节点
      diffKey = difference(checkedKeys.checked, oldCheckedKeys.checked || [])[0];
      const set = new Set(oldCheckedKeys.checked || []);
      // 1.点击的节点 没有下级 直接添加节点
      if (permissions[diffKey] == null) {
        set.add(diffKey);
      } else {
        // 2，点击节点存在下级，下级都要放进去
        set.add(diffKey);
        permissions[diffKey].forEach((key) => {
          set.add(key);
        });
      }
      // 找到此节点的上级节点
      const parentNode = this.hasParentNode(diffKey, permissions);
      if (parentNode.length > 0) {
        parentNode.forEach((node) => {
          if (!set.has(node)) {
            set.add(node);
          }
        });
      }
      this.setState({
        checkedKeys: { halfChecked: [], checked: Array.from(set) },
      });
    } else {
      //删除
      diffKey = difference(oldCheckedKeys.checked, checkedKeys.checked)[0];
      const set = new Set(oldCheckedKeys.checked || []);
      if (permissions[diffKey] == null) {
        set.delete(diffKey);
      } else {
        set.delete(diffKey);
        permissions[diffKey].forEach((key) => {
          set.delete(key);
        });
      }
      this.setState({
        checkedKeys: { halfChecked: [], checked: Array.from(set) },
      });
    }
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
                <Tabs.TabPane key={key} tab={formatMessage({id:`app.module.${key}`}) }>
                  {permission?.appMenu.length !== 0 ? (
                    <Tree
                      checkable
                      checkStrictly
                      defaultExpandAll
                      onCheck={this.onCheck}
                      autoExpandParent
                      checkedKeys={checkedKeys}
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
              bottom: 0,
              left: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              textAlign: 'right',
              background: '#fff',
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                submitAuthKeys(checkedKeys.checked);
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

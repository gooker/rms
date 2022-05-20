import React, { Component } from 'react';
import { Empty, Tabs, Tree } from 'antd';
import { PlusCircleOutlined, DownOutlined } from '@ant-design/icons';
import { transform } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import { generateTreeData, handlePermissions } from '../../RoleManager/components/assignUtils';
import { AppCode } from '@/config/config';
import {
  generateMenuNodeLocaleKey,
  validateRouteAuthority,
  validateHookPermission,
  getNewMenuDataByMergeCustomNodes,
} from '@/utils/init';
import AddCustomMenuModal from './AddCustomMenuModal';
import allModuleRouter from '@/router';
import { mockData } from './mockData';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class AllMenuModal extends Component {
  state = {
    activeKey: null,
    permissionList: [], // tree data
    permissionMap: {}, // 所有父级下的自己
    visible: false,
    parentPath: null,
  };

  componentDidMount() {
    const allRoutes = Object.keys(allModuleRouter).map((key) => {
      const currentRoutes = allModuleRouter[key] || [];
      return { appCode: key, appMenu: currentRoutes };
    });

    const allAuthorityData = allRoutes
      .map((appRoute) => {
        const { appCode, appMenu } = appRoute;
        // 处理menu, 需要跳过SSO
        if (appCode === AppCode.SSO) {
          return null;
        }
        // 处理自定义的菜单 start
        let newAppMenu = [...appMenu];
        newAppMenu = getNewMenuDataByMergeCustomNodes(newAppMenu, mockData, appCode);
        // end

        const menuData = generateMenuNodeLocaleKey(newAppMenu);

        // 将路由与自定义权限合并
        const codePermissionMap = {};
        const authRoutes = this.combineMenuAndPermission(menuData, codePermissionMap) || [];
        return {
          appCode,
          appMenu: {
            key: `@@_${appCode}`,
            title: formatMessage({ id: 'app.module' }),
            children: authRoutes.filter(Boolean),
          },
        };
      })
      .filter(Boolean);

    // 权限扁平化 每个父节点的value是下面所有的子集
    const permissionMap = transform(
      allAuthorityData,
      (result, record) => {
        const { appCode, appMenu } = record;
        const temp = {};
        handlePermissions(appMenu, temp);
        result[appCode] = temp;
      },
      {},
    );

    // 这里要对authorityKeys中的对象进行筛选，在权限树中不存在的key就过滤掉
    let flatPermissionMap = {};
    Object.values(permissionMap).forEach((item) => {
      flatPermissionMap = { ...flatPermissionMap, ...item };
    });

    this.setState({
      permissionMap,
      permissionList: allAuthorityData,
      activeKey: allAuthorityData[0].appCode,
    });
  }

  // 处理menu
  getSubMenu = (item, codePermission) => {
    const { currentUser } = this.props;
    const adminType = currentUser.adminType || 'USER';

    // hooks 属性的路由节点
    const showhooks = validateHookPermission(item.hooks);

    // 对 authority 字段进行验证
    if (validateRouteAuthority(item, adminType) || showhooks) {
      if (Array.isArray(item.routes)) {
        return {
          ...item,
          key: item.path,
          title: formatMessage({ id: `${item.label}` }),
          children: this.combineMenuAndPermission(item.routes, codePermission).filter(Boolean),
        };
      } else {
        return {
          ...item,
          key: item.path,
          title: formatMessage({ id: `${item.label}` }),
          children: codePermission?.[item.path] || [],
        };
      }
    }
  };

  combineMenuAndPermission = (menuData, codePermission) => {
    if (!menuData) return [];
    return menuData.map((item) => this.getSubMenu(item, codePermission)).filter(Boolean);
  };

  onClose = () => {
    this.setState({
      visible: false,
      parentPath: null,
    });
  };

  render() {
    const { activeKey, permissionList, visible, parentPath } = this.state;
    const { currentUser, handlSubmit } = this.props;
    const adminType = currentUser.adminType || 'USER';
    return (
      <div>
        <Tabs
          activeKey={activeKey}
          style={{ marginBottom: 50 }}
          onChange={(key) => {
            this.setState({ activeKey: key });
          }}
        >
          {permissionList.map(({ appCode, appMenu }, index) => {
            const treeData = generateTreeData(appMenu, adminType);
            return (
              <Tabs.TabPane key={appCode} tab={formatMessage({ id: `app.module.${appCode}` })}>
                {appMenu.length !== 0 ? (
                  <Tree
                    showLine
                    defaultExpandAll
                    autoExpandParent
                    switcherIcon={<DownOutlined />}
                    treeData={[treeData]}
                    titleRender={(nodeData) => {
                      return (
                        <>
                          <span
                            title={`${nodeData?.title}`}
                            className="ant-tree-node-content-wrapper ant-tree-node-content-wrapper-normal"
                          >
                            <span className="ant-tree-title">{`${nodeData?.title}`}</span>
                            {nodeData?.children && nodeData?.children.length > 0 && (
                              <span
                                className="ant-tree-title"
                                style={{ marginLeft: 5, color: '#189ff1' }}
                                onClick={() => {
                                  this.setState({ visible: true, parentPath: nodeData.key });
                                }}
                              >
                                <PlusCircleOutlined />
                              </span>
                            )}
                          </span>
                        </>
                      );
                    }}
                  />
                ) : (
                  <Empty />
                )}
              </Tabs.TabPane>
            );
          })}
        </Tabs>
        {visible && (
          <AddCustomMenuModal
            visible={AddCustomMenuModal}
            parentPath={parentPath}
            appCode={activeKey}
            onClose={this.onClose}
            onSave={handlSubmit}
          />
        )}
      </div>
    );
  }
}
export default AllMenuModal;

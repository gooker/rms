import React from 'react';

function getAuthorityKeys() {
  let AuthorityKeys = window.sessionStorage.getItem('permissionMap');
  if (AuthorityKeys === null) {
    AuthorityKeys = {};
  } else {
    try {
      AuthorityKeys = JSON.parse(AuthorityKeys);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('当前用户未配置任何权限');
      AuthorityKeys = {};
    }
  }
  return AuthorityKeys;
}

export const hasPermission = (key) => {
  const AuthorityKeys = getAuthorityKeys();
  return !!AuthorityKeys[key];
};

export class Permission extends React.PureComponent {
  render() {
    const { id, children, type = 'and' } = this.props;
    const AuthorityKeys = getAuthorityKeys();
    let renderChildren = false;
    const andSet = new Set();
    if (id) {
      if (Array.isArray(id)) {
        for (let index = 0; index < id.length; index++) {
          const item = id[index];
          const innerFlag = AuthorityKeys[item] === undefined;
          if (type === 'and') {
            andSet.add(innerFlag ? 0 : 1);
          }

          if (type === 'or') {
            if (innerFlag) {
              continue;
            } else {
              renderChildren = true;
              break;
            }
          }
        }
      } else {
        renderChildren = AuthorityKeys[id] !== undefined;
      }
    } else {
      console.warn('Permisson组件无法获取id属性值');
      return <></>;
    }

    // 对 and 进行汇总
    if (type === 'and' && Array.isArray(id)) {
      renderChildren = andSet.size === 1 && andSet.has(1);
    }

    if (renderChildren) {
      return children;
    }
    return <></>;
  }
}

// 获取是否有某个APP的权限
export const hasAppPermission = (appCode) => {
  const { grantedAPP } = window.g_app._store.getState().global;
  return grantedAPP.includes(appCode);
};

import React, { PureComponent } from 'react';
import { connect } from '@/utils/dva';
import { Badge, Row } from 'antd';
import { GlobalOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { BaseContext } from '@/config/config';
import styles from './Portal.module.less';

const Image = (props) => {
  const { alt } = props;
  return <img alt={alt} {...props} />;
};

const AppIconColor = {
  sso: '#993366',
  i18n: '#0099FF',
  [BaseContext.Coordinator]: 'linear-gradient(#4f97dc, #001529)',
  [BaseContext.LatentLifting]: 'linear-gradient(#33CC33, #006633)',
  [BaseContext.Tote]: 'linear-gradient(rgb(228, 148, 92), rgba(181, 22, 22, 0.93))',
  [BaseContext.ForkLifting]: 'linear-gradient(#CCCC33, #CCCC66)',
  [BaseContext.Sorter]: 'linear-gradient(rgb(80, 198, 236),rgb(35, 185, 136))',
};

const APPs = {
  [BaseContext.LatentLifting]: {
    icon: 'agv_latent.png',
    style: {
      height: '70%',
      display: 'block',
      verticalAlign: 'middle',
      margin: '8px auto',
    },
    color: AppIconColor[BaseContext.LatentLifting],
  },
  [BaseContext.Tote]: {
    icon: 'agv_tote.png',
    style: {
      height: '100%',
      display: 'block',
      verticalAlign: 'middle',
      margin: '0 auto',
    },
    color: AppIconColor[BaseContext.Tote],
  },
  [BaseContext.ForkLifting]: {
    icon: 'agv_forklift.png',
    style: {
      height: '100%',
      display: 'block',
      verticalAlign: 'middle',
    },
    color: AppIconColor[BaseContext.ForkLifting],
  },
  [BaseContext.Sorter]: {
    icon: 'agv_sorter.png',
    style: {
      height: '100%',
      display: 'block',
      verticalAlign: 'middle',
    },
    color: AppIconColor[BaseContext.Sorter],
  },
};

class Portal extends PureComponent {
  checkoutApp = async (appCode) => {
    const { dispatch } = this.props;
    dispatch({ type: 'global/saveCurrentApp', payload: appCode });
  };

  // 根据习惯, Mixrobot在第一项, SSO在最后一项, i18n在倒数第二项
  getAppList = () => {
    const { isAdmin, appList } = this.props;
    if (!appList || appList.length === 0) return [];
    const grantedApps = [...appList];

    // SSO
    let sso = null;
    const ssoIndex = grantedApps.indexOf('sso');
    if (ssoIndex >= 0) {
      sso = grantedApps.splice(ssoIndex, 1);
    }

    // 如果是admin账户登录，就只显示SSO APP
    if (isAdmin) {
      return sso;
    }

    // Mixrobot
    let mixrobot = null;
    const mixrobotIndex = grantedApps.indexOf('mixrobot');
    if (mixrobotIndex >= 0) {
      mixrobot = grantedApps.splice(mixrobotIndex, 1);
    }

    // I18n
    let i18n = null;
    const I18nIndex = grantedApps.indexOf('i18n');
    if (I18nIndex >= 0) {
      i18n = grantedApps.splice(I18nIndex, 1);
    }

    // 整合数据
    mixrobot && grantedApps.unshift(mixrobot[0]);
    i18n && grantedApps.push(i18n[0]);
    sso && grantedApps.push(sso[0]);
    return grantedApps;
  };

  renderAppInfo = () => {
    const { currentApp } = this.props;
    return (
      <>
        {this.getAppList().map((name) => {
          let img = null;
          const currentItem=currentApp === name?styles.currentItem:"";
          if (APPs[name] != null) {
            const { icon, style, color } = APPs[name];
            if (icon != null) {
              img = <Image style={{ ...style }} src={require(`../../images/${icon}`).default} />;
            }
            return (
              <div key={name} className={`${styles.portalItem} ${currentItem} `}>
                <Badge dot={currentApp === name}>
                  <span
                    onClick={() => {
                      this.checkoutApp(name);
                    }}
                    style={{ backgroundImage: color }}
                    className={classNames(styles.portalItemIconContainer, styles.selectApp)}
                  >
                    {img}
                  </span>
                </Badge>
              </div>
            );
          }
          if (name === 'i18n') {
            return (
              <div key={name} className={`${styles.portalItem} ${currentItem}`}>
                <Badge dot={currentApp === name}>
                  <span
                    style={{ background: AppIconColor.i18n }}
                    className={classNames(styles.portalItemIconContainer, styles.selectApp)}
                  >
                    <span
                      onClick={() => {
                        this.checkoutApp(name);
                      }}
                      className={styles.portalItemIcon}
                    >
                      <GlobalOutlined />
                    </span>
                  </span>
                </Badge>
              </div>
            );
          }
          if (name === 'sso') {
            return (
              <div key={name} className={`${styles.portalItem} ${currentItem}`}>
                <Badge dot={currentApp === name}>
                  <span
                    style={{ background: AppIconColor.sso }}
                    className={classNames(styles.portalItemIconContainer, styles.selectApp)}
                  >
                    <span
                      onClick={() => {
                        this.checkoutApp(name);
                      }}
                      className={styles.portalItemIcon}
                    >
                      <UserOutlined />
                    </span>
                  </span>
                </Badge>
              </div>
            );
          }
          if (name === 'mixrobot') {
            return (
              <div key={name} className={`${styles.portalItem} ${currentItem}`}>
                <Badge dot={currentApp === name}>
                  <span
                    style={{ background: AppIconColor[BaseContext.Coordinator] }}
                    className={classNames(styles.portalItemIconContainer, styles.selectApp)}
                  >
                    <span
                      onClick={() => {
                        this.checkoutApp(name);
                      }}
                      className={styles.portalItemIcon}
                    >
                      M
                    </span>
                  </span>
                </Badge>
              </div>
            );
          }
        })}
      </>
    );
  };

  render() {
    return <Row className={styles.portal}>{this.renderAppInfo()}</Row>;
  }
}

export default connect(({ global, user }) => {
  const isAdmin = user?.currentUser?.username === 'admin';
  return {
    isAdmin,
    appList: global.grantedAPP,
    currentApp: global?.currentApp.toLowerCase(),
  };
})(Portal);

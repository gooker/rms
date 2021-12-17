import React, { PureComponent } from 'react';
import { Badge, Row } from 'antd';
import classNames from 'classnames';
import { GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import { AppCode } from '@/config/config';
import styles from './Portal.module.less';

const Image = (props) => {
  const { alt } = props;
  return <img alt={alt} {...props} />;
};

const AppIconColor = {
  [AppCode.SSO]: '#993366',
  [AppCode.I18N]: '#0099FF',
  [AppCode.XIHE]: 'linear-gradient(#4f97dc, #001529)',
  [AppCode.LatentLifting]: 'linear-gradient(#33CC33, #006633)',
  [AppCode.Tote]: 'linear-gradient(rgb(228, 148, 92), rgba(181, 22, 22, 0.93))',
  [AppCode.ForkLifting]: 'linear-gradient(#CCCC33, #CCCC66)',
  [AppCode.Sorter]: 'linear-gradient(rgb(80, 198, 236),rgb(35, 185, 136))',
};

const APPs = {
  [AppCode.LatentLifting]: {
    icon: 'agv_latent.png',
    style: {
      height: '70%',
      display: 'block',
      verticalAlign: 'middle',
      margin: '8px auto',
    },
    color: AppIconColor[AppCode.LatentLifting],
  },
  [AppCode.Tote]: {
    icon: 'agv_tote.png',
    style: {
      height: '100%',
      display: 'block',
      verticalAlign: 'middle',
      margin: '0 auto',
    },
    color: AppIconColor[AppCode.Tote],
  },
  [AppCode.ForkLifting]: {
    icon: 'agv_forklift.png',
    style: {
      height: '100%',
      display: 'block',
      verticalAlign: 'middle',
    },
    color: AppIconColor[AppCode.ForkLifting],
  },
  [AppCode.Sorter]: {
    icon: 'agv_sorter.png',
    style: {
      height: '100%',
      display: 'block',
      verticalAlign: 'middle',
    },
    color: AppIconColor[AppCode.Sorter],
  },
};

class Portal extends PureComponent {
  checkoutApp = async (appCode) => {
    const { dispatch } = this.props;
    dispatch({ type: 'global/saveCurrentApp', payload: appCode });
  };

  // 根据习惯, XIHE在第一项, SSO在最后一项, i18n在倒数第二项
  getAppList = () => {
    const { isAdmin, appList } = this.props;
    if (!appList || appList.length === 0) return [];
    const grantedApps = [...appList];

    // SSO
    let sso = null;
    const ssoIndex = grantedApps.indexOf(AppCode.SSO);
    if (ssoIndex >= 0) {
      sso = grantedApps.splice(ssoIndex, 1);
    }

    // 如果是admin账户登录，就只显示SSO APP
    if (isAdmin) {
      return sso;
    }

    // XIHE
    let XIHE = null;
    const XIHEIndex = grantedApps.indexOf(AppCode.XIHE);
    if (XIHEIndex >= 0) {
      XIHE = grantedApps.splice(XIHEIndex, 1);
    }

    // I18n
    let i18n = null;
    const I18nIndex = grantedApps.indexOf(AppCode.I18N);
    if (I18nIndex >= 0) {
      i18n = grantedApps.splice(I18nIndex, 1);
    }

    // 整合数据
    XIHE && grantedApps.unshift(XIHE[0]);
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
          const currentItem = currentApp === name ? styles.currentItem : '';
          if (APPs[name] !== undefined) {
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
          if (name === AppCode.I18N) {
            return (
              <div key={name} className={`${styles.portalItem} ${currentItem}`}>
                <Badge dot={currentApp === name}>
                  <span
                    style={{ background: AppIconColor[name] }}
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
          if (name === AppCode.SSO) {
            return (
              <div key={name} className={`${styles.portalItem} ${currentItem}`}>
                <Badge dot={currentApp === name}>
                  <span
                    style={{ background: AppIconColor[name] }}
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
          if (name === AppCode.XIHE) {
            return (
              <div key={name} className={`${styles.portalItem} ${currentItem}`}>
                <Badge dot={currentApp === name}>
                  <span
                    style={{ background: AppIconColor[AppCode.XIHE] }}
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
    currentApp: global?.currentApp,
  };
})(Portal);

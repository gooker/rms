import React from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import screenfull from 'screenfull';
import { connect } from '@/utils/RmsDva';
import { dealResponse, isNull, isStrictNull } from '@/utils/util';
import { getHAInfo } from '@/services/XIHEService';
import SelectEnvironment from './SelectEnvironment';
import UserCenter from './UserCenter';
import SelectSection from './SelectSection';
import SelectLang from './SelectLang';
import HeaderTimezone from './HeaderTimezone';
import HeaderHelpDoc from './HeaderHelpDoc';
import styles from './Header.module.less';
import HeaderAlertCenter from '@/packages/Portal/components/HeaderAlertCenter';

@connect(({ global, user }) => ({
  logo: global.logo,
  sysAuthInfo: global.sysAuthInfo,
  globalLocale: global.globalLocale,
  isFullscreen: global.isFullscreen,
  version: global.version,
  currentUser: user.currentUser,
}))
class Header extends React.Component {
  state = {
    isHA: false, // 是否是高可用模式
  };

  componentDidMount() {
    // this.getHAInformation();
  }

  getHAInformation = () => {
    getHAInfo().then((response) => {
      if (!dealResponse(response)) {
        // 服务器列表中highAvailable只要有一个是true就表示是高可用模式
        let isHA = false;
        for (let index = 0; index < response.length; index++) {
          const { highAvailable } = response[index];
          if (highAvailable) {
            isHA = true;
          }
        }
        this.setState({ isHA });
      }
    });
  };

  switchFullScreen = () => {
    const { dispatch, isFullscreen } = this.props;
    dispatch({ type: 'global/changeFullScreen', payload: !isFullscreen });
    screenfull.toggle();
  };

  renderVersion = () => {
    const { version } = this.props;
    const versionText = version?.PlatForm?.version;
    if (!isStrictNull(versionText)) {
      return `v1.0.0`;
    }
    return null;
  };

  render() {
    const { isHA } = this.state;
    const { logo, currentUser, isFullscreen, sysAuthInfo } = this.props;
    if (isNull(currentUser)) return null;

    const isAdmin = currentUser.username === 'admin';
    return (
      <div className={styles.header}>
        <div className={styles.leftContent}>
          <img src={logo || '/images/logoMain.png'} alt={'logo'} style={{ width: 240 }} />
        </div>
        <div className={styles.middleContent}>
          {window.localStorage.getItem('dev') === 'true' && (
            <div className={styles.devFlag}>DEV</div>
          )}
          {/*{isHA && <HA />}*/}
          {/*{sysAuthInfo <= 30 && <ExpiredTip days={sysAuthInfo} />}*/}
          <div className={styles.version}>{this.renderVersion()}</div>
        </div>
        <div className={styles.rightContent}>
          {/* 环境切换 */}
          <SelectEnvironment />

          {/* 帮助文档 */}
          <HeaderHelpDoc />

          {/* 展示时区详情信息 */}
          <HeaderTimezone />

          {/* 用户中心 */}
          <UserCenter />

          {/* Section切换 */}
          {!isAdmin && <SelectSection />}

          {/* 全屏切换 */}
          <span className={styles.action} onClick={this.switchFullScreen}>
            {isFullscreen ? (
              <FullscreenExitOutlined style={{ fontSize: 14, color: 'red' }} />
            ) : (
              <FullscreenOutlined style={{ fontSize: 14 }} />
            )}
          </span>

          {/* 问题中心 */}
          <HeaderAlertCenter />

          {/* 切换语言 */}
          <SelectLang />
        </div>
      </div>
    );
  }
}
export default Header;

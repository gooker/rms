import React from 'react';
import { Badge, Popover, Switch } from 'antd';
import { BellOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import screenfull from 'screenfull';
import { connect } from '@/utils/RmsDva';
import { AppCode } from '@/config/config';
import { dealResponse, isNull } from '@/utils/util';
import { getHAInfo } from '@/services/XIHEService';
import { IconFont } from '@/components/IconFont';
import FormattedMessage from '@/components/FormattedMessage';
import HA from './HA';
import ExpiredTip from './ExpiredTip';
import SelectEnvironment from './SelectEnvironment';
import UserCenter from './UserCenter';
import SelectSection from './SelectSection';
import SelectLang from './SelectLang';
import HeaderTimezone from './HeaderTimezone';
import HeaderHelpDoc from './HeaderHelpDoc';
import styles from './Header.module.less';

@withRouter
@connect(({ global, user }) => ({
  logo: global.logo,
  alertCount: global.alertCount,
  sysAuthInfo: global.sysAuthInfo,
  globalLocale: global.globalLocale,
  isFullscreen: global.isFullscreen,
  backendVersion: global.backendVersion,
  currentUser: user.currentUser,
}))
class Header extends React.Component {
  state = {
    showErrorNotification: false,
    isHA: false, // 是否是高可用模式
  };

  componentDidMount() {
    // this.getHAInformation();
    const sessionValue = window.sessionStorage.getItem('showErrorNotification');
    const showErrorNotification = sessionValue === null ? true : JSON.parse(sessionValue);
    this.setState({ showErrorNotification });
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

  changeSection = (record) => {
    const { key } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUpdateUserCurrentSection',
      payload: key, // key就是sectionId,
    }).then((result) => {
      if (result) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  };

  switchShowErrorNotification = (checked) => {
    window.sessionStorage.setItem('showErrorNotification', checked);
    this.setState({ showErrorNotification: checked });
  };

  goToQuestionCenter = async () => {
    const { history } = this.props;
    history.push(`/${AppCode.SSO}/alertCenter`);
  };

  changeLocale = async ({ key }) => {
    const { dispatch } = this.props;
    await dispatch({ type: 'global/updateGlobalLocale', payload: key });
  };

  render() {
    const { showErrorNotification, isHA, sysAuthInfo } = this.state;
    const { alertCount, backendVersion } = this.props;
    const { logo, isFullscreen, currentUser } = this.props;
    if (isNull(currentUser)) return null;

    const mainVersion = backendVersion?.MixRobot?.version;
    const isAdmin = currentUser.username === 'admin';
    return (
      <div className={styles.header}>
        <div className={styles.leftContent}>
          <img src={logo || '/images/logoMain.png'} alt={'logo'} />
          <div className={styles.version}>{mainVersion && `v${mainVersion}`}</div>
        </div>
        <div className={styles.rightContent}>
          {isHA && <HA />}
          {sysAuthInfo <= 30 && <ExpiredTip days={sysAuthInfo} />}

          {/* 刷新基础数据 */}
          {/*<ReloadGlobalResource />*/}

          {/* 环境切换 */}
          <SelectEnvironment />

          {/* 帮助文档 */}
          <HeaderHelpDoc />

          {/* 展示时区详情信息 */}
          <HeaderTimezone />

          {/* 用户中心 */}
          <UserCenter />

          {/* Section切换 */}
          {!isAdmin && <SelectSection onMenuClick={this.changeSection} />}

          {/* 全屏切换 */}
          <span className={styles.action} onClick={this.switchFullScreen}>
            {isFullscreen ? (
              <FullscreenExitOutlined style={{ fontSize: 14, color: 'red' }} />
            ) : (
              <FullscreenOutlined style={{ fontSize: 14 }} />
            )}
          </span>

          {/* 问题中心 */}
          <Popover
            trigger="hover"
            content={
              <Switch
                checkedChildren={<FormattedMessage id="app.common.on" />}
                unCheckedChildren={<FormattedMessage id="app.common.off" />}
                checked={showErrorNotification}
                onChange={this.switchShowErrorNotification}
              />
            }
          >
            <span className={styles.action} onClick={this.goToQuestionCenter}>
              <Badge size="small" showZero={false} count={alertCount} overflowCount={99}>
                {showErrorNotification ? <BellOutlined /> : <IconFont type="icon-bellOff" />}
              </Badge>
            </span>
          </Popover>

          {/* 切换语言 */}
          <SelectLang onChange={this.changeLocale} />
        </div>
      </div>
    );
  }
}
export default Header;

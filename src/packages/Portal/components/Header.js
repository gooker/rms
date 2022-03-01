import React from 'react';
import { Badge, Modal, Popover, Switch } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined, BellOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import screenfull from 'screenfull';
import { connect } from '@/utils/RmsDva';
import { dealResponse, isNull } from '@/utils/util';
import { getHAInfo } from '@/services/XIHE';
import HA from '@/packages/Portal/components/HA';
import ExpiredTip from '@/packages/Portal/components/ExpiredTip';
import FormattedMessage from '@/components/FormattedMessage';
import SelectEnvironment from './SelectEnvironment';
import UserCenter from './UserCenter';
import SelectSection from './SelectSection';
import SelectLang from './SelectLang';
import AppConfigPanel from './AppConfigPanel';
import styles from './Header.module.less';

@withRouter
@connect(({ global, user }) => ({
  logo: global.logo,
  alertCount: global.alertCount,
  sysAuthInfo: global.sysAuthInfo,
  globalLocale: global.globalLocale,
  environments: global.environments,
  isFullscreen: global.isFullscreen,
  backendVersion: global.backendVersion,
  currentUser: user.currentUser,
}))
class Header extends React.Component {
  state = {
    showErrorNotification: false,
    apiListShow: false,
    isHA: false, // 是否是高可用模式
  };

  componentDidMount() {
    this.getHAInformation();
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

  changeEnvironment = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchUpdateEnvironment',
      payload: record,
    }).then((result) => {
      if (result) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
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
    history.push('/XIHE/questionCenter');
  };

  changeLocale = async ({ key }) => {
    const { dispatch } = this.props;
    await dispatch({ type: 'global/updateGlobalLocale', payload: key });
  };

  render() {
    const { showErrorNotification, isHA, sysAuthInfo } = this.state;
    const { history, alertCount, backendVersion, apiListShow } = this.props;
    const { logo, environments, isFullscreen, currentUser } = this.props;
    if (isNull(currentUser)) return null;

    const mainVersion = backendVersion?.MixRobot?.version;
    const isAdmin = currentUser.username === 'admin';
    return (
      <div className={styles.header}>
        <div className={styles.leftContent}>
          <img
            className={styles.logo}
            src={logo || '/images/logoMain.png'}
            alt={'logo'}
            onClick={() => {
              history.push('/');
            }}
          />
          <div className={styles.version}>{mainVersion && `v${mainVersion}`}</div>
        </div>
        <div className={styles.rightContent}>
          {isHA && <HA />}
          {sysAuthInfo <= 30 && <ExpiredTip days={sysAuthInfo} />}

          {/* 环境切换 */}
          <SelectEnvironment
            environments={environments || []}
            changeEnvironment={(record) => {
              this.changeEnvironment(record);
            }}
          />

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
              <span>
                <FormattedMessage id="app.notification" />:{' '}
                <Switch
                  checkedChildren={<FormattedMessage id="app.notification.on" />}
                  unCheckedChildren={<FormattedMessage id="app.notification.off" />}
                  checked={showErrorNotification}
                  onChange={this.switchShowErrorNotification}
                />
              </span>
            }
          >
            <span className={styles.action} onClick={this.goToQuestionCenter}>
              <Badge size="small" showZero={false} count={alertCount} overflowCount={99}>
                <BellOutlined />
              </Badge>
            </span>
          </Popover>

          {/* 切换语言 */}
          <SelectLang onChange={this.changeLocale} />

          {/* API列表展示窗口 */}
          <Modal
            width={960}
            footer={null}
            closable={false}
            visible={apiListShow}
            onCancel={() => {
              this.setState({ apiListShow: false });
            }}
          >
            <AppConfigPanel />
          </Modal>
        </div>
      </div>
    );
  }
}
export default Header;

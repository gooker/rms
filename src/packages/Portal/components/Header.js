import React from 'react';
import { Popover, Switch, Modal } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import screenfull from 'screenfull';
import { connect } from '@/utils/dva';
import throttle from 'lodash/throttle';
import FormattedMessage from '@/components/FormattedMessage';
import Portal from './Portal/Portal';
import SelectEnvironment from './SelectEnvironment';
import UserCenter from './UserCenter';
import SelectSection from './SelectSection';
import NoticeIcon from './NoticeIcon';
import SelectLang from './SelectLang';
import AppConfigPanel from './AppConfigPanel/AppConfigPanel';
import styles from './Head.module.less';

@connect(({ global, user }) => ({
  globalLocale: global.globalLocale,
  currentUser: user.currentUser,
  environments: global.environments,
  isFullscreen: global.isFullscreen,
}))
class Header extends React.Component {
  // 用来标记是否是用户点击触发了全屏切换，而不是ESC退出全屏
  userAction = false;

  state = {
    isFullscreen: false,
    showErrorNotification: false,
    apiListShow: false,
    showLabel: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    screenfull.on('change', this.changeFullScreenFlag);
    const sessionValue = window.sessionStorage.getItem('showErrorNotification');
    const showErrorNotification = sessionValue === null ? true : JSON.parse(sessionValue);
    this.setState({ showErrorNotification });
    this.resizeObserver();

    window.addEventListener('fullscreenchange', function (e) {
      if (document.fullscreenElement === null) {
        dispatch({ type: 'global/changeFullScreen', payload: false });
      }
    });
  }

  componentWillUnmount() {
    screenfull.off('change', this.changeFullScreenFlag);
    this.bodySizeObserver.disconnect();
    window.removeEventListener('fullscreenchange', null);
  }

  resizeObserver = () => {
    this.bodySizeObserver = new ResizeObserver(
      throttle((entries) => {
        const { width } = entries[0].contentRect;
        this.setState({ showLabel: width >= 1440 });
      }, 500),
    );
    this.bodySizeObserver.observe(document.body);
  };

  changeFullScreenFlag = () => {
    const { isFullscreen } = this.state;
    if (!this.userAction && isFullscreen) {
      this.setState({
        isFullscreen: false,
      });
    }
    this.userAction = false;
  };

  switchFullScreen = () => {
    const { isFullscreen } = this.state;
    const { dispatch } = this.props;
    this.userAction = true;
    this.setState({ isFullscreen: !isFullscreen }, () => {
      dispatch({ type: 'global/changeFullScreen', payload: !isFullscreen });
      const AppContent = document.getElementById('layoutContent');
      screenfull.toggle(AppContent);
    });
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

  handleUserMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      // 只有在手动退出的情况下才清空 global/environments 对象
      dispatch({ type: 'global/clearEnvironments' });
      dispatch({ type: 'user/logout' });
    }
    if (key === 'apiList') {
      this.setState({ apiListShow: true });
    }
  };

  switchShowErrorNotification = (checked) => {
    window.sessionStorage.setItem('showErrorNotification', checked);
    this.setState({ showErrorNotification: checked });
  };

  goToQuestionCenter = async () => {
    const { dispatch } = this.props;
    dispatch({ type: 'global/goToQuestionCenter' });
  };

  changeLocale = async ({ key }) => {
    const { dispatch } = this.props;
    const currentLocale = key;
    await dispatch({ type: 'global/updateGlobalLocale', payload: currentLocale });
  };

  render() {
    const { isFullscreen, showErrorNotification, showLabel, apiListShow } = this.state;
    const { environments, currentUser, noticeCountUpdate, noticeCount } = this.props;
    const isAdmin = currentUser.username === 'admin';
    return (
      <div className={styles.headerContent}>
        <div className={styles.leftContent}>
          <Portal />
        </div>
        <div className={styles.rightContent}>
          {/* 环境切换 */}
          <SelectEnvironment
            showLabel={showLabel}
            className={styles.icon}
            environments={environments || []}
            changeEnvironment={(record) => {
              this.changeEnvironment(record);
            }}
          />

          {/* 用户中心 */}
          <UserCenter showLabel={showLabel} onMenuClick={this.handleUserMenuClick} />

          {/* Section切换 */}
          {!isAdmin && <SelectSection showLabel={showLabel} onMenuClick={this.changeSection} />}

          {/* 全屏切换 */}
          <span className={styles.icon} onClick={this.switchFullScreen}>
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
            <span
              className={styles.icon}
              onMouseOver={noticeCountUpdate}
              onFocus={() => void 0}
              onClick={this.goToQuestionCenter}
            >
              {/* /coordinator/problemHandling/getProblemHandlingCount */}
              <NoticeIcon count={noticeCount || 0} />
            </span>
          </Popover>

          {/* 切换语言 */}
          <SelectLang showLabel={showLabel} className={styles.icon} onChange={this.changeLocale} />

          {/* 切换时间区 */}
          {/* <SelectTimeZone
            className={styles.icon}
            userTimeZone={currentUser.userTimeZone}
            toUserCenter={() => {}}
          /> */}

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

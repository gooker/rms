import React from 'react';
import { Modal, Popover, Switch } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import screenfull from 'screenfull';
import { connect } from '@/utils/RmsDva';
import { throttle } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import Portal from './Portal/Portal';
import SelectEnvironment from './SelectEnvironment';
import UserCenter from './UserCenter';
import SelectSection from './SelectSection';
import NoticeIcon from './NoticeIcon';
import SelectLang from './SelectLang';
import AppConfigPanel from './AppConfigPanel/AppConfigPanel';
import styles from './Header.module.less';
import { isNull } from '@/utils/util';

@connect(({ global, user }) => ({
  globalLocale: global.globalLocale,
  currentUser: user.currentUser,
  environments: global.environments,
  isFullscreen: global.isFullscreen,
}))
class Header extends React.Component {
  state = {
    showErrorNotification: false,
    apiListShow: false,
    showLabel: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
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
    const { dispatch } = this.props;
    dispatch({ type: 'global/goToQuestionCenter' });
  };

  changeLocale = async ({ key }) => {
    const { dispatch } = this.props;
    await dispatch({ type: 'global/updateGlobalLocale', payload: key });
  };

  render() {
    const { showErrorNotification, showLabel, apiListShow } = this.state;
    const { environments, isFullscreen, currentUser, noticeCountUpdate, noticeCount } = this.props;
    if (isNull(currentUser)) return null;
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
            environments={environments || []}
            changeEnvironment={(record) => {
              this.changeEnvironment(record);
            }}
          />

          {/* 用户中心 */}
          <UserCenter showLabel={showLabel} />

          {/* Section切换 */}
          {!isAdmin && <SelectSection showLabel={showLabel} onMenuClick={this.changeSection} />}

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
            <span
              className={styles.action}
              onMouseOver={noticeCountUpdate}
              onFocus={() => void 0}
              onClick={this.goToQuestionCenter}
            >
              <NoticeIcon count={noticeCount || 0} />
            </span>
          </Popover>

          {/* 切换语言 */}
          <SelectLang showLabel={showLabel} onChange={this.changeLocale} />

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

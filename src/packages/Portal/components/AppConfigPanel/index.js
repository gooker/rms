import React from 'react';
import { message } from 'antd';
import { find } from 'lodash';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import { isStrictNull, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import SuperDescription from './SuperDescription';
import styles from './AppConfigPanel.module.less';

class AppConfigPanel extends React.PureComponent {
  dataSource = [];

  state = {
    dataSource: [],
    versionTextList: [],
  };

  addToClipBoard = () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', JSON.stringify(this.dataSource));
    input.setSelectionRange(0, 9999);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    message.info(formatMessage({ id: 'app.configInfo.copy.tip' }));
  };

  handlePromise = (promiseList) => {
    return promiseList.map((promise) =>
      promise.then(
        async (res) => ({ status: 'true', res: await res.text() }),
        (err) => ({ status: 'false', res: err }),
      ),
    );
  };

  getVersion = async (url) => {
    // url存在
    const webAddress = url.split('#')[0];
    return fetch(`${webAddress}version.txt`);
  };

  renderApiList = (versionTextList) => {
    const { grantedAPP, nameSpacesInfo } = this.props;
    const grantedAPPMap = {};
    grantedAPP.forEach(({ base, entry }) => {
      grantedAPPMap[base] = entry;
    });
    const appAPIKey = new Set(Object.keys(nameSpacesInfo));
    const mergedKey = new Set([...grantedAPP, ...appAPIKey]);

    // 因为对于国际化模块, 前端是i18n, 后端是translation, 所以这里删除掉一个
    // 因为对于Mixrobot模块, 前端是mixrobot, 后端是coordinator, 所以这里删除掉一个
    // 因为对于Tote模块, 前端是tote-wcs-gui, 后端是tote, 所以这里删除掉一个
    mergedKey.delete('translation');
    mergedKey.delete('coordinator');
    mergedKey.delete('tote');

    const dataSource = [];
    this.dataSource = dataSource;
    mergedKey.forEach((module) => {
      const item = { module };
      const appModule = find(versionTextList, ({ appmodule }) => appmodule === module);
      if (module === 'i18n') {
        item.api = nameSpacesInfo.translation;
      } else if (module === 'mixrobot') {
        item.api = nameSpacesInfo.coordinator;
      } else if (module === 'tote-wcs-gui') {
        item.api = nameSpacesInfo.tote;
      } else {
        item.api = nameSpacesInfo[module];
      }
      item.version = appModule ? appModule.version : null;
      dataSource.push(item);
    });
    this.setState({
      dataSource,
      versionTextList,
    });
  };

  componentDidMount() {
    this.renderAPI();
  }

  renderAPI = async () => {
    const { grantedAPP } = this.props;
    const getAppVersion = [];
    const getAppVersionModule = [];
    grantedAPP.forEach(({ base, entry }) => {
      if (!isStrictNull(entry)) {
        getAppVersion.push(this.getVersion(entry));
        getAppVersionModule.push(base);
      }
    });

    const versionTextList = [];
    try {
      const response = await Promise.all(this.handlePromise(getAppVersion));
      const newResponse = [];
      response.map((res, index) => {
        if (res.status === 'true') {
          const currentRes = res.res;
          const currentResArray = currentRes.split('\n');
          if (
            currentResArray &&
            currentResArray.length > 0 &&
            currentResArray[0].startsWith('version') &&
            currentResArray[1].startsWith('git_sha1')
          ) {
            newResponse.push({
              data: res.res,
              appmodule: getAppVersionModule[index],
            });
          }
        }
      });
      newResponse.map((res) => {
        const { data } = res;
        const { appmodule } = res;
        const responseVersionText = data.split('\n')[0];
        const versionText = responseVersionText.split(':')[1];
        versionTextList.push({
          appmodule,
          version: versionText,
        });
      });
      return this.renderApiList(versionTextList);
    } catch (error) {
      return [];
    }
  };

  render() {
    const { dataSource } = this.state;
    const { grantedAPP } = this.props;
    return (
      <div className={styles.appConfigPanel}>
        <div className={styles.copy}>
          <span onClick={this.addToClipBoard}>
            <FormattedMessage id={'app.button.copy'} />
          </span>
        </div>
        <div className={styles.tableRow}>
          <div className={classnames(styles.flexRowCenter, styles.backColor)} style={{ flex: 1 }}>
            <FormattedMessage id="app.configInfo.header.moduleName" />
          </div>
          <div className={classnames(styles.flexRowCenter, styles.backColor)} style={{ flex: 2 }}>
            <FormattedMessage id="app.configInfo.header.moduleAPI" />
          </div>
        </div>
        <div className={styles.body}>
          <SuperDescription data={dataSource} grantedAPP={grantedAPP} />
        </div>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  grantedAPP: global.grantedAPP,
  nameSpacesInfo: global.nameSpacesInfo,
}))(AppConfigPanel);

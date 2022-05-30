import React from 'react';
import classnames from 'classnames';
import { Divider, message } from 'antd';
import { connect } from '@/utils/RmsDva';
import SuperDescription from './SuperDescription';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isStrictNull } from '@/utils/util';
import styles from './moduleInformationPanel.module.less';
import { NameSpace } from '@/config/config';
import packageJSON from '@/../package.json';
import HAStyle from '../HA/ha.module.less';

const ModuleInformationPanel = (props) => {
  const { adapterVersion, backendVersion } = props;

  const appVersion = formatAppVersionData();

  async function addToClipBoard() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(appVersion));
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    } catch (err) {
      message.success(formatMessage({ id: 'app.message.operateFailed' }));
    }
  }

  function formatAppVersionData() {
    const namespace = window.nameSpacesInfo;
    const versions = { ...backendVersion };
    delete versions.MixVehicle;
    const result = [];
    result.push({
      module: 'FE',
      version: packageJSON.version,
      api: window.location.origin,
    });
    Object.values(versions).forEach(({ appName, version }) => {
      result.push({
        version,
        module: appName,
        api: namespace[NameSpace[appName]],
      });
    });
    result.push({
      module: 'WS',
      version: '-',
      api: namespace.ws,
    });
    return result;
  }

  return (
    <div className={styles.appConfigPanel}>
      <div className={styles.copy}>
        <span onClick={addToClipBoard}>
          <FormattedMessage id={'app.button.copy'} />
        </span>
      </div>
      <div className={styles.tableRow}>
        <div className={classnames(styles.flexRowCenter, styles.backColor)} style={{ flex: 1 }}>
          <FormattedMessage id="app.configInfo.header.moduleName" />
        </div>
        <div className={classnames(styles.flexRowCenter, styles.backColor)} style={{ flex: 1 }}>
          <FormattedMessage id="app.configInfo.header.moduleURL" />
        </div>
        <div className={classnames(styles.flexRowCenter, styles.backColor)} style={{ flex: 1 }}>
          <FormattedMessage id="app.configInfo.header.moduleVersion" />
        </div>
      </div>
      <div className={styles.body}>
        <SuperDescription data={appVersion} />
      </div>

      {adapterVersion && (
        <>
          <Divider style={{ marginBottom: 0 }}>
            <FormattedMessage id="app.configInfo.header.adapter" />
          </Divider>
          <div>
            <div className={HAStyle.serverListTitle}>
              <span />
              <span>{formatMessage({ id: 'app.configInfo.header.adapterName' })}</span>
              <span>{formatMessage({ id: 'app.configInfo.header.adapterURL' })}</span>
            </div>
            {Object.values(adapterVersion).map(
              ({ currentUrl, isMainServer, serverName }, index) => {
                return (
                  <div key={index} className={HAStyle.serverListBody}>
                    <span>
                      {formatMessage({
                        id: isMainServer ? 'app.navBar.haMode.main' : 'app.navBar.haMode.spare',
                      })}
                    </span>
                    <span>{serverName}</span>
                    <span>{currentUrl}</span>
                  </div>
                );
              },
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default connect(({ global }) => ({
  adapterVersion: global.adapterVersion,
  backendVersion: global.backendVersion,
}))(ModuleInformationPanel);

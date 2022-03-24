import React, { useState } from 'react';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import SuperDescription from './SuperDescription';
import styles from './AppConfigPanel.module.less';

const AppConfigPanel = (props) => {
  const { grantedAPP } = props;

  const [dataSource, setDataSource] = useState([]);

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
};
export default connect(({ global }) => ({
  grantedAPP: global.grantedAPP,
  nameSpacesInfo: global.nameSpacesInfo,
}))(AppConfigPanel);

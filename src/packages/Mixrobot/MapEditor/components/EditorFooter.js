/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import { connect } from '@/utils/dva';
import { FormattedMessage } from '@/utils/Lang';
import styles from '../editor.module.less';

const MapFooter = (props) => {
  const { currentMap, selectLines, selectCells, height } = props;
  const { ever, mver } = currentMap ?? {};

  const selectContent = (record) => {
    if (record.length === 1) {
      return (
        <div className={styles.footerBlock}>
          <FormattedMessage id="app.footer.cellSelected" />
          <span className={styles.footerContent}>{record[0]}</span>
        </div>
      );
    }
    return (
      <div className={styles.footerBlock}>
        <FormattedMessage id="app.footer.altogetherSelected" />
        <span className={styles.footerContent}>{record.length}</span>
        <FormattedMessage id="app.footer.unit" />
      </div>
    );
  };

  const selectLineContent = (record) => {
    if (record.length === 1) {
      return (
        <div className={styles.footerBlock}>
          <FormattedMessage id="app.footer.lineSelected" />
          <span className={styles.footerContent}>{record[0]}</span>
        </div>
      );
    }
    return (
      <div className={styles.footerBlock}>
        <FormattedMessage id="app.footer.altogetherSelected" />
        <span className={styles.footerContent}>{record.length}</span>
        <FormattedMessage id="app.footer.unit" />
      </div>
    );
  };

  const renderVersion = (eVer, mVer) => {
    if (eVer === mVer) {
      return <span style={{ marginLeft: 5 }}>{`V-${eVer}`}</span>;
    }
    return null;
  };
  let content = null;
  if (ever == null) {
    content = (
      <span style={{ marginLeft: 20, color: '#FFF' }}>
        {' '}
        <FormattedMessage id="app.mapTool.selectMap" />
      </span>
    );
  } else {
    content = (
      <div style={{ display: 'flex' }}>
        <span>{renderVersion(ever, mver)}</span>
        {selectCells.length > 0 && selectContent(selectCells)}
        {selectLines.length > 0 && selectLineContent(selectLines)}
      </div>
    );
  }
  return <div style={{ height }}>{content}</div>;
};
export default connect(({ editor }) => {
  const { currentMap, selectLines, selectCells } = editor;
  return { currentMap, selectLines, selectCells };
})(MapFooter);

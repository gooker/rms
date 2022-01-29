import React from 'react';
import classNames from 'classnames';
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RcsDva';
import { isNull } from '@/utils/util';
import { FooterHeight } from '../enums';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyle from '@/common.module.less';
import styles from '../editorLayout.module.less';

const EditorFooter = (props) => {
  const { mapContext, currentMap, selectLines, selectCells } = props;
  const { ever, mver } = currentMap ?? {};

  function selectCellTip(record) {
    if (record.length === 1) {
      return (
        <div className={classNames(styles.footerSelection, commonStyle.flexVerticalCenter)}>
          <FormattedMessage id="editor.footer.cellSelected" />
          <span className={styles.footerSelectionValue}>{record[0]}</span>
        </div>
      );
    }
    return (
      <div className={classNames(styles.footerSelection, commonStyle.flexVerticalCenter)}>
        <FormattedMessage id="editor.footer.totalSelected" />
        <span className={styles.footerSelectionValue}>{record.length}</span>
      </div>
    );
  }

  function selectCostTip(record) {
    if (record.length === 1) {
      return (
        <div className={styles.footerSelection}>
          <FormattedMessage id="editor.footer.lineSelected" />
          <span className={styles.footerSelectionValue}>{record[0]}</span>
        </div>
      );
    }
    return (
      <div className={styles.footerSelection}>
        <FormattedMessage id="editor.footer.totalSelected" />
        <span className={styles.footerSelectionValue}>{record.length}</span>
      </div>
    );
  }

  function renderVersion(eVer, mVer) {
    if (eVer === mVer) {
      return `V-${eVer}`;
    }
    return null;
  }

  function cancelSelection() {
    mapContext.cancelCellSelected();
    mapContext.refresh();
  }

  let content;
  if (isNull(ever)) {
    content = (
      <span style={{ marginLeft: 10, color: '#FFF' }}>
        <FormattedMessage id="mapEditor.selectMap.required" />
      </span>
    );
  } else {
    content = (
      <>
        <div className={classNames(styles.footerVersion, commonStyle.flexVerticalCenter)}>
          {renderVersion(ever, mver)}
        </div>
        {selectCells.length > 0 && selectCellTip(selectCells)}
        {selectLines.length > 0 && selectCostTip(selectLines)}
        {(selectCells.length > 0 || selectLines.length > 0) && (
          <div className={classNames(styles.footerClose, commonStyle.flexVerticalCenter)}>
            <CloseCircleOutlined onClick={cancelSelection} />
          </div>
        )}
      </>
    );
  }
  return (
    <div className={styles.footer} style={{ height: `${FooterHeight}px` }}>
      {content}
    </div>
  );
};
export default connect(({ editor }) => {
  const { mapContext, currentMap, selectLines, selectCells } = editor;
  return { mapContext, currentMap, selectLines, selectCells };
})(EditorFooter);

import React, { memo } from 'react';
import styles from './simpleTable.module.less';
import { isStrictNull } from '@/utils/util';

const SimpleTable = (props) => {
  const { columns, dataSource, marker, style } = props;

  return (
    <div style={style}>
      <div className={styles.simpleTableHeader}>
        {marker && <span className={styles.simpleTableMarker}></span>}
        {columns.map(({ title, width, dataIndex }) => (
          <div
            key={dataIndex}
            style={isStrictNull(width) ? { flex: 1 } : { width }}
            className={styles.simpleTableRowColumn}
          >
            {title}
          </div>
        ))}
      </div>
      <div>
        {dataSource.map((dataRow, index) => (
          <div key={index} className={styles.simpleTableRow}>
            {marker && (
              <span className={styles.simpleTableMarker}>
                <div style={{ background: dataRow.$$color }} />
              </span>
            )}
            {columns.map(({ dataIndex, width, render }) => (
              <div
                key={dataIndex}
                style={isStrictNull(width) ? { flex: 1 } : { width }}
                className={styles.simpleTableRowColumn}
              >
                {typeof render === 'function' ? render(dataRow[dataIndex]) : dataRow[dataIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default memo(SimpleTable);

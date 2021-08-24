import React, { memo } from 'react';
import { Table } from 'antd';
import EditableCell from './EditableCell';
import styles from './editableTable.module.less';

const EditableTable = (props) => {
  const { value, columns, onChange, loading } = props;

  function generateColumns() {
    if (Array.isArray(columns) && columns.length > 0) {
      return columns.map(({ field, disabled = false, fixed = false }) => ({
        title: field,
        dataIndex: field,
        align: 'center',
        width: `${Math.floor((1 / columns.length) * 100)}%`,
        render: (text, record, index) => {
          if (disabled) {
            return <div className={styles.tableCell}>{text}</div>;
          }
          return (
            <EditableCell
              text={text}
              onChange={(content) => {
                onChange(field, index, record, content, text);
              }}
            />
          );
        },
      }));
    }
    return [];
  }

  return (
    <div className={styles.editableTable}>
      <Table
        bordered
        loading={loading}
        columns={generateColumns()}
        dataSource={value}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};
export default memo(EditableTable);

import React, { memo } from 'react';
import { Table } from 'antd';
import EditableCell from './EditableCell';
import { formatMessage } from '@/utils/util';
import styles from './editableTable.module.less';

const EditableTable = (props) => {
  const { value, columns, onChange, loading,pagination,handlePagination } = props;

  function generateColumns() {
    if (Array.isArray(columns) && columns.length > 0) {
      return columns.map(({ title, field, disabled = false, fixed = false }) => ({
        title: title,
        dataIndex: field,
        align: 'center',
        width: `${Math.floor((1 / columns.length) * 100)}%`,
        render: (text, record, index) => {
          if (disabled) {
            return <div className={`${styles.celldisabled} ${styles.tableCell}`}>{text}</div>;
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

  function handleTableChange({ current, pageSize }) {
    handlePagination({current, pageSize });
  }

  return (
    <div className={styles.editableTable}>
      <Table
        bordered
        loading={loading}
        columns={generateColumns()}
        dataSource={value}
        rowKey={(record) => {
          return record.languageKey;
        }}
        scroll={{ x: 'max-content' }}
        pagination={{
          ...pagination,
          showTotal: (total) =>
            `${formatMessage({ id: 'app.common.tableRecord' }, { count: total })}`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};
export default memo(EditableTable);

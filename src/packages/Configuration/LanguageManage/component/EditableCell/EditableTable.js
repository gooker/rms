import React, { memo } from 'react';
import { Table, Typography } from 'antd';
import EditableCell from './EditableCell';
import { formatMessage } from '@/utils/util';
import styles from './editableTable.module.less';
import FormattedMessage from '@/components/FormattedMessage';

const EditableTable = (props) => {
  const { value, columns, deleteRow, onChange, loading, pagination, handlePagination } = props;

  function generateColumns() {
    let result = [];
    const basePercent = window.localStorage.getItem('dev') === 'true' ? 96 : 100;
    const columnWidthPercent = `${Math.floor(basePercent / columns.length)}%`;
    if (Array.isArray(columns) && columns.length > 0) {
      result = columns.map(({ title, field, disabled = false, fixed = false }) => ({
        title: title,
        dataIndex: field,
        align: 'center',
        width: columnWidthPercent,
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

      if (window.localStorage.getItem('dev') === 'true') {
        result.push({
          title: formatMessage('app.common.operation'),
          align: 'center',
          width: '5%',
          render: (text, record) => {
            return (
              <Typography.Link
                onClick={() => {
                  deleteRow(record);
                }}
              >
                <FormattedMessage id={'app.button.delete'} />
              </Typography.Link>
            );
          },
        });
      }
    }
    return result;
  }

  function handleTableChange({ current, pageSize }) {
    handlePagination({ current, pageSize });
  }

  return (
    <div className={styles.editableTable}>
      <Table
        bordered
        loading={loading}
        columns={generateColumns()}
        dataSource={value}
        onChange={handleTableChange}
        rowKey={({ languageKey }) => languageKey}
        pagination={{
          ...pagination,
          showTotal: (total) =>
            `${formatMessage({ id: 'app.template.tableRecord' }, { count: total })}`,
        }}
      />
    </div>
  );
};
export default memo(EditableTable);

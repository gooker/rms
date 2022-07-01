import React, { memo } from 'react';
import { Table } from 'antd';
import { formatMessage, isNull } from '@/utils/util';
import ExpandPanel from '@/components/TableWithPages/ExpandPanel';
import commonStyles from '@/common.module.less';

const TableWithPages = (props) => {
  const newProps = { ...props };
  const expandColumns = newProps.expandColumns;
  const expandColumnsKey = newProps.expandColumnsKey;
  const colspan = newProps.expandColumnSpan;
  delete newProps.expandColumns;
  delete newProps.expandColumnsKey;
  delete newProps.expandColumnSpan;

  if (Array.isArray(expandColumns) && expandColumns.length > 0) {
    newProps.expandable = {
      expandedRowRender: (record) => (
        <ExpandPanel
          record={isNull(expandColumnsKey) ? record : record[expandColumnsKey] ?? {}}
          columns={expandColumns}
          span={colspan}
        />
      ),
    };
  }

  return (
    <div className={commonStyles.tableWrapper}>
      <Table
        pagination={{
          responsive: true,
          defaultPageSize: 10,
          showTotal: (total) => formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
        }}
        {...newProps}
      />
    </div>
  );
};
export default memo(TableWithPages);

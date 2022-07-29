import React, { memo, useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import { formatMessage, getTableScrollY, isNull } from '@/utils/util';
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
  const [y, setY] = useState(null);
  let tableRef = useRef(null);

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

  useEffect(() => {
    if (props?.dataSource?.length > 0) {
      setY(getTableScrollY({ ref: tableRef }));
    }
  }, [props]);

  return (
    <div className={commonStyles.tableWrapper} ref={tableRef}>
      <Table
        pagination={{
          responsive: true,
          defaultPageSize: 10,
          showTotal: (total) => formatMessage({ id: 'app.template.tableRecord' }, { count: total }),
        }}
        {...newProps}
        scroll={{ ...newProps.scroll, y }}
      />
    </div>
  );
};
export default memo(TableWithPages);

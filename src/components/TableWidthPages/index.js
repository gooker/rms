import React, { Component } from 'react';
import { Table } from 'antd';
import { formatMessage } from '@/utils/utils';
import commonStyles from '@/common.module.less';

class TableWidthPages extends Component {
  render() {
    return (
      <div className={commonStyles.tableWrapper}>
        <Table
          {...this.props}
          pagination={{
            responsive: true,
            defaultPageSize: 10,
            showTotal: (total) => formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    );
  }
}
export default TableWidthPages;

import React, { Component } from 'react';
import { Table } from 'antd';
import { formatMessage } from '@/utils/utils';
import commonStyles from '@/common.module.less';

export default class TablewidthPages extends Component {
  render() {
    // const { loading, columns, dataSource, rowSelection,expandedRowRender, rowKey } = this.props;
    return (
      <div className={commonStyles.divContent}>
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

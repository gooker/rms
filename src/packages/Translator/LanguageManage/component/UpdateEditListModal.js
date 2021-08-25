import React, { memo, useState } from 'react';
import { Table, Row, Col, Button } from 'antd';
import { formatMessage } from '@/utils/Lang';

const UpdateEditListModal = (props) => {
  const { columns, source } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataList, setDataList] = useState(Object.values(source) || []);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  function getColumns() {
    if (Array.isArray(columns) && columns.length > 0) {
      const currentColumns = [
        {
          title: 'KEY',
          field: 'languageKey',
          dataIndex: 'languageKey',
        },
      ];
      columns.map(({ type }) => {
        currentColumns.push({
          title: type,
          field: type,
          dataIndex: type,
        });
      });
      return currentColumns;
    }
    return [];
  }

  return (
    <div>
      <Row>
        <Col span={4}>
          <Button
            onClick={() => {
              const filterData = dataList.filter((record) => {
                if (selectedRowKeys.indexOf(record.languageKey) !== -1) {
                  delete source[record.languageKey];
                  return false;
                }
                return true;
              });
              const { onChange } = props;
              if (onChange) {
                onChange(source);
                setDataList(filterData);
              }
            }}
            disabled={selectedRowKeys.length === 0}
          >
            {formatMessage({ id: 'app.button.delete' })}
          </Button>
        </Col>
      </Row>

      <Table
        rowSelection={rowSelection}
        dataSource={dataList}
        columns={getColumns()}
        rowKey={(record) => {
          return record.languageKey;
        }}
        pagination={false}
      />
    </div>
  );
};
export default memo(UpdateEditListModal);

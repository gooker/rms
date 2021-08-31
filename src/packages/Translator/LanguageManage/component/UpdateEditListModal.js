import React, { memo, useState, useEffect } from 'react';
import { Table, Row, Col, Button, Modal } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { adjustModalWidth } from '@/utils/utils';
import { sortBy } from 'lodash';

const UpdateEditListModal = (props) => {
  const { columns, source, onCancel, visible } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    let _sources = Object.values(source) || [];
    _sources = sortBy(_sources, (o) => {
      return o.languageKey;
    });
    setDataList(_sources);
  }, [source]);

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
      <Modal
        width={adjustModalWidth()}
        footer={null}
        destroyOnClose
        visible={visible}
        onCancel={onCancel}
      >
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
              <FormattedMessage id="app.button.delete"></FormattedMessage>
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
      </Modal>
    </div>
  );
};
export default memo(UpdateEditListModal);

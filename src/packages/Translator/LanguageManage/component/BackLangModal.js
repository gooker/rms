import React, { memo, useState, useEffect } from 'react';
import { Table, Row, Col, Button, Modal } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { adjustModalWidth, dealResponse } from '@/utils/util';
import { getPreviousList } from '@/services/translator';

const BackLangModal = (props) => {
  const { columns, onCancel, visible, appCode } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    async function init() {
      const response = await getPreviousList({ appCode });
      if (!dealResponse(response)) {
        setDataList(response);
      }
    }
    init();
  }, []);

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectedRowKeys(selectedRowKeys);
  //   },
  // };
  function getColumns() {
    if (Array.isArray(columns) && columns.length > 0) {
      const currentColumns = [
        {
          title: 'KEY',
          field: 'languageKey',
          dataIndex: 'languageKey',
        },
      ];
      columns.map(({ code }) => {
        currentColumns.push({
          title: code,
          field: code,
          dataIndex: code,
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
        <Row style={{ marginBottom: 10 }}>
          <Col span={4}>
            <Button onClick={() => {}} disabled={selectedRowKeys.length === 0}>
              <FormattedMessage id="app.button.save"></FormattedMessage>
            </Button>
          </Col>
        </Row>

        <Table
          // rowSelection={rowSelection}
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
export default memo(BackLangModal);

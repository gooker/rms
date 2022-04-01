import React, { memo, useState } from 'react';
import { Row, Col, Button,Card } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import LatentTotePodTemplate from './components/PodTemplateComponent';
import commonStyles from '@/common.module.less';

const LatentToteStorage = () => {
  const [addVisible, setAddVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const columns = [{}];

  function getData() {}

  return (
    <TablePageWrapper>
      <Row>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          {/* 新增 */}
          <Button
            type="primary"
            onClick={() => {
              setAddVisible(true);
              setEditRecord(null);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="app.button.add" />
          </Button>

          <Button onClick={getData}>
            <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      {/* <TableWithPages
        bordered
        columns={columns}
        rowKey={({ id }) => id}
        dataSource={[]}
        loading={loading}
        scroll={{ x: 'max-content' }}
      /> */}

       {addVisible && (
        <LatentTotePodTemplate
          visible={addVisible}
          updateRecord={editRecord}
          onClose={() => {
            setAddVisible(false);
            setEditRecord(null);
          }}
          onRefresh={getData}
        />
      )}
    </TablePageWrapper>
  );
};
export default memo(LatentToteStorage);

/*TODO：I18N**/
import React, { memo, useState } from 'react';
import { Button, Form, Modal, Popconfirm, Table, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import UploadHardwareModal from './UploadHardwareModal';

const FireWareFileListModal = (props) => {
  const { visible, onCancel, fireWareFiles, onRefresh } = props;

  const [formRef] = Form.useForm();
  const [uploadVisible, setUploadVisible] = useState(false);

  const columns = [
    {
      title: '固件名',
      dataIndex: 'groupName',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Popconfirm
          title={formatMessage({ id: 'app.message.delete.confirm' })}
          onConfirm={() => deleteRow(record)}
        >
          <Typography.Link>
            <FormattedMessage id={'app.button.delete'} />
          </Typography.Link>
        </Popconfirm>
      ),
    },
  ];

  async function deleteRow({ id }) {
    const response = await xxx([id]);
    if (!dealResponse(response)) {
      onRefresh();
    }
  }

  return (
    <Modal
      visible={visible}
      title={'固件管理'}
      width={750}
      maskClosable={false}
      footer={null}
      onCancel={onCancel}
    >
      <Button
        type={'primary'}
        style={{ marginBottom: 15 }}
        onClick={() => {
          setUploadVisible(true);
        }}
      >
        <PlusOutlined /> <FormattedMessage id={'app.button.add'} />
      </Button>
      <Form form={formRef} component={false}>
        <Table
          bordered
          rowKey={(record, index) => index}
          columns={columns}
          dataSource={fireWareFiles}
          pagination={false}
        />
      </Form>

      {/* 上传固件弹窗 */}
      <UploadHardwareModal
        visible={uploadVisible}
        onCancel={() => {
          setUploadVisible(false);
        }}
        refreshHardWare={onRefresh}
      />
    </Modal>
  );
};
export default memo(FireWareFileListModal);

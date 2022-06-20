/*TODO: I18N*/
import React, { memo } from 'react';
import { Form, Row, Col, Button } from 'antd';
import { DeleteOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, getFormLayout, formatMessage } from '@/utils/util';
import commonStyles from '@/common.module.less';
import { deleteChargingStrategyById } from '@/services/resourceService';
import RmsConfirm from '@/components/RmsConfirm';
import ResourceGroupOperateComponent from '@/packages/ResourceManage/component/ResourceGroupOperateComponent';
const { formItemLayout } = getFormLayout(5, 18);

const SearchComponent = (props) => {
  const { searchData, selectedRowKeys, selectedRows, addStrage, data, getData } = props;

  const [formRef] = Form.useForm();


  function search() {
    formRef.validateFields().then((value) => {
      searchData(data, value);
    });
  }

  async function deleteStrage() {
    const id = selectedRowKeys[0];
    RmsConfirm({
      content: formatMessage({ id: 'app.message.delete.confirm' }),
      onOk: async () => {
        const response = await deleteChargingStrategyById({ Id: id });
        if (!dealResponse(response, 1)) {
          getData();
        }
      },
    });
  }

  return (
    <>
      {/* <Form {...formItemLayout} form={formRef}> */}
      {/* <Row>
          <Col span={6}>
            <Form.Item label={<FormattedMessage id="app.common.code" />} name="code">
              <Input allowClear style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col style={{ textAlign: 'end' }}>
            <Form.Item>
              <Button type="primary" onClick={search}>
                <SearchOutlined /> <FormattedMessage id="app.button.search" />
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form> */}

      <Row justify={'space-between'} style={{ userSelect: 'none' }}>
        <Col className={commonStyles.tableToolLeft} flex="auto">
          <Button type="primary" onClick={addStrage}>
            <PlusOutlined /> <FormattedMessage id="app.button.add" />
          </Button>
          <Button danger disabled={selectedRowKeys.length !== 1} onClick={deleteStrage}>
            <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
          </Button>


          <ResourceGroupOperateComponent
            selectedRows={selectedRows}
            selectedRowKeys={selectedRowKeys}
            groupType={'CHARGESTRATEGY'}
            onRefresh={getData}
          />

          <Button onClick={getData}>
            <RedoOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>

    </>
  );
};
export default memo(SearchComponent);

import React, { memo, useState, useEffect } from 'react';
import { connect } from '@/utils/dva';
import { Col, Row, Form, Input, Button, Modal } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import MenuIcon from '@/utils/MenuIcon';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 16 } };
const tailLayout = { wrapperCol: { offset: 6, span: 16 } };

const BatchAddCellModal = (props) => {
  const { dispatch, createMapVisit, extraData } = props;

  const [form] = Form.useForm();
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      name: extraData ? extraData.name : formatMessage({ id: 'app.createMap.mapName' }),
      desc: extraData ? extraData.desc : formatMessage({ id: 'app.createMap.description.testUse' }),
    });
  }, [extraData]);

  const onCancel = () => {
    dispatch({
      type: 'editor/updateModalVisit',
      payload: { type: 'createMapVisit', value: false },
    });
  };

  const onDelete = async () => {
    setDeleteLoading(true);
    await dispatch({
      type: 'editor/fetchDeleteMap',
      payload: extraData.id,
    });
    onCancel();
    setDeleteLoading(false);
  };

  const submit = () => {
    const isUpdate = !!extraData;
    form.validateFields().then(async (value) => {
      const payload = {
        ...value,
        id: isUpdate ? extraData.id : null,
      };
      setSaveLoading(true);
      if (isUpdate) {
        await dispatch({ type: 'editor/fetchUpdateMap', payload });
      } else {
        await dispatch({ type: 'editor/fetchCreateMap', payload });
      }
      onCancel();
      setSaveLoading(false);
    });
  };

  return (
    <Modal
      width={600}
      destroyOnClose
      visible={createMapVisit}
      footer={null}
      onCancel={() => {
        onCancel();
      }}
      title={
        extraData != null
          ? formatMessage({ id: 'app.createMap.updateMap' })
          : formatMessage({ id: 'app.createMap.createMap' })
      }
    >
      <Form form={form}>
        <Form.Item
          {...layout}
          name={'name'}
          label={formatMessage({ id: 'app.createMap.mapName' })}
          rules={[{ required: true, message: formatMessage({ id: 'app.createMap.mapName' }) }]}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item
          {...layout}
          name={'desc'}
          label={formatMessage({ id: 'app.createMap.description' })}
        >
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Row gutter={15}>
            {/* 取消 */}
            <Col>
              <Button onClick={onCancel}>
                <FormattedMessage id="app.leftContent.cancel" />
              </Button>
            </Col>

            {/* 保存 */}
            <Col>
              <Button type="primary" onClick={submit} loading={saveLoading}>
                <FormattedMessage id="app.leftContent.save" />
              </Button>
            </Col>

            {extraData ? (
              <>
                {/* 删除地图 */}
                <Col>
                  <Button
                    type="danger"
                    icon={MenuIcon.delete}
                    onClick={onDelete}
                    loading={deleteLoading}
                  >
                    <FormattedMessage id="app.createMap.deleteMap" />
                  </Button>
                </Col>
                {/* 保存记录 */}
                <Col>
                  <Button
                    onClick={() => {
                      dispatch({
                        type: 'editor/saveMapHistoryVisible',
                        payload: true,
                      });
                    }}
                  >
                    <FormattedMessage id="app.createMap.saveRecord" />
                  </Button>
                </Col>
              </>
            ) : null}
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ editor }) => {
  const { createMapVisit, extraData } = editor.visible;
  return { createMapVisit, extraData };
})(memo(BatchAddCellModal));

import React, { memo, useState } from 'react';
import { Button, Col, Form, Row, Select, message } from 'antd';
import LatentPodUpdater from '../Simulator/LatentPodUpdater';
import { updateLatentPodSize } from '@/services/XIHE';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, isNull, LatentSizeUpdaterValidator, formatMessage } from '@/utils/util';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };

const ResizeLatentPod = () => {
  const [form] = Form.useForm();
  const [resizeAll, setResizeAll] = useState(false);

  function resizePod() {
    form
      .validateFields()
      .then((values) => {
        if (isNull(values.podId) && !resizeAll) return;
        const requestParam = {
          podIds: resizeAll ? [] : values.podId || [],
          isUpdateAllPodSize: resizeAll,
          length: values.size.height,
          width: values.size.width,
        };
        updateLatentPodSize(requestParam).then((response) => {
          if (!dealResponse(response)) {
            message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          } else {
            message.error(formatMessage({ id: 'app.message.operateFailed' }));
          }
        });
      })
      .catch(() => {});
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', marginTop: 8 }}>
      <Form form={form}>
        <Form.Item
          {...layout}
          name={'size'}
          label={formatMessage({ id: 'monitor.pod.podSize' })}
          rules={[{ required: true }, { validator: LatentSizeUpdaterValidator }]}
          initialValue={{ width: 1050, height: 1050 }}
        >
          <LatentPodUpdater showInput angle={0} />
        </Form.Item>
        <Form.Item required={!resizeAll} {...layout} label={formatMessage({ id: 'app.pod.id' })}>
          <Row gutter={10}>
            <Col span={18}>
              <Form.Item noStyle {...layout} name={'podId'} rules={[{ required: !resizeAll }]}>
                <Select
                  allowClear
                  size={'small'}
                  mode="tags"
                  notFoundContent={null}
                  disabled={resizeAll}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button
                size={'small'}
                onClick={() => {
                  setResizeAll(!resizeAll);
                  if (!resizeAll) {
                    form.validateFields();
                    form.setFieldsValue({ podId: ['ALL'] });
                  } else {
                    form.setFieldsValue({ podId: [] });
                  }
                }}
              >
                <FormattedMessage
                  id={resizeAll ? 'app.button.cancel' : 'monitor.view.selectVehicleall'}
                />
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...noLabelLayout}>
          <Button type="primary" onClick={resizePod}>
            <FormattedMessage id="app.button.update" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default memo(ResizeLatentPod);

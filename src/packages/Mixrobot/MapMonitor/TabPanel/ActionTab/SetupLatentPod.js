import React, { memo } from 'react';
import { connect } from 'umi';
import { Form, Divider, InputNumber, Select, Row, Col, Button } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { Permission } from '@/utils/Permission';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };

const SetupLatentPod = (props) => {
  const { dispatch, height, width, sectionId } = props;
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Divider orientation="left">
        {/* 货架尺寸 */}
        <FormattedMessage id="app.monitorOperation.podSize" />
      </Divider>
      <Form.Item
        {...layout}
        name={'podLength'}
        initialValue={height}
        label={formatMessage({ id: 'app.monitorOperation.podLength' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'app.monitorOperation.podLengthMessage' }),
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        {...layout}
        name={'podWidth'}
        initialValue={width}
        label={formatMessage({ id: 'app.monitorOperation.podWidth' })}
        rules={[
          {
            required: true,
            message: formatMessage({ id: 'app.monitorOperation.podWidthMessage' }),
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      {/* 新增货架 */}
      <Permission id="/map/monitor/action/latent/addPod">
        <Divider orientation="left">
          <FormattedMessage id="app.monitorOperation.add" />
        </Divider>
        <Form.Item
          {...layout}
          name={'podId'}
          label={formatMessage({ id: 'app.monitorOperation.podId' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'targetId'}
          label={formatMessage({ id: 'app.monitorOperation.targetCell' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'angle'}
          initialValue={0}
          label={formatMessage({ id: 'app.monitorOperation.angle' })}
        >
          <InputNumber min={0} max={360} />
        </Form.Item>
        <Form.Item
          {...layout}
          zoneIds={'zoneIds'}
          initialValue={undefined}
          label={formatMessage({ id: 'app.monitorOperation.zone' })}
        >
          <Select allowClear mode="tags" style={{ width: '80%' }} />
        </Form.Item>

        <Form.Item {...noLabelLayout}>
          <Row>
            <Col span={12}>
              <Button
                type="primary"
                onClick={() => {
                  form.validateFields().then((value) => {
                    const { podLength, podWidth } = value;
                    if (!podLength || !podWidth) return;
                    dispatch({
                      type: 'monitor/fetchSetPod',
                      payload: {
                        sectionId,
                        length: podLength,
                        width: podWidth,
                        podId: value.podId,
                        cellId: value.targetId,
                        angle: value.angle,
                        zoneIds: value.zoneIds ? value.zoneIds : null,
                      },
                    });
                  });
                }}
              >
                <FormattedMessage id="app.monitorOperation.set" />
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="danger"
                onClick={() => {
                  form.validateFields().then((value) => {
                    dispatch({
                      type: 'monitor/fetchDeletePod',
                      payload: { ...value, sectionId },
                    });
                  });
                }}
              >
                <FormattedMessage id="app.monitorOperation.delete" />
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Permission>

      {/* 批量添加货架 */}
      <Permission id="/map/monitor/action/latent/batchAddPod">
        <Divider orientation="left">
          <FormattedMessage id="app.monitorOperation.addBatch" />
        </Divider>
        <Form.Item
          {...layout}
          name={'podNumber'}
          label={formatMessage({ id: 'app.monitorOperation.podNumber' })}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          {...layout}
          name={'batchAngle'}
          initialValue={0}
          label={formatMessage({ id: 'app.monitorOperation.batchAngle' })}
        >
          <InputNumber min={0} max={360} />
        </Form.Item>
        <Form.Item {...noLabelLayout}>
          <Col span={12}>
            <Button
              onClick={() => {
                form.validateFields().then((value) => {
                  const { podLength, podWidth } = value;
                  if (!podLength || !podWidth) return;
                  dispatch({
                    type: 'monitor/fetchDeletePodAndAddPod',
                    payload: value,
                  });
                });
              }}
            >
              <FormattedMessage id="app.monitorOperation.deleteAndBatchAdd" />
            </Button>
          </Col>
        </Form.Item>
      </Permission>
    </Form>
  );
};
export default connect(() => ({}))(memo(SetupLatentPod));

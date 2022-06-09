import React, { memo, useState } from 'react';
import { Button, Col, Form, InputNumber, message, Row } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import LatentPodUpdater from './LatentPodUpdater';
import { find } from 'lodash';
import { useMap, useMount } from 'ahooks';
import { dealResponse, formatMessage, htmlFormatMessage, LatentSizeUpdaterValidator } from '@/utils/util';
import { hasAppPermission } from '@/utils/Permission';
import { AppCode } from '@/config/config';
import { fetchLatentLiftingSystemParam } from '@/services/monitorService';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };

const ClearPodsAndBatchAdd = (props) => {
  const { dispatch } = props;
  const [form] = Form.useForm();

  const [confirmCode, setConfirmCode] = useState(0);
  const [angle, setAngle] = useState(0);
  const [, { setAll, get: getPodSize }] = useMap([
    ['width', 1050],
    ['height', 1050],
  ]);

  useMount(() => {
    // 获取潜伏车系统参数
    if (hasAppPermission(AppCode.LatentLifting)) {
      fetchLatentLiftingSystemParam({
        language: window.localStorage.getItem('currentLocale'),
      }).then((res) => {
        if (!dealResponse(res)) {
          const runTimePrams = res[0].tabContent;
          const podProps = find(runTimePrams, {
            groupName: formatMessage({ id: 'monitor.operation.podProps' }),
          });
          if (podProps) {
            const data = [];
            podProps.group.forEach((item) => {
              if (item.key === 'pod_width') {
                data.push(['width', item.defaultValue]);
              }
              if (item.key === 'pod_length') {
                data.push(['height', item.defaultValue]);
              }
            });
            if (data.length > 0) {
              setAll(data);
            }
          }
        }
      });
    }
  });

  const getWarnMsg = () => {
    if (confirmCode > 0) {
      return (
        <div>
          <span style={{ color: 'red' }}>
            {htmlFormatMessage(
              { id: 'monitor.simulator.action.clearPodBatchAddWarn' },
              { confirmCode: confirmCode },
            )}
          </span>
          <br />
          <br />
        </div>
      );
    }
  };

  return (
    <div style={{marginTop:20}}>
      <Form form={form} {...layout}>
        <Form.Item
          name={'size'}
          initialValue={{ width: getPodSize('width'), height: getPodSize('height') }}
          label={formatMessage({ id: 'monitor.pod.podSize' })}
          rules={[{ required: true }, { validator: LatentSizeUpdaterValidator }]}
        >
          <LatentPodUpdater showInput angle={angle} />
        </Form.Item>
        <Form.Item
          initialValue={1}
          name={'podNumber'}
          label={formatMessage({ id: 'monitor.pod.podNumber' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'batchAngle'}
          initialValue={0}
          label={formatMessage({ id: 'monitor.pod.batchAngle' })}
          rules={[{ required: true }]}
          getValueFromEvent={(__angle) => {
            setAngle(__angle);
            return __angle;
          }}
        >
          <InputNumber min={0} max={359} />
        </Form.Item>
        <Form.Item
          name={'inputConfirmCode'}
          label={formatMessage({ id: 'monitor.operation.confirmCode' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        {getWarnMsg()}
        <Row>
          <Col span={2} offset={2}>
            <Button
              type="danger"
              onClick={() => {
                if (!confirmCode) {
                  setConfirmCode(Math.floor(Math.random() * 9000 + 1000));
                  return;
                }
                form.validateFields().then((value) => {
                  if (confirmCode !== value.inputConfirmCode) {
                    return;
                  }
                  setConfirmCode(0);
                  form.setFieldsValue({ inputConfirmCode: 0 });
                  const {
                    size: { width, height },
                  } = value;
                  if (!width || !height) return;

                  dispatch({
                    type: 'monitor/fetchDeletePodAndAddPod',
                    payload: {
                      podWidth: width,
                      podLength: height,
                      podNumber: value.podNumber,
                      batchAngle: value.batchAngle,
                    },
                  }).then((result) => {
                    result &&
                      message.success(
                        formatMessage(
                          { id: 'monitor.operation.commandSendSuccessfully' },
                          { type: formatMessage({ id: 'monitor.operation.batchAdd' }) },
                        ),
                      );
                  });
                });
              }}
            >
              <FormattedMessage id="monitor.operation.deleteAndBatchAdd" />
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(() => ({}))(memo(ClearPodsAndBatchAdd));

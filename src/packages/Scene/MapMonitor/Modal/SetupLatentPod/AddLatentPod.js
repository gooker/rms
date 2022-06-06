import React, { memo, useState } from 'react';
import { Button, Col, Form, InputNumber, Row, Select } from 'antd';
import { useMap, useMount } from 'ahooks';
import { find } from 'lodash';
import LatentPodUpdater from '../Simulator/LatentPodUpdater';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, getFormLayout, isNull, LatentSizeUpdaterValidator } from '@/utils/util';
import { hasAppPermission } from '@/utils/Permission';
import { fetchDeletePod, fetchLatentLiftingSystemParam, fetchSetPod } from '@/services/monitorService';
import { AppCode } from '@/config/config';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const AddLatentPod = () => {
  const [form] = Form.useForm();
  const [angle, setAngle] = useState(0);

  const sectionId = window.localStorage.getItem('sectionId');

  const [, { setAll, get: getPodSize }] = useMap([
    ['width', 1050],
    ['height', 1050],
  ]);

  useMount(() => {
    // 获取潜伏车到站信息和暂停消息
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

  function addSubmit() {
    form
      .validateFields()
      .then((value) => {
        const {
          size: { width, height },
        } = value;
        if (!width || !height) return;
        const params = {
          sectionId,
          width,
          length: height,
          podId: value.podId,
          cellId: value.targetId,
          angle: value.angle,
          zoneIds: value.zoneIds ? value.zoneIds : null,
        };

        addPod([params]);
      })
      .catch(() => {});
  }

  async function addPod(params) {
    const result = await fetchSetPod(params);
    dealResponse(result, true);
  }

  async function deletePod() {
    const podId = form.getFieldValue('podId');
    if (!isNull(podId)) {
      const response = await fetchDeletePod({ podId, sectionId });
      dealResponse(response, true);
    }
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', marginTop: 8 }}>
      <Form form={form} {...formItemLayout}>
        <Form.Item
          name={'size'}
          label={formatMessage({ id: 'monitor.pod.podSize' })}
          rules={[{ required: true }, { validator: LatentSizeUpdaterValidator }]}
          initialValue={{ width: getPodSize('width'), height: getPodSize('height') }}
        >
          <LatentPodUpdater showInput angle={angle} />
        </Form.Item>
        <Form.Item required label={formatMessage({ id: 'app.pod.id' })}>
          <Row>
            <Col>
              <Form.Item noStyle name={'podId'} rules={[{ required: true }]}>
                <InputNumber />
              </Form.Item>
            </Col>
            <Col>
              <Button type="danger" onClick={deletePod} style={{ marginLeft: 15 }}>
                <FormattedMessage id="app.button.delete" />
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          name={'targetId'}
          label={formatMessage({ id: 'app.common.targetCell' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'angle'}
          initialValue={0}
          label={formatMessage({ id: 'app.direction' })}
          rules={[{ required: true }]}
          getValueFromEvent={(value) => {
            setAngle(value);
            return value;
          }}
        >
          <InputNumber min={0} max={359} step={1} />
        </Form.Item>
        <Form.Item
          name={'zoneIds'}
          initialValue={undefined}
          label={formatMessage({ id: 'app.map.zone' })}
        >
          <Select allowClear mode="tags" style={{ width: '80%' }} />
        </Form.Item>
        <Form.Item {...formItemLayoutNoLabel}>
          <Button type="primary" onClick={addSubmit}>
            <FormattedMessage id="monitor.operation.set" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default memo(AddLatentPod);

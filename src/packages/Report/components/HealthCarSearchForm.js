import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { fetchActiveMap, fetchCustomParamType } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import SelectCarType from '../HealthReport/AgvHealth/components/SelectCarType';
import DatePickerSelector from '@/packages/Report/components/DatePickerSelector';

const LogSearchForm = (props) => {
  const { search, type, downloadVisible, allTaskTypes, exportData } = props;

  const [form] = Form.useForm();
  const [optionsData, setOptionsData] = useState([
    {
      code: 'AGV_ID',
      name: <FormattedMessage id='customTask.form.SPECIFY_AGV' />,
      value: {},
    },
    {
      code: 'AGV_GROUP',
      name: <FormattedMessage id='customTask.form.SPECIFY_GROUP' />,
      value: {},
    },
    {
      code: 'AGV_TYPE',
      name: <FormattedMessage id="app.common.type" />,
      value: {
        LatentLifting: formatMessage({ id: 'app.agvType.LatentLifting' }),
        Sorter: formatMessage({ id: 'app.agvType.Sorter' }),
      },
    },
  ]);

  useEffect(() => {
    async function init() {
      const mapData = await fetchActiveMap();
      if (!dealResponse(mapData)) {
        if (isNull(mapData)) return;
        const { id } = mapData;
        const modelTypes = await fetchCustomParamType({ mapId: id });
        if (!dealResponse(modelTypes)) {
          const optionsData = [
            {
              code: 'AGV_ID',
              name: <FormattedMessage id='customTask.form.SPECIFY_AGV' />,
              value: {},
            },
            {
              code: 'AGV_GROUP',
              name: <FormattedMessage id='customTask.form.SPECIFY_GROUP' />,
              value: modelTypes?.AGV_GROUP.options ?? {},
            },
            {
              code: 'AGV_TYPE',
              name: <FormattedMessage id="app.common.type" />,
              value: {
                LatentLifting: formatMessage({ id: 'app.agvType.LatentLifting' }),
                Sorter: formatMessage({ id: 'app.agvType.Sorter' }),
              },
            },
          ];
          setOptionsData(optionsData);
        }
      }
    }
    init();
  }, []);

  function submitSearch() {
    form
      .validateFields()
      .then((values) => {
        const currentValues = { ...values };
        const { timeRange } = currentValues;
        if (!isNull(timeRange)) {
          currentValues.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss');
          currentValues.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss');
        }
        delete currentValues.timeRange;
        search && search(currentValues);
      })
      .catch(() => {});
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Form.Item hidden name={'startTime'} />
        <Form.Item hidden name={'endTime'} />

        {/* 日期 */}
        <Col span={12}>
          <Form.Item
            name="timeRange"
            label={<FormattedMessage id="app.form.dateRange" />}
            rules={[
              {
                required: true,
                message: <FormattedMessage id="reportCenter.time.required" />,
              },
            ]}
          >
            <DatePickerSelector />
          </Form.Item>
        </Col>

        {/* 小车 */}
        <Col span={12}>
          <Form.Item
            name={'agvSearch'}
            label={<FormattedMessage id="app.agv" />}
            initialValue={{ type: 'AGV_ID', code: [] }}
          >
            <SelectCarType data={optionsData} />
          </Form.Item>
        </Col>

        {type === 'taskload' ? (
          <Col span={12}>
            <Form.Item name={'taskType'} label={<FormattedMessage id="app.task.type" />}>
              <Select allowClear style={{ width: 200 }}>
                {Object.keys(allTaskTypes).map((type) => (
                  <Select.Option key={type} value={type}>
                    {allTaskTypes[type]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        ) : (
          <Col span={12} />
        )}

        <Col span={12}>
          <Form.Item>
            <Button type="primary" onClick={submitSearch}>
              <FormattedMessage id="app.button.search" />
            </Button>

            {downloadVisible && (
              <Button
                style={{ marginLeft: 15 }}
                onClick={() => {
                  exportData ? exportData() : '';
                }}
              >
                <FormattedMessage id="reportCenter.sourceData.download" />
              </Button>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global?.allTaskTypes?.LatentLifting || {},
}))(memo(LogSearchForm));

import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { fetchActiveMap, fetchCustomParamType } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, isNull } from '@/utils/util';
import VehicleComponent from './VehicleComponent';
import DatePickerSelector from '@/packages/Report/components/DatePickerSelector';

const HealthCarSearchForm = (props) => {
  const { search, type, downloadVisible, allTaskTypes, exportData } = props;

  const [form] = Form.useForm();
  const [optionsData, setOptionsData] = useState({ vehicle: [], vehicleGroup: [] });

  useEffect(() => {
    async function init() {
      const mapData = await fetchActiveMap();
      if (!dealResponse(mapData)) {
        if (isNull(mapData)) return;
        const { id } = mapData;
        const modelTypes = await fetchCustomParamType({ mapId: id });
        if (!dealResponse(modelTypes)) {
          const dataSource = { vehicle: [], vehicleGroup: [] };
          dataSource.vehicle = modelTypes?.VEHICLE || [];
          dataSource.vehicleGroup = modelTypes?.VEHICLE_GROUP || [];
          setOptionsData(dataSource);
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
        <Col span={10}>
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
        <Col span={14}>
          <Form.Item
            name={'vehicleSearch'}
            label={<FormattedMessage id="app.vehicle" />}
            initialValue={{ type: 'Vehicle_ID', code: [] }}
          >
            <VehicleComponent dataSource={optionsData} />
          </Form.Item>
        </Col>

        {type === 'taskload' ? (
          <Col span={12}>
            <Form.Item name={'taskType'} label={<FormattedMessage id='app.task.name' />}>
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
}))(memo(HealthCarSearchForm));

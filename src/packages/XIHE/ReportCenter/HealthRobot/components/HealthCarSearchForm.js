import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { getFormModelTypes, fetchActiveMap } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import SelectCarType from './SelectCarType';
import DatePickerSelector from '../../components/DatePickerSelector';

const formLayout = { labelCol: { span: 9 }, wrapperCol: { span: 14 } };
const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };


const LogSearchForm = (props) => {
  const { search, type, downloadVisible, allTaskTypes, exportData } = props;

  const [form] = Form.useForm();
  const [optionsData, setOptionsData] = useState([
    {
      code: 'AGV_ID',
      name: <FormattedMessage id="app.customTask.form.SPECIFY_AGV" />,
      value: {},
    },
    {
      code: 'AGV_GROUP',
      name: <FormattedMessage id="app.customTask.form.SPECIFY_GROUP" />,
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
        const modelTypes = await getFormModelTypes({ mapId: id });
        if (!dealResponse(modelTypes)) {
          const optionsData = [
            {
              code: 'AGV_ID',
              name: <FormattedMessage id="app.customTask.form.SPECIFY_AGV" />,
              value: {},
            },
            {
              code: 'AGV_GROUP',
              name: <FormattedMessage id="app.customTask.form.SPECIFY_GROUP" />,
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
    form.validateFields().then((values) => {
      const currentValues = { ...values };
      const { timeRange } = currentValues;
      if (!isNull(timeRange)) {
        currentValues.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:00');
        currentValues.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:00');
      }
      delete currentValues.timeRange;
      search && search(currentValues);
    });
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Form.Item hidden name={'startTime'} />
        <Form.Item hidden name={'endTime'} />
        {/* 日期 */}
        <Col flex="auto">
          <Form.Item
            label={<FormattedMessage id="app.form.dateRange" />}
            name="timeRange"
            getValueFromEvent={(value) => {
              return value;
            }}
          >
            <DatePickerSelector />
          </Form.Item>
        </Col>

        <Col>
          {/* 分小车 */}
          <Form.Item
            name={'agvSearch'}
            label={<FormattedMessage id="app.agv" />}
            initialValue={{ type: 'AGV_ID', code: [] }}
          >
            <SelectCarType data={optionsData} />
          </Form.Item>
        </Col>
        {type === 'taskload' && (
          <Col>
            <Form.Item
              name={'taskType'}
              label={<FormattedMessage id="app.task.type" />}
              {...formLayout}
            >
              {/* mode="multiple" */}
              <Select allowClear style={{ width: 200 }}>
                {Object.keys(allTaskTypes).map((type) => (
                  <Select.Option key={type} value={type}>
                    {allTaskTypes[type]}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        <Col offset={1}>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button type="primary" onClick={submitSearch}>
                <FormattedMessage id="app.button.search" />
              </Button>
            </Row>
          </Form.Item>
        </Col>
        {downloadVisible && (
          <Col>
            <Form.Item {...NoLabelFormLayout}>
              <Row justify="end">
                <Button
                  onClick={() => {
                    exportData ? exportData() : '';
                  }}
                >
                  <FormattedMessage id="reportCenter.sourceData.download" />
                </Button>
              </Row>
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global?.allTaskTypes?.LatentLifting || {},
}))(memo(LogSearchForm));

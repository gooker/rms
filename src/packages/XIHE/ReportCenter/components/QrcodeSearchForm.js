import React, { memo } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import XLSX from 'xlsx';
import { forIn } from 'lodash';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull, formatMessage, isStrictNull } from '@/utils/util';
import DatePickerSelector from './DatePickerSelector';

const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

const colums = {
  agvId: formatMessage({ id: 'app.agv.id' }),
  period: formatMessage({ id: 'app.time' }),
  robotType: formatMessage({ id: 'app.agv.type' }),
};

const QrcodeSearchComponent = (props) => {
  const { search, name, sourceData } = props;

  const [form] = Form.useForm();

  function submitSearch() {
    form.validateFields().then((values) => {
      const currentValues = { ...values };
      const { timeRange } = currentValues;
      if (!isNull(timeRange)) {
        currentValues.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss');
        currentValues.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss');
      }
      delete currentValues.timeRange;
      search(currentValues);
    });
  }

  function generateEveryType(allData, type) {
    const typeResult = [];
    Object.entries(sourceData).forEach(([key, typeData]) => {
      if (!isStrictNull(typeData)) {
        typeData.forEach((record) => {
          let currentTime = {};
          let _record = { ...record };
          currentTime[colums.agvId] = record.agvId;
          currentTime[colums.period] = record.period;
          currentTime[colums.robotType] = record.robotType;
          if (!isNull(type)) {
            _record = { ...record[type] };
          }
          forIn(_record, (value, parameter) => {
            currentTime[parameter] = value;
          });
          typeResult.push(currentTime);
        });
      }
    });
    return typeResult;
  }

  function exportData() {
    const wb = XLSX.utils.book_new(); /*新建book*/
    const statusWs = XLSX.utils.json_to_sheet(generateEveryType(sourceData));
    XLSX.utils.book_append_sheet(wb, statusWs, 'common');
    XLSX.writeFile(wb, `${name}.xlsx`);
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={8}>
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

        <Col span={6}>
          <Form.Item name={'code'} label={<FormattedMessage id="app.common.code" />}>
            <Select mode="tags" style={{ width: '100%' }} maxTagTextLength={5} maxTagCount={4} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button type="primary" onClick={submitSearch}>
                <FormattedMessage id="app.button.search" />
              </Button>
            </Row>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button onClick={exportData}>
                <FormattedMessage id="reportCenter.sourceData.download" />
              </Button>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(QrcodeSearchComponent);

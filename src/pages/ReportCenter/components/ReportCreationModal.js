import React, { memo, useState } from 'react';
import moment from 'moment';
import { Button, Divider, message, DatePicker, Form, Input, Radio, Select, Spin } from 'antd';
import { dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ReportConfigurationOfTime from '@/pages/ReportCenter/components/ReportConfigurationOfTime';
import { fetchReportSourceDetail } from '@/services/api';

const { RangePicker } = DatePicker;
const formLayout = getFormLayout(6, 18);

const ReportCreationModal = (props) => {
  const { creationLoading, agvType, source } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sourceDetail, setSourceDetail] = useState({});

  async function changeDataSource(sourceId) {
    setLoading(true);
    const response = await fetchReportSourceDetail(agvType, sourceId);
    if (
      !dealResponse(
        response,
        null,
        `${formatMessage(
          { id: 'app.message.fetchFailTemplate' },
          { type: formatMessage({ id: 'app.reportCenter.report.dataSource' }) },
        )}`,
      )
    ) {
      setSourceDetail(response);
    }
    setLoading(false);
  }

  function renderDimensionality(records) {
    if (isNull(records)) return null;

    const type = formRef.getFieldValue('type');
    if (isNull(type)) return null;

    return records.map((record, index) => {
      if (type === 'pie' && index > 0) {
        return null;
      }
      if (index > 1) {
        return null;
      }
      return (
        <Form.Item
          key={index}
          label={
            <FormattedMessage id="app.reportCenter.indexDimension" values={{ index: index + 1 }} />
          }
        >
          <Form.Item noStyle name={`dimensionalitys${index + 1}`}>
            <Radio.Group>
              {records.map((record) => (
                <Radio key={record.value} value={record.value}>
                  {record.name}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form.Item>
      );
    });
  }

  function renderFilters(filters) {
    if (isNull(filters)) return null;

    return filters.map((record, index) => {
      const { type } = record;
      return (
        <Form.Item key={index} label={<span>{record.name}</span>}>
          <Form.Item noStyle name={`filters_${record.field}&${type}`}>
            {type === 'date' ? (
              <RangePicker />
            ) : (
              <Select mode="multiple" allowClear>
                {record.options.map((record) => (
                  <Select.Option value={record.value} key={record.value}>
                    {record.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form.Item>
      );
    });
  }

  function createReport() {
    formRef.validateFields().then(async (values) => {
      const params = {
        filters: [],
        dimensionality: [],
        datePattern: values.date.dateType,
        relativeDay: values.date.number,
      };

      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          const element = values[key];
          if (!key.includes('filters_')) {
            if (!key.includes('dimensionalitys')) {
              params[key] = element;
            } else {
              if (element != null) {
                params.dimensionality.push(element);
              }
            }
          } else {
            if (element != null) {
              const objs = {};
              const newKey = key.split('filters_')[1].split('&')[0];
              if (key.split('&')[1] === 'date') {
                objs[newKey] = [
                  new moment(element[0]).format('YYYY-MM-DD'),
                  new moment(element[1]).format('YYYY-MM-DD'),
                ];
                params.filters.push(objs);
              } else {
                objs[newKey] = element;
                params.filters.push(objs);
              }
            }
          }
        }
      }
      if (params.dimensionality.length === 0) {
        message.warn(formatMessage({ id: 'app.reportCenter.dimensionality.required' }));
        return false;
      } else if (params.dimensionality.length === 2) {
        if (params.dimensionality[0] === params.dimensionality[1]) {
          message.warn(formatMessage({ id: 'form.reportCenter.dimensionality.cannotSame' }));
          return false;
        }
      }
      params.countValue = sourceDetail.countValue;
      props.createReport(params);
    });
  }

  return (
    <Form form={formRef} {...formLayout.formItemLayout}>
      <Form.Item
        name={'name'}
        label={formatMessage({ id: 'app.reportCenter.report.name' })}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'type'}
        label={formatMessage({ id: 'app.reportCenter.report.type' })}
        rules={[{ required: true }]}
      >
        <Select
          onChange={() => {
            setSourceDetail({ ...sourceDetail });
          }}
        >
          <Select.Option value="pie">
            <FormattedMessage id="app.reportCenter.report.type.pie" />
          </Select.Option>
          <Select.Option value="bar">
            <FormattedMessage id="app.reportCenter.report.type.bar" />
          </Select.Option>
          <Select.Option value="line">
            <FormattedMessage id="app.reportCenter.report.type.line" />
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name={'data'}
        label={formatMessage({ id: 'app.reportCenter.report.dataSource' })}
        rules={[{ required: true }]}
      >
        <Select onChange={changeDataSource}>
          {source.map((record) => (
            <Select.Option key={record.id} value={record.id}>
              {record.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={'date'}
        label={formatMessage({ id: 'app.time' })}
        rules={[
          { required: true },
          () => ({
            validator(_, value) {
              if (value) {
                if (isNull(value.number)) {
                  return Promise.reject(
                    new Error(formatMessage({ id: 'app.reportCenter.recently.required' })),
                  );
                } else {
                  return Promise.resolve();
                }
              } else {
                return Promise.resolve();
              }
            },
          }),
        ]}
        initialValue={{ number: 1, dateType: 'day' }}
      >
        <ReportConfigurationOfTime />
      </Form.Item>

      {/* 渲染维度 */}
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin spinning={true} />
        </div>
      ) : (
        renderDimensionality(sourceDetail.dimensionality)
      )}

      <Divider orientation="left">
        <FormattedMessage id="app.reportCenter.filterCondition" />
      </Divider>

      {/* 筛选条件 */}
      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin spinning={true} />
        </div>
      ) : (
        renderFilters(sourceDetail.filters)
      )}

      <Form.Item {...formLayout.formItemLayoutNoLabel}>
        <Button
          type="primary"
          loading={creationLoading}
          onClick={createReport}
          disabled={creationLoading}
        >
          <FormattedMessage id="app.button.submit" />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default memo(ReportCreationModal);

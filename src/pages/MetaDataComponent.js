import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import { Button, Card, DatePicker, Form, Select } from 'antd';
import { convertToUserTimezone, dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/util';
import { DownloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { downloadLogFromSFTP, fetchAllVehicleList } from '@/services/commonService';
import commonStyle from '@/common.module.less';

const { RangePicker } = DatePicker;
const formLayout = getFormLayout(4, 16);

const MetaDataComponent = (props) => {
  const { vehicleType } = props;

  const [formRef] = Form.useForm();
  const [vehicleList, setVehicleList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllVehicleList().then((response) => {
      if (
        !dealResponse(
          response,
          false,
          null,
          formatMessage({ id: 'app.message.fetchVehicleListFail' }),
        )
      ) {
        setVehicleList(response);
      }
    });
  }, []);

  function exportData() {
    formRef.validateFields().then(async ({ vehicleIds, createDate }) => {
      setLoading(true);
      const requestParam = {
        vehicleIds,
        startDate: convertToUserTimezone(createDate[0]).format('YYYY-MM-DD HH:mm:ss'),
        endDate: convertToUserTimezone(createDate[1]).format('YYYY-MM-DD HH:mm:ss'),
      };
      const response = await downloadLogFromSFTP(vehicleType, requestParam);
      dealResponse(
        response,
        false,
        null,
        `${formatMessage(
          { id: 'app.message.fetchFailTemplate' },
          { type: formatMessage({ id: 'menu.formManger.metadata' }) },
        )}`,
      );
      setLoading(false);
    });
  }

  // 日期范围不能超过7天
  const disabledDate = (current) => {
    const dates = formRef.getFieldValue('createDate');
    if (!dates || dates.length === 0) {
      return false;
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 7;
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 7;
    return tooEarly || tooLate;
  };

  return (
    <div className={commonStyle.commonPageStyle}>
      <Card
        hoverable
        style={{ width: 600, border: '1px solid #e8e8e8' }}
        title={<FormattedMessage id={'app.metaData.vehicleOffsetData'} />}
        actions={[
          <Button key='a' type={'link'} onClick={exportData} loading={loading} disabled={loading}>
            <DownloadOutlined /> <FormattedMessage id='app.button.download' />
          </Button>,
        ]}
        bordered={false}
        bodyStyle={{ paddingBottom: 0 }}
      >
        <Form {...formLayout.formItemLayout} form={formRef}>
          <Form.Item
            name={'vehicleIds'}
            label={formatMessage({ id: 'vehicle.id' })}
            rules={[{ required: true }]}
          >
            <Select allowClear showSearch mode="multiple" maxTagCount={5} maxTagTextLength={4}>
              {vehicleList.map(({ vehicleId }) => (
                <Select.Option value={vehicleId} key={vehicleId}>
                  {vehicleId}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={'createDate'}
            label={formatMessage({ id: 'app.form.timeRange' })}
            initialValue={[moment().startOf('day'), new moment()]}
            rules={[
              { required: true },
              () => ({
                validator(_, value) {
                  if (value) {
                    if (isNull(value[0]) || isNull(value[1])) {
                      return Promise.reject(
                        new Error(formatMessage({ id: 'app.metaData.rangeNotValid' })),
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
          >
            <RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              onCalendarChange={(val) => formRef.setFieldsValue({ createDate: val })}
              onChange={(val) => formRef.setFieldsValue({ createDate: val })}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default memo(MetaDataComponent);

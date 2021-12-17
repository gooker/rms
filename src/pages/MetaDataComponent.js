import React, { memo, useEffect, useState } from 'react';
import moment from 'moment';
import { Card, Select, DatePicker, Form, Button } from 'antd';
import {
  dealResponse,
  formatMessage,
  getFormLayout,
  GMT2UserTimeZone,
  isNull,
} from '@/utils/utils';
import { DownloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { downloadLogFromSFTP, fetchAgvList } from '@/services/api';
import commonStyle from '@/common.module.less';

const { RangePicker } = DatePicker;
const formLayout = getFormLayout(4, 16);

const MetaDataComponent = (props) => {
  const { agvType } = props;

  const [formRef] = Form.useForm();
  const [agvList, setAgvList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgvList(agvType).then((response) => {
      if (
        !dealResponse(response, false, null, formatMessage({ id: 'app.message.fetchAgvListFail' }))
      ) {
        setAgvList(response);
      }
    });
  }, []);

  function exportData() {
    formRef.validateFields().then(async ({ agvIds, createDate }) => {
      setLoading(true);
      const requestParam = {
        agvIds,
        startDate: GMT2UserTimeZone(createDate[0]).format('YYYY-MM-DD HH:mm:ss'),
        endDate: GMT2UserTimeZone(createDate[1]).format('YYYY-MM-DD HH:mm:ss'),
      };
      const response = await downloadLogFromSFTP(agvType, requestParam);
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
    <div className={commonStyle.tablePageWrapper}>
      <Card
        hoverable
        style={{ width: 600, border: '1px solid #e8e8e8' }}
        title={<FormattedMessage id={'app.metaData.agvOffsetData'} />}
        actions={[
          <Button key="a" type={'link'} onClick={exportData} loading={loading} disabled={loading}>
            <DownloadOutlined /> <FormattedMessage id="app.button.export" />
          </Button>,
        ]}
        bordered={false}
        bodyStyle={{ paddingBottom: 0 }}
      >
        <Form {...formLayout.formItemLayout} form={formRef}>
          <Form.Item
            name={'agvIds'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <Select allowClear showSearch mode="multiple" maxTagCount={5} maxTagTextLength={4}>
              {agvList.map(({ robotId }) => (
                <Select.Option value={robotId} key={robotId}>
                  {robotId}
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

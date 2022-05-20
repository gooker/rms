import React, { memo, useState } from 'react';
import { message, Button, Row, Col, DatePicker } from 'antd';
import { isStrictNull, formatMessage, getDomainNameByUrl } from '@/utils/util';
import { NameSpace } from '@/config/config';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;

const DownLoadMRV = (props) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  function handleDateRangeChanged(value, dateString) {
    const startTime = new Date(value[0].format('YYYY-MM-DD HH:mm')).getTime();
    const endTime = new Date(value[1].format('YYYY-MM-DD HH:mm')).getTime();
    setStartTime(startTime);
    setEndTime(endTime);
  }

  async function handleSubmit() {
    if (isStrictNull(startTime) || isStrictNull(endTime)) {
      message.error(formatMessage({ id: 'app.monitor.download.time.required' }));
      return;
    }
    const sectionId = window.localStorage.getItem('sectionId');
    const _startTime = startTime ?? '';
    const _endTime = endTime ?? '';
    const unzipURL = `/${NameSpace.Platform}/traffic/getRcsHistoryGZip?sectionId=${sectionId}&startTime=${_startTime}&endTime=${_endTime}&type=`;
    const url = getDomainNameByUrl(unzipURL);
    window.open(url);
  }

  return (
    <div>
      <Row>
        <Col>
          <RangePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD HH:mm"
            showTime={{ format: 'HH:mm' }}
            onChange={handleDateRangeChanged}
          />
        </Col>
      </Row>

      <Row type="flex" justify="end" style={{ marginTop: 25 }}>
        <Button type="primary" onClick={handleSubmit}>
          <FormattedMessage id="app.button.confirm" />
        </Button>
      </Row>
    </div>
  );
};
export default memo(DownLoadMRV);

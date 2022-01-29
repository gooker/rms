import React, { memo, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import TimeZone from '@/components/TimeZone';
import { fetchSystemParamByKey, updateSystemParams } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import { dealResponse, formatMessage } from '@/utils/util';

const SystemParamsTimeZone = () => {
  const [timeZone, setTimeZone] = useState(null);

  useEffect(() => {
    async function init() {
      await fetchData();
    }
    init();
  }, []);

  async function fetchData() {
    const response = await fetchSystemParamByKey('client_timezone_id');
    if (!dealResponse(response)) {
      setTimeZone(response);
    }
  }

  async function submit() {
    const response = await updateSystemParams('Coordinator', {
      client_timezone_id: timeZone,
    });
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      fetchData();
    }
  }
  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ textAlign: 'end', marginBottom: '10px' }}>
        <Button onClick={fetchData}>
          <FormattedMessage id="app.button.refresh" />
        </Button>
        <Button type="primary" onClick={submit} style={{ marginLeft: '10px' }}>
          <FormattedMessage id="app.button.submit" />
        </Button>
      </div>
      <TimeZone
        value={timeZone}
        defaultValue={timeZone}
        onChange={(value) => {
          setTimeZone(value);
        }}
      />
    </div>
  );
};
export default memo(SystemParamsTimeZone);

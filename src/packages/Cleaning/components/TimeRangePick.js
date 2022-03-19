import React, { useState, useEffect } from 'react';
import { TimePicker } from 'antd';
import { formatMessage } from '@/utils/util';

const TimeRangePick = (props) => {
  const { value } = props;
  const [startDate, setStartDate] = useState(value ? value[0] : null);
  const [endDate, setEndDate] = useState(value ? value[1] : null);
  useEffect(() => {
    const { onChange } = props;
    if (onChange) {
      onChange([startDate, endDate]);
    }
  }, [startDate, endDate]);
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flex: 1,
      }}
    >
      <div>
        <TimePicker
          placeholder={formatMessage({ id: 'app.taskDetail.startTime' })}
          value={startDate}
          disabledHours={() => {
            const result = [];
            if (endDate != null && endDate.hours) {
              for (let index = 0; index < 23; index++) {
                if (index > endDate.hours()) {
                  result.push(index);
                }
              }
              return result;
            }
            return [];
          }}
          disabledMinutes={(selectedHour) => {
            const result = [];
            if (endDate != null && endDate.hours) {
              if (selectedHour === endDate.hours()) {
                for (let index = 0; index < 60; index++) {
                  if (index > endDate.minutes()) {
                    result.push(index);
                  }
                }
                return result;
              } else {
                return [];
              }
            }
          }}
          onChange={(value) => {
            setStartDate(value);
          }}
          format="HH:mm"
        />
      </div>
      <div style={{ padding: '0 10px' }}>-</div>
      <div>
        <TimePicker
          placeholder={formatMessage({ id: 'app.taskDetail.endTime' })}
          value={endDate}
          disabledHours={() => {
            const result = [];
            if (startDate != null && startDate.hours) {
              for (let index = 0; index < 23; index++) {
                if (index < startDate.hours()) {
                  result.push(index);
                }
              }
              return result;
            }
            return [];
          }}
          disabledMinutes={(selectedHour) => {
            const result = [];
            if (startDate != null && startDate.hours) {
              if (selectedHour == startDate.hours()) {
                for (let index = 0; index < 60; index++) {
                  if (index < startDate.minutes()) {
                    result.push(index);
                  }
                }
                return result;
              } else {
                return [];
              }
            }
          }}
          onChange={(value) => {
            setEndDate(value);
          }}
          format="HH:mm"
        />
      </div>
    </div>
  );
};
export default TimeRangePick;

import React, { PureComponent } from 'react';
import moment from 'moment';
import { Checkbox, Tooltip, DatePicker, Select } from 'antd';
import { connect } from '@/utils/RcsDva';

import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../TaskKpi.module.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ global }) => ({
  latentTaskTypes: global.allTaskTypes.LatentLifting || {},
}))
class KpiSearchConditions extends PureComponent {
  render() {
    const {
      startTime,
      endTime,
      isBaseHour,
      taskType,
      targetCells,
      changeIsBaseHour,
      searchTaskTypeChanged,
      dataRangePickerChanged,
      searchTargetCellChanged,
      latentTaskTypes,
    } = this.props;
    const MomentRangeFormat = isBaseHour ? 'YYYY-MM-DD HH:00:00' : 'YYYY-MM-DD HH:mm:ss';
    let RangePickerValue = [];
    if (startTime || endTime) {
      RangePickerValue = [moment(startTime, MomentRangeFormat), moment(endTime, MomentRangeFormat)];
    } else {
      RangePickerValue = [];
    }

    const TaskTypes = Object.entries(latentTaskTypes).map(([value, label]) => ({ value, label }));
    TaskTypes.unshift({ label: formatMessage({ id: 'app.common.all' }), value: 'ALL' });
    return (
      <div className={styles.inputor}>
        {isBaseHour ? (
          <RangePicker
            value={RangePickerValue}
            style={{ width: '375px' }}
            format={MomentRangeFormat}
            showTime={{ format: 'HH' }}
            onChange={dataRangePickerChanged}
            renderExtraFooter={() => (
              <Checkbox checked={isBaseHour} onChange={changeIsBaseHour}>
                <FormattedMessage id="app.report.baseHour" />
              </Checkbox>
            )}
          />
        ) : (
          <RangePicker
            value={RangePickerValue}
            style={{ width: '375px' }}
            format={MomentRangeFormat}
            showTime={{ format: 'HH:mm:ss' }}
            onChange={dataRangePickerChanged}
            renderExtraFooter={() => (
              <Checkbox checked={isBaseHour} onChange={changeIsBaseHour}>
                <FormattedMessage id="app.report.baseHour" />
              </Checkbox>
            )}
          />
        )}
        <Select
          value={taskType}
          placeholder={formatMessage({ id: 'app.task.type' })}
          defaultValue={'ALL'}
          defaultActiveFirstOption
          style={{ width: '125px' }}
          onChange={searchTaskTypeChanged}
        >
          {TaskTypes.map((taskType, index) => (
            <Option key={index} value={taskType.value}>
              <Tooltip title={taskType.value}>{taskType.label}</Tooltip>
            </Option>
          ))}
        </Select>
        <Select
          allowClear
          mode="tags"
          maxTagCount={4}
          value={targetCells}
          notFoundContent={null}
          style={{ width: '300px' }}
          onChange={searchTargetCellChanged}
          placeholder={formatMessage({ id: 'app.map.targetCell' })}
          disabled={taskType === 'ALL'} // 这里之所以设置 "全部类型" 时无法输入目标点是因为考虑到目前版本对比功能。对比的前提是 相同类型 && 都不是按小时，其次就是如果输入了点位那么x轴就变成目标点了，这里会导致要重复判断已选择的 "所有类型" 的savedSeed是否有目标点，不符合当前版本的功能范围
        />
      </div>
    );
  }
}
export default KpiSearchConditions;

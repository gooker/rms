import React, { memo } from 'react';
import { Col, Row, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { isStrictNull, isSubArray } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { VehicleOptionType } from '@/packages/SmartTask/CustomTask/components/VehicleSelector';

const TargetSelector = (props) => {
  const { dataSource, vehicleSelection, value, onChange, limit } = props;
  const currentValue = value || { type: null, code: [] }; // {type:xxx, code:[]}

  function onTypeChange(_value) {
    currentValue.type = _value;
    currentValue.code = [];
    onChange({ ...currentValue });
  }

  function onCodeChange(_value) {
    currentValue.code = _value ?? [];
    onChange({ ...currentValue });
  }

  // 第二个下拉框选项
  function renderSecondaryOptions() {
    if (currentValue.type) {
      // 如果选择的载具, 则需要与对应的车型进行筛选
      let isAuto =
        vehicleSelection.type === VehicleOptionType.VEHICLE && vehicleSelection.code.length === 0;
      isAuto = isAuto || vehicleSelection.type === VehicleOptionType.AUTO;
      if (['LOAD', 'LOAD_GROUP'].includes(currentValue.type) && !isAuto) {
        // 获取分车所支持的所有的载具类型
        let validLoadTypes = [];
        if (
          vehicleSelection.type === VehicleOptionType.VEHICLE &&
          vehicleSelection.code.length > 0
        ) {
          const vehicleType = dataSource.VEHICLE?.filter((item) =>
            item.ids.includes(vehicleSelection.code[0]),
          );
          validLoadTypes = validLoadTypes.concat(vehicleType[0]?.types || []);
        }
        if (
          vehicleSelection.type === VehicleOptionType.VEHICLE_GROUP &&
          vehicleSelection.code.length > 0
        ) {
          if (Array.isArray(dataSource.Vehicle_GROUP)) {
            for (const item of dataSource.Vehicle_GROUP) {
              if (vehicleSelection.code.includes(item.code)) {
                validLoadTypes.push(...(item.types ?? []));
              }
            }
          }
        }

        // 生成返回值
        if (currentValue.type === 'LOAD') {
          return validLoadTypes.map((loadType) => (
            <Select.Option key={loadType} value={loadType}>
              {loadType}
            </Select.Option>
          ));
        } else {
          // 对 dataSource的LOAD_GROUP进行筛选，LOAD_GROUP所有数据的types必须为validLoadTypes的子集
          const loadGroup = dataSource.LOAD_GROUP?.filter((item) =>
            isSubArray(item.types, validLoadTypes),
          );
          return loadGroup.map(({ code }) => (
            <Select.Option key={code} value={code}>
              {code}
            </Select.Option>
          ));
        }
      }
      if (currentValue.type.endsWith('_GROUP')) {
        return dataSource[currentValue.type]?.map(({ name, code }) => (
          <Select.Option key={name} value={code}>
            {name}
          </Select.Option>
        ));
      }
      return dataSource[currentValue.type]?.map(({ name, ids }, index) => {
        return (
          <Select.OptGroup key={index} label={name}>
            {Array.isArray(ids) &&
              ids.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
          </Select.OptGroup>
        );
      });
    }
    return [];
  }

  function renderSelectOptions() {
    let data = TargetSelectorOptions;
    if (!isStrictNull(limit)) {
      let _limit = limit;
      if (_limit.endsWith('_GROUP')) {
        _limit.replace('_GROUP', '');
      }
      data = data.filter((item) => item.value.startsWith(_limit));
    }
    return data.map(({ value, label }) => (
      <Select.Option key={value} value={value}>
        <FormattedMessage id={label} />
      </Select.Option>
    ));
  }

  return (
    <Row gutter={16}>
      <Col>
        <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 150 }}>
          {renderSelectOptions()}
        </Select>
      </Col>
      <Col flex={1}>
        {['CELL', 'ROTATE'].includes(currentValue.type) ? (
          <Select
            mode='tags'
            value={currentValue?.code || []}
            onChange={onCodeChange}
            style={{ width: '100%' }}
            notFoundContent={null}
          />
        ) : (
          <Select
            mode='multiple'
            value={currentValue?.code || []}
            onChange={onCodeChange}
            style={{ width: '100%' }}
          >
            {renderSecondaryOptions()}
          </Select>
        )}
      </Col>
    </Row>
  );
};
export default connect(({ global }) => ({
  dataSource: global.targetDatasource || {},
}))(memo(TargetSelector));

export const TargetSelectorOptions = [
  {
    value: 'CELL',
    label: 'app.map.cell',
  },
  {
    value: 'CELL_GROUP',
    label: 'app.map.cellGroup',
  },
  {
    value: 'LOAD',
    label: 'resource.load',
  },
  {
    value: 'LOAD_GROUP',
    label: 'resource.load.group',
  },
  {
    value: 'ROTATE',
    label: 'editor.cellType.rotation',
  },
  {
    value: 'ROTATE_GROUP',
    label: 'editor.cellType.rotationGroup',
  },
  {
    value: 'STORE',
    label: 'menu.storage',
  },
  {
    value: 'STORE_GROUP',
    label: 'resource.storage.group',
  },
  {
    value: 'STATION',
    label: 'app.map.station',
  },
  {
    value: 'STATION_GROUP',
    label: 'app.map.stationGroup',
  },
];

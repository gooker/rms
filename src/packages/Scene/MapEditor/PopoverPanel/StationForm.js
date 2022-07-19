import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Row, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import AngleSelector from '@/components/AngleSelector';
import { MapSelectableSpriteType } from '@/config/consts';
import RichInput from '@/packages/Scene/components/RichInput';
import CardRadio from '@/packages/Scene/components/CardRadio';

const { Option } = Select;

const StationForm = (props) => {
  const { flag, cellMap, station, selectCellIds } = props;
  const { dispatch, allStationTypes, mapContext } = props;

  const [formRef] = Form.useForm();
  const [stationType, setStationType] = useState('COMMON');
  const [latentToteVisible, setLatentToteVisible] = useState(false);

  useEffect(() => {
    if (!isNull(station)) {
      setStationType(station.customType);
      setLatentToteVisible(station.customType === 'PICK' || station.customType === 'TALLY');
    }
  }, []);

  function onValuesChange() {
    if (latentToteVisible) return;
    setTimeout(() => {
      formRef
        .validateFields()
        .then((allValues) => {
          dispatch({
            type: 'editor/updateFunction',
            payload: { scope: 'logic', type: 'commonList', data: allValues },
          }).then((result) => {
            if (result.type === 'add') {
              mapContext.renderStation([result.payload], null, cellMap);
            }
            if (result.type === 'update') {
              mapContext.updateStation(result.current, cellMap);
            }
            mapContext.refresh();
          });
        })
        .catch(() => {
        });
    });
  }

  function latentToteSubmit() {
    //
  }

  function renderStationTypeOptions() {
    const optionData = Object.entries(allStationTypes).map(([type, label]) => ({ type, label }));
    return optionData.map(({ type, label }) => (
      <Option key={type} value={type}>
        {label}
      </Option>
    ));
  }

  return (
    <div>
      <Form form={formRef} layout={'vertical'} onValuesChange={onValuesChange}>
        {/* 隐藏字段 */}
        <Form.Item hidden name={'flag'} initialValue={flag}>
          <Input disabled />
        </Form.Item>

        {/* 类型 */}
        <Form.Item
          name={'customType'}
          initialValue={station?.customType || 'COMMON'}
          label={formatMessage({ id: 'app.common.type' })}
          getValueFromEvent={(value) => {
            setStationType(value);
            setLatentToteVisible(value === 'PICK' || value === 'TALLY');
            return value;
          }}
        >
          <Select>{renderStationTypeOptions()}</Select>
        </Form.Item>

        {/* 编码 */}
        {!latentToteVisible ? (
          <>
            <Form.Item
              name={'code'}
              initialValue={station?.code || `station_${getRandomString(10)}`}
              label={formatMessage({ id: 'app.common.code' })}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            {/* 名称 */}
            <Form.Item
              name={'name'}
              initialValue={station?.name}
              label={<FormattedMessage id='app.common.name' />}
            >
              <Input />
            </Form.Item>
          </>
        ) : (
          <Form.Item
            name={'groupCode'}
            initialValue={station?.groupCode}
            label={<FormattedMessage id='sourcemanage.vehiclegroup.name' />}
            rules={[{ required: true }]}
          >
            <Input disabled={!isNull(station)} />
          </Form.Item>
        )}

        {/* 停止点 */}
        <Form.Item
          name={'stopCellId'}
          initialValue={station?.stopCellId}
          label={formatMessage({ id: 'editor.cellType.stop' })}
          rules={[{ required: true }]}
        >
          <RichInput
            currentCellId={selectCellIds}
            icon={
              <img
                alt='stop'
                style={{ width: 25 }}
                src={require('@/../public/images/stop.png').default}
              />
            }
            showLatentTote={latentToteVisible && isNull(station)}
          />
        </Form.Item>

        {/* 站点角度 */}
        <Form.Item
          name={'nangle'}
          initialValue={station?.angle ?? 0}
          label={formatMessage({ id: 'app.common.angle' })}
        >
          <AngleSelector
            disabled
            width={'100%'}
            addonLabel={{
              0: formatMessage({ id: 'app.direction.rightSide' }),
              90: formatMessage({ id: 'app.direction.topSide' }),
              180: formatMessage({ id: 'app.direction.leftSide' }),
              270: formatMessage({ id: 'app.direction.bottomSide' }),
            }}
          />
        </Form.Item>

        {/* 偏移距离 */}
        <Form.Item
          name={'offset'}
          initialValue={station?.offset || 1500}
          label={formatMessage({ id: 'editor.moveCell.offsetDistance' })}
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标 */}
        <Form.Item
          name={'icon'}
          initialValue={station?.icon || 'common'}
          label={<FormattedMessage id='editor.station.icon' />}
        >
          <CardRadio type='common' />
        </Form.Item>

        {/* 图标角度 */}
        <Form.Item
          name={'iconAngle'}
          initialValue={station?.iconAngle || 0}
          label={<FormattedMessage id='editor.station.icon.angle' />}
        >
          <AngleSelector disabled width={'100%'} />
        </Form.Item>

        {/* 图标宽度 */}
        <Form.Item
          name={'iconWidth'}
          initialValue={station?.iconWidth ?? 1000}
          label={formatMessage({ id: 'editor.station.icon.width' })}
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标高度 */}
        <Form.Item
          name={'iconHeight'}
          initialValue={station?.iconHeight ?? 1000}
          label={formatMessage({ id: 'editor.station.icon.height' })}
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 保存 */}
        {latentToteVisible && (
          <Form.Item>
            <Row justify="end">
              <Button type="primary" onClick={latentToteSubmit}>
                <FormattedMessage id="app.button.confirm" />
              </Button>
            </Row>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
export default connect(({ editor }) => {
  const { currentMap, selections } = editor;

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ naviId }) => naviId);

  return {
    selectCellIds,
    cellMap: currentMap.cellMap,
    mapContext: editor.mapContext,
    allStationTypes: editor.allStationTypes,
  };
})(memo(StationForm));

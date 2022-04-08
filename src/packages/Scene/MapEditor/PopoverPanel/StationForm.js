import React, { memo, useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getRandomString, isNull, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import AngleSelector from '@/components/AngleSelector';
import { MapSelectableSpriteType } from '@/config/consts';
import RichInput from '@/packages/Scene/components/RichInput';
import CardRadio from '@/packages/Scene/components/CardRadio';

const { Option } = Select;

const StationForm = (props) => {
  const { dispatch, allCommons, allWebHooks, allStationTypes, mapContext } = props;
  const { flag, station, selectCellIds } = props;

  const [iconWidth, iconHeight] = station?.size.split('@').map((value) => parseInt(value, 10)) || [
    1000, 1000,
  ];

  const [formRef] = Form.useForm();
  const [stationType, setStationType] = useState('COMMON');
  const [latentToteVisible, setLatentToteVisible] = useState(false);

  useEffect(() => {
    if (!isNull(station)) {
      setStationType(station.customType);
      setLatentToteVisible(station.customType === 'PICK' || station.customType === 'TALLY');
    }
  }, []);

  function checkCodeDuplicate(key, keyValue) {
    const tid = isNull(station) ? -1 : flag;
    let newFunctionData = [...allCommons];
    newFunctionData.splice(tid, 1);
    const existCodes = newFunctionData.map((item) => item[key]);
    return existCodes.includes(keyValue);
  }

  function onValuesChange(changedValues, allValues) {
    const { setFieldsValue, getFieldValue } = formRef;
    const currentCommon = { ...allValues };
    currentCommon.x = currentCommon.x || 0;
    currentCommon.y = currentCommon.y || 0;
    if (latentToteVisible) return;

    if (!isNull(currentCommon.stopCellId) && !isNull(currentCommon.angle)) {
      // 如果没有编码字段就手动添加: 停止点-角度
      if (isStrictNull(currentCommon.station)) {
        if (!isNull(currentCommon.stopCellId) && !isNull(currentCommon.angle)) {
          currentCommon.station = `${currentCommon.stopCellId}-${currentCommon.angle}`;
        }
      }

      // 默认值(保证数据正确)和size字段
      currentCommon.size = `${currentCommon.iconWidth || currentCommon.width}@${
        currentCommon.iconHeight || currentCommon.height
      }`;

      // 删除无用的字段
      delete currentCommon['direction&&angle'];
      delete currentCommon.iconWidth;
      delete currentCommon.iconHeight;

      // 只有编码字段为空时候才会自动赋值
      const currentCode = getFieldValue('station');
      if (isNull(currentCode)) {
        setFieldsValue({ station: currentCommon.station });
      }
      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'commonList', data: currentCommon },
      }).then((result) => {
        if (result.type === 'add') {
          mapContext.renderCommonFunction([result.payload], null);
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          mapContext.removeCommonFunction(pre);
          mapContext.renderCommonFunction([current]);
        }
        mapContext.refresh();
      });
    }
  }

  function checkStopIdDuplicate(stopcellId) {
    if (isStrictNull(stopcellId)) {
      return Promise.reject(new Error(formatMessage({ id: 'app.common.select' })));
    }
    if (latentToteVisible && isNull(station) && !Array.isArray(stopcellId)) {
      return Promise.reject(new Error('停止点要选择2个'));
    }

    return Promise.resolve();
  }

  function latentToteSubmit() {
    const angle = formRef.getFieldValue('angle');
    if (isStrictNull(angle)) {
      // formRef.validateFields(['angle'], { force: true });
      message.error('选择角度');
      return;
    }

    formRef
      .validateFields()
      .then((values) => {
        const currentCommon = { ...values };
        currentCommon.x = currentCommon.x || 0;
        currentCommon.y = currentCommon.y || 0;
        // 默认值(保证数据正确)和size字段
        currentCommon.size = `${currentCommon.iconWidth || currentCommon.width}@${
          currentCommon.iconHeight || currentCommon.height
        }`;

        // 删除无用的字段
        delete currentCommon['direction&&angle'];
        delete currentCommon.iconWidth;
        delete currentCommon.iconHeight;

        const { stopCellId, flag } = currentCommon;
        const newStopCellId = isNull(station) ? [...stopCellId] : [stopCellId];

        newStopCellId.map((id, index) => {
          dispatch({
            type: 'editor/updateFunction',
            payload: {
              scope: 'logic',
              type: 'commonList',
              data: {
                ...currentCommon,
                station: isNull(station) ? getRandomString(6) : station.station,
                name: isNull(station) ? `${currentCommon.groupCode}-${index}` : station.name,
                stopCellId: id,
                flag: index === 0 ? flag : flag + 1,
              },
            },
          }).then((result) => {
            if (result.type === 'add') {
              mapContext.renderCommonFunction([result.payload], null);
            }
            if (result.type === 'update') {
              const { pre, current } = result;
              mapContext.removeCommonFunction(pre);
              mapContext.renderCommonFunction([current]);
            }
            mapContext.refresh();
          });
        });
      })
      .catch(() => {});
  }

  function freshAllWebHook() {
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
        <Form.Item hidden name={'flag'} initialValue={flag} />
        <Form.Item hidden name={'direction'} initialValue={station?.direction} />
        <Form.Item hidden name={'angle'} initialValue={station?.angle} />
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
        {!latentToteVisible && (
          <>
            <Form.Item
              name={'station'}
              initialValue={station?.station || getRandomString(6)}
              label={formatMessage({ id: 'app.common.code' })}
              rules={[
                () => ({
                  validator(_, value) {
                    const isDuplicate = checkCodeDuplicate('station', value);
                    if (!isDuplicate || isNull(station)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(formatMessage({ id: 'editor.code.duplicate' })),
                    );
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>

            {/* 名称 */}
            <Form.Item
              name={'name'}
              initialValue={station?.name}
              label={<FormattedMessage id="app.common.name" />}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {latentToteVisible && (
          <Form.Item
            name={'groupCode'}
            initialValue={station?.groupCode}
            label={<FormattedMessage id="sourcemanage.agvgroup.name" />}
            rules={[
              { required: true },
              () => ({
                validator(_, value) {
                  const isDuplicate = checkCodeDuplicate('groupCode', value);
                  if (!isDuplicate) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(formatMessage({ id: 'groupManage.groupname.duplicate' })),
                  );
                },
              }),
            ]}
          >
            <Input disabled={!isNull(station)} />
          </Form.Item>
        )}

        {/* 停止点 */}
        <Form.Item
          name={'stopCellId'}
          initialValue={station?.stopCellId}
          label={formatMessage({ id: 'editor.cellType.stop' })}
          rules={[
            () => ({
              validator(_, value) {
                return checkStopIdDuplicate(value);
              },
            }),
          ]}
        >
          <RichInput
            currentCellId={selectCellIds}
            icon={
              <img
                alt="stop"
                style={{ width: 25 }}
                src={require('../../../../../public/images/stop.png').default}
              />
            }
            showlatentTote={latentToteVisible && isNull(station)}
          />
        </Form.Item>

        {/* 站点角度 */}
        <Form.Item
          name={'direction&&angle'}
          initialValue={station?.angle}
          label={<FormattedMessage id="app.common.angle" />}
          getValueFromEvent={(value) => {
            formRef.setFieldsValue({
              direction: value.dir,
              angle: value.angle,
            });
            return value;
          }}
        >
          <AngleSelector />
        </Form.Item>

        {/* 偏移距离 */}
        <Form.Item
          name={'offset'}
          initialValue={station?.offset}
          label={<FormattedMessage id="editor.moveCell.offsetDistance" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* ---- 滚筒站 ---- */}
        {stationType === 'ROLLER' && (
          <>
            {/* 料箱编码 */}
            <Form.Item
              name={'binCode'}
              initialValue={station?.binCode}
              label={formatMessage({ id: 'app.roller.binCode' })}
            >
              <Input />
            </Form.Item>

            {/* 车头方向 */}
            <Form.Item
              name={'toteAgvDirection'}
              initialValue={station?.toteAgvDirection}
              label={formatMessage({ id: 'app.agv.direction' })}
            >
              <AngleSelector getAngle />
            </Form.Item>

            {/* 高度 */}
            <Form.Item label={formatMessage({ id: 'app.common.height' })}>
              <Row gutter={10}>
                <Col span={10}>
                  <Form.Item noStyle name={'heightOffset'} initialValue={station?.heightOffset}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  mm
                </Col>
              </Row>
            </Form.Item>

            {/* 深度 */}
            <Form.Item label={formatMessage({ id: 'app.common.depth' })}>
              <Row gutter={10}>
                <Col span={10}>
                  <Form.Item noStyle name={'toteAGVDepth'} initialValue={station?.toteAGVDepth}>
                    <InputNumber style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  mm
                </Col>
              </Row>
            </Form.Item>

            {/* WebHook */}
            <Form.Item label={'Web Hook'}>
              <Row gutter={10}>
                <Col span={15}>
                  <Form.Item noStyle name={'webHookId'} initialValue={station?.webHookId}>
                    <Select style={{ width: '100%' }}>
                      {allWebHooks.map(({ id, name }) => (
                        <Option key={id} value={id}>
                          {name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    type="link"
                    size={'small'}
                    icon={<ReloadOutlined />}
                    onClick={freshAllWebHook}
                    style={{ marginLeft: '5px' }}
                  />
                </Col>
              </Row>
            </Form.Item>
          </>
        )}

        {/* 图标 */}
        <Form.Item
          name={'icon'}
          initialValue={station?.icon || 'common'}
          label={<FormattedMessage id="editor.station.icon" />}
        >
          <CardRadio type="common" />
        </Form.Item>

        {/* 图标宽度 */}
        <Form.Item
          name={'iconWidth'}
          initialValue={iconWidth}
          label={<FormattedMessage id="editor.station.icon.width" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标高度 */}
        <Form.Item
          name={'iconHeight'}
          initialValue={iconHeight}
          label={<FormattedMessage id="editor.station.icon.height" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>

        {/* 图标角度 */}
        <Form.Item
          name={'iconAngle'}
          initialValue={station?.iconAngle || 0}
          label={<FormattedMessage id="app.common.angle" />}
        >
          <AngleSelector getAngle />
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
  const { currentMap, selections, allWebHooks } = editor;

  // 获取所有通用站点列表
  const allCommons = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const commonList = item.commonList || [];
    allCommons.push(...commonList);
  });

  const selectCellIds = selections
    .filter((item) => item.type === MapSelectableSpriteType.CELL)
    .map(({ id }) => id);

  return {
    allCommons,
    allWebHooks,
    selectCellIds,
    mapContext: editor.mapContext,
    allStationTypes: editor.allStationTypes,
  };
})(memo(StationForm));

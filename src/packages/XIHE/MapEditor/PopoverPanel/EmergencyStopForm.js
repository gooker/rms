import React, { memo, useEffect, useState } from 'react';
import { Button, Form, InputNumber, message, Input, Radio, Select } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { EmergencyStopMode } from '@/config/consts';
import { fetchEmergencyStopList } from '@/services/XIHE';
import { dealResponse, formatMessage, getFormLayout, getRandomString, isNull } from '@/utils/util';
import { LeftCategory } from '@/packages/XIHE/MapEditor/enums';
import { getSelectionWorldCoordinator } from '@/utils/mapUtil';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(4, 20);
const key = 'updatable';

const EmergencyStopForm = (props) => {
  const { dispatch, flag, editing, mapContext, mapId, logicId, back } = props;

  const [formRef] = Form.useForm();
  const [shape, setShape] = useState(null);
  const [allEStop, setAllEStop] = useState([]);

  useEffect(() => {
    // fetchEmergencyStopList(mapId).then((response) => {
    //   if (!dealResponse(response)) {
    //     setAllEStop(response);
    //   }
    // });

    //
    if (!isNull(editing)) {
      const _shape = isNull(editing.r) ? 'Rect' : 'Circle';
      setShape(_shape);
      formRef.setFieldsValue({ shape: _shape });
    }

    return () => {
      // 先关闭Mask
      const maskDOM = document.getElementById('mapSelectionMask');
      maskDOM.style.display = 'none';

      message.destroy(key);
      mapContext.pixiUtils.viewport.drag({ pressDrag: true });
      dispatch({
        type: 'editor/updateLeftActiveCategory',
        payload: LeftCategory.Drag,
      });
    };
  }, []);

  function checkCodeDuplicate() {
    //
  }

  function autLoad() {
    const maskDOM = document.getElementById('mapSelectionMask');
    const { worldStartX, worldStartY, worldEndX, worldEndY } = getSelectionWorldCoordinator(
      document.getElementById('editorPixi'),
      maskDOM,
      mapContext.pixiUtils.viewport,
    );
    const xLength = Math.abs(worldEndX - worldStartX);
    const yLength = Math.abs(worldStartY - worldEndY);

    if (shape === 'Rect') {
      formRef.setFieldsValue({
        x: worldStartX,
        y: worldStartY,
        xlength: xLength,
        ylength: yLength,
      });
    } else {
      // 注意: 圆的计算点在圆心，不是左上角
      formRef.setFieldsValue({
        x: (worldEndX + worldStartX) / 2,
        y: (worldEndY + worldStartY) / 2,
        r: (xLength + yLength) / 4,
      });
    }
    onValuesChange({}, formRef.getFieldsValue());
    dispatch({ type: 'editor/updateLeftActiveCategory', payload: LeftCategory.Drag });
    maskDOM.style.display = 'none';
    message.destroy(key);
    back();
  }

  function onValuesChange(changedValues, allValues) {
    const commonFlag = !isNull(allValues.code) && !isNull(allValues.x) && !isNull(allValues.y);
    if (!commonFlag) return;

    const currentAllValues = { ...allValues };
    delete currentAllValues.shape;
    currentAllValues.mapId = mapId;
    currentAllValues.logicId = logicId;
    currentAllValues.isFixed = true;

    if (commonFlag) {
      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'emergencyStopFixedList', data: currentAllValues },
      }).then((result) => {
        if (result.type === 'add') {
          mapContext.renderFixedEStopFunction(result.payload);
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          mapContext.removeFixedEStopFunction(pre);
          mapContext.renderFixedEStopFunction(current);
        }
        mapContext.refresh();
      });
    }
  }

  function onShapeChange(evt) {
    // 先关闭Mask
    const maskDOM = document.getElementById('mapSelectionMask');
    maskDOM.style.display = 'none';
    // 给予用户操作指引
    message.info({ content: formatMessage({ id: 'editor.emergency.tip' }), duration: 0, key });
    setShape(evt.target.value);
    mapContext.pixiUtils.viewport.drag({ pressDrag: false });
    dispatch({
      type: 'editor/updateSettingEStop',
      payload: evt.target.value === 'Rect' ? LeftCategory.Rectangle : LeftCategory.Circle,
    });
    return evt.target.value;
  }

  return (
    <Form labelWrap form={formRef} onValuesChange={onValuesChange} {...formItemLayout}>
      <Form.Item hidden name={'flag'} initialValue={flag} />
      {/* 模式 */}
      <Form.Item
        name={'estopMode'}
        initialValue={editing?.estopMode || 'LockPath'}
        label={<FormattedMessage id="editor.emergency.mode" />}
      >
        <Select style={{ width: '100%' }}>
          {EmergencyStopMode.map((item) => (
            <Select.Option key={item.label} value={item.value}>
              <FormattedMessage id={item.label} />
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {/* 编码 */}
      <Form.Item
        name={'code'}
        initialValue={editing?.code || `ESP_${getRandomString(8)}`}
        label={<FormattedMessage id="app.common.code" />}
      >
        <Input />
      </Form.Item>
      {/* 名称 */}
      <Form.Item
        name={'name'}
        initialValue={editing?.name}
        label={<FormattedMessage id="app.common.name" />}
      >
        <Input />
      </Form.Item>
      {/*  所属组 */}
      <Form.Item
        name={'group'}
        initialValue={editing?.group}
        label={<FormattedMessage id="editor.emergency.group" />}
      >
        <Input />
      </Form.Item>
      {/*  形状 */}
      <Form.Item
        name={'shape'}
        label={<FormattedMessage id="editor.emergency.shape" />}
        getValueFromEvent={onShapeChange}
      >
        <Radio.Group buttonStyle="solid" disabled={!isNull(editing)}>
          <Radio.Button value={'Rect'}>
            <FormattedMessage id="editor.emergency.shape.rect" />
          </Radio.Button>
          <Radio.Button value={'Circle'}>
            <FormattedMessage id="editor.emergency.shape.circle" />
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* x */}
      <Form.Item name={'x'} label={'X'} initialValue={editing?.x} hidden={isNull(editing)}>
        <InputNumber />
      </Form.Item>

      {/* y */}
      <Form.Item name={'y'} label={'Y'} initialValue={editing?.y} hidden={isNull(editing)}>
        <InputNumber />
      </Form.Item>

      {!isNull(shape) && shape === 'Rect' && (
        <>
          {/* 宽度 */}
          <Form.Item
            name={'xlength'}
            label={<FormattedMessage id="app.common.width" />}
            initialValue={editing?.xlength}
            hidden={isNull(editing)}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          {/* 高度 */}
          <Form.Item
            name={'ylength'}
            initialValue={editing?.ylength}
            label={<FormattedMessage id="app.common.height" />}
            hidden={isNull(editing)}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          {/* 方向 */}
          <Form.Item
            name={'angle'}
            initialValue={editing?.angle || 0}
            label={<FormattedMessage id="app.common.angle" />}
            hidden={isNull(editing)}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
        </>
      )}

      {!isNull(shape) && shape === 'Circle' && (
        // 半径
        <Form.Item
          name={'r'}
          initialValue={editing?.r}
          label={<FormattedMessage id="app.common.radius" />}
          hidden={isNull(editing)}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>
      )}

      {isNull(editing) && (
        <Form.Item {...formItemLayoutNoLabel}>
          <Button type={'primary'} onClick={autLoad} disabled={isNull(shape)}>
            <CheckOutlined /> <FormattedMessage id={'app.button.confirm'} />
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};
export default connect(({ editor }) => {
  const { currentMap, currentLogicArea } = editor;
  return {
    mapId: currentMap?.id,
    logicId: currentLogicArea,
    mapContext: editor.mapContext,
  };
})(memo(EmergencyStopForm));

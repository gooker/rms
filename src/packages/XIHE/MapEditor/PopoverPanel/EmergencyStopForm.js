import React, { memo, useEffect, useState } from 'react';
import { Button, Form, InputNumber, Input, Radio, Select } from 'antd';
import { PushpinOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { EmergencyStopMode } from '@/config/consts';
import { fetchEmergencyStopList } from '@/services/XIHE';
import { dealResponse, getRandomString, isNull } from '@/utils/util';
import { LeftCategory } from '@/packages/XIHE/MapEditor/enums';
import { getSelectionWorldCoordinator } from '@/utils/mapUtil';

const EmergencyStopForm = (props) => {
  const { dispatch, flag, editing, mapContext, mapId, logicId, back } = props;

  const [formRef] = Form.useForm();
  const [shape, setShape] = useState(null);
  const [allEStop, setAllEStop] = useState([]);
  const [dataAutoLoaded, setDataAutoLoaded] = useState(false);

  useEffect(() => {
    fetchEmergencyStopList().then((response) => {
      if (!dealResponse(response)) {
        setAllEStop(response);
      }
    });
  }, []);

  function checkCodeDuplicate() {}

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
    setDataAutoLoaded(true);
    onValuesChange({}, formRef.getFieldsValue());
    dispatch({ type: 'editor/updateRangeForConfig', payload: LeftCategory.Choose });
    maskDOM.style.display = 'none';
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

  return (
    <Form form={formRef} layout={'vertical'} onValuesChange={onValuesChange}>
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
        rules={
          [
            // () => ({
            //   validator(_, value) {
            //     const isDuplicate = checkCodeDuplicate(value);
            //     if (!isDuplicate) {
            //       return Promise.resolve();
            //     }
            //     return Promise.reject(new Error(formatMessage({ id: 'editor.code.duplicate' })));
            //   },
            // }),
          ]
        }
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
        initialValue={editing?.shape}
        label={<FormattedMessage id="editor.emergency.shape" />}
        getValueFromEvent={(e) => {
          setShape(e.target.value);
          dispatch({
            type: 'editor/updateRangeForConfig',
            payload: e.target.value === 'Rect' ? LeftCategory.Rectangle : LeftCategory.Circle,
          });
          return e.target.value;
        }}
      >
        <Radio.Group buttonStyle="solid">
          <Radio.Button value={'Rect'}>
            <FormattedMessage id="editor.emergency.shape.rect" />
          </Radio.Button>
          <Radio.Button value={'Circle'}>
            <FormattedMessage id="editor.emergency.shape.circle" />
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      {/* x */}
      <Form.Item name={'x'} label={'X'} initialValue={editing?.x} hidden={!dataAutoLoaded}>
        <InputNumber />
      </Form.Item>

      {/* y */}
      <Form.Item name={'y'} label={'Y'} initialValue={editing?.y} hidden={!dataAutoLoaded}>
        <InputNumber />
      </Form.Item>

      {shape === 'Rect' ? (
        <>
          {/* 宽度 */}
          <Form.Item
            name={'xlength'}
            label={<FormattedMessage id="app.common.width" />}
            initialValue={editing?.xlength}
            hidden={!dataAutoLoaded}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          {/* 高度 */}
          <Form.Item
            hidden={!dataAutoLoaded}
            name={'ylength'}
            initialValue={editing?.ylength}
            label={<FormattedMessage id="app.common.height" />}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
          {/* 方向 */}
          <Form.Item
            hidden={!dataAutoLoaded}
            name={'angle'}
            initialValue={editing?.angle || 0}
            label={<FormattedMessage id="app.common.angle" />}
          >
            <InputNumber style={{ width: 150 }} />
          </Form.Item>
        </>
      ) : (
        // 半径
        <Form.Item
          hidden={!dataAutoLoaded}
          name={'r'}
          initialValue={editing?.r || 1000}
          label={<FormattedMessage id="app.mapEditView.CircleRadius" />}
        >
          <InputNumber style={{ width: 150 }} />
        </Form.Item>
      )}
      <Form.Item>
        <Button type={'primary'} onClick={autLoad} disabled={isNull(shape)}>
          <PushpinOutlined /> <FormattedMessage id={'editor.emergency.autLoad'} />
        </Button>
      </Form.Item>
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

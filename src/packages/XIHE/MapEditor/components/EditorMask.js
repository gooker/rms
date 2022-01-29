import React, { memo, useRef, useState } from 'react';
import { Button, Input } from 'antd';
import { connect } from '@/utils/RcsDva';
import { convertPngToBase64, formatMessage, getColorRGB, isStrictNull } from '@/utils/util';
import { transformScreenToWorldCoordinator } from '@/utils/mapUtil';
import { LeftCategory } from '@/packages/XIHE/MapEditor/enums';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';

const EditorMask = (props) => {
  const { dispatch, mapContext, leftActiveCategory, maskToolVisible, maskInputVisible } = props;

  const maskRef = useRef();
  const filePickerRef = useRef();
  const [color, setColor] = useState('transparent');
  const [label, setLabel] = useState(null);

  function getSelectionWorldCoordinator() {
    const mapDOM = document.getElementById('editorPixi');
    const x = maskRef.current.offsetLeft;
    const y = maskRef.current.offsetTop;
    const { width, height } = maskRef.current.getBoundingClientRect();
    // 转换坐标
    const [rangeWorldStartX, rangeWorldStartY] = transformScreenToWorldCoordinator(
      { x, y },
      mapDOM,
      mapContext.pixiUtils.viewport,
    );
    const [rangeWorldEndX, rangeWorldEndY] = transformScreenToWorldCoordinator(
      { x: x + width, y: y + height },
      mapDOM,
      mapContext.pixiUtils.viewport,
    );

    return {
      width,
      height,
      worldStartX: rangeWorldStartX,
      worldStartY: rangeWorldStartY,
      worldEndX: rangeWorldEndX,
      worldEndY: rangeWorldEndY,
    };
  }

  // 线框背景
  function confirm() {
    const { worldStartX, worldStartY, worldEndX, worldEndY } = getSelectionWorldCoordinator();
    const __color = color || '#e8e8e8';

    if (leftActiveCategory === LeftCategory.Rectangle) {
      // 锚点在正中心
      const width = Math.abs(worldStartX - worldEndX);
      const height = Math.abs(worldStartY - worldEndY);
      const x = worldStartX + width / 2;
      const y = worldStartY + height / 2;
      mapContext.drawRectArea(x, y, width, height, __color);
      dispatch({
        type: 'editor/insertBackgroundMark',
        payload: {
          type: 'wireframe',
          shape: 'Rect',
          x,
          y,
          width,
          height,
          labelColor: __color,
        },
      });
    }

    if (leftActiveCategory === LeftCategory.Circle) {
      const width = Math.abs(worldStartX - worldEndX);
      mapContext.drawCircleArea(
        worldStartX + width / 2,
        worldStartY + width / 2,
        width / 2,
        __color,
      );
      dispatch({
        type: 'editor/insertBackgroundMark',
        payload: {
          type: 'wireframe',
          shape: 'Circle',
          x: worldStartX + width / 2,
          y: worldStartY + width / 2,
          radius: width / 2,
          labelColor: __color,
        },
      });
    }
    cancel();
  }

  function cancel() {
    // 重置选择框DOM样式
    maskRef.current.style.display = 'none';
    maskRef.current.style.width = `${0}px`;
    maskRef.current.style.height = `${0}px`;
    maskRef.current.style.borderRadius = `${0}px`;

    // 重置工具栏显示状态
    dispatch({ type: 'editor/updateMaskToolVisible', payload: false });
    dispatch({ type: 'editor/maskInputVisible', payload: false });
    setColor(null);
  }

  // 文字标记
  function onPressEnter(ev) {
    const text = ev.target.value;
    if (!isStrictNull(text)) {
      const mapDOM = document.getElementById('editorPixi');
      const x = maskRef.current.offsetLeft;
      const y = maskRef.current.offsetTop;
      const [worldX, worldY] = transformScreenToWorldCoordinator(
        { x, y },
        mapDOM,
        mapContext.pixiUtils.viewport,
      );
      mapContext.renderLabel(text, worldX, worldY);
      dispatch({
        type: 'editor/insertLabel',
        payload: { text, x: worldX, y: worldY },
      });
      setLabel(null);
    }
    cancel();
  }

  // 图片背景
  async function onFileLoaded() {
    const file = filePickerRef.current.files[0];
    if (file instanceof File) {
      const base64 = await convertPngToBase64(file);
      const { worldStartX, worldStartY, worldEndX, worldEndY } = getSelectionWorldCoordinator();
      mapContext.renderImage({
        base64,
        x: worldStartX,
        y: worldStartY,
        width: Math.abs(worldStartX - worldEndX),
        height: Math.abs(worldStartY - worldEndY),
      });

      dispatch({
        type: 'editor/insertBackgroundMark',
        payload: {
          type: 'image',
          x: worldStartX,
          y: worldStartY,
          width: Math.abs(worldStartX - worldEndX),
          height: Math.abs(worldStartY - worldEndY),
          imageUrl: base64,
        },
      });

      cancel();
      filePickerRef.current.value = '';
    }
  }

  return (
    <div
      ref={maskRef}
      id={'mapSelectionMask'}
      className={commonStyles.mapSelectionMask}
      style={{
        background: getColorRGB(color, 0.8),
        ...(maskInputVisible ? { border: 'none' } : {}),
        ...(leftActiveCategory === LeftCategory.Circle ? { borderRadius: '50%' } : {}),
      }}
    >
      {maskToolVisible ? (
        <div style={{ position: 'relative', width: '100%', height: '100%', cursor: 'grab' }}>
          <input
            type={'color'}
            style={{ position: 'absolute', right: '90px', bottom: '-40px' }}
            onChange={(value) => {
              setColor(value.target.value);
            }}
          />
          <Button
            type={'link'}
            style={{ position: 'absolute', right: '30px', bottom: '-40px' }}
            onClick={cancel}
          >
            <FormattedMessage id={'app.button.cancel'} />
          </Button>
          <Button
            type={'link'}
            style={{ position: 'absolute', right: '-10px', bottom: '-40px' }}
            onClick={confirm}
          >
            <FormattedMessage id={'app.button.confirm'} />
          </Button>
        </div>
      ) : null}

      {maskInputVisible ? (
        <Input
          value={label}
          onChange={(ev) => setLabel(ev.target.value)}
          onPressEnter={onPressEnter}
          placeholder={formatMessage({ id: 'mapEditor.placeholder.requireText' })}
          style={{ width: '100%' }}
        />
      ) : null}

      <input
        ref={filePickerRef}
        type={'file'}
        accept="image/png"
        style={{ display: 'none' }}
        id={'editorMaskFilePicker'}
        onChange={() => {
          onFileLoaded();
        }}
      />
    </div>
  );
};
export default connect(({ editor }) => ({
  leftActiveCategory: editor.leftActiveCategory,
  maskInputVisible: editor.maskInputVisible,
  maskToolVisible: editor.maskToolVisible,
  mapContext: editor.mapContext,
}))(memo(EditorMask));

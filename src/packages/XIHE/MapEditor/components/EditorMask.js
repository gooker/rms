import React, { memo, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { connect } from '@/utils/RcsDva';
import { convertPngToBase64, getColorRGB, getRandomString } from '@/utils/util';
import { transformScreenToWorldCoordinator } from '@/utils/mapUtil';
import { LeftCategory } from '@/packages/XIHE/MapEditor/enums';
import FormattedMessage from '@/components/FormattedMessage';
import { ZoneMarkerType } from '@/config/consts';
import LabelInputModal from './LabelInputModal';
import commonStyles from '@/common.module.less';

const EditorMask = (props) => {
  const { dispatch, mapContext, leftActiveCategory, maskToolVisible, maskInputVisible } = props;

  const maskRef = useRef();
  const filePickerRef = useRef();
  const [color, setColor] = useState('transparent');

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
    if (leftActiveCategory === LeftCategory.Rectangle) {
      // 锚点在正中心
      const type = ZoneMarkerType.RECT;
      const code = `${type}_${getRandomString(6)}`;
      const width = Math.abs(worldStartX - worldEndX);
      const height = Math.abs(worldStartY - worldEndY);
      const x = worldStartX + width / 2;
      const y = worldStartY + height / 2;
      mapContext.drawRectArea(code, x, y, width, height, color);
      dispatch({
        type: 'editor/insertZoneMarker',
        payload: { code, x, y, width, height, color, type },
      });
    }

    if (leftActiveCategory === LeftCategory.Circle) {
      const type = ZoneMarkerType.CIRCLE;
      const code = `${type}_${getRandomString(6)}`;
      const width = Math.abs(worldStartX - worldEndX);
      const x = worldStartX + width / 2;
      const y = worldStartY + width / 2;
      const radius = width / 2;
      mapContext.drawCircleArea(code, x, y, radius, color);
      dispatch({
        type: 'editor/insertZoneMarker',
        payload: { code, x, y, radius, color, type },
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
    setColor(null);
  }

  // 图片背景
  async function onFileLoaded() {
    const file = filePickerRef.current.files[0];
    if (file instanceof File) {
      const base64 = await convertPngToBase64(file);
      const { worldStartX, worldStartY, worldEndX, worldEndY } = getSelectionWorldCoordinator();

      // 锚点在正中心
      const width = Math.abs(worldStartX - worldEndX);
      const height = Math.abs(worldStartY - worldEndY);
      const x = worldStartX + width / 2;
      const y = worldStartY + height / 2;
      mapContext.renderImage({ x, y, width, height, base64 });
      dispatch({
        type: 'editor/insertZoneMarker',
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
        ...(leftActiveCategory === LeftCategory.Circle ? { borderRadius: '50%' } : {}),
      }}
    >
      {/* 区域标记 */}
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

      {/* Label输入 */}
      <Modal
        visible={maskInputVisible}
        title={<FormattedMessage id={'editor.label.creation'} />}
        footer={null}
        closable={false}
      >
        <LabelInputModal
          onCancel={cancel}
          getSelectionWorldCoordinator={getSelectionWorldCoordinator}
        />
      </Modal>

      {/* 图片选择器 */}
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

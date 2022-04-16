import React, { memo, useRef, useState } from 'react';
import { Modal } from 'antd';
import { connect } from '@/utils/RmsDva';
import {
  getColorRGB,
  getRandomString,
  convertPngToBase64,
  getUploadedImageDetail,
} from '@/utils/util';
import { getSelectionWorldCoordinator } from '@/utils/mapUtil';
import { LeftCategory } from '@/packages/Scene/MapEditor/editorEnums';
import FormattedMessage from '@/components/FormattedMessage';
import { ZoneMarkerType } from '@/config/consts';
import LabelInputModal from './LabelInputModal';
import ZoneMarkerModal from './ZoneMarkerModal';
import commonStyles from '@/common.module.less';

const EditorMask = (props) => {
  const { dispatch, mapContext, leftActiveCategory, zoneMarkerVisible, labelMarkerVisible } = props;

  const maskRef = useRef();
  const filePickerRef = useRef();
  const [color, setColor] = useState('transparent');

  function cancel() {
    // 重置选择框DOM样式
    maskRef.current.style.display = 'none';
    maskRef.current.style.cursor = 'default';
    maskRef.current.style.width = `${0}px`;
    maskRef.current.style.height = `${0}px`;
    maskRef.current.style.borderRadius = `${0}px`;

    // 重置工具栏显示状态
    dispatch({ type: 'editorView/updateZoneMarkerVisible', payload: false });
    setColor(null);
  }

  // 图片背景
  async function onFileLoaded() {
    const file = filePickerRef.current.files[0];
    if (file instanceof File) {
      const data = await convertPngToBase64(file);
      const { worldStartX, worldStartY, worldEndX, worldEndY } = getSelectionWorldCoordinator(
        document.getElementById('editorPixi'),
        maskRef.current,
        mapContext.pixiUtils.viewport,
      );

      // 锚点在正中心
      const code = `${ZoneMarkerType.IMG}_${getRandomString(6)}`;
      const rangeWidth = Math.abs(worldStartX - worldEndX);
      const rangeHeight = Math.abs(worldStartY - worldEndY);
      let width, height;

      // 这里插入图片要保持图片原有尺寸比例, 尺寸谁大就不用谁
      const imgDetail = await getUploadedImageDetail(file);
      if (rangeWidth >= rangeHeight) {
        height = rangeHeight;
        width = (rangeHeight * imgDetail.width) / imgDetail.height;
      } else {
        width = rangeWidth;
        height = (rangeWidth * imgDetail.height) / imgDetail.width;
      }
      const x = worldStartX + rangeWidth / 2;
      const y = worldStartY + rangeHeight / 2;
      mapContext.renderImage({ code, x, y, width, height, data }, true);
      dispatch({
        type: 'editor/insertZoneMarker',
        payload: {
          code,
          width,
          height,
          data,
          x,
          y,
          type: ZoneMarkerType.IMG,
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
      {/* 创建区域 */}
      <Modal
        destroyOnClose
        visible={zoneMarkerVisible}
        title={<FormattedMessage id={'editor.zone.creation'} />}
        footer={null}
        closable={false}
      >
        <ZoneMarkerModal onCancel={cancel} />
      </Modal>

      {/* Label输入 */}
      <Modal
        visible={labelMarkerVisible}
        title={<FormattedMessage id={'editor.label.creation'} />}
        footer={null}
        closable={false}
      >
        <LabelInputModal onCancel={cancel} />
      </Modal>

      {/* 图片选择器 */}
      <input
        ref={filePickerRef}
        type={'file'}
        accept="image/png,image/jpeg"
        style={{ display: 'none' }}
        id={'editorMaskFilePicker'}
        onChange={() => {
          onFileLoaded();
        }}
      />
    </div>
  );
};
export default connect(({ editor, editorView }) => ({
  mapContext: editor.mapContext,
  leftActiveCategory: editor.leftActiveCategory,
  zoneMarkerVisible: editorView.zoneMarkerVisible,
  labelMarkerVisible: editorView.labelMarkerVisible,
}))(memo(EditorMask));

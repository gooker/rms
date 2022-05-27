/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { Divider, Empty, Modal } from 'antd';
import { extractActionToFormValue, isNull } from '@/utils/util';
import ProgramingConfigure from './ProgramingForm';
import ProgramingDnd from '@/components/ProgramingConfiguer/ProgramingDnd';

/**
 * 默认导出一个弹窗组件
 * @param props
 * @param editing 正在编辑的对象数据
 * @param title 弹窗Title
 * @param visible 弹窗是否可见
 * @param onOk 弹窗确定按钮
 * @param onCancel 弹窗取消按钮
 * @param width 弹窗宽度
 * @param programing 编程元数据
 */
const ProgramingConfiguerModal = (props) => {
  const { title, visible, width = '60%' } = props;
  const { onOk, onCancel, programing, operationType, editing } = props;

  const [configuration, setConfiguration] = useState([]);

  useEffect(() => {
    if (visible && !isNull(editing)) {
      const configurations = extractActionToFormValue(editing.actions ?? []);
      setConfiguration(configurations);
    } else {
      setConfiguration([]);
    }
  }, [visible]);

  function addConfiguration(value) {
    if (Array.isArray(value)) {
      setConfiguration([...configuration, ...value]);
    } else {
      setConfiguration([...configuration, value]);
    }
  }

  function confirm() {
    onOk(configuration);
    onCancel();
  }

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      width={width}
      closable={false}
      maskClosable={false}
      onOk={confirm}
      onCancel={onCancel}
      style={{ maxWidth: 1000, top: '5%' }}
    >
      {/*  点位编程配置信息 */}
      {configuration.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ProgramingDnd value={configuration} onChange={setConfiguration} programing={programing} />
      )}

      {/*  点位编程配置面板 */}
      <Divider orientation={'left'}>配置工具</Divider>
      <ProgramingConfigure
        programing={programing}
        operationType={operationType}
        onAdd={addConfiguration}
      />
    </Modal>
  );
};
export default memo(ProgramingConfiguerModal);

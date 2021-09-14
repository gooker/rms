import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/Lang';
import { isNull } from '@/utils/utils';

const { confirm } = Modal;

/**
 * 所有操作确认弹窗统一使用该组件
 * @param {*} content 提示内容
 * @param {*} okType 确定按钮类型(无 或者 'danger')
 * @param {*} onOk 确认回调
 * @param {*} onCancel 取消回调
 */
const RcsConfirm = ({ content, okType, onOk, onCancel }) => {
  const confirmConfig = {
    title: formatMessage({ id: 'app.tip.systemHint' }),
    icon: <ExclamationCircleOutlined />,
    content,
    onOk,
  };
  if (!isNull(okType)) {
    confirmConfig.okType = okType;
  }
  if (!isNull(onCancel) && typeof onCancel === 'function') {
    confirmConfig.onCancel = onCancel;
  }

  confirm(confirmConfig);
};
export default RcsConfirm;

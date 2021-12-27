import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { isNull, formatMessage } from '@/utils/utils';

const { confirm } = Modal;

/**
 * 所有操作确认弹窗统一使用该组件
 * @param {*} content 提示内容
 * @param {*} okType 确定按钮类型(无 或者 'danger')
 * @param {*} okText 确认按钮文字
 * @param {*} cancelText 取消按钮文字
 * @param {*} onOk 确认回调
 * @param {*} onCancel 取消回调
 */
const RmsConfirm = ({ content, okType, onOk, onCancel, okText, cancelText }) => {
  const confirmConfig = {
    title: formatMessage({ id: 'app.message.systemHint' }),
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
  if (!isNull(okText)) {
    confirmConfig.okText = okText;
  }
  if (!isNull(cancelText)) {
    confirmConfig.cancelText = cancelText;
  }

  confirm(confirmConfig);
};
export default RmsConfirm;

import React from 'react';
import { Button, notification } from 'antd';
import { convertToUserTimezone, formatMessage } from '@/utils/util';

const LimitedNotification = 1;

const closeNotification = (key, notificationQueue) => {
  notification.close(key);
  notificationQueue.splice(notificationQueue.indexOf(key), 1);
};

export function showBrowserNotification(title, body) {
  function showNotification() {
    new window.Notification(title, { body });
  }

  if (Notification.permission === 'granted') {
    showNotification();
  } else {
    window.Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        showNotification();
      }
    });
  }
}

export default function notice(message, sectionId, notificationQueue) {
  const { hasNewError, problemHandling } = message;
  if (
    problemHandling != null &&
    problemHandling.vehicleType != null &&
    problemHandling.vehicleId != null &&
    problemHandling.id != null
  ) {
    const { id, taskId, alertType, vehicleType, vehicleId, updateTime, alertItemList } = problemHandling;
    if (hasNewError) {
      // 浏览器级别提醒
      const vehicleTypeName = formatMessage({ id: `app.vehicleType.${vehicleType}` });
      const content = `${vehicleTypeName} #${vehicleId} ${formatMessage({
        id: 'app.notification.reportProblem',
      })}`;
      showBrowserNotification(formatMessage({ id: 'app.notification.central' }), content);

      // 保证页面大弹窗数量保持在配置值
      const key = `open${id}`;
      // 缓存Notification窗口的key, 用于关闭多余的窗口
      notificationQueue.push(key);
      // 如果队列中的通知窗口超过限制值, 就关闭最早的通知
      if (notificationQueue.length > LimitedNotification) {
        const externalNotifications = notificationQueue.length - LimitedNotification;
        for (let index = 0; index < externalNotifications; index++) {
          const notificationQueueKey = notificationQueue.shift();
          notification.close(notificationQueueKey);
        }
      }
      // 大提示框
      const btn = (
        <Button
          type="primary"
          size="small"
          onClick={() => closeNotification(key, notificationQueue)}
        >
          {formatMessage({ id: 'app.button.turnOff' })}
        </Button>
      );
      const notificationContent = (
        <>
          <div style={{ marginTop: 10 }}>
            <span>{vehicleTypeName}</span>
            <span style={{ marginLeft: 10, fontSize: 18, fontWeight: 600, color: 'red' }}>
              {vehicleId}
            </span>
          </div>

          {taskId != null && (
            <div style={{ marginTop: 10 }}>
              <span>{formatMessage({ id: 'app.task.id' })}: </span>
              <span style={{ fontWeight: 700, color: 'red' }}>{taskId}</span>
            </div>
          )}

          <ul style={{ marginTop: 10, paddingLeft: 20 }}>
            {Array.isArray(alertItemList) &&
              alertItemList.map((item, index) => {
                return (
                  <li key={index}>
                    <span style={{ marginRight: 5, fontWeight: 600, color: '#1890ff' }}>
                      {item.alertNameI18NKey}:
                    </span>
                    <span>{item.alertContentI18NKey}</span>
                  </li>
                );
              })}
          </ul>

          <div style={{ textAlign: 'end', marginTop: 10 }}>
            {convertToUserTimezone(updateTime).format('YY-MM-DD HH:mm:ss')}
          </div>
        </>
      );
      notification.warning({
        key,
        btn,
        duration: 10,
        top: 65,
        message: formatMessage({ id: `app.alertCenter.${alertType}` }),
        description: notificationContent,
        onClose: () => closeNotification(key, notificationQueue),
      });
    }
  }
}

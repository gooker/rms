import React from 'react';
import { Button, notification } from 'antd';
import { formatMessage, convertToUserTimezone } from '@/utils/util';

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
    problemHandling.robotType != null &&
    problemHandling.agvId != null &&
    problemHandling.id != null
  ) {
    const { id, taskId, alertType, robotType, agvId, updateTime, alertItemList } = problemHandling;
    if (hasNewError) {
      // 浏览器级别提醒
      const agvTypeName = formatMessage({ id: `app.agvType.${robotType}` });
      const content = `${agvTypeName} #${agvId} ${formatMessage({
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
          {formatMessage({ id: 'app.button.close' })}
        </Button>
      );
      const notificationContent = (
        <>
          <div style={{ marginTop: 15 }}>
            <span>{agvTypeName}</span>
            <span style={{ marginLeft: 10, fontSize: 18, fontWeight: 600, color: 'red' }}>
              {agvId}
            </span>
          </div>

          {taskId != null && (
            <div style={{ marginTop: 15 }}>
              <span>{formatMessage({ id: 'app.task.id' })}: </span>
              <span style={{ fontWeight: 700, color: 'red' }}>{taskId}</span>
            </div>
          )}

          <ul style={{ marginTop: 15, paddingLeft: 20 }}>
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

          <div style={{ textAlign: 'end', marginTop: 15 }}>
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

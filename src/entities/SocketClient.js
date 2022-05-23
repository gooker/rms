import Stomp from 'stompjs';
import { message, notification } from 'antd';
import { formatMessage, isStrictNull } from '@/utils/util';

const SOCKET_RECONNECT_MESSAGE_ID = 'SOCKET_RECONNECT_MESSAGE_ID';
class SocketClient {
  constructor({ login, passcode }) {
    const nameSpacesInfo = window.nameSpacesInfo;
    this.ws = nameSpacesInfo?.ws;
    this.headers = {
      login: login,
      passcode: passcode,
    };
    this.client = null;
    this.unsubscribeueueQueue = [];
    this.reconnectable = true; // 标记是否可以重连
    this.monitor = false; // 是否已经订阅了监控页面的topic
  }

  getInstance() {
    if (isStrictNull(this.ws)) {
      message.error(formatMessage({ id: 'app.global.wsInvalid' }));
    } else {
      if (this.client === null) {
        this.client = Stomp.over(new WebSocket(this.ws));
        this.client.debug = false;
      }
    }
  }

  connect() {
    this.getInstance();
    if (this.client) {
      this.client.connect(this.headers, this.onConnect.bind(this), this.onError.bind(this));
    }
  }

  disconnect() {
    if (this.client) {
      this.client.disconnect(() => {
        this.client = null;
      });
    }
  }

  onConnect() {
    message.success({
      content: formatMessage({ id: 'app.socket.reConnected' }),
      key: SOCKET_RECONNECT_MESSAGE_ID,
      duration: 2,
    });

    const sectionId = window.localStorage.getItem('sectionId');

    /// /////////////////////////////// 全局  //////////////////////////////////
    // 订阅系统消息提醒
    this.client.subscribe(`/topic/COORDINATOR_UI_PROBLEM_CHANGE.s${sectionId}`, (response) => {
      const p = JSON.parse(response.body);
      if (this.notificationQuestion) this.notificationQuestion(p);
    });

    if (this.monitor) {
      this.applyMonitorRegistration();
    }
  }

  onError(errorMessage) {
    console.error(`[Socket]: ${errorMessage}`);
    if (
      this.reconnectable &&
      typeof errorMessage === 'string' &&
      errorMessage.indexOf('Whoops! Lost connection') > -1
    ) {
      message.loading({
        content: formatMessage({ id: 'app.socket.reconnecting' }),
        key: SOCKET_RECONNECT_MESSAGE_ID,
      });
      this.reconnectable = true;
      this.client = null;
      this.connect();
    } else if (errorMessage?.body?.indexOf('Access refused for user') > -1) {
      this.reconnectable = false;
      notification.warn({
        message: formatMessage({ id: 'app.message.systemHint' }),
        description: formatMessage({ id: 'app.socket.accountNoAuth' }),
        duration: 0,
      });
    } else {
      this.reconnectable = false;
      notification.error({
        message: formatMessage({ id: 'app.message.systemHint' }),
        description: formatMessage({ id: 'app.socket.connectFailed' }),
        duration: 0,
      });
    }
  }

  // 只有在监控页面才会使用到以下topic
  applyMonitorRegistration() {
    this.monitor = true;
    const sectionId = window.localStorage.getItem('sectionId');
    let unsubscription;

    /// /////////////////////////////// 潜伏式  //////////////////////////////////
    // 潜伏式车状态
    unsubscription = this.client.subscribe(
      `/topic/latent_lifting_ui_monitor_agv.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.agvStatusCallback) this.agvStatusCallback(p);
      },
    );
    // 将返回的"取消订阅"的函数缓存起来
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    // 潜伏货架状态
    unsubscription = this.client.subscribe(
      `/topic/latent_lifting_monitor_pod.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.podStatusCallback) this.podStatusCallback(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    // 潜伏车工作站状态
    unsubscription = this.client.subscribe(
      `/topic/latent_lifting_monitor_pod_to_workstation.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.podInStation) this.podInStation(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    // 潜伏工作站自动任务设置
    unsubscription = this.client.subscribe(
      `/topic/latent_lifting_monitor_auto_task_config.s${sectionId}`,
      (response) => {
        const p = response.body;
        if (this.openAutoTask) this.openAutoTask(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    // 潜伏车任务阻塞消息
    unsubscription = this.client.subscribe(
      `/topic/latent_lifting_monitor_pause_task_event.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.latentLiftingPauseTaskEvent) this.latentLiftingPauseTaskEvent(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    /// /////////////////////////// 料箱  /////////////////////////////////////////
    // 料箱车状态信息
    unsubscription = this.client.subscribe(
      `/topic/tote_ui_monitor_agv.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.toteAgvStatusCallback) this.toteAgvStatusCallback(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    // 料箱车上料箱[tote]状态
    unsubscription = this.client.subscribe(
      `/topic/tote_monitor_agv_tote_status.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.toteStatusCallback) this.toteStatusCallback(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    /// /////////////////////////// 分拣车  /////////////////////////////////////////
    unsubscription = this.client.subscribe(
      `/topic/sorter_ui_monitor_agv.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.sorterAgvStatusCallback) this.sorterAgvStatusCallback(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    /// /////////////////////////// 充电桩  /////////////////////////////////////////
    unsubscription = this.client.subscribe(
      `/topic/COORDINATOR_CHARGER_STATUS.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.chargerStatusCallback) this.chargerStatusCallback(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);

    // 紧急停止区域
    unsubscription = this.client.subscribe(
      `/topic/EMERGENCY_STOP_CHANGE.s${sectionId}`,
      (response) => {
        const p = JSON.parse(response.body);
        if (this.emergencyStopCallback) this.emergencyStopCallback(p);
      },
    );
    this.unsubscribeueueQueue.push(unsubscription.unsubscribe);
  }

  cancelMonitorRegistration() {
    this.monitor = false;
    this.unsubscribeueueQueue.map((func) => {
      if (typeof func === 'function') {
        func();
      }
    });
    this.unsubscribeueueQueue = [];
  }

  // *********************** 注册器 *********************** //
  registerNotificationQuestion(cb) {
    this.notificationQuestion = cb;
  }

  // Latent AGV
  registerLatentAGVStatus(cb) {
    this.agvStatusCallback = cb;
  }

  registerLatentPodStatus(cb) {
    this.podStatusCallback = cb;
  }

  registerLatentLiftingPauseTaskEvent(cb) {
    this.latentLiftingPauseTaskEvent = cb;
  }

  registerOpenAutoTask(cb) {
    this.openAutoTask = cb;
  }

  registerPodInStation(cb) {
    this.podInStation = cb;
  }

  // Tote AGV
  registerToteAGVStatus(cb) {
    this.toteAgvStatusCallback = cb;
  }

  registerToteStatusCallback(cb) {
    // 料箱车货架状态
    this.toteStatusCallback = cb;
  }

  // 分拣车
  registerSorterAGVStatus(cb) {
    this.sorterAgvStatusCallback = cb;
  }

  // 充电桩
  registerChargerStatusListener(cb) {
    this.chargerStatusCallback = cb;
  }

  // 紧急停止
  registerEmergencyStopListener(cb) {
    this.emergencyStopCallback = cb;
  }
}
export default SocketClient;

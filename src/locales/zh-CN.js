import menu from './zh-CN/menu';
import task from './zh-CN/task';
import global from './zh-CN/global';
import common from './zh-CN/common';
import agvList from './zh-CN/agvList';
import agvModel from './zh-CN/agvModel';
import agvRealTime from './zh-CN/agvRealTime';
import request from './zh-CN/request';
import requestor from './zh-CN/requestor';
import collection from './zh-CN/collection';
import chargingStrategy from './zh-CN/chargingStrategy';
import systemParameters from './zh-CN/systemParameters';
import reportCenter from './zh-CN/reportCenter';
import translator from './zh-CN/translator';
import portal from './zh-CN/portal';
import userManager from './zh-CN/SSO/userManager';
import sectionManager from './zh-CN/SSO/sectionManager';
import userLoginHistory from './zh-CN/SSO/userHistory';
import environmentManager from './zh-CN/SSO/environmentManager';
import authorizationCenter from './zh-CN/SSO/authorizationCenter';
import customConfiguration from './zh-CN/SSO/customConfiguration';
import latentLiftingReport from './zh-CN/report';
import customTasks from './zh-CN/Scene/customTasks';
import operationLog from './zh-CN/Scene/operationlog';
import charging from './zh-CN/Scene/charging';
import lockManage from './zh-CN/Scene/lockManage';
import mapEditor from './zh-CN/Scene/editor';
import mapMonitor from './zh-CN/Scene/monitor';
import notification from './zh-CN/Scene/notification';
import sourceManage from './zh-CN/Scene/sourcemanage';
import alert from './zh-CN/Scene/alert';
import latentTotStorage from './zh-CN/latentTotStorage';
import containerLock from './zh-CN/Res/containLock';

export default {
  ...menu,
  ...task,
  ...global,
  ...common,
  ...collection,
  ...agvList,
  ...agvModel,
  ...request,
  ...requestor,
  ...agvRealTime,
  ...chargingStrategy,
  ...systemParameters,
  ...reportCenter,
  ...translator,
  ...portal,
  ...userManager,
  ...sectionManager,
  ...userLoginHistory,
  ...environmentManager,
  ...authorizationCenter,
  ...customConfiguration,
  ...latentLiftingReport,
  ...customTasks,
  ...operationLog,
  ...charging,
  ...lockManage,
  ...mapEditor,
  ...mapMonitor,
  ...notification,
  ...sourceManage,
  ...alert,
  ...latentTotStorage,
  ...containerLock,
};

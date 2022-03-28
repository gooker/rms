import menu from './zh-CN/menu';
import task from './zh-CN/task';
import global from './zh-CN/global';
import common from './zh-CN/common';
import agvList from './zh-CN/agvList';
import request from './zh-CN/request';
import requestor from './zh-CN/requestor';
import collection from './zh-CN/collection';
import agvRealTime from './zh-CN/agvRealTime';
import chargingStrategy from './zh-CN/chargingStrategy';
import systemParameters from './zh-CN/systemParameters';
import reportCenter from './zh-CN/reportCenter';
import translator from './zh-CN/Translator/translator';
import portal from './zh-CN/Portal/portal';
import userManager from './zh-CN/SSO/userManager';
import sectionManager from './zh-CN/SSO/sectionManager';
import userLoginHistory from './zh-CN/SSO/userHistory';
import accountCenter from './zh-CN/SSO/accountCenter';
import environmentManager from './zh-CN/SSO/environmentManager';
import authorizationCenter from './zh-CN/SSO/authorizationCenter';
import customConfiguration from './zh-CN/SSO/customConfiguration';
import latentLiftingReport from './zh-CN/LatentLifting/report';
import customTasks from './zh-CN/Scene/customTasks';
import operationLog from './zh-CN/Scene/operationlog';
import charging from './zh-CN/Scene/charging';
import lockManage from './zh-CN/Scene/lockManage';
import mapEditor from './zh-CN/Scene/editor';
import mapMonitor from './zh-CN/Scene/monitor';
import notification from './zh-CN/Scene/notification';
import sourceManage from './zh-CN/Scene/sourcemanage';
import alert from './zh-CN/Scene/alert';

export default {
  ...menu,
  ...task,
  ...global,
  ...common,
  ...collection,
  ...agvList,
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
  ...accountCenter,
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
};

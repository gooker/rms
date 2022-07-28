import map from './zh-CN/Scene/map';
import menu from './zh-CN/menu';
import task from './zh-CN/task';
import charger from './zh-CN/Resource/charger';
import global from './zh-CN/global';
import common from './zh-CN/common';
import requestor from './zh-CN/Strategy/requestor';
import collection from './zh-CN/collection';
import chargingStrategy from './zh-CN/Strategy/chargingStrategy';
import systemParameters from './zh-CN/Strategy/systemParameters';
import reportCenter from './zh-CN/reportCenter';
import translator from './zh-CN/Strategy/translator';
import userManager from './zh-CN/SSO/userManager';
import sectionManager from './zh-CN/SSO/sectionManager';
import userLoginHistory from './zh-CN/SSO/userHistory';
import authorizationCenter from './zh-CN/SSO/authorizationCenter';
import customConfiguration from './zh-CN/SSO/customConfiguration';
import customTasks from './zh-CN/customTasks';
import operationLog from './zh-CN/SSO/operationlog';
import lockManage from './zh-CN/Resource/lockManage';
import mapEditor from './zh-CN/Scene/editor';
import mapMonitor from './zh-CN/Scene/monitor';
import simulator from './zh-CN/Scene/simulator';
import notification from './zh-CN/SSO/notification';
import alert from './zh-CN/alarm';
import latentTotStorage from './zh-CN/Resource/latentToteStorage';
import resource from './zh-CN/Resource/resource';
import vehicle from './zh-CN/vehicle';
import message from './zh-CN/message';
import devOps from './zh-CN/devOps';

export default {
  ...map,
  ...menu,
  ...task,
  ...charger,
  ...global,
  ...common,
  ...collection,
  ...requestor,
  ...simulator,
  ...chargingStrategy,
  ...systemParameters,
  ...reportCenter,
  ...translator,
  ...userManager,
  ...sectionManager,
  ...userLoginHistory,
  ...authorizationCenter,
  ...customConfiguration,
  ...customTasks,
  ...operationLog,
  ...lockManage,
  ...mapEditor,
  ...mapMonitor,
  ...notification,
  ...alert,
  ...latentTotStorage,
  ...resource,
  ...vehicle,
  ...message,
  ...devOps,
};

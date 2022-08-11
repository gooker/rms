import map from './Scene/map';
import menu from './menu';
import task from './task';
import charger from './Resource/charger';
import global from './global';
import common from './common';
import requestor from './Strategy/requestor';
import collection from './collection';
import chargingStrategy from './Strategy/chargingStrategy';
import systemParameters from './Strategy/systemParameters';
import reportCenter from './reportCenter';
import translator from './Strategy/translator';
import userManager from './SSO/userManager';
import sectionManager from './SSO/sectionManager';
import userLoginHistory from './SSO/userHistory';
import authorizationCenter from './SSO/authorizationCenter';
import customConfiguration from './SSO/customConfiguration';
import customTasks from './customTasks';
import operationLog from './SSO/operationlog';
import lockManage from './Resource/lockManage';
import mapEditor from './Scene/editor';
import mapMonitor from './Scene/monitor';
import simulator from './Scene/simulator';
import notification from './SSO/notification';
import alert from './alarm';
import latentTotStorage from './Resource/latentToteStorage';
import resource from './Resource/resource';
import vehicle from './vehicle';
import message from './message';
import devOps from './devOps';

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

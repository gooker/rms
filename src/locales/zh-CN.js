import menu from './zh-CN/menu';
import task from './zh-CN/task';
import common from './zh-CN/common';
import agvList from './zh-CN/agvList';
import request from './zh-CN/request';
import taskType from './zh-CN/taskType';
import enumerate from './zh-CN/enumerate';
import agvRealTime from './zh-CN/agvRealTime';
import chargingStrategy from './zh-CN/chargingStrategy';
import systemParameters from './zh-CN/systemParameters';
import translator from './zh-CN/Translator/translator';
import portal from './zh-CN/Portal/portal';
import userManager from './zh-CN/SSO/userManager';

export default {
  ...menu,
  ...task,
  ...common,
  ...agvList,
  ...request,
  ...taskType,
  ...enumerate,
  ...agvRealTime,
  ...chargingStrategy,
  ...systemParameters,
  ...translator,
  ...portal,
  ...userManager
};

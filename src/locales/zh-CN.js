import activity from './zh-CN/activity';
import agv from './zh-CN/agv';
import chargerManagement from './zh-CN/chargerManagement';
import common from './zh-CN/common';
import executionQ from './zh-CN/executionQ';
import taskQueue from './zh-CN/taskQueue';
import fault from './zh-CN/fault';
import firmwareUpgrade from './zh-CN/firmwareUpgrade';
import lock from './zh-CN/lock';
import log from './zh-CN/log';
import menu from './zh-CN/menu';
import podManager from './zh-CN/podManager';
import questionCenter from './zh-CN/questionCenter';
import report from './zh-CN/report';
import request from './zh-CN/request';
import taskDetail from './zh-CN/taskDetail';

export default {
  ...agv,
  ...activity,
  ...chargerManagement,
  ...common,
  ...executionQ,
  ...taskQueue,
  ...fault,
  ...firmwareUpgrade,
  ...lock,
  ...log,
  ...menu,
  ...podManager,
  ...questionCenter,
  ...report,
  ...request,
  ...taskDetail,
};

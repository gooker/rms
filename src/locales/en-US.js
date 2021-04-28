import activity from './en-US/activity';
import agv from './en-US/agv';
import chargerManagement from './en-US/chargerManagement';
import common from './en-US/common';
import executionQ from './en-US/executionQ';
import taskQueue from './en-US/taskQueue';
import fault from './en-US/fault';
import firmwareUpgrade from './en-US/firmwareUpgrade';
import lock from './en-US/lock';
import log from './en-US/log';
import menu from './en-US/menu';
import podManager from './en-US/podManager';
import questionCenter from './en-US/questionCenter';
import report from './en-US/report';
import request from './en-US/request';
import taskDetail from './en-US/taskDetail';

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

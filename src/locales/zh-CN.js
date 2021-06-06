import common from './zh-CN/common';
import menu from './zh-CN/menu';
import request from './zh-CN/request';
import task from './zh-CN/task';
import taskType from './zh-CN/taskType';
import agv from './zh-CN/agv';
import agvRealTime from './zh-CN/agvRealTime';
import firmwareUpgrade from './zh-CN/firmwareUpgrade';
import logDownLoad from './zh-CN/logDownLoad';
import fault from './zh-CN/fault';
import report from './zh-CN/report';
import systemParamsManager from './zh-CN/systemParamsManager';
import chargeManagement from './zh-CN/chargeManagement';

export default {
  ...menu,
  ...common,
  ...request,
  ...task,
  ...taskType,
  ...agv,
  ...agvRealTime,
  ...firmwareUpgrade,
  ...logDownLoad,
  ...fault,
  ...report,
  ...systemParamsManager,
  ...chargeManagement,
};

import agv from './zh-CN/agv';
import agvRealTime from './zh-CN/agvRealTime';
import chargeManagement from './zh-CN/chargeManagement';
import common from './zh-CN/common';
import enumerate from './zh-CN/enumerate';
import fault from './zh-CN/fault';
import firmwareUpgrade from './zh-CN/firmwareUpgrade';
import logDownLoad from './zh-CN/logDownLoad';
import menu from './zh-CN/menu';
import report from './zh-CN/report';
import request from './zh-CN/request';
import systemParamsManager from './zh-CN/systemParamsManager';
import task from './zh-CN/task';

export default {
  ...agv,
  ...agvRealTime,
  ...chargeManagement,
  ...common,
  ...enumerate,
  ...fault,
  ...firmwareUpgrade,
  ...logDownLoad,
  ...menu,
  ...report,
  ...request,
  ...systemParamsManager,
  ...task,
};

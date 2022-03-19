import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.SmartTask}/customOrderPool`,
    name: 'customOrderPool',
    icon: 'environment',
    component: '/SmartTask/CustomOrderPool',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/taskDependency`,
    name: 'taskDependency',
    icon: 'environment',
    component: '/SmartTask/TaskDependency',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/customTask`,
    name: 'customTask',
    icon: 'environment',
    component: '/SmartTask/CustomTask/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/taskRouteBind`,
    name: 'taskRouteBind',
    icon: 'environment',
    component: '/SmartTask/TaskRouteBind',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/limitEqualizer`,
    name: 'limitEqualizer',
    icon: 'environment',
    component: '/SmartTask/TaskLimitEqualizer/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/trigger`,
    name: 'trigger',
    icon: 'environment',
    component: '/SmartTask/TaskTrigger/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];

import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.SmartTask}/customOrderPool`,
    name: 'customOrderPool',
    icon: 'taskQueue',
    component: '/SmartTask/CustomOrderPool',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/taskDependency`,
    name: 'taskDependency',
    icon: 'dependency',
    component: '/SmartTask/TaskDependency',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/customTask`,
    name: 'customTask',
    icon: 'customConfig',
    component: '/SmartTask/CustomTask/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/taskRouteBind`,
    name: 'taskRouteBind',
    icon: 'binding',
    component: '/SmartTask/TaskRouteBind',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/limitEqualizer`,
    name: 'limitEqualizer',
    icon: 'limit',
    component: '/SmartTask/TaskLimitEqualizer/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/trigger`,
    name: 'trigger',
    icon: 'trigger',
    component: '/SmartTask/TaskTrigger/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];

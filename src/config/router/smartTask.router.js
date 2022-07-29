import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.SmartTask}/standardOrderPool`,
    name: 'standardTaskPool',
    icon: 'taskQueue',
    component: '/SmartTask/StandardTaskPool',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/taskHistory`,
    name: 'taskHistory',
    icon: 'taskHistory',
    component: '/SmartTask/TaskHistory',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/customTask`,
    name: 'customTask',
    icon: 'customTask',
    component: '/SmartTask/CustomTask/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SmartTask}/quickTask`,
    name: 'quickTask',
    icon: 'quickTask',
    component: '/SmartTask/QuickTask/index',
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

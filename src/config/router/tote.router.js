import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Tote}/task/toteTaskPool`,
    name: 'toteTaskPool',
    icon: 'taskQueue',
    component: '/Tote/ToteTaskPool',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.Tote}/task/waitingQueue`,
    name: 'waitingQueue',
    icon: 'taskQueue',
    component: '/Tote/TaskQueue',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.Tote}/task/executingQueue`,
    name: 'executingQueue',
    icon: 'executing',
    component: '/Tote/TaskExecuting',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.Tote}/task/taskManagement`,
    name: 'taskManagement',
    icon: 'taskQueue',
    component: '/Tote/TaskExecuted',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];

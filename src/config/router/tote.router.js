import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Tote}/task`,
    name: 'task',
    icon: 'taskManage',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Tote}/task/toteTaskPool`,
        name: 'toteTaskPool',
        component: '/Tote/ToteTaskPool',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Tote}/task/waitingQueue`,
        name: 'waitingQueue',
        component: '/Tote/TaskQueue',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Tote}/task/executingQueue`,
        name: 'executingQueue',
        component: '/Tote/TaskExecuting',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Tote}/task/taskManagement`,
        name: 'taskManagement',
        component: '/Tote/TaskExecuted',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Tote}/task/SystemParameters`,
        name: 'systemParameters',
        component: '/Tote/SystemParameters',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
];

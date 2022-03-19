import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Tote}/task`,
    name: 'task',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Tote}/task/toteTaskPool`,
        name: 'toteTaskPool',
        component: '/Tote/TotePoolTask',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Tote}/task/waitingQueue`,
        name: 'waitingQueue',
        component: '/Tote/WaitingQueue',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Tote}/task/executingQueue`,
        name: 'executingQueue',
        component: '/Tote/ExecutingQueue',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Tote}/task/taskManagement`,
        name: 'taskManagement',
        component: '/Tote/TaskManagement',
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

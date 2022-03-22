import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.LatentPod}/task`,
    name: 'task',
    icon: 'taskManage',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.LatentPod}/task/waitingQueue`,
        name: 'waitingQueue',
        component: '/LatentPod/TaskQueue',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.LatentPod}/task/executingQueue`,
        name: 'executingQueue',
        component: '/LatentPod/TaskExecuting',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.LatentPod}/task/taskManagement`,
        name: 'taskManagement',
        component: '/LatentPod/TaskExecuted',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
];

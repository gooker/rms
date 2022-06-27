import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.LatentPod}/task/waitingQueue`,
    name: 'waitingQueue',
    icon: 'taskQueue',
    component: '/LatentPod/TaskQueue',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.LatentPod}/task/executingQueue`,
    name: 'executingQueue',
    icon: 'executing',
    component: '/LatentPod/TaskExecuting',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.LatentPod}/task/taskManagement`,
    name: 'taskManagement',
    icon: 'taskQueue',
    component: '/LatentPod/TaskExecuted',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];

import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.FlexibleSorting}/sortTask`,
    name: 'sortTaskQueue',
    icon: 'taskQueue',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/FlexibleSorting/SortTaskQueue',
  },
  {
    path: `/${AppCode.FlexibleSorting}/sortExecuteTask`,
    name: 'sortExecutingTask',
    icon: 'executing',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/FlexibleSorting/SortExecutingTask',
  },
  {
    path: `/${AppCode.FlexibleSorting}/sortTaskManagement`,
    name: 'sortTaskManagement',
    icon: 'taskExecuted',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/FlexibleSorting/SortTaskManagement',
  },
];

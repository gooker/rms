import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.FlexibleSorting}/sortTask`,
    name: 'sortTaskQueue',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/FlexibleSorting/SortTaskQueue',
  },
  {
    path: `/${AppCode.FlexibleSorting}/sortExecuteTask`,
    name: 'sortExecutingTask',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/FlexibleSorting/SortExecutingTask',
  },
  {
    path: `/${AppCode.FlexibleSorting}/sortTaskManagement`,
    name: 'sortTaskManagement',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/FlexibleSorting/SortTaskManagement',
  },
];

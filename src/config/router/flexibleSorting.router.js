import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.FlexibleSorting}/sortTask`,
    name: 'sortTaskQueue',
    icon: 'pool',
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
    icon: 'taskSearch',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/FlexibleSorting/SortTaskManagement',
  },
];

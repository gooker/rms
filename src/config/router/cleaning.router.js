import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Cleaning}/strategy`,
    name: 'cleaningStrategy',
    icon: 'strategy',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Cleaning/CleaningStrategy',
  },
  {
    path: `/${AppCode.Cleaning}/planning`,
    name: 'cleaningPlan',
    icon: 'planning',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Cleaning/CleaningPlan',
  },
  {
    path: `/${AppCode.Cleaning}/record`,
    name: 'cleaningRecord',
    icon: 'history',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Cleaning/CleaningRecord',
  },
];

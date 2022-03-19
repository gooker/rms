import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Cleaning}/strategy`,
    name: 'cleaningStrategy',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Cleaning/CleaningStrategy',
  },
  {
    path: `/${AppCode.Cleaning}/planning`,
    name: 'cleaningPlan',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Cleaning/CleaningPlan',
  },
  {
    path: `/${AppCode.Cleaning}/record`,
    name: 'cleaningRecord',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Cleaning/CleaningRecord',
  },
];

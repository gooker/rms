import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Cleaning}/carry/taskPool`,
    name: 'carryTaskPool',
    icon: 'taskQueue',
    component: '/UnmannedCarry/UnmannedCarryTaskPool',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.Cleaning}/carry/taskManagement`,
    name: 'carryTaskManagement',
    icon: 'taskExecuted',
    component: '/UnmannedCarry/UnmannedCarryTaskManagement',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];

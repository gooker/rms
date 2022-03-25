import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.LatentTote}/latentToteTaskManagement`,
    name: 'latentToteTaskManagement',
    icon: 'taskExecuted',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/LatentTote/LantentToteTaskManagement',
  },
  {
    path: `/${AppCode.LatentTote}/simulationTask`,
    name: 'simulationTask',
    icon: 'taskExecuted',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/LatentTote/SimulationTask/SimulationTask',
  },
];

import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Strategy}/charging`,
    name: 'chargingStrategy',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/ChargingStrategy',
  },
  {
    path: `/${AppCode.Strategy}/speed`,
    name: 'speedStrategy',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/SpeedStrategy',
  },
  {
    path: `/${AppCode.Strategy}/parking`,
    name: 'parkingStrategy',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/ParkingStrategy',
  },
  {
    path: `/${AppCode.Strategy}/SystemParameters`,
    name: 'systemParameters',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/SystemParameters',
  },
];

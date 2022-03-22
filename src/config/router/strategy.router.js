import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Strategy}/charging`,
    name: 'chargingStrategy',
    icon: 'strategy',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/ChargingStrategy',
  },
  {
    path: `/${AppCode.Strategy}/speed`,
    name: 'speedStrategy',
    icon: 'strategy',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/SpeedStrategy',
  },
  {
    path: `/${AppCode.Strategy}/parking`,
    name: 'parkingStrategy',
    icon: 'strategy',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/ParkingStrategy',
  },
  {
    path: `/${AppCode.Strategy}/SystemParameters`,
    name: 'systemParameters',
    icon: 'list',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Strategy/SystemParameters',
  },
];

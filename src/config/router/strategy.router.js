import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Strategy}/strategy`,
    name: 'strategy',
    icon: 'strategy',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Strategy}/strategy/charging`,
        name: 'chargingStrategy',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/Strategy/ChargingStrategy',
      },
      // {
      //   path: `/${AppCode.Strategy}/strategy/speed`,
      //   name: 'speedStrategy',
      //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //   component: '/Strategy/SpeedStrategy',
      // },
      // {
      //   path: `/${AppCode.Strategy}/strategy/parking`,
      //   name: 'parkingStrategy',
      //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //   component: '/Strategy/ParkingStrategy',
      // },
    ],
  },
  {
    path: `/${AppCode.Strategy}/system`,
    name: 'systemConfig',
    icon: 'list',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Strategy}/system/parameters`,
        name: 'parameters',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/Strategy/SystemParameters',
      },
      {
        path: `/${AppCode.Strategy}/system/requestor`,
        name: 'requestor',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/Strategy/Requestor/index',
      },
      {
        path: `/${AppCode.Strategy}/system/richEditor`,
        name: 'richEditor',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/Strategy/RichEditor/index',
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.Strategy}/system/timeZone`,
        name: 'timeZone',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/Strategy/SystemTimezone/index',
      },
      {
        path: `/${AppCode.Strategy}/system/i18n`,
        name: 'i18n',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/Strategy/LanguageManage/index',
      },
    ],
  },
];

import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Report}/healthReport`,
    name: 'healthReport',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Report}/healthReport/agv`,
        name: 'agv',
        component: '/Report/HealthReport/AgvHealth/index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Report}/healthReport/network`,
        name: 'network',
        component: '/Report/HealthReport/NetworkHealth',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Report}/healthReport/qrcode`,
        name: 'qrcode',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: `/${AppCode.Report}/healthReport/qrcode/groundQrcodeHealth`,
            name: 'ground',
            component: '/Report/HealthReport/GroundQrcodeHealth',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.Report}/healthReport/qrcode/latentPodQrcodeHealth`,
            name: 'latentPod',
            component: '/Report/HealthReport/LatentPodQrcodeHealth',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.Report}/healthReport/qrcode/toteQrcodeHealth`,
            name: 'tote',
            component: '/Report/HealthReport/ToteQrcodeHealth',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      {
        path: `/${AppCode.Report}/healthReport/chargerHealth`,
        name: 'chargerHealth',
        component: '/Report/HealthReport/ChargerHealth',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Report}/healthReport/automationHealth`,
        name: 'automationHealth',
        component: '/Report/HealthReport/AutomationHealth',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.Report}/loadReport`,
    name: 'loadReport',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Report}/loadReport/agvLoad`,
        name: 'agvLoad',
        component: '/Report/LoadReport/AgvLoadReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Report}/loadReport/taskLoad`,
        name: 'taskLoad',
        component: '/Report/LoadReport/TaskLoadReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Report}/loadReport/containerLoad`,
        name: 'containerLoad',
        component: '/Report/LoadReport/ContainerLoadReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Report}/loadReport/chargerLoad`,
        name: 'chargerLoad',
        component: '/Report/LoadReport/ChargerLoadReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },

  {
    path: `/${AppCode.Report}/sourceDownload`,
    name: 'sourceDownload',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Report/SourceDownload',
  },
  {
    path: `/${AppCode.Report}/customReport`,
    name: 'customReport',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Report/CustomReport',
  },
  {
    path: `/${AppCode.Report}/taskReport`,
    name: 'taskReport',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Report/TaskReport/index',
  },
  {
    path: `/${AppCode.Report}/formManger/stationReport`,
    name: 'stationReport',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Report/StationReport/index',
  },
  {
    path: `/${AppCode.Report}/waitingReport`,
    name: 'waitingReport',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Report/WaitingReport/index',
  },
  {
    path: `/${AppCode.Report}/flowReport`,
    name: 'flowReport',
    icon: 'report',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Report/FlowReport',
  },
];

import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.I18N}/management`,
    name: 'languageManage',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/I18N/LanguageManage/index',
  },
];

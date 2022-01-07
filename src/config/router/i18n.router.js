import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.I18N}/languageManage`,
    name: 'languageManage',
    component: '/Translator/LanguageManage',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
    icon: 'global',
  },
];

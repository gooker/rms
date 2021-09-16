import SorterPermission from './sorter.permission';
import I18NPermission from './i18n.permission';
import { AppCode } from '@/config/config';

export default {
  [AppCode.Sorter]: SorterPermission,
  [AppCode.I18N]: I18NPermission,
  [AppCode.LatentLifting]: [],
  [AppCode.Tote]: [],
  [AppCode.ForkLifting]: [],
  [AppCode.Coordinator]: [],
};

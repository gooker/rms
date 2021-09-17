import SorterPermission from './sorter.permission';
import I18NPermission from './i18n.permission';
import MixrobotPermission from './mixrobot.permission'
import { BaseContext } from '@/config/config';

export default {
  [BaseContext.Coordinator]: MixrobotPermission,
  [BaseContext.Sorter]: SorterPermission,
  [BaseContext.I18N]: I18NPermission,
  // [BaseContext.LatentLifting]: [],
  // [BaseContext.Tote]: [],
  // [BaseContext.ForkLifting]: [],
};

import SorterPermission from './sorter.permission';
import I18NPermission from './i18n.permission';
import MixrobotPermission from './mixrobot.permission'
import TotePermission from './tote.permission'
import { BaseContext } from '@/config/config';

export default {
  [BaseContext.Coordinator]: MixrobotPermission,
  [BaseContext.Tote]: TotePermission,
  [BaseContext.Sorter]: SorterPermission,
  [BaseContext.I18N]: I18NPermission,
  // [BaseContext.LatentLifting]: [],
  // [BaseContext.ForkLifting]: [],
};

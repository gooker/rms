import XIHEPermission from './XIHE.permission';
import LatentLiftingPermission from './latentLifting.permission';
import TotePermission from './tote.permission';
import SorterPermission from './sorter.permission';
import I18NPermission from './i18n.permission';
import { AppCode } from '@/config/config';

export default {
  [AppCode.XIHE]: XIHEPermission,
  [AppCode.LatentLifting]: LatentLiftingPermission,
  [AppCode.Tote]: TotePermission,
  [AppCode.Sorter]: SorterPermission,
  [AppCode.I18N]: I18NPermission,
};

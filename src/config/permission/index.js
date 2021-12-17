import SorterPermission from './sorter.permission';
import I18NPermission from './i18n.permission';
import XIHEPermission from './XIHE.permission';
import TotePermission from './tote.permission';
import LatentLiftingPermission from './latentLifting.permission';
import { AppCode } from '@/config/config';

export default {
  [AppCode.XIHE]: XIHEPermission,
  [AppCode.LatentLifting]: LatentLiftingPermission,
  [AppCode.Tote]: TotePermission,
  [AppCode.Sorter]: SorterPermission,
  [AppCode.I18N]: I18NPermission,
};

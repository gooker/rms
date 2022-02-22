import SorterRouter from './sorter.router';
import TranslatorRouter from './i18n.router';
import SSORouter from './sso.router';
import XIHERouter from './XIHE.router';
import ToteRouter from './tote.router';
import LatentLiftingRouter from './latentLifting.router';

import { AppCode } from '@/config/config';

export default {
  [AppCode.XIHE]: XIHERouter,
  [AppCode.LatentLifting]: LatentLiftingRouter,
  // [AppCode.Tote]: ToteRouter,
  [AppCode.Sorter]: SorterRouter,
  [AppCode.I18N]: TranslatorRouter,
  [AppCode.SSO]: SSORouter,
};

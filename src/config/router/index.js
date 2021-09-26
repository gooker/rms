import SorterRouter from './sorter.router';
import TranslatorRouter from './i18n.router';
import SsoRouter from './sso.router';
import MixrobotRouter from './mixrobot.router'
import ToteRouter from './tote.router';
import { BaseContext } from '@/config/config';

export default {
  [BaseContext.Coordinator]: MixrobotRouter,
  [BaseContext.LatentLifting]: [],
  [BaseContext.Tote]: ToteRouter,
  [BaseContext.Sorter]: SorterRouter,
  [BaseContext.ForkLifting]: [],
  [BaseContext.I18N]: TranslatorRouter,
  [BaseContext.SSO]: SsoRouter,
};

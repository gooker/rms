import SorterRouter from './sorter.router';
import TranslatorRouter from './i18n.router';
import { BaseContext } from '@/config/config';

export default {
  [BaseContext.I18N]: TranslatorRouter,
  [BaseContext.Sorter]: SorterRouter,
  [BaseContext.LatentLifting]: [],
  [BaseContext.Tote]: [],
  [BaseContext.ForkLifting]: [],
  [BaseContext.Coordinator]: [],
  [BaseContext.SSO]: [],
};

import SorterRouter from './sorter.router';
import TranslatorRouter from './i18n.router';
import { AppCode } from '@/config/config';

export default {
  [AppCode.I18N]: TranslatorRouter,
  [AppCode.Sorter]: SorterRouter,
};

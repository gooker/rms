import { createFromIconfontCN } from '@ant-design/icons';

const ExtraIconCharge = createFromIconfontCN({
  scriptUrl: ['IconFont.js'],
  // scriptUrl: ['//at.alicdn.com/t/font_2597007_tp7trmgyemn.js'],
});

function IconDir(icon, style) {
  if (!style) {
    return <ExtraIconCharge style={style} type={icon} />;
  }
  return <ExtraIconCharge type={icon} />;
}
export default IconDir;

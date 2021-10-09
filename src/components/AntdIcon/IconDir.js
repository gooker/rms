import { createFromIconfontCN } from '@ant-design/icons';

const ExtraIconCharge = createFromIconfontCN({
  scriptUrl: ['IconFont.js'],
});

function IconDir(icon, style) {
  if (!style) {
    return <ExtraIconCharge style={style} type={icon} />;
  }
  return <ExtraIconCharge type={icon} />;
}
export default IconDir;

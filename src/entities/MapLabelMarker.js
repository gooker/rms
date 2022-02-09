import ResizableContainer from '@/components/ResizableContainer';
import { Text } from '@/entities';
import { MapSelectableSpriteType, zIndex } from '@/config/consts';

export default class MapLabelMarker extends ResizableContainer {
  constructor({ code, x, y, color, text, width, height, refresh, select, interactive }) {
    super();
    this.x = x;
    this.y = y;
    this.code = code;
    this.text = text;
    this.color = color;
    this.refresh = refresh;
    this.zIndex = zIndex.label;
    this.select = (add) => {
      select({ id: code, type: MapSelectableSpriteType.LABEL }, add);
    };
    const element = this.createElement(width, height);
    this.create(element, this.updateZonMarker, zIndex.label, interactive);
  }

  createElement(width, height) {
    let element = new Text(this.text, 0, 0, this.color, true, 200);
    element.width = width;
    element.height = height;
    element.alpha = 0.8;
    element.anchor.set(0.5);
    return element;
  }

  updateZonMarker(data) {
    const { dispatch } = window.g_app._store;
    dispatch({ type: 'editor/updateLabelMarker', payload: { code: this.code, ...data } });
  }
}

import ResizableContainer from '@/components/ResizableContainer';
import { Text } from '@/entities';
import { zIndex } from '@/config/consts';

export default class MapLabelMarker extends ResizableContainer {
  constructor({ x, y, color, text, width, height, refresh }) {
    super();
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.refresh = refresh;
    this.zIndex = zIndex.label;
    const element = this.createElement(width, height);
    this.create(element, zIndex.label);
  }

  createElement(width, height) {
    let element = new Text(this.text, 0, 0, this.color, true, 200);
    element.width = width;
    element.height = height;
    element.alpha = 0.8;
    element.anchor.set(0.5);
    return element;
  }
}

import ResizableContainer from '@/components/ResizableContainer';
import { Text } from '@/entities';
import { MapSelectableSpriteType, SelectionType, zIndex } from '@/config/consts';

export default class MapLabelMarker extends ResizableContainer {
  constructor(props) {
    const { code, x, y, color, text, width, height } = props;
    const { refresh, select, interactive } = props;

    super();
    this.type = MapSelectableSpriteType.LABEL;
    this.x = x;
    this.y = y;
    this.code = code;
    this.text = text;
    this.color = color;
    this.refresh = refresh;
    this.zIndex = zIndex.label;
    this.select = (event) => {
      this.click(event, select);
    };
    const element = this.createElement(width, height);
    this.create(element, this.updateZonMarker, zIndex.label, interactive);
  }

  click = (event, select) => {
    if (event?.data.originalEvent.ctrlKey || event?.data.originalEvent.metaKey) {
      select && select(this, SelectionType.CTRL);
    } else {
      select && select(this, SelectionType.SINGLE);
    }
  };

  createElement(width, height) {
    let element = new Text(this.text, 0, 0, this.color, true, 200);
    element.width = width;
    element.height = height;
    element.alpha = 0.8;
    element.anchor.set(0.5);
    return element;
  }

  updateZonMarker(data) {
    window.$$dispatch({ type: 'editor/updateLabelMarker', payload: { code: this.code, ...data } });
  }
}

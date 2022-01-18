import * as PIXI from 'pixi.js';

export default class Text extends PIXI.Text {
  constructor(text, x, y, color, isBold, size) {
    super(
      text,
      new PIXI.TextStyle({
        fontFamily: 'Helvetica',
        fontSize: size || 50,
        fontWeight: isBold ? 'bold' : 'normal',
        fill: color || 0xffffff,
      }),
    );
    this.position.set(x, y);
  }
}

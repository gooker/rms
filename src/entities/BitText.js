import * as PIXI from 'pixi.js';

export default class BitText extends PIXI.BitmapText {
  constructor(text, x, y, color, size) {
    super(`${text}`, {
      fontName: 'Arial',
      fontSize: size || 50,
      tint: color,
    });
    this.position.set(x, y);
  }
}

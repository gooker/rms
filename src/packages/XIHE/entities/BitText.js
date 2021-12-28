import * as PIXI from 'pixi.js';

export default class BitText extends PIXI.BitmapText {
  constructor(text, x, y, color, size) {
    super(`${text}`, {
      font: size ? `${size}px Arial` : '50px Arial',
      tint: color,
    });
    this.position.set(x, y);
  }
}

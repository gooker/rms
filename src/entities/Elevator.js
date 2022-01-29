import * as PIXI from 'pixi.js';
import { getTextureFromResources } from '@/utils/mapUtil';
import { GlobalAlpha, ElevatorSize } from '@/config/consts';

export default class Elevator extends PIXI.Container {
  constructor(props) {
    super();
    this.id = props.id;
    this.x = props.x;
    this.y = props.y;
    this.alpha = GlobalAlpha;
    this.create();
    this.addChild(this.elevator);
  }

  create() {
    const elevatorTexture = getTextureFromResources('elevator');
    const elevator = new PIXI.Sprite(elevatorTexture);
    const scaleX = ElevatorSize.width / elevatorTexture.width;
    const scaleY = ElevatorSize.height / elevatorTexture.height;
    elevator.anchor.set(0.5);
    elevator.setTransform(0, 0, scaleX, scaleY);
    this.elevator = elevator;
  }
}

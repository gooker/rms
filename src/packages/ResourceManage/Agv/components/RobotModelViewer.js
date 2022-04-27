import React, { memo, useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { getCoordinat } from '@/utils/mapUtil';
import { BitText } from '@/entities';

const height = 400;
let app;
const RobotModelViewer = ({ data }) => {
  const domRef = useRef();
  const { front, rear, left, right, radius } = data.dimension;

  useEffect(() => {
    initPixi();

    return () => {
      app.destroy(true);
      app = null;
    };
  }, []);

  useEffect(() => {
    renderStage();
  }, [data]);

  function initPixi() {
    const { width } = domRef.current.getBoundingClientRect();
    app = new PIXI.Application({
      width,
      height,
      antialias: true,
      autoDensity: true,
      backgroundColor: 0xf3f4f7,
      resolution: window.devicePixelRatio || 1.0,
      powerPreference: 'high-performance',
    });
    domRef.current.appendChild(app.view);
  }

  function renderStage() {
    if (app.stage) {
      app.stage.removeChildren();
    }
    const { width } = app.screen;
    let ratio = height / (front + rear) - 0.1;
    const graphics = new PIXI.Graphics();

    // 画车模型轮廓
    const positionX = width / 2 - ((left + right) / 2) * ratio;
    const positionY = height / 2 - ((front + rear) / 2) * ratio;
    graphics.lineStyle(2, 0x00000, 1);
    graphics.drawRect(positionX, positionY, (left + right) * ratio, (front + rear) * ratio);

    // 画锚点
    const anchorX = positionX + left * ratio;
    const anchorY = positionY + front * ratio;
    graphics.lineStyle(4, 0x00000, 1);
    graphics.drawCircle(anchorX, anchorY, 2);

    // 画小车旋转范围
    graphics.lineStyle(2, 0x00aeff, 1);
    graphics.drawCircle(width / 2, height / 2, radius * ratio);

    // 画旋转半径线条
    graphics.lineStyle(2, 0x00aeff, 1);
    const pos1 = getCoordinat({ x: anchorX, y: anchorY }, 45, radius * ratio);
    graphics.moveTo(anchorX, anchorY);
    graphics.lineTo(pos1.x, pos1.y);

    // 画小车模型尺寸线条
    graphics.lineStyle(2, 0x00000, 1);
    graphics.moveTo(anchorX, positionY);
    graphics.lineTo(anchorX, positionY + (front + rear) * ratio);
    graphics.moveTo(positionX, anchorY);
    graphics.lineTo(positionX + (left + right) * ratio, anchorY);

    // 画表示头部朝向的三角形
    graphics.beginFill(0x000000);
    graphics.moveTo(positionX - 70, anchorY - 50);
    graphics.lineTo(positionX - 90, anchorY);
    graphics.lineTo(positionX - 50, anchorY);
    graphics.endFill();

    app.stage.addChild(graphics);

    // front
    const frontText = new BitText(front, anchorX - 5, anchorY - (front * ratio) / 2, 0xfb8a2e, 20);
    frontText.anchor.set(1, 0.5);
    app.stage.addChild(frontText);

    // rear
    const rearText = new BitText(rear, anchorX + 5, anchorY + (rear * ratio) / 2, 0xfb8a2e, 20);
    rearText.anchor.set(0, 0.5);
    app.stage.addChild(rearText);

    // left
    const leftText = new BitText(left, anchorX - (left * ratio) / 2, anchorY + 5, 0xfb8a2e, 20);
    leftText.anchor.set(0.5, 0);
    app.stage.addChild(leftText);

    // right
    const rightText = new BitText(right, anchorX + (right * ratio) / 2, anchorY + 5, 0xfb8a2e, 20);
    rightText.anchor.set(0.5, 0);
    app.stage.addChild(rightText);

    // radius
    const pos2 = getCoordinat({ x: anchorX, y: anchorY }, 45, (radius / 2) * ratio);
    const radiusText = new BitText(radius, pos2.x, pos2.y, 0xfb8a2e, 20);
    radiusText.anchor.set(0.5);
    app.stage.addChild(radiusText);
  }

  return <div ref={domRef} style={{ height }} />;
};
export default memo(RobotModelViewer);

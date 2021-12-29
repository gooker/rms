import React, { memo, useEffect } from 'react';
import * as PIXI from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import commonStyles from '@/common.module.less';

const EditorMapView = (props) => {
  useEffect(() => {
    const domContainer = document.getElementById('editorMap');
    const { width, height } = domContainer.getBoundingClientRect();

    const app = new PIXI.Application({
      width,
      height,
      resolution: window.devicePixelRatio,
      antialias: true,
      backgroundAlpha: 0,
    });
    domContainer.appendChild(app.view);

    const scrollBox = app.stage.addChild(
      new Scrollbox({
        boxWidth: width,
        boxHeight: height,
        passiveWheel: false,
        stopPropagation: true,
        divWheel: app.view,
        interaction: app.renderer.plugins.interaction,
      }),
    );

    const texture = PIXI.Texture.from('/webView/agv_tote.png');
    const positions = [
      [-1200, -1200],
      [1000, 1000],
    ];
    for (let index = 0; index < 2; index++) {
      const sprite = new PIXI.Sprite(texture);
      sprite.position.set(positions[index][0], positions[index][1]);
      scrollBox.content.addChild(sprite);
    }

    // force an update of the scrollbox's calculations after updating the children
    scrollBox.update();
  }, []);

  return <div id="editorMap" className={commonStyles.mapBodyMiddle} />;
};
export default memo(EditorMapView);

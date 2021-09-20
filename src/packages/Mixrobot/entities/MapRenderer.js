import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import Config from '@/config';

export default class MapRenderer {
  constructor(viewport, callRenderer, renderer) {
    this.viewport = viewport;
    this.renderer = renderer;
    this.callRenderer = callRenderer;
  }

  refresh() {
    this.callRenderer();
  }

  resize(width, height) {
    this.renderer.resize(width, height);
    this.viewport.resize(width, height);
    this.callRenderer();
  }

  centerView(cells) {
    if (cells && Object.keys(cells).length > 0) {
      // Sort all points x & y
      const uniqueXs = uniq(
        Object.keys(cells)
          .map((id) => cells[id])
          .map((cell) => cell.x),
      );
      const Xs = sortBy(uniqueXs, (x) => x);

      const uniqueYs = uniq(
        Object.keys(cells)
          .map((id) => cells[id])
          .map((cell) => cell.y),
      );
      const Ys = sortBy(uniqueYs, (y) => y);

      // Get Min and Max
      const minX = Xs[0];
      const minY = Ys[0];
      const maxX = Xs[Xs.length - 1];
      const maxY = Ys[Ys.length - 1];

      // Map elements Area
      const elementsWidth = maxX - minX + Config.CellWidth;
      const elementsHeight = maxY - minY + Config.CellHeight;

      const worldWidth = elementsWidth * Config.WorldScreenRatio;
      const worldHeight = elementsHeight * Config.WorldScreenRatio;

      this.viewport.worldWidth = worldWidth;
      this.viewport.worldHeight = worldHeight;
      this.viewport.fitWorld(false);
      
      this.viewport.moveCenter(minX + elementsWidth / 2, minY + elementsHeight / 2);

      return { worldWidth, worldHeight };
    }
  }

  mapMoveTo(x, y, scaled) {
    this.viewport.moveCenter(x, y);
    if (scaled) {
      this.viewport.scaled = scaled;
    }
  }
}

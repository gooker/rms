import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { Viewport } from 'pixi-viewport';
import classnames from 'classnames';
import { connect } from '@/utils/dva';
import { EditorLeftTools } from '../enums';
import commonStyles from '@/common.module.less';
import styles from './editorLayout.module.less';
import { isNull } from '@/utils/utils';
import { transformScreenToWorldCoordinator } from '@/utils/mapUtils';

/**
 * 这里使用class组件原因在于需要对renderer.plugins.interaction进行绑定&解绑事件, class组件处理起来更方便
 * @TODO 目前有个已知bug-->向左上方框选无效
 */
class EditorBodyLeft extends React.Component {
  pinterIsDown = false; // 标记指针是否被按下
  pointerDownX = null;
  pointerDownY = null;
  pointerUpX = null;
  pointerUpY = null;

  state = {
    activeKey: 'drag',
  };

  /**
   * 这里针对 mouseUp && pointerUp 有个bug, 首次点击(click行为)会出现只触发了 down事件，up事件并未触发
   * 所以这个方法会在两中情况下触发
   * 1. 按下
   * 2. 首次点击
   */
  onMouseDown = (ev) => {
    // 不能阻止点击地图上任何元素
    if (!this.pinterIsDown && ev.target instanceof Viewport) {
      this.pinterIsDown = true;
      const maskDOM = document.getElementById('mapSelectionMask');
      const { x, y } = ev.data.global;
      this.pointerDownX = x;
      this.pointerDownY = y;
      maskDOM.style.display = 'block';
      maskDOM.style.left = `${x}px`;
      maskDOM.style.top = `${y}px`;
    }
  };

  onMouseMove = (ev) => {
    if (this.pinterIsDown) {
      this.pointerUpX = ev.data.global.x;
      this.pointerUpY = ev.data.global.y;
      const selectWidth = Math.abs(this.pointerUpX - this.pointerDownX);
      const selectHeight = Math.abs(this.pointerUpY - this.pointerDownY);
      const minX = Math.min(this.pointerUpX, this.pointerDownX);
      const minY = Math.min(this.pointerUpY, this.pointerDownY);

      const maskDOM = document.getElementById('mapSelectionMask');
      maskDOM.style.left = `${minX}px`;
      maskDOM.style.top = `${minY}px`;
      maskDOM.style.width = `${selectWidth}px`;
      maskDOM.style.height = `${selectHeight}px`;
    }
  };

  onMouseUp = (ev) => {
    this.pinterIsDown = false;
    // 重置选择框DOM样式
    const maskDOM = document.getElementById('mapSelectionMask');
    maskDOM.style.display = 'none';
    maskDOM.style.width = `${0}px`;
    maskDOM.style.height = `${0}px`;

    // 收集转换所需的数据
    let __viewport = ev.target;
    if (isNull(__viewport?.worldScreenWidth)) {
      __viewport = ev.currentTarget;
    }
    const mapDOM = document.getElementById('editorPixi');

    // 转换坐标
    const [rangeWorldStartX, rangeWorldStartY] = transformScreenToWorldCoordinator(
      { x: this.pointerDownX, y: this.pointerDownY },
      mapDOM,
      __viewport,
    );
    const [rangeWorldEndX, rangeWorldEndY] = transformScreenToWorldCoordinator(
      { x: this.pointerUpX, y: this.pointerUpY },
      mapDOM,
      __viewport,
    );

    this.afterDrawRectangle(rangeWorldStartX, rangeWorldStartY, rangeWorldEndX, rangeWorldEndY);

    // 重置参数
    this.pointerDownX = null;
    this.pointerDownY = null;
    this.pointerUpX = null;
    this.pointerUpY = null;
  };

  handleMaskEvent = () => {
    const { activeKey } = this.state;
    const { mapContext } = this.props;
    if (mapContext?.pixiUtils?.renderer) {
      const {
        pixiUtils: { renderer },
      } = mapContext;
      if (activeKey === 'choose') {
        renderer.plugins.interaction.on('pointerdown', this.onMouseDown);
        renderer.plugins.interaction.on('pointermove', this.onMouseMove);
        renderer.plugins.interaction.on('pointerup', this.onMouseUp);
      } else {
        renderer.plugins.interaction.off('pointerdown', this.onMouseDown);
        renderer.plugins.interaction.off('pointermove', this.onMouseMove);
        renderer.plugins.interaction.off('pointerup', this.onMouseUp);
      }
    }
  };

  afterDrawRectangle = (startX, startY, endX, endY) => {
    const { mapContext, currentCells } = this.props;

    const [_startX, _endX] = [startX, endX].sort();
    const [_startY, _endY] = [startY, endY].sort();

    // 这里要判断到底要干什么
    const cellsInRange = currentCells
      .filter(
        (item) => item.x >= _startX && item.x <= _endX && item.y >= _startY && item.y <= _endY,
      )
      .map(({ id }) => id);
    mapContext.rectangleSelection(cellsInRange);
  };

  render() {
    const { activeKey } = this.state;
    const { mapContext } = this.props;
    return (
      <div className={classnames(commonStyles.mapBodyLeft, styles.bodyLeftSide)}>
        {EditorLeftTools.map(({ label, value, icon }) => (
          <Tooltip key={value} placement="right" title={label}>
            <span
              className={activeKey === value ? styles.contentActive : undefined}
              onClick={() => {
                mapContext.pixiUtils.viewport.drag({ pressDrag: value === 'drag' });
                this.setState({ activeKey: value }, () => {
                  this.handleMaskEvent();
                });
              }}
            >
              {icon}
            </span>
          </Tooltip>
        ))}
      </div>
    );
  }
}
export default connect(({ editor }) => ({
  mapContext: editor.mapContext,
  currentCells: editor.currentCells,
}))(memo(EditorBodyLeft));

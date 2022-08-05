import React from 'react';
import { connect } from '@/utils/RmsDva';
import { isNull } from '@/utils/util';
import { IconFont } from '@/components/IconFont';
import { DumpBasket } from '@/entities';
import { MonitorOperationType } from '@/packages/Scene/MapMonitor/MonitorConts';
import EventManager from '@/utils/EventManager';
import styles from './components.module.less';

@connect(({ monitor }) => ({
  mapContext: monitor.mapContext,
  selections: monitor.selections,
  operationType: monitor.operationType,
  selectableType: monitor.selectableType,
}))
class OperationType extends React.PureComponent {
  // 标记指针相关数据
  pinterIsDown = false;
  pinterIsMoving = false;
  pinterDownTimestamp = null;

  // 框选的screen坐标数据
  pointerDownX = null;
  pointerDownY = null;
  pointerUpX = null;
  pointerUpY = null;

  componentWillReceiveProps(nextProps, nextContext) {
    const { operationType, mapContext } = nextProps;
    const dom = document.getElementById('monitorPixiContainer');
    if (isNull(this.props.mapContext) && !isNull(mapContext)) {
      mapContext.pixiUtils.viewport.drag({ pressDrag: true });
      dom.style.cursor = 'grab';
    }

    if (this.props.operationType !== operationType) {
      const isGrab = operationType !== MonitorOperationType.Choose;
      mapContext.pixiUtils.viewport.drag({ pressDrag: isGrab });
      dom.style.cursor = isGrab ? 'grab' : 'default';
      this.handleMaskEvent(operationType, mapContext.pixiUtils.renderer);
    }
  }

  handleMaskEvent = (activeKey, renderer) => {
    if (activeKey === MonitorOperationType.Choose) {
      renderer.plugins.interaction.on('pointerdown', this.onMouseDown);
      renderer.plugins.interaction.on('pointermove', this.onMouseMove);
      renderer.plugins.interaction.on('pointerup', this.onMouseUp);
      // 解决向左上方画区域不会触发 pointerup 事件
      renderer.plugins.interaction.on('pointerupoutside', this.onMouseUp);
    } else {
      renderer.plugins.interaction.off('pointerdown', this.onMouseDown);
      renderer.plugins.interaction.off('pointermove', this.onMouseMove);
      renderer.plugins.interaction.off('pointerup', this.onMouseUp);
      renderer.plugins.interaction.off('pointerupoutside', this.onMouseUp);
    }
  };

  onMouseDown = (ev) => {
    this.pinterDownTimestamp = new Date().getTime();
    // 不能阻止点击地图上任何元素
    if (!this.pinterIsDown && !isNull(ev.target.worldScreenWidth)) {
      this.pinterIsDown = true;
      const maskDOM = document.getElementById('monitorMask');
      const { x, y } = ev.data.global;
      this.pointerDownX = x;
      this.pointerDownY = y;
      maskDOM.style.left = `${x}px`;
      maskDOM.style.top = `${y}px`;
    }
  };

  onMouseMove = (ev) => {
    if (this.pinterIsDown) {
      this.pinterIsMoving = true;
      this.pointerUpX = ev.data.global.x;
      this.pointerUpY = ev.data.global.y;
      const selectWidth = Math.abs(this.pointerUpX - this.pointerDownX);
      const selectHeight = Math.abs(this.pointerUpY - this.pointerDownY);
      const maskDOM = document.getElementById('monitorMask');

      // 这个逻辑是为了解决第一次click不触发 pointerup 事件；因为事件触发在Mask节点上而不是Canvas，导致触发了 pointerupoutside 事件
      if (selectWidth * selectHeight >= 40) {
        maskDOM.style.display = 'block';
      }
      maskDOM.style.left = `${Math.min(this.pointerUpX, this.pointerDownX)}px`;
      maskDOM.style.top = `${Math.min(this.pointerUpY, this.pointerDownY)}px`;
      maskDOM.style.width = `${selectWidth}px`;
      maskDOM.style.height = `${selectHeight}px`;
    }
  };

  onMouseUp = (ev) => {
    if (!this.pinterIsDown) return;
    const { x, y } = ev.data.global;
    this.pointerUpX = x;
    this.pointerUpY = y;

    // 手动模拟点击事件
    const pointerTimeGap = new Date().getTime() - this.pinterDownTimestamp;
    if (!this.pinterIsMoving && pointerTimeGap <= 150) {
      this.cancelSelections();
    } else {
      this.hideMask();
      this.onSelectElement();
    }

    // 发布订阅
    EventManager.dispatch('moveUp', {
      start: {
        x: this.pointerDownX,
        y: this.pointerDownY,
      },
      end: {
        x: this.pointerUpX,
        y: this.pointerUpY,
      },
    });

    // 重置参数
    this.pinterIsMoving = false;
    this.pinterIsDown = false;
    this.pointerDownX = null;
    this.pointerDownY = null;
    this.pointerUpX = null;
    this.pointerUpY = null;
  };

  hideMask = () => {
    const maskDOM = document.getElementById('monitorMask');
    maskDOM.style.display = 'none';
    maskDOM.style.width = `${0}px`;
    maskDOM.style.height = `${0}px`;
  };

  // 取消选择所以已选中的元素
  cancelSelections = () => {
    const { dispatch, selections, mapContext } = this.props;
    selections.forEach((entity) => entity.onUnSelect());
    mapContext.refresh();
    dispatch({ type: 'monitor/updateSelections', payload: [] });
  };

  // 框选地图元素
  onSelectElement = (incremental) => {
    !incremental && this.cancelSelections();
    const { dispatch, mapContext, selectableType } = this.props;

    // 转换坐标确定选择区域
    const viewport = mapContext.pixiUtils.viewport;
    const { x: rangeWorldStartX, y: rangeWorldStartY } = viewport.toWorld(
      this.pointerDownX,
      this.pointerDownY,
    );
    const { x: rangeWorldEndX, y: rangeWorldEndY } = viewport.toWorld(
      this.pointerUpX,
      this.pointerUpY,
    );
    const [_startX, _endX] = [rangeWorldStartX, rangeWorldEndX].sort((x, y) => x - y);
    const [_startY, _endY] = [rangeWorldStartY, rangeWorldEndY].sort((x, y) => x - y);

    // 筛选出区域内的元素
    const selectable = [...selectableType];
    const selections = mapContext.pixiUtils.viewport.children
      .filter(
        (item) =>
          item.x >= _startX &&
          item.x <= _endX &&
          item.y >= _startY &&
          item.y <= _endY &&
          !(item instanceof DumpBasket), // 筛掉抛物篮
      )
      .filter((item) => selectable.includes(item.type));
    selections.forEach((item) => item.onSelect());
    mapContext.refresh();
    dispatch({ type: 'monitor/updateSelections', payload: selections });
  };

  onChange = (type) => {
    const { dispatch } = this.props;
    dispatch({ type: 'monitor/saveOperationType', payload: type });
  };

  render() {
    const { operationType } = this.props;
    return (
      <div className={styles.operationType}>
        <div
          className={
            operationType === MonitorOperationType.Choose ? styles.operationTypeActive : null
          }
          onClick={() => {
            this.onChange(MonitorOperationType.Choose);
          }}
        >
          <IconFont type={'icon-click'} />
        </div>
        <div
          className={
            operationType === MonitorOperationType.Drag ? styles.operationTypeActive : null
          }
          onClick={() => {
            this.onChange(MonitorOperationType.Drag);
          }}
        >
          <IconFont type={'icon-drag'} />
        </div>
      </div>
    );
  }
}
export default OperationType;

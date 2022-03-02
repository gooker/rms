import * as PIXI from 'pixi.js';
import { getCoordinat } from '@/utils/mapUtil';
import { isStrictNull, formatMessage } from '@/utils/util';
import { forIn } from 'lodash';

export default class RealtimeRate extends PIXI.Container {
  constructor(props) {
    super();

    this.angle = 0;
    this.zIndex = 0.5;
    this.direction = 0;
    this.alpha = 0.4;
    this.$visible = props.showRealTimeRate;
    this.$commonNum = 380;
    this.$commonNumY = 250;
    this.$width = 1800; // 不变
    this.$height = 1300; // 高度根据有几条数据设置 是动态的 一条320*1 2条320*2

    // 在外面先判断好 只要进来了 代表一定都不为空
    this.drawRealRate(props);
  }

  generatexy(props) {
    const commonStyle = {
      fontFamily: 'Arial',
      fontSize: 120,
      fontWeight: 'bold',
    };
    let commonX = (props.x || 0) * 1;
    let commonY = (props.y || 0) * 1;
    let commonAngle = props.angle || 0;
    let r = props.iconwidth || 1500;
    if ((commonAngle >= 0 && commonAngle < 90) || (commonAngle >= 180 && commonAngle < 270)) {
      r = props.iconheight / 2 + this.$height / 2 + 500 || 1500;
    }
    if ((commonAngle >= 90 && commonAngle < 180) || (commonAngle >= 270 && commonAngle < 360)) {
      r = props.iconwidth + 500 || 1500;
    }
    const { x, y } = getCoordinat({ x: commonX, y: commonY }, commonAngle, r);
    this.x = x;
    this.y = y;
    this.$style = {
      ...commonStyle,
      fill: '0xFFFFFF',
    };
    this.textStyle = {
      ...commonStyle,
      fill: '0x45b97c',
    };
  }

  drawRealRate(props) {
    // 根据站点的角度
    this.generatexy(props); // 算x y
    this.drawFrame();
    let dataLength = [];
    forIn(props, (value, key) => {
      if (key === 'goodsRate' && !isStrictNull(value)) {
        dataLength.push('goodsRate_1');
      }
      if (key === 'agvRate' && !isStrictNull(value)) {
        dataLength.push('agvRate');
      }
      if (key === 'waitTime' && !isStrictNull(value)) {
        dataLength.push('waitTime');
      }
      if (key === 'agvAndTaskProportion' && !isStrictNull(value)) {
        dataLength.push('agvAndTaskProportion');
      }
    });
    this.count = dataLength.length;
    this.$height = this.count * 325;
    this.$commonNumY = this.count * 62.5;
    !isStrictNull(props.goodsRate) && this.addFreight(props.goodsRate); // 货物速率 30.22个/小时
    !isStrictNull(props.agvRate) && this.addAgvRate(props.agvRate); // 车次速率 3.50次小时
    !isStrictNull(props.waitTime) && this.addWaitingTime(props.waitTime); // 已等待 30 秒
    !isStrictNull(props.agvAndTaskProportion) &&
      this.addTaskAllocation(props.agvAndTaskProportion, props.allocated); // 任务执行比 3/20
  }

  drawFrame() {
    this.labelSprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    this.labelSprite.width = this.$width;
    this.labelSprite.height = this.$height;
    this.labelSprite.tint = '0x999eff';
    this.labelSprite.visible = this.$visible;
    this.labelSprite.alpha = 0.4;
    this.labelSprite.anchor.set(0.5);
    this.addChild(this.labelSprite);
  }

  addFreight(goodsRate) {
    const _y = -(this.$height / 2).toFixed(2) + this.$commonNumY; //4-3
    const _x = (this.$width / 2).toFixed(2);
    this.labelFreightSprite = new PIXI.Text(
      formatMessage({ id: 'app.monitor.view.stationRealtimeRate.freightrate' }),
      this.$style,
    );
    this.labelFreightSprite.visible = this.$visible;
    this.labelFreightSprite.anchor.set(0.5);
    this.labelFreightSprite.x = -_x + this.$commonNum;
    this.labelFreightSprite.y = _y;

    this.rateFreightSprite = new PIXI.Text(
      `${goodsRate} ${formatMessage({ id: 'monitor.workstation.label.count' })}`,
      this.textStyle,
    );
    this.rateFreightSprite.visible = this.$visible;
    this.rateFreightSprite.anchor.set(0.5);
    this.rateFreightSprite.x = _x - this.$commonNum;
    this.rateFreightSprite.y = _y;
    this.addChild(this.labelFreightSprite);
    this.addChild(this.rateFreightSprite);
  }

  addAgvRate(rate) {
    const _y = -(this.$height / 2).toFixed(2) + this.$commonNumY * 2; //count
    const _x = (this.$width / 2).toFixed(2);
    this.labelAgvRateSprite = new PIXI.Text(
      formatMessage({ id: 'app.monitor.view.stationRealtimeRate.trainsrate' }),
      this.$style,
    );
    this.labelAgvRateSprite.visible = this.$visible;
    this.labelAgvRateSprite.anchor.set(0.5);
    this.labelAgvRateSprite.x = -_x + this.$commonNum;
    this.labelAgvRateSprite.y = _y;

    this.rateAgvRateSprite = new PIXI.Text(
      `${rate} ${formatMessage({ id: 'monitor.workstation.label.rate' })}`,
      this.textStyle,
    );
    this.rateAgvRateSprite.visible = this.$visible;
    this.rateAgvRateSprite.anchor.set(0.5);
    this.rateAgvRateSprite.x = _x - this.$commonNum;
    this.rateAgvRateSprite.y = _y;
    this.addChild(this.labelAgvRateSprite);
    this.addChild(this.rateAgvRateSprite);
  }

  addWaitingTime(time) {
    const _y = -(this.$height / 2).toFixed(2) + this.$commonNumY * 3;
    const _x = (this.$width / 2).toFixed(2);
    this.labelWaitSprite = new PIXI.Text(
      formatMessage({ id: 'app.monitor.view.stationRealtimeRate.waiting' }),
      this.$style,
    );
    this.labelWaitSprite.visible = this.$visible;
    this.labelWaitSprite.anchor.set(0.5);
    this.labelWaitSprite.x = -_x + this.$commonNum;
    this.labelWaitSprite.y = _y;

    const _time = (time / 1000).toFixed(2);

    this.waitTimeSprite = new PIXI.Text(
      `${_time} ${formatMessage({ id: 'app.customTask.form.second' })}`,
      this.textStyle,
    );
    this.waitTimeSprite.visible = this.$visible;
    this.waitTimeSprite.anchor.set(0.5);
    this.waitTimeSprite.x = _x - this.$commonNum;
    this.waitTimeSprite.y = _y;
    this.addChild(this.labelWaitSprite);
    this.addChild(this.waitTimeSprite);
  }
  addTaskAllocation(agvAndTaskProportion) {
    const _y = -(this.$height / 2).toFixed(2) + this.$commonNumY * 4;
    const _x = (this.$width / 2).toFixed(2);
    this.labelAllocatedSprite = new PIXI.Text(
      formatMessage({ id: 'app.monitor.view.stationRealtimeRate.allocationrate' }),
      this.$style,
    );
    this.labelAllocatedSprite.visible = this.$visible;
    this.labelAllocatedSprite.anchor.set(0.5);
    this.labelAllocatedSprite.x = -_x + this.$commonNum;
    this.labelAllocatedSprite.y = _y;

    this.numAllocatedSprite = new PIXI.Text(`${agvAndTaskProportion}`, this.textStyle);
    this.numAllocatedSprite.visible = this.$visible;
    this.numAllocatedSprite.anchor.set(0.5);
    this.numAllocatedSprite.x = _x - this.$commonNum;
    this.numAllocatedSprite.y = _y;
    this.addChild(this.labelAllocatedSprite);
    this.addChild(this.numAllocatedSprite);
  }

  switchStationRateEntityShown(flag) {
    this.children.forEach((child) => {
      child.visible = flag;
    });
  }

  updateRateEntity(params) {
    this.children.forEach((child) => {
      this.removeChild(child);
      child.destroy(true);
    });

    this.drawRealRate(params);
  }
}

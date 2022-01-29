import React, { memo } from 'react';
import classnames from 'classnames';
import { connect } from '@/utils/RcsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { isStrictNull, renderAgvState, renderBattery } from '@/utils/util';
import styles from '../monitorLayout.module.less';

const ElementProp = (props) => {
  const {
    height,
    data: { type, payload },
  } = props;

  return (
    <div
      style={{ height, width: 300 }}
      className={classnames(styles.popoverPanel, styles.rightSideAgvContent)}
    >
      <div>
        <FormattedMessage id={'app.common.prop'} />
      </div>
      <div>
        {/* 小车详情 */}
        <div>
          {/* 小车*/}
          <div className={styles.rightSideAgvContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 45, height: 'auto' }}
                src={require('../category/latent_category.svg').default}
              />
              <span>
                <FormattedMessage id={'app.agv'} />
              </span>
            </div>
            <div>{payload.robotId}</div>
          </div>

          {/* 电量 */}
          <div className={styles.rightSideAgvContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 35, height: 35 }}
                src={require('@/packages/XIHE/icons/electricity.png').default}
              />
              <span>
                <FormattedMessage id={'app.agv.electricity'} />
              </span>
            </div>
            <div>{renderBattery(payload.battery)}</div>
          </div>

          {/* 小车状态 */}
          <div className={styles.rightSideAgvContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/state.png').default}
              />
              <span>
                <FormattedMessage id={'app.common.status'} />
              </span>
            </div>
            <div>{renderAgvState(payload.agvStatus)}</div>
          </div>

          {/* 潜伏货架 */}
          <div className={styles.rightSideAgvContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/pod.png').default}
              />
              <span>
                <FormattedMessage id={'app.pod'} />
              </span>
            </div>
            <div>{payload.upliftPodId}</div>
          </div>

          {/* 任务 */}
          <div className={styles.rightSideAgvContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/task.png').default}
              />
              <span>
                <FormattedMessage id={'app.task'} />
              </span>
            </div>
            <div style={{ cursor: 'pointer', color: '#fff' }}>
              {!isStrictNull(payload.currentTaskId)
                ? `*${payload.currentTaskId.substr(payload.currentTaskId.length - 6, 6)}`
                : null}
              {}
            </div>
          </div>

          {/* 异常 */}
          <div className={styles.rightSideAgvContentDetail}>
            <div>
              <img
                alt={'agv'}
                style={{ width: 25, height: 25 }}
                src={require('@/packages/XIHE/icons/error.png').default}
              />
              <span>
                <FormattedMessage id={'app.agv.exception'} />
              </span>
            </div>
            <div />
          </div>
        </div>

        {/* 操作区域*/}
        <div style={{ marginTop: 30 }}>
          {/* 充电、休息 */}
          <div className={styles.rightSideAgvContentOperation}>
            <div className={styles.rightSideAgvContentOperationItem}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/charger.png').default} />
              <div>
                <FormattedMessage id={'monitor.right.charge'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/rest.png').default} />
              <div>
                <FormattedMessage id={'monitor.right.goRest'} />
              </div>
            </div>
            <div style={{ width: 80 }} />
          </div>

          {/* 路径、维护、手动 */}
          <div className={styles.rightSideAgvContentOperation}>
            <div className={styles.rightSideAgvContentOperationItem2}>
              <div>
                <img alt={'agv'} src={require('@/packages/XIHE/icons/path.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.path'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem2}>
              <div>
                <img alt={'agv'} src={require('@/packages/XIHE/icons/maintain.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.maintain'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem2}>
              <div>
                <img alt={'agv'} src={require('@/packages/XIHE/icons/manual.png').default} />
              </div>
              <div>
                <FormattedMessage id={'monitor.manual'} />
              </div>
            </div>
          </div>

          {/* 重置、重启、运行时 */}
          <div className={styles.rightSideAgvContentOperation}>
            <div className={styles.rightSideAgvContentOperationItem}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/reset.png').default} />
              <div>
                <FormattedMessage id={'app.button.reset'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/reboot.png').default} />
              <div>
                <FormattedMessage id={'monitor.reboot'} />
              </div>
            </div>
            <div className={styles.rightSideAgvContentOperationItem}>
              <img alt={'agv'} src={require('@/packages/XIHE/icons/runTime.png').default} />
              <div>
                <FormattedMessage id={'monitor.runTime'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  data: monitor.checkingElement,
}))(memo(ElementProp));

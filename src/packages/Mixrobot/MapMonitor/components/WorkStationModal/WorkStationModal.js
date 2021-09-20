import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { useMap } from '@umijs/hooks';
import { Dropdown, Menu, Switch, Spin, Tag } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { Permission } from '@/utils/Permission';
import {
  waitingHistoryLineOption,
  taskHistoryLineOption,
  LineChartsAxisColor,
  DataColor,
} from './echarts';
import commonStyle from '@/common/common.less';
import styles from './index.less';

let taskHistoryLine = null;
let waitingHistoryLine = null;
const clientHeightBase = 1.3;
const clientWidthBase = 3;
const EmployerColors = [
  '#3369e7',
  '#ff4c4c',
  '#34bf49',
  '#ffdd00',
  '#00c4ff',
  '#f39233',
  '#fa26a0',
  '#faafff',
];

const WorkStationModal = (props) => {
  const { workStation, marker, usedColors, dataSource = {}, waiting = {} } = props;
  const { name, direction, stopCellId, flag: showEmployee, color: employeeColor } = JSON.parse(
    workStation,
  );
  const availableColors = EmployerColors.filter((item) => !usedColors.includes(item));
  const monitorScreenDOM = document.body;

  const [agvs, setAgvs] = useState(null);
  const [checked, setChecked] = useState(false);
  const [color, setColor] = useState(employeeColor ?? availableColors[0]);

  const [map, { get: getModalSize, setAll }] = useMap([
    ['height', monitorScreenDOM.clientHeight / clientHeightBase],
    ['width', monitorScreenDOM.clientWidth / clientWidthBase],
  ]);

  useEffect(() => {
    const { clientHeight, clientWidth } = monitorScreenDOM;
    setAll([
      ['height', clientHeight / clientHeightBase],
      ['width', clientWidth / clientWidthBase],
    ]);
  }, []);

  useEffect(initChart, []);

  // workStation 的变化触发显重新拉取数据，dataSource的变化触发图表数据更新
  useEffect(refreshChart, [workStation, dataSource, waiting]);

  function initChart() {
    // 到站次数
    taskHistoryLine = echarts.init(document.getElementById('workStationTaskHistory'));
    taskHistoryLine.setOption(taskHistoryLineOption(), true);

    // 最后30次空等时间
    waitingHistoryLine = echarts.init(document.getElementById('waitingHistory'));
    waitingHistoryLine.setOption(waitingHistoryLineOption(), true);

    return () => {
      taskHistoryLine.dispose();
      taskHistoryLine = null;

      waitingHistoryLine.dispose();
      waitingHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!taskHistoryLine || !waitingHistoryLine) return;
    setAgvs(null);
    setChecked(showEmployee);

    const workStationTaskHistoryData = dataSource[`${stopCellId}-${direction}`];
    const workStationWaitingData = waiting[`${stopCellId}-${direction}`];

    if (workStationTaskHistoryData) {
      const { robotIds, taskHistoryData } = workStationTaskHistoryData;
      setAgvs(robotIds);
      const { xAxis, series } = taskHistoryData;
      const newTaskHistoryLineOption = taskHistoryLine.getOption();
      newTaskHistoryLineOption.xAxis = xAxis;
      newTaskHistoryLineOption.series = series;
      taskHistoryLine.setOption(newTaskHistoryLineOption, true);
    }

    if (workStationWaitingData) {
      const { xAxis, series } = workStationWaitingData;
      const newWaitingHistoryLineOption = waitingHistoryLine.getOption();
      newWaitingHistoryLineOption.xAxis = xAxis;
      newWaitingHistoryLineOption.series = series;
      waitingHistoryLine.setOption(newWaitingHistoryLineOption, true);
    }
  }

  function generateTitle() {
    return (
      <div>
        <span>{name ? `[${name}]` : formatMessage({ id: 'app.monitor.modal.workstation' })}</span>
        <span>{`-${stopCellId}-${direction}`}</span>
      </div>
    );
  }

  function renderTool() {
    if (agvs) {
      if (agvs.length > 0) {
        return agvs.map((id) => (
          <Tag key={id} color="rgba(1,137,255,0.6)">
            {id}
          </Tag>
        ));
      }
      return (
        <span style={{ color: 'rgb(3, 137, 255)' }}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.noTask" />
        </span>
      );
    }
    return <Spin />;
  }

  return (
    <div
      className={commonStyle.checkModal}
      style={{
        display: 'flex',
        top: '10%',
        left: `calc(50% - ${getModalSize('width') / 2}px)`,
        width: `${getModalSize('width')}px`,
        height: `${getModalSize('height')}px`,
      }}
    >
      <div className={commonStyle.header}>
        <div className={commonStyle.title}>{generateTitle()}</div>
      </div>
      <div className={commonStyle.body} style={{ display: 'flex', flexFlow: 'column nowrap' }}>
        <div id="workStationTaskHistory" style={{ flex: '0 45%' }} />
        <div id="waitingHistory" style={{ flex: '0 40%' }} />
        <div className={styles.tool}>
          <div>
            <span style={{ fontSize: '16px', color: LineChartsAxisColor }}>
              <FormattedMessage id="app.monitor.modal.workstation.label.serviceAMR" />:
            </span>
            <span
              style={{ fontSize: '16px', marginLeft: '8px', fontWeight: 500, color: DataColor }}
            >
              {agvs ? agvs.length : 0}
              {formatMessage({ id: 'app.monitor.modal.workstation.label.piece' })}
            </span>
          </div>
          <div style={{ marginTop: 4, display: 'flex', flexFlow: 'row wrap' }}>{renderTool()}</div>
          <div style={{ marginTop: 4, display: 'flex' }}>
            <Dropdown
              trigger={['click']}
              overlay={
                <Menu
                  onClick={(ev) => {
                    setColor(ev.key);
                  }}
                >
                  {EmployerColors.map((EmployerColor) => (
                    <Menu.Item key={EmployerColor}>
                      <div style={{ background: EmployerColor, height: 25, width: 60 }} />
                    </Menu.Item>
                  ))}
                </Menu>
              }
              disabled={checked || !agvs || agvs.length === 0}
            >
              <div style={{ background: color }} className={styles.dropDownContent} />
            </Dropdown>
            <div style={{ marginLeft: '5px' }}>
              <Permission id="/map/monitor/WorkStationModal/sign">
                <Switch
                  checked={checked}
                  checkedChildren={formatMessage({
                    id: 'app.monitor.modal.workstation.label.marked',
                  })}
                  unCheckedChildren={formatMessage({
                    id: 'app.monitor.modal.workstation.label.unmarked',
                  })}
                  onChange={(value) => {
                    setChecked(value);
                    const workStationOB = JSON.stringify({
                      name,
                      direction,
                      stopCellId,
                      flag: value,
                      color,
                    });
                    marker(agvs, value, color, `${stopCellId}-${direction}`, workStationOB);
                  }}
                />
              </Permission>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(WorkStationModal);

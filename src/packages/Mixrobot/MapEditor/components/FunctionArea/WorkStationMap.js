import React, { Component } from 'react';
import { connect } from '@/utils/dva';
import { Input, Form, Table, Row, Divider, Col, Button, InputNumber } from 'antd';
import MenuIcon from '@/utils/MenuIcon';
import { WorkStationSize } from '@/config/consts';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { isNull, isStrictNull, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import CardRadio from '@/packages/Mixrobot/MapEditor/components/CardRadio';
import InputWithIcon from '@/packages/Mixrobot/components/InputWithIcon';
import AngleSelector from '@/packages/Mixrobot/components/AngleSelector';
import SuperMultiSelect from '@/packages/Mixrobot/components/SuperMultiSelect';
import MapEditContext from '@/packages/Mixrobot/MapEditor/MapEditContext';

const formLayout = { labelCol: { span: 4 }, wrapperCol: { span: 19 } };
const noLabelFormLayout = { wrapperCol: { offset: 4, span: 19 } };

class WorkStationMap extends Component {
  static contextType = MapEditContext;

  formRef = React.createRef();

  state = {
    flag: 0,
    showForm: false,
    workStation: null,
  };

  workstationListColumns = [
    {
      // 名称
      title: formatMessage({ id: 'app.workStationMap.name' }),
      align: 'center',
      dataIndex: 'name',
    },
    {
      // 编码
      title: formatMessage({ id: 'form.code' }),
      align: 'center',
      dataIndex: 'station',
    },
    {
      // 停止点
      title: formatMessage({ id: 'app.workStationMap.stopPoint' }),
      align: 'center',
      dataIndex: 'stopCellId',
    },
    {
      // 角度
      title: formatMessage({ id: 'app.workStationMap.angle' }),
      align: 'center',
      dataIndex: 'angle',
    },
    {
      // 操作
      title: formatMessage({ id: 'app.workStationMap.operation' }),
      align: 'center',
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <div>
            <span
              key="edit"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.editRow(record, index);
              }}
            >
              {MenuIcon.edit}
            </span>
            <Divider type="vertical" />
            <span
              onClick={() => {
                this.remove(index + 1);
              }}
              key="delete"
              style={{ cursor: 'pointer' }}
            >
              {MenuIcon.delete}
            </span>
          </div>
        );
      },
    },
  ];

  onValuesChange = (changedValues, allValues) => {
    const { dispatch } = this.props;
    // 配置工作站最少参数是 角度 & 停止点
    if (!isNull(allValues.angle) && !isNull(allValues.stopCellId)) {
      const currentWorkStation = { ...allValues };
      // 如果此时没有输入编码，就是用默认值
      if (isStrictNull(currentWorkStation.station)) {
        currentWorkStation.station = `${allValues.stopCellId}-${allValues.angle}`;
      }
      // 默认值(保证数据正确)和size字段
      currentWorkStation.size = `${currentWorkStation.iconWidth || WorkStationSize.width}@${
        currentWorkStation.iconHeight || WorkStationSize.height
      }`;
      // 删除无用的字段
      delete currentWorkStation['direction&&angle'];
      delete currentWorkStation.iconWidth;
      delete currentWorkStation.iconHeight;

      dispatch({
        type: 'editor/updateFunction',
        payload: { scope: 'logic', type: 'workstationList', data: currentWorkStation },
      }).then((result) => {
        if (result.type === 'add') {
          this.context.addWorkStation(result.payload);
        }
        if (result.type === 'update') {
          const { pre, current } = result;
          this.context.removeWorkStation(pre);
          this.context.addWorkStation(current);
        }
        this.context.refresh();
      });
    }
  };

  editRow = (record, index) => {
    this.setState({
      workStation: record,
      showForm: true,
      flag: index + 1,
      tid: record.tid,
    });
  };

  remove = (flag) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'editor/removeFunction',
      payload: { flag, type: 'workstationList', scope: 'logic' },
    }).then((result) => {
      this.context.removeWorkStation(result);
      this.context.refresh();
    });
  };

  checkCodeDuplicate = (station) => {
    const { allWorkstations } = this.props;
    const { getFieldValue } = this.formRef.current;
    const { tid } = getFieldValue();
    const existCodes = allWorkstations
      .filter((item) => item.tid !== tid)
      .map((item) => item.station);
    return existCodes.includes(station);
  };

  render() {
    const _this = this;
    const { showForm, tid, flag, workStation } = this.state;
    const { selectCellIds, workstationList, allWorkstations } = this.props;

    let iconWidth = WorkStationSize.width; // 默认值
    let iconHeight = WorkStationSize.height; // 默认值
    if (workStation?.size) {
      const [_iconWidth, _iconHeight] = workStation.size.split('@');
      iconWidth = _iconWidth ? parseInt(_iconWidth, 10) : iconWidth;
      iconHeight = _iconHeight ? parseInt(_iconHeight, 10) : iconHeight;
    }

    if (showForm) {
      return (
        <Row style={{ margin: '20px 10px' }}>
          <div style={{ width: '100%' }}>
            <Divider orientation="left">
              {workStation
                ? formatMessage({ id: 'app.workStationMap.updateWorkstation' })
                : formatMessage({ id: 'app.workStationMap.addWorkstation' })}
            </Divider>
          </div>
          <Form ref={this.formRef} onValuesChange={this.onValuesChange}>
            {/* 隐藏字段 */}
            <Form.Item hidden name={'tid'} initialValue={tid} />
            <Form.Item hidden name={'flag'} initialValue={flag} />
            <Form.Item hidden name={'direction'} initialValue={workStation?.direction} />
            <Form.Item hidden name={'angle'} initialValue={workStation?.angle} />

            {/* 编码 */}
            <Form.Item
              {...formLayout}
              name={'station'}
              initialValue={workStation?.station}
              label={formatMessage({ id: 'form.code' })}
              rules={[
                () => ({
                  validator(_, value) {
                    const isDuplicate = _this.checkCodeDuplicate(value);
                    if (!isDuplicate) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(formatMessage({ id: 'app.commonFunction.station.duplicate' })),
                    );
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            {/* 名称 */}
            <Form.Item
              {...formLayout}
              name={'name'}
              initialValue={workStation?.name}
              label={<FormattedMessage id="app.workStationMap.name" />}
              getValueFromEvent={(ev) => {
                const value = ev.target.value;
                if (value) {
                  return value.replace(/[\u4E00-\u9FA5]/g, '');
                }
                return value;
              }}
            >
              <Input
                placeholder={formatMessage({
                  id: 'app.workStationMap.workstationNameTip',
                })}
              />
            </Form.Item>
            {/* "停止点" */}
            <Form.Item
              {...formLayout}
              name={'stopCellId'}
              initialValue={workStation?.stopCellId}
              label={formatMessage({ id: 'app.workStationMap.stopPoint' })}
            >
              <InputWithIcon
                currentCellId={selectCellIds}
                icon={
                  <img
                    alt={'stop'}
                    style={{ width: 25 }}
                    src={require('@/../public/webView/stop.png')}
                  />
                }
              />
            </Form.Item>
            {/* 距离停止点的距离 */}
            <Form.Item
              {...formLayout}
              name={'offset'}
              initialValue={workStation?.offset || 1900}
              label={<FormattedMessage id="app.dump.distance" />}
            >
              <InputNumber style={{ width: 150 }} />
            </Form.Item>
            {/* 图标 */}
            <Form.Item
              {...formLayout}
              name={'icon'}
              initialValue={workStation?.icon || 'work_station'}
              label={<FormattedMessage id="app.workStationMap.icon" />}
            >
              <CardRadio />
            </Form.Item>
            {/* 图标宽度 */}
            <Form.Item
              {...formLayout}
              name={'iconWidth'}
              initialValue={iconWidth}
              label={<FormattedMessage id="app.workStationMap.iconWidth" />}
            >
              <InputNumber />
            </Form.Item>
            {/* 图标高度 */}
            <Form.Item
              {...formLayout}
              name={'iconHeight'}
              initialValue={iconHeight}
              label={<FormattedMessage id="app.workStationMap.iconHeight" />}
            >
              <InputNumber />
            </Form.Item>
            {/* 角度 */}
            <Form.Item
              {...formLayout}
              name={'direction&&angle'}
              initialValue={workStation?.angle}
              label={<FormattedMessage id="app.workStationMap.angle" />}
              getValueFromEvent={(value) => {
                const { setFieldsValue } = this.formRef.current;
                setFieldsValue({
                  direction: value.dir,
                  angle: value.angle,
                });
                return value;
              }}
            >
              <AngleSelector />
            </Form.Item>
            {/* 扫描点 */}
            <Form.Item
              {...formLayout}
              name={'scanCellId'}
              initialValue={workStation?.scanCellId}
              label={<FormattedMessage id="app.workStationMap.scanningPoint" />}
            >
              <InputWithIcon
                icon={
                  <img
                    alt={'scan_cell'}
                    style={{ width: 25 }}
                    src={require('@/../public/webView/scan_cell.png')}
                  />
                }
                currentCellId={selectCellIds}
              />
            </Form.Item>
            {/* "缓冲点" */}
            <Form.Item
              {...formLayout}
              name={'bufferCellId'}
              initialValue={workStation?.bufferCellId}
              label={formatMessage({ id: 'app.workStationMap.bufferPoint' })}
            >
              <InputWithIcon
                currentCellId={selectCellIds}
                icon={
                  <img
                    alt={'buffer_cell'}
                    style={{ width: 25 }}
                    src={require('@/../public/webView/buffer_cell.png')}
                  />
                }
              />
            </Form.Item>
            {/* "旋转点" */}
            <Form.Item
              {...formLayout}
              name={'rotateCellIds'}
              initialValue={workStation?.rotateCellIds}
              label={formatMessage({ id: 'app.workStationMap.rotationPoint' })}
            >
              <SuperMultiSelect
                currentCellId={selectCellIds}
                icon={
                  <img
                    alt={'rotate'}
                    style={{ width: 25 }}
                    src={require('@/../public/webView/round.png')}
                  />
                }
              />
            </Form.Item>
            {/* "分叉点" */}
            <Form.Item
              {...formLayout}
              name={'branchPathCellIds'}
              initialValue={workStation?.branchPathCellIds}
              label={formatMessage({ id: 'app.workStationMap.bifurcationPoint' })}
            >
              <SuperMultiSelect
                currentCellId={selectCellIds}
                icon={
                  <img
                    alt={'bifurcation'}
                    style={{ width: 25 }}
                    src={require('@/../public/webView/bifurcation.png')}
                  />
                }
              />
            </Form.Item>
            {/* 返回 */}
            <Form.Item {...noLabelFormLayout}>
              <Col span={12}>
                <Button
                  type="primary"
                  icon={MenuIcon.rollback}
                  onClick={() => {
                    this.setState({ showForm: false, workStation: null });
                  }}
                >
                  <FormattedMessage id="app.workStationMap.back" />
                </Button>
              </Col>
            </Form.Item>
          </Form>
        </Row>
      );
    }
    return (
      <Row style={{ margin: '10px 0px' }}>
        <Row style={{ width: '100%' }}>
          <Col span={12}>
            <h3>
              <FormattedMessage id="app.workStationMap.workstationList" />
            </h3>
          </Col>
          <Col style={{ textAlign: 'end' }} span={12}>
            <Button
              size="small"
              type="primary"
              icon={MenuIcon.plus}
              onClick={() => {
                this.setState({
                  choice: '',
                  showForm: true,
                  flag: workstationList.length + 1,
                  tid: allWorkstations.length,
                });
              }}
            >
              <FormattedMessage id="app.workStationMap.add" />
            </Button>
          </Col>
        </Row>
        <Row style={{ width: '100%' }}>
          <Table
            bordered
            pagination={false}
            dataSource={workstationList}
            columns={this.workstationListColumns}
            scroll={{ x: 'max-content' }}
          />
        </Row>
      </Row>
    );
  }
}
export default connect(({ editor }) => {
  const { currentMap, selectCells } = editor;
  const currentLogicAreaData = getCurrentLogicAreaData();
  const workstationList = currentLogicAreaData?.workstationList ?? [];

  // 获取所有工作站点列表
  const allWorkstations = [];
  const { logicAreaList } = currentMap;
  logicAreaList.forEach((item) => {
    const logicWorkstations = item.workstationList || [];
    allWorkstations.push(...logicWorkstations);
  });

  return { allWorkstations, workstationList, selectCellIds: selectCells };
})(WorkStationMap);

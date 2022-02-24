import React, { memo } from 'react';
import { Form, Row, Col, Switch, Select, Button, message, Checkbox, InputNumber } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { fetchCellLocks } from '@/services/XIHE';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 500;
const { formItemLayout } = getFormLayout(6, 16);

const allLockOptions = [
  {
    value: 'PATH',
    label: formatMessage({ id: 'monitor.view.lock.path' }),
    key: 'PATH',
  },
  {
    value: 'ROTATION',
    label: formatMessage({ id: 'monitor.view.lock.rotation' }),
    key: 'ROTATION',
  },
  {
    value: 'SPECIAL',
    label: formatMessage({ id: 'monitor.view.lock.special' }),
    key: 'SPECIAL',
  },
];

const PathLock = (props) => {
  const { dispatch, allAGVs, mapRef, viewSetting, currentLogicAreaId } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onValuesChange(changedValues) {
    dispatch({
      type: 'monitor/fetchUpdateViewSetting',
      payload: {
        key: Object.keys(changedValues)[0],
        value: Object.values(changedValues)[0],
      },
    });
  }

  function onAgvListChanged(changedAgvList) {
    if (!mapRef) return;
    // 更新地图锁格显示
    const showLockCell = form.getFieldValue('showLockCell');
    if (changedAgvList.length > 0 && showLockCell.length > 0) {
      dispatch({
        type: 'monitor/fetchAllLockCells',
        payload: { lockTypes: showLockCell, robotIds: changedAgvList },
        then: (locked) => {
          if (!locked) {
            message.error(formatMessage({ id: 'monitor.tip.fetchLockFail' }));
            return;
          }
          mapRef.renderLockCell(locked);
        },
      });
    } else {
      mapRef.clearAllLocks();
    }
  }

  function selectAllAgvs() {
    const selectAgv = allAGVs.map(({ robotId }) => robotId);
    form.setFieldsValue({ selectAgv });
    onAgvListChanged(selectAgv);
    dispatch({
      type: 'monitor/fetchUpdateViewSetting',
      payload: { key: 'selectAgv', value: selectAgv },
    });
  }

  // 小车锁
  function refreshMapAgvLock() {
    const selectAgv = form.getFieldValue('selectAgv');
    if (selectAgv.length === 0) {
      message.error(formatMessage({ id: 'monitor.view.require.AGV' }));
      return false;
    }
    const showLockCell = form.getFieldValue('showLockCell');
    if (showLockCell && showLockCell.length > 0) {
      dispatch({
        type: 'monitor/fetchAllLockCells',
        payload: {
          lockTypes: showLockCell,
          robotIds: selectAgv,
        },
        then: (locked) => {
          if (!locked) {
            message.error(formatMessage({ id: 'monitor.tip.fetchLockFail' }));
            return;
          }
          mapRef.renderLockCell(locked);
        },
      });
    } else {
      mapRef.clearAllLocks();
    }
  }

  // 点位锁格
  async function viewCellLocker() {
    const cellId = form.getFieldValue('cellIdForLock');
    if (!isNull(cellId)) {
      const response = await fetchCellLocks(currentLogicAreaId, cellId);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'monitor.tip.fetchCellLockFail' }));
      } else {
        mapRef.renderCellLocks(response);
      }
    } else {
      message.error(formatMessage({ id: 'monitor.view.cell.required' }));
    }
  }

  // 临时不可走点
  function refreshTemporaryLockedCells() {
    dispatch({
      type: 'monitor/fetchTemporaryLockedCells',
    }).then((res) => {
      const showTempAllowed = form.getFieldValue('tempBlockShown');
      if (showTempAllowed) {
        mapRef.renderTemporaryLock(res || []);
      } else {
        mapRef.clearTemporaryLock();
      }
    });
  }

  // 新增临时不可走点
  function addTemporaryLockedCells() {
    const temporaryCell = form.getFieldValue('temporaryCell');
    if (temporaryCell.length !== 0) {
      const temporaryCellList = temporaryCell.map((record) => ({ robotId: -1, cellId: record }));
      dispatch({
        type: 'monitor/fetchSaveTemporaryCell',
        payload: {
          temporaryCellList,
        },
      }).then(refreshTemporaryLockedCells);
    } else {
      message.error(formatMessage({ id: 'monitor.view.temporaryBlock.required' }));
    }
  }

  // 删除临时不可走点
  const deleteTemporaryLockedCells = () => {
    const temporaryCell = form.getFieldValue('temporaryCell');
    if (temporaryCell.length !== 0) {
      const temporaryCellList = temporaryCell.map((record) => ({ robotId: -1, cellId: record }));
      dispatch({
        type: 'monitor/fetchDeleteTemporaryCell',
        payload: { temporaryCellList },
      }).then(refreshTemporaryLockedCells);
    } else {
      message.error(formatMessage({ id: 'monitor.view.temporaryBlock.required' }));
    }
  };

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.pathLock'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={form} onValuesChange={onValuesChange}>
          {/* 小车ID */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.agv.id' })} labelWrap>
            <Row gutter={10}>
              <Col span={18}>
                <Form.Item
                  noStyle
                  name={'selectAgv'}
                  initialValue={viewSetting?.selectAgv || []}
                  getValueFromEvent={(value) => {
                    onAgvListChanged(value);
                    return value;
                  }}
                >
                  <Select allowClear showSearch size="small" mode="tags" maxTagCount={5}>
                    {allAGVs.map((element) => (
                      <Select.Option key={element.robotId} value={element.robotId}>
                        {element.robotId}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Button size="small" onClick={selectAllAgvs}>
                  <FormattedMessage id="monitor.view.selectAgvall" />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 显示锁格 */}
          <Form.Item
            {...formItemLayout}
            name={'showLockCell'}
            valuePropName={'checked'}
            initialValue={viewSetting?.showLockCell || []}
            label={formatMessage({ id: 'monitor.view.lockView' })}
          >
            <Checkbox.Group
              options={allLockOptions.map((item) => ({
                ...item,
                label: formatMessage({ id: item.label }),
              }))}
            />

            <Button size="small" onClick={refreshMapAgvLock} style={{ marginTop: 5 }}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </Form.Item>

          {/* 显示路径 */}
          <Form.Item {...formItemLayout} label={formatMessage({ id: 'monitor.view.pathView' })}>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showRoute'}
                  valuePropName={'checked'}
                  initialValue={viewSetting?.showRoute || true}
                >
                  <Switch
                    checkedChildren={formatMessage({ id: 'app.notification.on' })}
                    unCheckedChildren={formatMessage({ id: 'app.notification.off' })}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showFullPath'}
                  valuePropName={'checked'}
                  initialValue={viewSetting?.showFullPath || false}
                >
                  <Checkbox>
                    <FormattedMessage id="monitor.view.path.fullPath" />
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  noStyle
                  {...formItemLayout}
                  name={'showTagetLine'}
                  valuePropName={'checked'}
                  initialValue={viewSetting?.showTagetLine || false}
                >
                  <Checkbox>
                    <FormattedMessage id="monitor.view.path.targetLine" />
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          {/* 点位锁格 */}
          <Form.Item {...formItemLayout} label={<FormattedMessage id="monitor.view.cellLock" />}>
            <Row style={{ width: '100%' }}>
              <Col span={5}>
                <Form.Item
                  name={'showLockedCell'}
                  valuePropName={'checked'}
                  initialValue={viewSetting?.showLockedCell}
                >
                  <Switch
                    checkedChildren={formatMessage({
                      id: 'app.map.view',
                    })}
                    unCheckedChildren={formatMessage({
                      id: 'app.common.hide',
                    })}
                    onChange={(checked) => {
                      if (!checked) {
                        form.setFieldsValue({ cellIdForLock: null });
                        mapRef.clearCellLocks();
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12} offset={1}>
                <Form.Item name={'cellIdForLock'}>
                  <InputNumber
                    allowClear
                    disabled={!viewSetting?.showLockedCell}
                    size="small"
                    style={{ width: '80%' }}
                    placeholder={formatMessage({ id: 'monitor.view.cell.required' })}
                  />
                </Form.Item>
              </Col>

              <Col span={5} style={{ paddingTop: 4 }}>
                <Button
                  size="small"
                  disabled={!viewSetting?.showLockedCell}
                  onClick={viewCellLocker}
                >
                  <FormattedMessage id="app.button.refresh" />
                </Button>
              </Col>
            </Row>
          </Form.Item>

          {/* 临时不可走点 */}
          <Form.Item
            {...formItemLayout}
            label={formatMessage({ id: 'monitor.view.temporaryBlock' })}
          >
            <Row>
              <Row style={{ width: '100%' }}>
                <Col span={6}>
                  <Form.Item
                    name={'tempBlockShown'}
                    valuePropName={'checked'}
                    initialValue={viewSetting?.tempBlockShown}
                  >
                    <Switch
                      checkedChildren={formatMessage({
                        id: 'app.map.view',
                      })}
                      unCheckedChildren={formatMessage({
                        id: 'app.common.hide',
                      })}
                      onChange={(checked) => {
                        if (checked) {
                          refreshTemporaryLockedCells();
                        } else {
                          mapRef.clearTemporaryLock();
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ padding: 5 }}>
                  <Button size="small" onClick={refreshTemporaryLockedCells}>
                    <FormattedMessage id="app.button.refresh" />
                  </Button>
                </Col>
              </Row>
              <Row style={{ width: '100%' }}>
                <Col span={14}>
                  <Form.Item name={'temporaryCell'} initialValue={viewSetting?.temporaryCell}>
                    <Select
                      allowClear
                      mode="tags"
                      size="small"
                      style={{ width: '90%' }}
                      placeholder={formatMessage({ id: 'monitor.view.temporaryBlock.required' })}
                    />
                  </Form.Item>
                </Col>
                <Col span={5} style={{ paddingTop: 4 }}>
                  <Button size="small" onClick={addTemporaryLockedCells}>
                    <FormattedMessage id="app.button.add" />
                  </Button>
                </Col>
                <Col span={5} style={{ paddingTop: 4 }}>
                  <Button size="small" type="danger" onClick={deleteTemporaryLockedCells}>
                    <FormattedMessage id="app.button.delete" />
                  </Button>
                </Col>
              </Row>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
  mapRef: monitor.mapContext,
  viewSetting: monitor.viewSetting,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(PathLock));

import React, { memo } from 'react';
import { Form, Row, Col, Switch, Select, Button, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 300;
const { formItemLayout } = getFormLayout(6, 16);

const TemporaryForbidcel = (props) => {
  const { dispatch, mapRef, tempBlockShown, temporaryCell } = props;
  const [form] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onValuesChange(changedValues) {
    const currentKey = Object.keys(changedValues)[0];
    const currentValue = Object.values(changedValues)[0];
    dispatch({
      type: 'monitorView/saveViewState',
      payload: { [currentKey]: currentValue },
    });
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
      const temporaryCellList = temporaryCell.map((record) => ({ vehicleId: -1, cellId: record }));
      dispatch({
        type: 'monitor/fetchSaveTemporaryCell',
        payload: temporaryCellList,
      }).then(refreshTemporaryLockedCells);
    } else {
      message.error(formatMessage({ id: 'monitor.view.temporaryBlock.required' }));
    }
  }

  // 删除临时不可走点
  const deleteTemporaryLockedCells = () => {
    const temporaryCell = form.getFieldValue('temporaryCell');
    if (temporaryCell.length !== 0) {
      const temporaryCellList = temporaryCell.map((record) => ({ vehicleId: -1, cellId: record }));
      dispatch({
        type: 'monitor/fetchDeleteTemporaryCell',
        payload: temporaryCellList,
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
        <FormattedMessage id={'app.activity.lockedTemporarySpots'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={form} onValuesChange={onValuesChange}>
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
                    initialValue={tempBlockShown}
                  >
                    <Switch
                      checkedChildren={formatMessage({
                        id: 'app.common.visible',
                      })}
                      unCheckedChildren={formatMessage({
                        id: 'app.common.hidden',
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
                  <Form.Item name={'temporaryCell'} initialValue={temporaryCell}>
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
export default connect(({ monitor, monitorView }) => ({
  mapRef: monitor.mapContext,
  temporaryCell: monitorView.temporaryCell,
  tempBlockShown: monitorView.tempBlockShown,
  currentLogicAreaId: monitor.currentLogicArea,
}))(memo(TemporaryForbidcel));

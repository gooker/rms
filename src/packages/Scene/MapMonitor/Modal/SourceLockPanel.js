import React, { memo } from 'react';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';
import { Button, Form } from 'antd';
import { fetchLoadTaskLockList, fetchTaskStorageLockList, fetchTaskTargetLockList } from '@/services/commonService';
import { connect } from '@/utils/RmsDva';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(5, 19);
export const SourceLockCategory = {
  targetLock: 'targetLock',
  loadLock: 'loadLock',
  storageLock: 'storageLock',
};

const SourceLockPanel = (props) => {
  const { dispatch, mapRef, sourceLockCategory } = props;

  async function showLock(category) {
    dispatch({ type: 'monitorView/updateSourceLockCategory', payload: category });
    let response;
    switch (category) {
      case SourceLockCategory.targetLock: {
        response = await fetchTaskTargetLockList();
        break;
      }
      case SourceLockCategory.loadLock: {
        response = await fetchLoadTaskLockList();
        break;
      }
      default: {
        response = await fetchTaskStorageLockList();
      }
    }
    if (!dealResponse(response)) {
      response = response.map((item, index) => ({ ...item, key: index }));
      mapRef.renderSourceLock(category, response);
    }
  }

  function cancelShow() {
    dispatch({ type: 'monitorView/updateSourceLockCategory', payload: null });
    mapRef.clearSourceLock();
  }

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
    dispatch({ type: 'monitorView/saveSourceLock', payload: null });
  }

  return (
    <div style={getMapModalPosition(550)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.sourceLockView'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form labelWrap {...formItemLayout}>
          <Form.Item label={formatMessage({ id: 'menu.resourceLock.targetLock' })}>
            <Button
              type={sourceLockCategory === SourceLockCategory.targetLock ? 'primary' : 'default'}
              size={'small'}
              onClick={() => {
                showLock(SourceLockCategory.targetLock);
              }}
            >
              <SearchOutlined /> <FormattedMessage id={'app.button.check'} />
            </Button>
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'menu.resourceLock.loadLock' })}>
            <Button
              type={sourceLockCategory === SourceLockCategory.loadLock ? 'primary' : 'default'}
              size={'small'}
              onClick={() => {
                showLock(SourceLockCategory.loadLock);
              }}
            >
              <SearchOutlined /> <FormattedMessage id={'app.button.check'} />
            </Button>
          </Form.Item>
          <Form.Item label={formatMessage({ id: 'menu.resourceLock.storageLock' })}>
            <Button
              type={sourceLockCategory === SourceLockCategory.storageLock ? 'primary' : 'default'}
              size={'small'}
              onClick={() => {
                showLock(SourceLockCategory.storageLock);
              }}
            >
              <SearchOutlined /> <FormattedMessage id={'app.button.check'} />
            </Button>
          </Form.Item>
          <Form.Item {...formItemLayoutNoLabel}>
            <Button ghost size={'small'} onClick={cancelShow}>
              <CloseOutlined /> <FormattedMessage id={'monitor.modal.sourceLock.clear'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor, monitorView }) => ({
  mapRef: monitor.mapContext,
  sourceLockCategory: monitorView.sourceLockCategory,
}))(memo(SourceLockPanel));

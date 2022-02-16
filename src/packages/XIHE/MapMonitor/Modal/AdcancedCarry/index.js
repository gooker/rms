import React, { memo, useState, useEffect } from 'react';
import { Radio, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchGetAllScopeActions } from '@/services/map';
import { dealResponse } from '@/utils/util';
import AdvancedCarryComponent from './AdvancedCarryComponent';
import AdvancedReleaseComponent from './AdvancedReleaseComponent';
import styles from '../../monitorLayout.module.less';

const width = 500;
const height = 600;

const AdvancedCarry = (props) => {
  const { dispatch } = props;
  const [type, setType] = useState('carry');
  const [functionArea, setFunctionArea] = useState([]);

  useEffect(() => {
    async function getArea() {
      const response = await fetchGetAllScopeActions();
      if (dealResponse(response)) {
        message.error('获取地图功能区信息失败!');
      } else {
        const functionAreaSet = new Set();
        response.forEach(({ sectionCellIdMap }) => {
          if (sectionCellIdMap) {
            Object.values(sectionCellIdMap).forEach((item) => {
              functionAreaSet.add(item);
            });
          }
        });
        setFunctionArea([...functionAreaSet]);
      }
    }
    getArea();

    return () => {};
  }, []);

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function onTypeChange(e) {
    setType(e.target.value);
  }

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
        <FormattedMessage id={'monitor.right.advancedCarry'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20, paddingLeft: 25 }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ marginRight: 10, color: '#fff' }}>
            <FormattedMessage id="app.common.type" />:
          </span>
          <Radio.Group
            onChange={onTypeChange}
            defaultValue="carry"
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="carry">
              <FormattedMessage id="monitor.right.carry" />
            </Radio.Button>
            <Radio.Button value="release">
              <FormattedMessage id="monitor.advancedcarry.released" />
            </Radio.Button>
          </Radio.Group>
        </div>

        {type === 'carry' ? (
          <AdvancedCarryComponent functionArea={functionArea} />
        ) : (
          <AdvancedReleaseComponent functionArea={functionArea} />
        )}
      </div>
    </div>
  );
};
export default connect(() => ({}))(memo(AdvancedCarry));

import React, { memo, useEffect, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { connect } from '@/utils/dva';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { formatMessage } from '@/utils/utils';
import styles from './index.module.less';

const SelectLogicArea = (props) => {
  const { dispatch, logicAreaList, currentLogicArea } = props;
  const currentLogicAreaData = getCurrentLogicAreaData();

  const [logicName, setLogicName] = useState(currentLogicAreaData?.name);

  useEffect(() => {
    const logicArea = find(logicAreaList, { id: currentLogicArea });
    setLogicName(logicArea?.name);
  }, [logicAreaList, currentLogicArea]);

  function renderMenuItem() {
    let result = [];
    if (logicAreaList && logicAreaList.length > 0) {
      result = logicAreaList.map((record) => (
        <Menu.Item key={`${record.id}`}>{record.name}</Menu.Item>
      ));
    }
    return result;
  }

  function menuClick(record) {
    dispatch({
      type: 'monitor/saveCurrentLogicArea',
      payload: parseInt(record.key, 10),
    });
  }

  const langMenu = (
    <Menu
      selectedKeys={[`${currentLogicArea}`]}
      onClick={(record) => {
        menuClick(record);
      }}
    >
      {renderMenuItem()}
    </Menu>
  );
  return (
    <Dropdown overlay={langMenu}>
      <span className={styles.action}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>
          {logicName || formatMessage({ id: 'mapEditor.logicArea' })}
        </span>
        <DownOutlined style={{ marginLeft: 4 }} />
      </span>
    </Dropdown>
  );
};
export default connect(({ monitor }) => {
  const { currentMap, currentLogicArea } = monitor;
  return { currentLogicArea, logicAreaList: currentMap?.logicAreaList || [] };
})(memo(SelectLogicArea));

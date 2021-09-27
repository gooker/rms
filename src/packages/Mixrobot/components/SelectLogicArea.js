import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/dva';
import { Menu } from 'antd';
import find from 'lodash/find';
import { EditOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/Lang';
import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import HeaderDropdown from '@/components/HeaderDropdown';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../LeftContent/index.less';

const SelectLogicArea = memo((props) => {
  const { dispatch, logicAreaList, currentLogicArea } = props;
  const currentLogicAreaData = getCurrentLogicAreaData();
  const [logicName, setLogicName] = useState(currentLogicAreaData?.name);

  useEffect(() => {
    const findedLogic = find(logicAreaList, { id: currentLogicArea });
    setLogicName(findedLogic?.name);
  }, [logicAreaList, currentLogicArea]);

  function renderMenuItem() {
    let result = [];
    if (logicAreaList && logicAreaList.length > 0) {
      result = logicAreaList.map((record) => (
        <Menu.Item key={`${record.id}`}>
          <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <div>{record.name}</div>
            <div style={{ flex: 1, textAlign: 'end' }}>
              <EditOutlined
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({
                    type: 'editor/updateModalVisit',
                    payload: {
                      type: 'createLogicAreaVisit',
                      value: true,
                      extraData: record,
                    },
                  });
                }}
              />
            </div>
          </div>
        </Menu.Item>
      ));
    }

    // 新增 "添加逻辑区" 选项
    result.push(
      <Menu.Item key="add">
        <PlusOutlined />
        <FormattedMessage id="app.selectLogicArea.addLogicArea" />
      </Menu.Item>,
    );
    return result;
  }

  function menuClick(record) {
    if (record.key === 'add') {
      dispatch({
        type: 'editor/updateModalVisit',
        payload: {
          type: 'createLogicAreaVisit',
          value: true,
        },
      });
    } else {
      dispatch({
        type: 'editor/saveCurrentLogicArea',
        payload: parseInt(record.key, 10),
      });
    }
  }

  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={[`${currentLogicArea}`]}
      onClick={(record) => {
        menuClick(record);
      }}
    >
      {renderMenuItem()}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu}>
      <span className={`${styles.action} ${styles.account}`}>
        <span style={{ fontSize: 15, fontWeight: 600 }} className={styles.name}>
          {logicName || formatMessage({ id: 'app.selectLogicArea.logicArea' })}
        </span>
        <DownOutlined style={{ marginLeft: 4 }} />
      </span>
    </HeaderDropdown>
  );
});
export default connect(({ editor }) => {
  const { currentMap, currentLogicArea } = editor;
  return { currentLogicArea, logicAreaList: currentMap?.logicAreaList || [] };
})(SelectLogicArea);

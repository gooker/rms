import React, { memo, useEffect, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { EditOutlined, PlusOutlined, DownOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { connect } from '@/utils/RcsDva';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
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
        <FormattedMessage id="mapEditor.addLogicArea" />
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
export default connect(({ editor }) => {
  const { currentMap, currentLogicArea } = editor;
  return { currentLogicArea, logicAreaList: currentMap?.logicAreaList || [] };
})(memo(SelectLogicArea));

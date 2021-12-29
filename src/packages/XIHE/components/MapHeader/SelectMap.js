import React, { memo } from 'react';
import { connect } from '@/utils/dva';
import { Badge, Dropdown, Menu } from 'antd';
import { DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './index.module.less';

const SelectMap = (props) => {
  const { mapList, currentMap } = props;

  function getMapListMenu() {
    let result = [];
    if (mapList) {
      result = mapList.map((record) => {
        const { activeFlag } = record;
        return (
          <Menu.Item key={record.id}>
            <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
              <div style={{ width: '15px' }}>{activeFlag && <Badge status="success" />}</div>
              <div>{record.name}</div>
              <div style={{ flex: 1, textAlign: 'end' }}>
                <EditOutlined style={{ marginLeft: '10px' }} />
              </div>
            </div>
          </Menu.Item>
        );
      });
    }
    result.push(<Menu.Divider />);
    result.push(
      <Menu.Item key="add">
        <PlusOutlined /> <FormattedMessage id="mapEditor.addMap" />
      </Menu.Item>,
    );
    return result;
  }

  return (
    <Dropdown
      overlayStyle={{ maxHeight: '50vh', overflow: 'auto' }}
      overlay={<Menu selectedKeys={currentMap?.id}>{getMapListMenu()}</Menu>}
    >
      <span className={styles.action}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>
          {currentMap?.name || formatMessage({ id: 'mapEditor.map' })}
        </span>
        <DownOutlined style={{ marginLeft: 4 }} />
      </span>
    </Dropdown>
  );
};
export default connect(({ editor }) => ({
  mapList: editor.mapList,
  currentMap: editor.currentMap,
}))(memo(SelectMap));

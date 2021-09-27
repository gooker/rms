import React, { memo, useState, useEffect } from 'react';
import { connect } from '@/utils/dva';
import find from 'lodash/find';
import { Menu, Col, Spin, Dropdown, Row, Modal, Badge, Button } from 'antd';
import { EditOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import SelectLogicArea from '../SelectLogicArea/Index';
import SelectScopeMap from '../SelectScopeMap/Index';
import MenuIcon from '@/utils/MenuIcon';
import styles from './editorToolLeft.module.less';

const MapSwitcher = memo((props) => {
  const { dispatch, mapList, currentMap } = props;

  const [saveConfirm, setSaveConfirm] = useState(false);
  const [mapName, setMapName] = useState(currentMap?.name);

  useEffect(() => {
    const findedMap = find(mapList, { id: currentMap?.id });
    setMapName(findedMap?.name);
  }, [mapList, currentMap]);

  function editMap(ev, record) {
    ev.stopPropagation();
    dispatch({
      type: 'editor/updateModalVisit',
      payload: {
        type: 'createMapVisit',
        value: true,
        extraData: record,
      },
    });
  }

  // 地图列表
  function mapListMenu() {
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
                <EditOutlined
                  style={{ marginLeft: '10px' }}
                  onClick={(ev) => {
                    editMap(ev, record);
                  }}
                />
              </div>
            </div>
          </Menu.Item>
        );
      });
    }
    result.push(<Menu.Divider />);
    result.push(
      // 添加地图
      <Menu.Item key="add">
        {MenuIcon.plus} <FormattedMessage id="app.leftContent.addMap" />
      </Menu.Item>,
    );
    return result;
  }

  function mapMenuClick(record) {
    if (record.key === 'add') {
      // 当前已经打开地图，如果要新增地图则需要询问是否要保存地图防止已改数据丢失
      if (currentMap && currentMap.name != null) {
        setSaveConfirm(true);
      } else {
        openMapCreationModal();
      }
    } else {
      dispatch({ type: 'editor/checkoutMap', payload: record.key });
    }
  }

  function saveMap() {
    dispatch({ type: 'editor/saveMap' });
    setSaveConfirm(false);
  }

  function openMapCreationModal() {
    setSaveConfirm(false);
    dispatch({
      type: 'editor/updateModalVisit',
      payload: {
        type: 'createMapVisit',
        value: true,
      },
    });
  }

  return (
    <div className={styles.mapSwitcher}>
      {/* 选择地图 */}
      {mapList === null ? (
        <Spin size="small" style={{ marginRight: '10px' }} />
      ) : (
        <Dropdown
          overlayStyle={{ maxHeight: '50vh', overflow: 'auto' }}
          overlay={
            <Menu selectedKeys={currentMap?.id} onClick={mapMenuClick}>
              {mapListMenu()}
            </Menu>
          }
        >
          <span className={styles.action}>
            <span style={{ fontSize: 15, fontWeight: 600 }} className={styles.name}>
              {mapName || formatMessage({ id: 'app.leftContent.map' })}
            </span>
            <DownOutlined style={{ marginLeft: 4 }} />
          </span>
        </Dropdown>
      )}

      {/* 选择逻辑区 */}
      <RightOutlined style={{ opacity: '0.4' }} />
      <SelectLogicArea />

      {/* 选择路线区 */}
      <RightOutlined style={{ opacity: '0.4' }} />
      <SelectScopeMap />

      {/* 是否保存地图 */}
      <Modal
        destroyOnClose
        onCancel={() => {
          setSaveConfirm(false);
        }}
        closable={false}
        footer={null}
        visible={saveConfirm}
        width={500}
      >
        <div style={{ padding: 24 }}>
          <Row>
            <Col span={12} offset={2}>
              <h3>
                {/* 是否保存当前修改的地图 */}
                <FormattedMessage id="app.leftContent.saveMap" />
              </h3>
            </Col>
          </Row>

          <Row style={{ marginTop: 0 }}>
            <Col span={12} offset={2}>
              {/* 若不保存,修改的内容可能会丢失 */}
              <FormattedMessage id="app.leftContent.contentLoss" />
            </Col>
          </Row>
          <Row style={{ marginTop: 30 }}>
            <Col span={16} offset={8}>
              {/* 取消 */}
              <Button
                onClick={() => {
                  setSaveConfirm(false);
                }}
                style={{ marginLeft: 20 }}
              >
                <FormattedMessage id="app.leftContent.cancel" />
              </Button>

              {/* 保存 */}
              <Button type="primary" style={{ marginLeft: 20 }} onClick={saveMap}>
                <FormattedMessage id="app.leftContent.save" />
              </Button>

              {/* 不保存 */}
              <Button style={{ marginLeft: 20 }} onClick={openMapCreationModal}>
                <FormattedMessage id="app.leftContent.notSave" />
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
});
export default connect(({ editor }) => {
  const { mapList, currentMap } = editor;
  return { mapList, currentMap };
})(MapSwitcher);

import React, { memo, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Badge, Button, Dropdown, Form, Input, Menu, Modal, Popconfirm } from 'antd';
import { DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage, getFormLayout, getRandomString } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './index.module.less';
import Loadable from '@/components/Loadable';

const MapUpdateHistory = Loadable(() => import('../components/MapUpdateHistory'));
const { formItemLayout } = getFormLayout(5, 19);

const SelectMap = (props) => {
  const { dispatch, mapList, currentMap } = props;

  const [formRef] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [creationVisible, setCreationVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);

  async function saveMap() {
    setSaveLoading(true);
    const result = await dispatch({ type: 'editor/saveMap' });
    result && openMapCreationModal();
    setSaveLoading(false);
    setSaveConfirm(false);
  }

  function openMapCreationModal() {
    formRef.resetFields();
    setEditing(null);
    setSaveConfirm(false);
    setCreationVisible(true);
  }

  function submit() {
    formRef.validateFields().then(async (value) => {
      setSaveLoading(true);
      if (editing) {
        await dispatch({ type: 'editor/fetchUpdateMap', payload: { id: editing.id, ...value } });
      } else {
        await dispatch({ type: 'editor/fetchCreateMap', payload: value });
      }
      setCreationVisible(false);
      setSaveLoading(false);
    });
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

  function editMap(record) {
    setCreationVisible(true);
    setEditing(record);
    formRef.setFieldsValue({ name: record.name, description: record.description });
  }

  async function deleteMap() {
    setDeleteLoading(true);
    await dispatch({ type: 'editor/fetchDeleteMap', payload: editing.id });
    setDeleteLoading(false);
    setCreationVisible(false);
  }

  function showSavingRecord() {
    setHistoryVisible(true);
  }

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
                <EditOutlined
                  style={{ marginLeft: '10px' }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    editMap(record);
                  }}
                />
              </div>
            </div>
          </Menu.Item>
        );
      });
    }
    result.push(<Menu.Divider key={getRandomString(6)} />);
    result.push(
      <Menu.Item key="add">
        <PlusOutlined /> <FormattedMessage id="app.button.add" />
        <FormattedMessage id="app.map" />
      </Menu.Item>,
    );
    return result;
  }

  return (
    <>
      <Dropdown
        overlayStyle={{ maxHeight: '40vh', overflow: 'auto' }}
        overlay={
          <Menu selectedKeys={currentMap?.id} onClick={mapMenuClick}>
            {getMapListMenu()}
          </Menu>
        }
      >
        <span className={styles.action}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>
            {currentMap?.name || formatMessage({ id: 'app.map' })}
          </span>
          <DownOutlined style={{ marginLeft: 4 }} />
        </span>
      </Dropdown>

      {/* 是否保存地图 */}
      <Modal
        destroyOnClose
        width={500}
        closable={false}
        maskClosable={false}
        transitionName=""
        maskTransitionName=""
        visible={saveConfirm}
        title={formatMessage({ id: 'app.message.systemHint' })}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setSaveConfirm(false);
            }}
          >
            <FormattedMessage id={'app.button.cancel'} />
          </Button>,
          <Button
            key="notSaveMap"
            onClick={() => {
              openMapCreationModal();
            }}
          >
            <FormattedMessage id={'editor.button.notSaveMap'} />
          </Button>,
          <Button
            key="save"
            type={'primary'}
            loading={saveLoading}
            disabled={saveLoading}
            onClick={() => {
              saveMap();
            }}
          >
            <FormattedMessage id={'app.button.save'} />
          </Button>,
        ]}
      >
        <FormattedMessage id={'editor.saveMap.contentLoss'} />
      </Modal>

      {/*  创建 & 更新地图 */}
      <Modal
        width={500}
        transitionName=""
        maskTransitionName=""
        closable={false}
        maskClosable={false}
        visible={creationVisible}
        title={`${formatMessage({
          id: editing ? 'app.button.edit' : 'app.button.add',
        })}${formatMessage({ id: 'app.map' })}`}
        footer={[
          <Button
            key="cancel"
            loading={deleteLoading}
            disabled={deleteLoading}
            onClick={() => {
              setCreationVisible(false);
            }}
          >
            <FormattedMessage id={'app.button.cancel'} />
          </Button>,

          editing && (
            <Popconfirm
              key="delete"
              title={formatMessage({ id: 'editor.deleteMapConfirm' })}
              onConfirm={deleteMap}
            >
              <Button danger>
                <FormattedMessage id={'app.button.delete'} />
              </Button>
            </Popconfirm>
          ),

          editing && (
            <Button key="record" onClick={showSavingRecord}>
              <FormattedMessage id={'editor.button.record'} />
            </Button>
          ),

          <Button
            key="save"
            type={'primary'}
            onClick={submit}
            loading={saveLoading}
            disabled={saveLoading}
          >
            <FormattedMessage id={'app.button.save'} />
          </Button>,
        ].filter(Boolean)}
      >
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'name'}
            label={formatMessage({ id: 'app.common.name' })}
            rules={[{ required: true }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item name={'description'} label={formatMessage({ id: 'app.common.description' })}>
            <Input style={{ width: 300 }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 地图更新记录 */}
      <Modal
        width={800}
        transitionName=""
        maskTransitionName=""
        closable={false}
        maskClosable={false}
        visible={historyVisible}
        title={<FormattedMessage id={'editor.updateHistory'} />}
        footer={[
          <Button
            key="cancel"
            type={'primary'}
            onClick={() => {
              setHistoryVisible(false);
            }}
          >
            <FormattedMessage id={'app.button.cancel'} />
          </Button>,
        ]}
      >
        <MapUpdateHistory dispatch={dispatch} mapId={editing?.id} />
      </Modal>
    </>
  );
};
export default connect(({ editor }) => ({
  mapList: editor.mapList,
  currentMap: editor.currentMap,
}))(memo(SelectMap));

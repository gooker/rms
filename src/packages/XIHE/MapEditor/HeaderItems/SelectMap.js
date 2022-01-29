import React, { memo, useState } from 'react';
import { connect } from '@/utils/RcsDva';
import { Badge, Button, Dropdown, Form, Input, Menu, Modal } from 'antd';
import { DownOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage, getFormLayout, getRandomString } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './index.module.less';

const { formItemLayout } = getFormLayout(5, 19);
const SelectMap = (props) => {
  const { dispatch, mapList, currentMap } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [creationVisible, setCreationVisible] = useState(false);

  async function saveMap() {
    setLoading(true);
    const result = await dispatch({ type: 'editor/saveMap' });
    result && openMapCreationModal();
    setLoading(false);
    setSaveConfirm(false);
  }

  function openMapCreationModal() {
    setSaveConfirm(false);
    setCreationVisible(true);
  }

  function submit() {
    formRef.validateFields().then(async (value) => {
      setSaveLoading(true);
      await dispatch({ type: 'editor/fetchCreateMap', value });
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
    result.push(<Menu.Divider key={getRandomString(6)} />);
    result.push(
      <Menu.Item key="add">
        <PlusOutlined /> <FormattedMessage id="mapEditor.addMap" />
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
            {currentMap?.name || formatMessage({ id: 'mapEditor.map' })}
          </span>
          <DownOutlined style={{ marginLeft: 4 }} />
        </span>
      </Dropdown>

      {/* 是否保存地图 */}
      <Modal
        destroyOnClose
        closable={false}
        maskClosable={false}
        width={500}
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
            <FormattedMessage id={'mapEditor.button.notSaveMap'} />
          </Button>,
          <Button
            key="save"
            type={'primary'}
            loading={loading}
            disabled={loading}
            onClick={() => {
              saveMap();
            }}
          >
            <FormattedMessage id={'app.button.save'} />
          </Button>,
        ]}
      >
        <FormattedMessage id={'mapEditor.saveMap.contentLoss'} />
      </Modal>

      {/*  创建&更新地图 */}
      <Modal
        destroyOnClose
        width={500}
        visible={creationVisible}
        title={formatMessage({ id: 'mapEditor.addMap' })}
        onOk={submit}
        onCancel={() => {
          setCreationVisible(false);
        }}
        okButtonProps={{
          loading: saveLoading,
          disabled: saveLoading,
        }}
      >
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'name'}
            label={formatMessage({ id: 'app.common.name' })}
            rules={[{ required: true }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item name={'desc'} label={formatMessage({ id: 'app.common.description' })}>
            <Input style={{ width: 300 }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default connect(({ editor }) => ({
  mapList: editor.mapList,
  currentMap: editor.currentMap,
}))(memo(SelectMap));

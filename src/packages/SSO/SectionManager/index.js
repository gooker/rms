import React, { Component } from 'react';
import { Row, Button, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  fetchSelectSectionList,
  fetchAddSection,
  updateSection,
  deleteSectionById,
} from '@/services/user';
import RcsConfirm from '@/components/RcsConfirm';
import TablewidthPages from '@/components/TablewidthPages';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';
import UpdateSection from './components/UpdateSection';
import commonStyles from '@/common.module.less';
import styles from './sectionManager.module.less';
import { dealResponse } from '@/utils/utils';

export default class SectionManager extends Component {
  state = {
    selectRowKey: [],
    selectRow: [],
    sectionsList: [],
    loading: false,
    sectionModalVisible: false, // 新增 修改区域
    updateFlag: false, // 修改为true
  };
  componentDidMount() {
    this.getData();
  }
  getData = async () => {
    this.setState({ loading: true });
    const response = await fetchSelectSectionList();
    if (!dealResponse(response)) {
      this.setState({ sectionsList: response });
    }
    this.setState({ loading: false });
  };

  getColumn = [
    {
      title: <FormattedMessage id="app.common.sectionId" />,
      dataIndex: 'sectionId',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'sectionName',
      align: 'center',
    },

    {
      title: <FormattedMessage id="sso.user.type.username" />,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: <FormattedMessage id="sso.user.account.password" />,
      dataIndex: 'password',
      align: 'center',
    },
  ];

  // 删除区域
  deleteUser = () => {
    const { selectRowKey } = this.state;
    const this_ = this;
    RcsConfirm({
      content: formatMessage({ id: 'section.delete.content', format: false }),
      onOk: async () => {
        const deleteRes = await deleteSectionById({ id: selectRowKey[0] });
        if (!dealResponse(deleteRes)) {
          message.info(formatMessage({ id: 'app.tip.operationFinish' }));
          this_.setState({ selectRow: [], selectRowKey: [] }, this_.getData);
        }
      },
    });
  };

  updatedSectionSubmit = async (values) => {
    // 新增 编辑
    const { updateFlag, selectRowKey } = this.state;
    let response;
    // 编辑
    if (updateFlag) {
      response = await updateSection({ ...values, id: selectRowKey[0] });
    } else {
      response = await fetchAddSection({ ...values });
    }
    if (!dealResponse(response)) {
      message.info(formatMessage({ id: 'app.tip.operationFinish' }));
      this.setState(
        {
          sectionModalVisible: false,
          updateFlag: false,
          selectRow: [],
          selectRowKey: [],
        },
        this.getData,
      );
    } else {
      message.error(response.message);
    }
  };

  render() {
    const { selectRowKey, sectionsList, loading, sectionModalVisible, updateFlag, selectRow } =
      this.state;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Row style={{ display: 'flex', padding: '0 0 20px 0' }}>
          <Button
            className={commonStyles.mr10}
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              this.setState({
                sectionModalVisible: true,
              });
            }}
          >
            <FormattedMessage id="app.button.add" />
          </Button>
          <Button
            className={commonStyles.mr10}
            icon={<EditOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({
                sectionModalVisible: true,
                updateFlag: true,
              });
            }}
          >
            <FormattedMessage id="app.button.edit" />
          </Button>

          <Button
            danger
            className={commonStyles.mr10}
            icon={<DeleteOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={this.deleteUser}
          >
            <FormattedMessage id="app.button.delete" />
          </Button>
        </Row>
        <div className={styles.sectionManagerTable}>
          <TablewidthPages
            bordered
            columns={this.getColumn}
            rowKey="id"
            dataSource={sectionsList}
            loading={loading}
            rowSelection={{
              selectedRowKeys: selectRowKey,
              onChange: (selectRowKey, selectRow) => {
                this.setState({ selectRowKey, selectRow });
              },
            }}
          />
        </div>

        {/* 新增修改区域 */}
        <Modal
          width={480}
          footer={null}
          title={
            !updateFlag ? (
              <FormattedMessage id="section.add.section" />
            ) : (
              <FormattedMessage id="section.update.section" />
            )
          }
          destroyOnClose
          visible={sectionModalVisible}
          onCancel={() => {
            this.setState({ sectionModalVisible: false, updateFlag: false });
          }}
        >
          {' '}
          <UpdateSection
            selectRow={selectRow}
            updateFlag={updateFlag}
            onSubmit={this.updatedSectionSubmit}
          />
        </Modal>
      </div>
    );
  }
}

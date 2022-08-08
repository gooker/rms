import React, { Component } from 'react';
import { Button, Col, message, Modal, Row } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { deleteSectionById, fetchAddSection, fetchSelectSectionList, updateSection } from '@/services/SSOService';
import RmsConfirm from '@/components/RmsConfirm';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage } from '@/utils/util';
import UpdateSection from './components/UpdateSection';
import commonStyles from '@/common.module.less';
import TablePageWrapper from '@/components/TablePageWrapper';

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

  columns = [
    {
      title: <FormattedMessage id="app.form.sectionId" />,
      dataIndex: 'sectionId',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.common.name" />,
      dataIndex: 'sectionName',
      align: 'center',
    },
  ];

  // 删除区域
  deleteUser = () => {
    const { selectRowKey } = this.state;
    const this_ = this;
    RmsConfirm({
      content: formatMessage({ id: 'section.delete.content', format: false }),
      onOk: async () => {
        const deleteRes = await deleteSectionById({ id: selectRowKey[0] });
        if (!dealResponse(deleteRes)) {
          message.info(formatMessage({ id: 'app.message.operateSuccess' }));
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
      message.info(formatMessage({ id: 'app.message.operateSuccess' }));
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
    const { selectRowKey, selectRow } = this.state;
    const { sectionsList, loading, sectionModalVisible, updateFlag } = this.state;
    return (
      <TablePageWrapper>
        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  sectionModalVisible: true,
                });
              }}
            >
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Button
              disabled={selectRowKey.length !== 1}
              onClick={() => {
                this.setState({
                  sectionModalVisible: true,
                  updateFlag: true,
                });
              }}
            >
              <EditOutlined /> <FormattedMessage id="app.button.edit" />
            </Button>

            <Button danger disabled={selectRowKey.length !== 1} onClick={this.deleteUser}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
          </Col>
          <Col>
            <Button onClick={this.getData}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
        <TableWithPages
          bordered
          rowKey={'id'}
          loading={loading}
          columns={this.columns}
          dataSource={sectionsList}
          rowSelection={{
            selectedRowKeys: selectRowKey,
            onChange: (selectRowKey, selectRow) => {
              this.setState({ selectRowKey, selectRow });
            },
          }}
        />

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
          <UpdateSection
            selectRow={selectRow}
            updateFlag={updateFlag}
            onSubmit={this.updatedSectionSubmit}
          />
        </Modal>
      </TablePageWrapper>
    );
  }
}

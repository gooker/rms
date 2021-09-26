import React, { Component } from 'react';
import { Row, Button, Table, Col, Switch, message, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  CopyOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import {
  fetchAllEnvironmentList,
  fetchAddEnvironment,
  deleteEnvironmentById,
  fetchUpdateEnvironment,
} from '@/services/user';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, adjustModalWidth, copyToBoard } from '@/utils/utils';
import RcsConfirm from '@/components/RcsConfirm';
import PasteModal from './components/PasteModal';
import AddEnvironmentModal from './components/AddEnvironmentModal';
import TablewidthPages from '@/components/TablewidthPages';
import commonStyles from '@/common.module.less';
import styles from './environmentManager.module.less';

export default class index extends Component {
  state = {
    selectRow: [],
    selectRowKey: [],
    loading: false,
    pasteVisble: false,
    addEnvironVisible: false,
    updateFlag: false,
    dataList: [],
  };

  componentDidMount() {
    this.getData();
  }

  columns = [
    {
      title: <FormattedMessage id="environmentManager.envName" />,
      dataIndex: 'envName',
      align: 'center',
    },
    {
      title: <FormattedMessage id="environmentManager.isDefault" />,
      dataIndex: 'flag',
      align: 'center',
      render: (text, record) => (
        <Switch
          checked={text === '1'}
          checkedChildren={<FormattedMessage id="app.common.true" />}
          unCheckedChildren={<FormattedMessage id="app.common.false" />}
          onChange={(checked) => {
            this.changeStatus(record, checked);
          }}
        />
      ),
    },
  ];

  getData = async () => {
    this.setState({ loading: true });
    const response = await fetchAllEnvironmentList();
    if (!dealResponse(response)) {
      this.setState({ dataList: response });
    }
    this.setState({ loading: false });
  };

  changeStatus = async (record, flag) => {
    const params = {
      ...record,
      flag: flag ? 1 : 0,
    };
    const updateRes = await fetchUpdateEnvironment(params);
    if (!dealResponse(updateRes)) {
      message.success(formatMessage({ id: 'environmentManager.updatestatusSuccess' }));
      this.getData();
    }
  };

  renderExpandedRowRender = (row) => {
    const result = [];
    if (row.additionalInfos != null) {
      row.additionalInfos.map((item) => {
        result.push(
          <Col xs={24} sm={12} md={12} lg={8} xl={8} key={item.key}>
            <span className={styles.additionalInfos}>{item.key}:</span>
            <span> {item.value}</span>
          </Col>,
        );
      });
    }
    return <Row gutter={12}>{result}</Row>;
  };

  copyJson = () => {
    const { selectRow } = this.state;
    const str = JSON.stringify(selectRow);
    copyToBoard(str);
  };

  onAddEnvironment = async (values) => {
    const { updateFlag, selectRow } = this.state;
    if (updateFlag) {
      values.id = selectRow[0].id;
    }
    const response = await fetchAddEnvironment(values);
    if (!dealResponse(response)) {
      message.success(formatMessage({ id: 'app.tip.operationFinish' }));
      this.getData();
      this.setState(
        {
          pasteVisble: false,
          addEnvironVisible: false,
          updateFlag: false,
          selectRow: [],
          selectRowKey: [],
        },
        this.getData,
      );
    }
  };

  deleteEnvironment = () => {
    const this_ = this;
    const { selectRowKey } = this.state;
    RcsConfirm({
      content: formatMessage({ id: 'environmentManager.deleteConfirmContent' }),
      onOk: async () => {
        const deleteRes = await deleteEnvironmentById({ id: selectRowKey[0] });
        if (!dealResponse(deleteRes)) {
          message.success(formatMessage({ id: 'app.tip.operationFinish' }));
          this_.getData();
        }
      },
    });
  };

  render() {
    const {
      selectRowKey,
      selectRow,
      loading,
      dataList,
      pasteVisble,
      addEnvironVisible,
      updateFlag,
    } = this.state;
    const updateRow = updateFlag ? selectRow : null;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Row style={{ display: 'flex', padding: '0 0 20px 0' }}>
          <Button
            className={commonStyles.mr10}
            icon={<PlusOutlined />}
            onClick={() => {
              this.setState({
                addEnvironVisible: true,
              });
            }}
          >
            <FormattedMessage id="app.taskStatus.New" />
          </Button>
          <Button
            className={commonStyles.mr10}
            icon={<EditOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({
                addEnvironVisible: true,
                updateFlag: true,
              });
            }}
          >
            <FormattedMessage id="app.button.update" />
          </Button>

          <Button
            className={commonStyles.mr10}
            icon={<DeleteOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={this.deleteEnvironment}
          >
            <FormattedMessage id="app.button.delete" />
          </Button>
          <Button
            className={commonStyles.mr10}
            disabled={selectRowKey.length !== 1}
            icon={<ExportOutlined />}
            onClick={() => {
              this.copyJson();
            }}
          >
            <FormattedMessage id="app.button.copy" />
          </Button>
          <Button
            className={commonStyles.mr10}
            icon={<CopyOutlined />}
            onClick={() => {
              this.setState({ pasteVisble: true });
            }}
          >
            <FormattedMessage id="app.button.past" />
          </Button>
          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<ReloadOutlined />} onClick={this.getData}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </div>
        </Row>
        {/* <TablewidthPages
          columns={this.columns}
          rowKey="id"
          dataSource={dataList}
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectRowKey,
            onChange: (selectRowKey, selectRow) => {
              this.setState({ selectRowKey, selectRow });
            },
          }}
          expandedRowRender={(row) => {
            return this.renderExpandedRowRender(row);
          }}
        /> */}
        <div className={commonStyles.divContent}>
          <Table
            bordered
            columns={this.columns}
            rowKey="id"
            dataSource={dataList}
            scroll={{ x: 'max-content' }}
            loading={loading}
            rowSelection={{
              selectedRowKeys: selectRowKey,
              onChange: (selectRowKey, selectRow) => {
                this.setState({ selectRowKey, selectRow });
              },
            }}
            pagination={{
              responsive: true,
              defaultPageSize: 10,
              showTotal: (total) =>
                formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
            }}
            expandedRowRender={(row) => {
              return this.renderExpandedRowRender(row);
            }}
          />
        </div>

        {/* 新增 */}
        <Modal
          width={adjustModalWidth() * 0.7}
          visible={addEnvironVisible}
          destroyOnClose
          footer={null}
          title={
            updateRow ? (
              <FormattedMessage id="environmentManager.update" />
            ) : (
              <FormattedMessage id="environmentManager.add" />
            )
          }
          onCancel={() => {
            this.setState({
              addEnvironVisible: false,
              updateFlag: false,
            });
          }}
        >
          <AddEnvironmentModal onSubmit={this.onAddEnvironment} updateRow={updateRow} />
        </Modal>

        {/* 粘贴 */}
        <Modal
          width={adjustModalWidth() * 0.7}
          visible={pasteVisble}
          maskClosable={false}
          destroyOnClose
          footer={null}
          title={<FormattedMessage id="environmentManager.tip.pasteTip" />}
          onCancel={() => {
            this.setState({
              pasteVisble: false,
            });
          }}
        >
          <PasteModal onAddEnvironment={this.onAddEnvironment} />
        </Modal>
      </div>
    );
  }
}

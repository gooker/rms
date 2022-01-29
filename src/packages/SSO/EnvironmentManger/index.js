import React, { Component } from 'react';
import { Row, Button, Col, Switch, message, Modal } from 'antd';
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
import { dealResponse, formatMessage, adjustModalWidth, copyToBoard } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import PasteModal from './components/PasteModal';
import AddEnvironmentModal from './components/AddEnvironmentModal';
import TablewidthPages from '@/components/TableWidthPages';
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
    RmsConfirm({
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
      <div className={commonStyles.commonPageStyle}>
        <Row style={{ display: 'flex', padding: '0 0 20px 0' }}>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  addEnvironVisible: true,
                });
              }}
            >
              <PlusOutlined /> <FormattedMessage id="app.button.add" />
            </Button>
            <Button
              disabled={selectRowKey.length !== 1}
              onClick={() => {
                this.setState({
                  addEnvironVisible: true,
                  updateFlag: true,
                });
              }}
            >
              <EditOutlined /> <FormattedMessage id="app.button.update" />
            </Button>

            <Button  danger disabled={selectRowKey.length !== 1} onClick={this.deleteEnvironment}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button
              disabled={selectRowKey.length !== 1}
              onClick={() => {
                this.copyJson();
              }}
            >
              <ExportOutlined /> <FormattedMessage id="app.button.copy" />
            </Button>
            <Button
              onClick={() => {
                this.setState({ pasteVisble: true });
              }}
            >
              <CopyOutlined /> <FormattedMessage id="app.button.past" />
            </Button>
          </Col>
          <Col>
            <Button type="primary" ghost icon={<ReloadOutlined />} onClick={this.getData}>
              <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>

        <TablewidthPages
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
        />

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

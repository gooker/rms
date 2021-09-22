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
import { fetchAllEnvironmentList, fetchAddEnvironment } from '@/services/user';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, adjustModalWidth } from '@/utils/utils';
import PasteModal from './components/PasteModal';
import commonStyles from '@/common.module.less';
import styles from './environmentManager.module.less';

export default class index extends Component {
  state = {
    selectRow: [],
    selectRowKey: [],
    loading: false,
    pasteVisble: false,
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

  changeStatus = (record, flag) => {
    const params = {
      ...record,
      flag: flag ? 1 : 0,
    };
  };

  renderExpandedRowRender = (row) => {
    const result = [];
    if (row.additionalInfos != null) {
      row.additionalInfos.map((item) => {
        result.push(
          <Col xxl={6} lg={8} key={item.key}>
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
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', str);
    document.body.appendChild(input);
    input.setSelectionRange(0, 9999);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      document.body.removeChild(input);
      message.info(formatMessage({ id: 'sso.user.tip.copySuccess' }));
    } else {
      document.body.removeChild(input);
      message.warn(formatMessage({ id: 'sso.user.tip.unsupportCopyAPI' }));
    }
  };

  onAddEnvironment = async (values) => {
    const response = await fetchAddEnvironment(...values);
    if (!dealResponse(response)) {
      this.setState(
        {
          pasteVisble: false,
        },
        this.getData,
      );
    }
  };

  render() {
    const { selectRowKey, loading, dataList, pasteVisble } = this.state;
    return (
      <div className={commonStyles.globalPageStyle}>
        <Row style={{ display: 'flex', padding: '20px 0' }}>
          <Button
            className={commonStyles.mr20}
            icon={<PlusOutlined />}
            onClick={() => {
              this.setState({
                addUserVisible: true,
              });
            }}
          >
            <FormattedMessage id="app.taskStatus.New" />
          </Button>
          <Button
            className={commonStyles.mr20}
            icon={<EditOutlined />}
            disabled={selectRowKey.length !== 1}
            onClick={() => {
              this.setState({
                addUserVisible: true,
                updateUserFlag: true,
              });
            }}
          >
            <FormattedMessage id="app.button.update" />
          </Button>

          <Button
            className={commonStyles.mr20}
            icon={<DeleteOutlined />}
            disabled={selectRowKey.length === 0}
            onClick={this.deleteUser}
          >
            <FormattedMessage id="app.button.delete" />
          </Button>
          <Button
            className={commonStyles.mr20}
            disabled={selectRowKey.length !==1}
            icon={<ExportOutlined />}
            onClick={() => {
              this.copyJson();
            }}
          >
            <FormattedMessage id="app.button.copy" />
          </Button>
          <Button
            className={commonStyles.mr20}
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

        {/* 粘贴 */}
        <Modal
          width={adjustModalWidth() * 0.7}
          visible={pasteVisble}
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

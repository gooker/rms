import React, { Component } from 'react';
import { Button, Col, message, Modal, Row, Switch } from 'antd';
import { BgColorsOutlined, CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addToClipBoard, adjustModalWidth, formatMessage, getRandomString, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import PasteModal from './components/PasteModal';
import AddEnvironmentModal from './components/AddEnvironmentModal';
import TableWithPages from '@/components/TableWithPages';
import commonStyles from '@/common.module.less';
import styles from './environmentManager.module.less';

const StorageKey = 'customEnvs';
export default class index extends Component {
  formRef = React.createRef();

  state = {
    dataList: [],
    selectRow: [],
    selectRowKey: [],
    editingRow: null,
    pasteVisible: false,
    addEnvironVisible: false,
    updateFlag: false,
  };

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
          checkedChildren={<FormattedMessage id='app.common.true' />}
          unCheckedChildren={<FormattedMessage id='app.common.false' />}
          onChange={(checked) => {
            this.changeStatus(record, checked);
          }}
        />
      ),
    },
    {
      title: <FormattedMessage id={'app.common.operation'} />,
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <>
          <Button
            type={'link'}
            onClick={() => {
              this.setState({
                addEnvironVisible: true,
                editingRow: record,
              });
            }}
          >
            <EditOutlined style={{ fontSize: 17 }} />
          </Button>
          <Button type={'link'} onClick={() => this.deleteEnvironment(record)}>
            <DeleteOutlined style={{ fontSize: 17 }} />
          </Button>
        </>
      ),
    },
  ];

  componentDidMount() {
    let dataList = window.localStorage.getItem(StorageKey);
    if (isStrictNull(dataList)) {
      dataList = [];
    } else {
      dataList = JSON.parse(dataList);
    }
    this.setState({ dataList });
  }

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
    addToClipBoard(str);
  };

  onAddEnvironment = (values) => {
    const { dataList, editingRow } = this.state;
    let _dataList = [...dataList];
    if (editingRow) {
      values.id = editingRow.id;
      _dataList = dataList.filter((item) => item.id !== editingRow.id);
      _dataList.unshift(values);
    } else {
      values.id = getRandomString(10);
      _dataList.push(values);
    }
    message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    this.setState({
      dataList: _dataList,
      addEnvironVisible: false,
      editingRow: null,
    });
    window.localStorage.setItem(StorageKey, JSON.stringify(_dataList));
  };

  pasteEnvironment = (envs) => {
    const { dataList } = this.state;
    const _dataList = dataList.concat(envs);
    this.setState({ dataList: _dataList, selectRow: [], selectRowKey: [], pasteVisible: false });
    window.localStorage.setItem(StorageKey, JSON.stringify(_dataList));
  };

  changeStatus = (record, flag) => {
    const { dataList } = this.state;
    const _dataList = dataList.map((item) => {
      return {
        ...item,
        flag: item.id === record.id && flag ? '1' : '0',
      };
    });
    this.setState({ dataList: _dataList });
    window.localStorage.setItem(StorageKey, JSON.stringify(_dataList));
  };

  deleteEnvironment = (record) => {
    const _this = this;
    const { dataList } = this.state;
    RmsConfirm({
      content: formatMessage({ id: 'environmentManager.deleteConfirmContent' }),
      onOk: async () => {
        const _dataList = dataList.filter((item) => item.id !== record.id);
        _this.setState({ dataList: _dataList });
        window.localStorage.setItem(StorageKey, JSON.stringify(_dataList));
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      },
    });
  };

  submit = () => {
    const { validateFields } = this.formRef.current;
    validateFields()
      .then((allValues) => {
        this.onAddEnvironment(allValues);
      })
      .catch(() => {
      });
  };

  render() {
    const { selectRowKey, editingRow, dataList, pasteVisible, addEnvironVisible } = this.state;
    return (
      <div className={commonStyles.commonPageStyle}>
        <div className={commonStyles.tableToolLeft}>
          <Button
            type='primary'
            onClick={() => {
              this.setState({
                addEnvironVisible: true,
              });
            }}
          >
            <PlusOutlined /> <FormattedMessage id='app.button.add' />
          </Button>
          <Button disabled={selectRowKey.length === 0} onClick={this.copyJson}>
            <CopyOutlined /> <FormattedMessage id='app.button.copy' />
          </Button>
          <Button
            onClick={() => {
              this.setState({ pasteVisible: true });
            }}
          >
            <BgColorsOutlined /> <FormattedMessage id='app.button.past' />
          </Button>
        </div>

        <TableWithPages
          columns={this.columns}
          dataSource={dataList}
          rowKey={({ id }) => id}
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
          destroyOnClose
          width={adjustModalWidth() * 0.7}
          visible={addEnvironVisible}
          title={
            editingRow ? (
              <FormattedMessage id='environmentManager.update' />
            ) : (
              <FormattedMessage id='environmentManager.add' />
            )
          }
          onOk={this.submit}
          onCancel={() => {
            this.setState({
              addEnvironVisible: false,
              editingRow: null,
            });
          }}
        >
          <AddEnvironmentModal formRef={this.formRef} updateRow={editingRow} />
        </Modal>

        {/* 粘贴 */}
        <Modal
          destroyOnClose
          width={adjustModalWidth() * 0.7}
          visible={pasteVisible}
          maskClosable={false}
          footer={null}
          title={<FormattedMessage id="environmentManager.tip.pasteTip" />}
          onCancel={() => {
            this.setState({
              pasteVisible: false,
            });
          }}
        >
          <PasteModal onPaste={this.pasteEnvironment} />
        </Modal>
      </div>
    );
  }
}

import React, { Component } from 'react';
import { Button, Card, Col, Empty, Form, message, Modal, Row } from 'antd';
import { BgColorsOutlined, CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addToClipBoard, adjustModalWidth, formatMessage, getRandomString, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import PasteModal from './components/PasteModal';
import AddEnvironmentModal from './components/AddEnvironmentModal';
import { GridResponsive } from '@/config/consts';
import commonStyles from '@/common.module.less';

const StorageKey = 'customEnvs';
export default class index extends Component {
  formRef = React.createRef();

  state = {
    dataList: [],
    editingRow: null,
    pasteVisible: false,
    addEnvironVisible: false,
    updateFlag: false,
  };

  componentDidMount() {
    let dataList = window.localStorage.getItem(StorageKey);
    if (isStrictNull(dataList)) {
      dataList = [];
    } else {
      dataList = JSON.parse(dataList);
    }
    this.setState({ dataList });
  }

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

  copyJson = (record) => {
    const str = JSON.stringify([record]);
    addToClipBoard(str);
  };

  pasteEnvironment = (envs) => {
    const { dataList } = this.state;
    const _dataList = dataList.concat(envs);
    this.setState({ dataList: _dataList, pasteVisible: false });
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
    const { editingRow, dataList, pasteVisible, addEnvironVisible } = this.state;
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
          <Button
            onClick={() => {
              this.setState({ pasteVisible: true });
            }}
          >
            <BgColorsOutlined /> <FormattedMessage id='app.button.past' />
          </Button>
        </div>

        {dataList.length === 0 ? (
          <Empty />
        ) : (
          <Row gutter={32}>
            {dataList.map((record, index) => {
              const { envName, additionalInfos } = record;
              return (
                <Col key={index} {...GridResponsive}>
                  <Card
                    hoverable
                    title={envName}
                    actions={[
                      <EditOutlined
                        key='edit'
                        onClick={() => {
                          this.setState({
                            addEnvironVisible: true,
                            editingRow: record,
                          });
                        }}
                      />,
                      <DeleteOutlined
                        key='setting'
                        onClick={() => this.deleteEnvironment(record)}
                      />,
                      <CopyOutlined
                        key='copy'
                        onClick={() => {
                          this.copyJson(record);
                        }}
                      />,
                    ]}
                    bodyStyle={{ height: 220 }}
                  >
                    {additionalInfos?.map(({ key, value }) => (
                      <Form.Item key={key} label={key}>
                        {value}
                      </Form.Item>
                    ))}
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

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

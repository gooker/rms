import React, { Component } from 'react';
import { Button, Card, Col, Empty, Form, message, Modal, Row } from 'antd';
import { BgColorsOutlined, CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addToClipBoard, adjustModalWidth, formatMessage, getRandomString, isStrictNull } from '@/utils/util';
import { deleteDB, insertDB, selectAllDB, updateDB } from '@/utils/IndexDBUtil';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import AddEnvironmentModal from './components/AddEnvironmentModal';
import { GridResponsive } from '@/config/consts';
import commonStyles from '@/common.module.less';
import { Input } from '_antd@4.18.3@antd';

export default class EnvironmentManger extends Component {
  formRef = React.createRef();

  state = {
    dataList: [],
    editingRow: null,
    pasteVisible: false,
    addEnvironVisible: false,
    updateFlag: false,
    textAreaValue: null,
  };

  async componentDidMount() {
    const dataList = await selectAllDB(window.dbContext);
    this.setState({ dataList });
  }

  onAddEnvironment = async (values) => {
    const { dataList, editingRow } = this.state;
    let _dataList = [...dataList];
    if (editingRow) {
      values.id = editingRow.id;
      await updateDB(window.dbContext, values);
      _dataList = dataList.filter((item) => item.id !== editingRow.id);
      _dataList.unshift(values);
    } else {
      const dbLoad = { ...values, id: getRandomString(10), active: false };
      await insertDB(window.dbContext, dbLoad);
      _dataList.push(values);
    }
    this.setState({ dataList: _dataList, addEnvironVisible: false, editingRow: null });
    message.success(formatMessage({ id: 'app.message.operateSuccess' }));
  };

  deleteEnvironment = (record) => {
    const _this = this;

    const { dataList } = this.state;
    RmsConfirm({
      content: formatMessage({ id: 'environmentManager.deleteConfirmContent' }),
      onOk: async () => {
        await deleteDB(window.dbContext, record.id);
        const _dataList = dataList.filter((item) => item.id !== record.id);
        _this.setState({ dataList: _dataList });
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
      },
    });
  };

  copyJson = async (record) => {
    await addToClipBoard(JSON.stringify(record));
  };

  pasteEnvironment = async () => {
    const { dataList, textAreaValue } = this.state;
    if (!isStrictNull(textAreaValue)) {
      try {
        const dbLoad = { ...JSON.parse(textAreaValue), id: getRandomString(10) };
        await insertDB(window.dbContext, dbLoad);
        const _dataList = dataList.concat([dbLoad]);
        this.setState({ dataList: _dataList, pasteVisible: false });
      } catch (e) {
        message.error(formatMessage({ id: 'app.message.dataFormatError' }));
      }
    }
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
      <div>
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
          <Row gutter={[20, 20]}>
            {dataList.map((record) => {
              const { id, envName, additionalInfos } = record;
              return (
                <Col key={id} {...GridResponsive}>
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
                        key="setting"
                        onClick={() => this.deleteEnvironment(record)}
                      />,
                      <CopyOutlined
                        key="copy"
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
              <FormattedMessage id="environmentManager.update" />
            ) : (
              <FormattedMessage id="environmentManager.add" />
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
          closable={false}
          title={<FormattedMessage id='environmentManager.tip.pasteTip' />}
          onOk={this.pasteEnvironment}
          onCancel={() => {
            this.setState({ pasteVisible: false });
          }}
        >
          <Input.TextArea
            allowClear
            style={{ height: 200 }}
            onChange={({ target: { value } }) => {
              this.setState({ textAreaValue: value });
            }}
          />
        </Modal>
      </div>
    );
  }
}

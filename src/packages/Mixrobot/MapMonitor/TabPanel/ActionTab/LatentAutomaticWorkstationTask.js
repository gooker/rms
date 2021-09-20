import React, { Component } from 'react';
import { connect } from 'umi';
import find from 'lodash/find';
import {
  Card,
  Select,
  Input,
  Button,
  Col,
  Row,
  Tag,
  Checkbox,
  Table,
  message,
  Switch,
  Form,
} from 'antd';
import intl from 'react-intl-universal';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import MenuIcon from '@/MenuIcon';

const Layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const NoLabelLayout = { wrapperCol: { span: 16, offset: 6 } };

@connect(({ monitor }) => ({
  latentAutomaticTaskForm: monitor.latentAutomaticTaskForm, // 表单数据
  latentAutomaticTaskUsage: monitor.latentAutomaticTaskUsage, // 操作日志
  latentAutomaticTaskConfig: monitor.latentAutomaticTaskConfig || [], // 表格数据
}))
class LatentAutomaticWorkstationTask extends Component {
  formRef = React.createRef();

  state = {
    // 用来标记当前是否在编辑某一个配置
    isEdit: false,
    editIndex: null,
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/fetchSelectAutoCallPodToWorkstationStatus',
    });
  };

  // 开启&关闭自动呼叫, 开启&关闭自动释放, 新增配置中传递的实体类都是同一个
  collectRequestParam = (value) => {
    const { workstationList, latentAutomaticTaskConfig } = this.props;
    const { validateFields } = this.formRef.current;
    if (latentAutomaticTaskConfig.length === 0) {
      validateFields(['maxPodNum'], { force: true });
      validateFields(['randomPodFace'], { force: true });
    }
    const { workStation, randomPodFace, maxPodNum, callIntervalMill, delayReleaseSecondMill } =
      value;
    let workstationArray;
    if (workStation.length === 0 || workStation === '') {
      workstationArray = workstationList.map((record) => ({
        stopCellId: record.stopCellId,
        direction: record.direction,
      }));
    } else {
      workstationArray = workStation.map((record) => {
        const [stopCellId, angle] = record.split('-').map((item) => parseInt(item, 10));
        const workStationData = find(workstationList, { stopCellId, angle });
        return {
          stopCellId: workStationData.stopCellId,
          direction: workStationData.direction,
        };
      });
    }
    return {
      workstationArray,
      randomPodFace: randomPodFace.join(''),
      maxPodNum,
      callIntervalMill,
      delayReleaseSecondMill,
    };
  };

  resetFields = () => {
    const { setFieldsValue } = this.formRef.current;
    setFieldsValue({
      workStation: [],
      randomPodFace: [],
      maxPodNum: null,
      callIntervalMill: 3000,
      delayReleaseSecondMill: 3000,
    });
  };

  // 开启自动呼叫
  turnOnAutoCall = () => {
    const { dispatch } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields(['maxPodNum'], { force: true });
    validateFields(['randomPodFace'], { force: true });
    validateFields().then((value) => {
      const params = this.collectRequestParam(value);
      dispatch({ type: 'monitor/fetchAutoCallPodToWorkstation', payload: params });
    });
  };

  // 关闭自动释放
  turnOffAutoCall = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'monitor/fetchCancelAutoCallPodToWorkstation' });
  };

  // 开启自动释放
  turnOnAutoRelease = () => {
    const { dispatch } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields(['maxPodNum'], { force: true });
    validateFields(['randomPodFace'], { force: true });
    validateFields().then((value) => {
      const params = this.collectRequestParam(value);
      dispatch({ type: 'monitor/fetchAutoReleasePod', payload: params });
    });
  };

  // 关闭自动释放
  turnOffAutoRelease = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'monitor/fetchCancelAutoReleasePod' });
  };

  // 自动任务配置操作
  addAutomaticTaskConfig = () => {
    const { isEdit, editIndex } = this.state;
    const { dispatch, latentAutomaticTaskConfig } = this.props;
    const { validateFields } = this.formRef.current;
    validateFields().then((value) => {
      // TODO: 这里判断下当前添加的工作站在已存在的自动呼叫配置中是否存在，如果存在就给予提示并返回
      const params = this.collectRequestParam(value);
      // 这里需要判断当前是新增还是更新
      let newLatentAutomaticTaskConfig;
      if (isEdit) {
        this.setState({ isEdit: false, editIndex: null });
        newLatentAutomaticTaskConfig = [...latentAutomaticTaskConfig];
        newLatentAutomaticTaskConfig.splice(editIndex, 1, params);
      } else {
        newLatentAutomaticTaskConfig = [...latentAutomaticTaskConfig, params];
      }
      dispatch({
        type: 'monitor/fetchSaveLatentAutomaticTaskConfig',
        payload: newLatentAutomaticTaskConfig,
      }).then(() => {
        message.success(intl.formatMessage({ id: 'app.monitor.tip.addConfigSuccess' }));
        this.resetFields();
        this.getData();
      });
    });
  };

  deleteAutomaticTaskConfig = (record) => {
    const { dispatch, latentAutomaticTaskConfig } = this.props;
    const newLatentAutomaticCallConfig = [...latentAutomaticTaskConfig];
    const index = newLatentAutomaticCallConfig.indexOf(record);
    newLatentAutomaticCallConfig.splice(index, 1);
    dispatch({
      type: 'monitor/fetchSaveLatentAutomaticTaskConfig',
      payload: newLatentAutomaticCallConfig,
    }).then(() => {
      message.success(intl.formatMessage({ id: 'app.monitor.tip.deleteConfigSuccess' }));
      this.getData();
    });
  };

  editAutomaticTaskConfig = (record) => {
    this.setState({ isEdit: true, editIndex: record.id });
    const { workstationList } = this.props;
    const { setFieldsValue } = this.formRef.current;
    const { workstationArray, randomPodFace, maxPodNum, callIntervalMill, delayReleaseSecondMill } =
      record;

    // 处理工作站数据
    if (workstationList.length === workstationArray.length) {
      setFieldsValue({ workStation: [] });
    } else {
      const workStation = [];
      workstationArray.forEach((item) => {
        const { stopCellId } = item;
        const workStationData = find(workstationList, { stopCellId });
        workStation.push(`${workStationData.stopCellId}-${workStationData.angle}`);
      });
      setFieldsValue({ workStation });
    }

    setFieldsValue({
      randomPodFace: randomPodFace.split(''),
      maxPodNum,
      callIntervalMill,
      delayReleaseSecondMill,
    });
  };

  cancelEditConfig = () => {
    this.setState({ isEdit: false, editIndex: null });
    this.resetFields();
  };

  covertWorkstationArrayToFormData = (workstationArray) => {
    const { workstationList } = this.props;
    const workStation = [];
    if (workstationArray.length !== workstationList.length) {
      workstationArray.forEach((record) => {
        const { stopCellId } = record;
        const workStationData = find(workstationList, { stopCellId });
        workStationData &&
          workStation.push(`${workStationData.stopCellId}-${workStationData.angle}`);
      });
    }
    return workStation;
  };

  handleAutoCallSwitcherChanged = (checked) => {
    if (checked) {
      this.turnOnAutoCall();
    } else {
      this.turnOffAutoCall();
    }
  };

  handleAutoReleaseSwitcherChanged = (checked) => {
    if (checked) {
      this.turnOnAutoRelease();
    } else {
      this.turnOffAutoRelease();
    }
  };

  AutomaticTaskConfigColumn = [
    {
      title: intl.formatMessage({ id: 'app.monitorOperation.workstation' }),
      dataIndex: 'workstationArray',
      align: 'center',
      width: 150,
      render: (text) => text && text.map((item, index) => <Tag key={index}>{item.stopCellId}</Tag>),
    },
    {
      title: intl.formatMessage({ id: 'app.monitorOperation.targetDirection' }),
      dataIndex: 'randomPodFace',
      align: 'center',
      width: 100,
    },
    {
      title: intl.formatMessage({
        id: 'app.monitorOperation.automaticLatentWorkStationTask.maxPodNum',
      }),
      dataIndex: 'maxPodNum',
      align: 'center',
      width: 100,
    },
    {
      title: intl.formatMessage({
        id: 'app.monitorOperation.automaticLatentWorkStationTask.callIntervalMill',
      }),
      dataIndex: 'callIntervalMill',
      align: 'center',
      width: 100,
      render: (text) => `${text} ms`,
    },
    {
      title: intl.formatMessage({
        id: 'app.monitorOperation.automaticLatentWorkStationTask.delayReleaseSecondMill',
      }),
      dataIndex: 'delayReleaseSecondMill',
      align: 'center',
      width: 100,
      render: (text) => `${text} ms`,
    },
    {
      title: intl.formatMessage({ id: 'app.monitorOperation.operations' }),
      dataIndex: 'operation',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Row gutter={8}>
          <Col span={12}>
            <EditOutlined
              onClick={() => {
                this.editAutomaticTaskConfig(record);
              }}
            />
          </Col>
          <Col span={12}>
            <DeleteOutlined
              onClick={() => {
                this.deleteAutomaticTaskConfig(record);
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  render() {
    const { isEdit } = this.state;
    const {
      workstationList,
      latentAutomaticTaskForm,
      latentAutomaticTaskConfig,
      latentAutomaticTaskUsage,
    } = this.props;
    const autoCallState = latentAutomaticTaskForm?.isAutoCall;
    const autoReleaseState = latentAutomaticTaskForm?.isAutoRelease;
    const locale = window.localStorage.getItem('umi_locale') || 'zh-CN';
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...Layout}
          name={'workStation'}
          initialValue={
            latentAutomaticTaskForm?.workstationArray
              ? this.covertWorkstationArrayToFormData(latentAutomaticTaskForm.workstationArray)
              : []
          }
          label={intl.formatMessage({ id: 'app.monitorOperation.workstation' })}
        >
          <Select
            mode="multiple"
            placeholder={intl.formatMessage({
              id: 'app.monitorOperation.automaticLatentWorkStationTask.defaultAllStation',
            })}
            style={{ width: '80%' }}
          >
            {workstationList.map((record, index) => (
              <Select.Option value={`${record.stopCellId}-${record.angle}`} key={index}>
                {record.stopCellId}-{record.angle}°
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          {...Layout}
          name={'randomPodFace'}
          initialValue={
            latentAutomaticTaskForm?.randomPodFace
              ? latentAutomaticTaskForm.randomPodFace.split('')
              : []
          }
          label={intl.formatMessage({ id: 'app.monitorOperation.targetDirection' })}
          rules={[
            {
              required: latentAutomaticTaskConfig.length === 0,
              message: intl.formatMessage({
                id: 'app.monitorOperation.automaticLatentWorkStationTask.targetDirectionMessage',
              }),
            },
          ]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col span={7}>
                <Checkbox value="A">
                  <FormattedMessage id="app.monitorOperation.faceA" />
                </Checkbox>
              </Col>
              <Col span={7}>
                <Checkbox value="B">
                  <FormattedMessage id="app.monitorOperation.faceB" />
                </Checkbox>
              </Col>
              <Col span={7}>
                <Checkbox value="C">
                  <FormattedMessage id="app.monitorOperation.faceC" />
                </Checkbox>
              </Col>
              <Col span={7}>
                <Checkbox value="D">
                  <FormattedMessage id="app.monitorOperation.faceD" />
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          {...Layout}
          name={'maxPodNum'}
          label={intl.formatMessage({
            id: 'app.monitorOperation.automaticLatentWorkStationTask.maxPodNum',
          })}
          rules={[
            {
              required: latentAutomaticTaskConfig.length === 0,
              message: intl.formatMessage({
                id: 'app.monitorOperation.automaticLatentWorkStationTask.maxPodNumMessage',
              }),
            },
          ]}
          initialValue={
            latentAutomaticTaskForm?.maxPodNum ? latentAutomaticTaskForm?.maxPodNum : null
          }
        >
          <Input
            style={{ width: '80%' }}
            suffix={
              <FormattedMessage id="app.monitorOperation.automaticLatentWorkStationTask.unit" />
            }
          />
        </Form.Item>

        <Form.Item
          {...Layout}
          name={'callIntervalMill'}
          label={intl.formatMessage({
            id: 'app.monitorOperation.automaticLatentWorkStationTask.callIntervalMill',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'app.monitorOperation.automaticLatentWorkStationTask.callIntervalMillMessage',
              }),
            },
          ]}
          initialValue={
            latentAutomaticTaskForm?.callIntervalMill
              ? latentAutomaticTaskForm?.callIntervalMill
              : 3000
          }
        >
          <Input style={{ width: '80%' }} suffix={'ms'} />
        </Form.Item>

        <Form.Item
          {...(locale === 'zh-CN'
            ? Layout
            : {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
              })}
          name={'delayReleaseSecondMill'}
          label={intl.formatMessage({
            id: 'app.monitorOperation.automaticLatentWorkStationTask.delayReleaseSecondMill',
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'app.monitorOperation.automaticLatentWorkStationTask.delayReleaseSecondMillMessage',
              }),
            },
          ]}
          initialValue={
            latentAutomaticTaskForm?.delayReleaseSecondMill
              ? latentAutomaticTaskForm?.delayReleaseSecondMill
              : 3000
          }
        >
          <Input style={{ width: '80%' }} suffix={'ms'} />
        </Form.Item>

        <Form.Item {...NoLabelLayout}>
          <Row type="flex" gutter={10}>
            <Col span={12}>
              <Button type="primary" icon={MenuIcon.plus} onClick={this.addAutomaticTaskConfig}>
                {isEdit
                  ? intl.formatMessage({
                      id: 'app.monitorOperation.automaticLatentWorkStationTask.updateConfiguration',
                    })
                  : intl.formatMessage({
                      id: 'app.monitorOperation.automaticLatentWorkStationTask.addConfiguration',
                    })}
              </Button>
            </Col>
            <Col span={12}>
              {isEdit && (
                <Button onClick={this.cancelEditConfig}>
                  <FormattedMessage id="app.monitorOperation.automaticLatentWorkStationTask.cancel" />
                </Button>
              )}
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Table
            style={{ width: '402px' }}
            bordered
            pagination={false}
            scroll={{ x: 600 }}
            dataSource={latentAutomaticTaskConfig}
            columns={this.AutomaticTaskConfigColumn}
          />
        </Form.Item>

        <Form.Item>
          <Row gutter={2}>
            <Col span={12}>
              <Card
                title={intl.formatMessage({
                  id: 'app.monitorOperation.automaticLatentWorkStationTask.handleAutoCall',
                })}
                extra={
                  <Switch
                    checkedChildren={intl.formatMessage({
                      id: 'app.monitorOperation.automaticLatentWorkStationTask.open',
                    })}
                    unCheckedChildren={intl.formatMessage({
                      id: 'app.monitorOperation.automaticLatentWorkStationTask.close',
                    })}
                    checked={autoCallState}
                    onChange={this.handleAutoCallSwitcherChanged}
                  />
                }
              >
                <Log
                  user={latentAutomaticTaskUsage.callByUser}
                  time={latentAutomaticTaskUsage.callTime}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={intl.formatMessage({
                  id: 'app.monitorOperation.automaticLatentWorkStationTask.handleAutoRelease',
                })}
                extra={
                  <Switch
                    checkedChildren={intl.formatMessage({
                      id: 'app.monitorOperation.automaticLatentWorkStationTask.open',
                    })}
                    unCheckedChildren={intl.formatMessage({
                      id: 'app.monitorOperation.automaticLatentWorkStationTask.close',
                    })}
                    checked={autoReleaseState}
                    onChange={this.handleAutoReleaseSwitcherChanged}
                  />
                }
              >
                <Log
                  user={latentAutomaticTaskUsage.releaseByUser}
                  time={latentAutomaticTaskUsage.releaseTime}
                />
              </Card>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}
export default LatentAutomaticWorkstationTask;

function Log(props) {
  return (
    <>
      <div>
        <div style={{ fontSize: 15 }}>
          <FormattedMessage id="app.monitorOperation.automaticLatentWorkStationTask.operator" />
        </div>
        <div style={{ fontSize: 14, color: '#2c9f45', fontWeight: 700 }}> {props.user}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 15 }}>
          <FormattedMessage id="app.monitorOperation.automaticLatentWorkStationTask.operateDate" />
        </div>
        <div style={{ fontSize: 14, color: '#2c9f45', fontWeight: 700 }}>{props.time}</div>
      </div>
    </>
  );
}

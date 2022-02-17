import React, { memo, useEffect, useState } from 'react';
import {
  Form,
  Button,
  Divider,
  Row,
  Col,
  Select,
  Checkbox,
  Input,
  Table,
  Tag,
  Card,
  Switch,
  message,
} from 'antd';
import { CloseOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { find } from 'lodash';
import { formatMessage, getFormLayout } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';
import styles from '../monitorLayout.module.less';

const width = 500;
const height = 600;
const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const AutomaticLatentWorkstationTask = (props) => {
  const {
    dispatch,
    workstationList,
    latentAutomaticTaskForm,
    latentAutomaticTaskConfig,
    latentAutomaticTaskUsage,
  } = props;

  const [formRef] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const autoCallState = latentAutomaticTaskForm?.isAutoCall;
  const autoReleaseState = latentAutomaticTaskForm?.isAutoRelease;

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    dispatch({
      type: 'monitor/fetchLatentAutoCallPodToWorkstation',
    });
  }

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  const AutomaticTaskConfigColumn = [
    {
      title: <FormattedMessage id="app.map.workstation" />,
      dataIndex: 'workstationArray',
      align: 'center',
      width: 150,
      render: (text) => text && text.map((item, index) => <Tag key={index}>{item.stopCellId}</Tag>),
    },
    {
      title: <FormattedMessage id="app.pod.direction" />,
      dataIndex: 'randomPodFace',
      align: 'center',
      width: 100,
    },
    {
      title: <FormattedMessage id="monitor.automaticLatentWorkStationTask.maxPodNum" />,
      dataIndex: 'maxPodNum',
      align: 'center',
      width: 100,
    },
    {
      title: <FormattedMessage id="monitor.automaticLatentWorkStationTask.callIntervalMill" />,
      dataIndex: 'callIntervalMill',
      align: 'center',
      width: 100,
      render: (text) => `${text} ms`,
    },
    {
      title: (
        <FormattedMessage id="monitor.automaticLatentWorkStationTask.delayReleaseSecondMill" />
      ),
      dataIndex: 'delayReleaseSecondMill',
      align: 'center',
      width: 100,
      render: (text) => `${text} ms`,
    },
    {
      title: <FormattedMessage id="app.common.operation" />,
      dataIndex: 'operation',
      align: 'center',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Row gutter={8}>
          <Col span={12}>
            <EditOutlined
              onClick={() => {
                setIsEdit(true);
                setEditIndex(record.id);
                editAutoTaskConfig(record);
              }}
            />
          </Col>
          <Col span={12}>
            <DeleteOutlined
              onClick={() => {
                deleteAutoTaskConfig(record);
              }}
            />
          </Col>
        </Row>
      ),
    },
  ];

  function covertWorkstationArrayToFormData(workstationArray) {
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
  }

  function resetFields() {
    const { setFieldsValue } = formRef;
    setFieldsValue({
      workStation: [],
      randomPodFace: [],
      maxPodNum: null,
      callIntervalMill: 3000,
      delayReleaseSecondMill: 3000,
    });
  }

  // 添加配置/更新配置
  function addAutomaticTaskConfig() {
    const { validateFields } = formRef;
    validateFields()
      .then((value) => {
        const params = collectRequestParam(value);
        // 这里需要判断当前是新增还是更新
        let newLatentAutomaticTaskConfig;
        if (isEdit) {
          newLatentAutomaticTaskConfig = [...latentAutomaticTaskConfig];
          newLatentAutomaticTaskConfig.splice(editIndex, 1, params);
          setIsEdit(false);
          setEditIndex(null);
        } else {
          newLatentAutomaticTaskConfig = [...latentAutomaticTaskConfig, params];
        }
        dispatch({
          type: 'monitor/fetchSaveLatentAutomaticTaskConfig',
          payload: newLatentAutomaticTaskConfig,
        }).then(() => {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          resetFields();
          getData();
        });
      })
      .catch(() => {});
  }

  // 编辑
  function editAutoTaskConfig(record) {
    const { setFieldsValue } = formRef;
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
  }

  // 删除
  function deleteAutoTaskConfig(record) {
    const newLatentAutomaticCallConfig = [...latentAutomaticTaskConfig];
    const index = newLatentAutomaticCallConfig.indexOf(record);
    newLatentAutomaticCallConfig.splice(index, 1);
    dispatch({
      type: 'monitor/fetchSaveLatentAutomaticTaskConfig',
      payload: newLatentAutomaticCallConfig,
    }).then(() => {
      message.success(
        formatMessage({ id: 'monitor.automaticLatentWorkStationTask.deleteConfig.success' }),
      );
      getData();
    });
  }

  // 取消
  function cancelEditConfig() {
    setIsEdit(false);
    setEditIndex(null);
    resetFields();
  }

  // 开启&关闭自动呼叫, 开启&关闭自动释放, 新增配置中传递的实体类都是同一个
  function collectRequestParam(value) {
    const { validateFields } = formRef;
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
  }

  // 自动呼叫
  function handleAutoCallChanged(checked) {
    if (checked) {
      const { validateFields } = formRef;
      validateFields(['maxPodNum'], { force: true });
      validateFields(['randomPodFace'], { force: true });
      validateFields()
        .then((value) => {
          const params = collectRequestParam(value);
          dispatch({ type: 'monitor/openAutomatCcall', payload: params }); // TODO:看着不需要放在monitor
        })
        .catch(() => {});
    } else {
      dispatch({ type: 'monitor/cancelAutomatiCcall' }); //  TODO:看着不需要放在monitor
    }
  }

  // 自动释放
  function handleAutoReleaseChanged(checked) {
    if (checked) {
      const { validateFields } = formRef;
      validateFields(['maxPodNum'], { force: true });
      validateFields(['randomPodFace'], { force: true });
      validateFields()
        .then((value) => {
          const params = collectRequestParam(value);
          dispatch({ type: 'monitor/openAutoReleasePod', payload: params });
        })
        .catch(() => {});
    } else {
      dispatch({ type: 'monitor/cancelAutoReleasePod' });
    }
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% - ${width / 2}px)`,
      }}
      className={styles.monitorModal}
    >
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.autoCall'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'workStation'}
            initialValue={
              latentAutomaticTaskForm?.workstationArray
                ? covertWorkstationArrayToFormData(latentAutomaticTaskForm.workstationArray)
                : []
            }
            label={formatMessage({ id: 'app.map.workstation' })}
          >
            <Select
              mode="multiple"
              placeholder={formatMessage({
                id: 'monitor.automaticLatentWorkStationTask.defaultAllStation',
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
            name={'randomPodFace'}
            initialValue={
              latentAutomaticTaskForm?.randomPodFace
                ? latentAutomaticTaskForm.randomPodFace.split('')
                : []
            }
            label={formatMessage({ id: 'app.pod.direction' })}
            rules={[{ required: latentAutomaticTaskConfig.length === 0 }]}
          >
            <Checkbox.Group
              options={[
                { label: formatMessage({ id: 'app.pod.side.A' }), value: 'A' },
                { label: formatMessage({ id: 'app.pod.side.B' }), value: 'B' },
                { label: formatMessage({ id: 'app.pod.side.C' }), value: 'C' },
                { label: formatMessage({ id: 'app.pod.side.D' }), value: 'D' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name={'maxPodNum'}
            label={formatMessage({
              id: 'monitor.automaticLatentWorkStationTask.maxPodNum',
            })}
            rules={[
              {
                required: latentAutomaticTaskConfig.length === 0,
              },
            ]}
            initialValue={
              latentAutomaticTaskForm?.maxPodNum ? latentAutomaticTaskForm?.maxPodNum : null
            }
          >
            <Input suffix={<FormattedMessage id="app.report.unit" />} />
          </Form.Item>

          <Form.Item
            name={'callIntervalMill'}
            label={formatMessage({
              id: 'monitor.automaticLatentWorkStationTask.callIntervalMill',
            })}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={
              latentAutomaticTaskForm?.callIntervalMill
                ? latentAutomaticTaskForm?.callIntervalMill
                : 3000
            }
          >
            <Input suffix={'ms'} />
          </Form.Item>

          <Form.Item
            name={'delayReleaseSecondMill'}
            label={formatMessage({
              id: 'monitor.automaticLatentWorkStationTask.delayReleaseSecondMill',
            })}
            rules={[
              {
                required: true,
              },
            ]}
            initialValue={
              latentAutomaticTaskForm?.delayReleaseSecondMill
                ? latentAutomaticTaskForm?.delayReleaseSecondMill
                : 3000
            }
          >
            <Input suffix={'ms'} />
          </Form.Item>
          <Form.Item {...formItemLayoutNoLabel}>
            <Row type="flex" gutter={10}>
              <Col span={12}>
                <Button type="primary" icon={<PlusOutlined />} onClick={addAutomaticTaskConfig}>
                  {isEdit
                    ? formatMessage({
                        id: 'monitor.automaticLatentWorkStationTask.updateConfiguration',
                      })
                    : formatMessage({
                        id: 'monitor.automaticLatentWorkStationTask.addConfiguration',
                      })}
                </Button>
              </Col>
              <Col span={12}>
                {isEdit && (
                  <Button onClick={cancelEditConfig}>
                    <FormattedMessage id="app.button.cancel" />
                  </Button>
                )}
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <Divider />
        <Table
          style={{ width: width }}
          bordered
          pagination={false}
          scroll={{ x: 600 }}
          rowKey={(_, index) => index}
          dataSource={latentAutomaticTaskConfig}
          columns={AutomaticTaskConfigColumn}
        />
        <Row gutter={2}>
          <Col span={24} style={{ marginTop: 10 }}>
            <Card
              title={formatMessage({
                id: 'monitor.right.autoCall',
              })}
              extra={
                <Switch
                  checkedChildren={formatMessage({
                    id: 'app.button.turnOn',
                  })}
                  unCheckedChildren={formatMessage({
                    id: 'app.button.close',
                  })}
                  checked={autoCallState}
                  onChange={handleAutoCallChanged}
                />
              }
            >
              <Log
                user={latentAutomaticTaskUsage?.callByUser}
                time={latentAutomaticTaskUsage?.callTime}
              />
            </Card>
          </Col>
          <Col span={24} style={{ marginTop: 10 }}>
            <Card
              title={formatMessage({
                id: 'monitor.automaticLatentWorkStationTask.handleAutoRelease',
              })}
              extra={
                <Switch
                  checkedChildren={formatMessage({
                    id: 'app.button.turnOn',
                  })}
                  unCheckedChildren={formatMessage({
                    id: 'app.button.close',
                  })}
                  checked={autoReleaseState}
                  onChange={handleAutoReleaseChanged}
                />
              }
            >
              <Log
                user={latentAutomaticTaskUsage?.releaseByUser}
                time={latentAutomaticTaskUsage?.releaseTime}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default connect(({ monitor }) => ({
  workstationList: getCurrentLogicAreaData('monitor')?.workstationList || [],
  latentAutomaticTaskForm: monitor.latentAutomaticTaskForm, // 表单数据
  latentAutomaticTaskUsage: monitor.latentAutomaticTaskUsage, // 操作日志
  latentAutomaticTaskConfig: monitor.latentAutomaticTaskConfig || [], // 表格数据
}))(memo(AutomaticLatentWorkstationTask));

function Log(props) {
  return (
    <>
      <div>
        <div style={{ fontSize: 15 }}>
          <FormattedMessage id="app.common.operator" />
        </div>
        <div style={{ fontSize: 14, color: '#2c9f45', fontWeight: 700 }}> {props.user}</div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 15 }}>
          <FormattedMessage id="app.taskDetail.operatingTime" />
        </div>
        <div style={{ fontSize: 14, color: '#2c9f45', fontWeight: 700 }}>{props.time}</div>
      </div>
    </>
  );
}

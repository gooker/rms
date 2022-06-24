import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import moment from 'moment';
import { Button, DatePicker, Form, Input, InputNumber, message, Modal, Radio, Select } from 'antd';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import EditVaribleModal from './EditVaribleModal';
import { fetchActiveMap } from '@/services/commonService';

const FormItem = Form.Item;
const formItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 18 } };

const TaskTriggerModal = (props) => {
  /**
   * updateItem 当前在编辑的触发器, 为null时表示当前是新建
   */
  const { title, visible, updateItem, customTaskList, onCancel, onSubmit } = props;

  const [form] = Form.useForm();

  // 是否可以编辑变量
  const [editVariableDisabled, setEditVariableDisabled] = useState(true);
  // 编辑变量弹窗
  const [editVaribleVisible, setEditVaribleVisible] = useState(false);
  // 触发器变量(中间值)
  const [variables, setVariables] = useState(null);
  // 是否修改了变量
  const [variablesChanged, setVariablesChanged] = useState(null);
  // 获取变量loading
  const [loading, setLoading] = useState(false);

  // 该Hook只处理编辑的case
  useEffect(() => {
    if (isNull(updateItem)) return;
    setEditVariableDisabled(updateItem.variable !== 'fixed');

    // 表单绑定数据
    const formItemValues = {};
    Object.keys(updateItem).forEach((k) => {
      if (
        [
          'name',
          'describe',
          'codes',
          'variable',
          'timeInterval',
          'totalCount',
          'basedOnEvents',
        ].includes(k)
      ) {
        if (k === 'basedOnEvents') {
          formItemValues[k] = updateItem[k] ? updateItem[k] : [];
        } else {
          formItemValues[k] = updateItem[k];
        }
      }
    });
    formItemValues.endTime = updateItem.endTime
      ? moment(updateItem.endTime, 'YYYY-MM-DD HH:mm')
      : null;
    form.setFieldsValue(formItemValues);
  }, [updateItem]);

  // 点击”编辑变量“时候如果variablesChanged是true就直接使用”variables“数据，否则会手动拉取变量信息
  function editVariable() {
    const param = form.getFieldValue('codes');
    if (!Array.isArray(param)) return;
    setLoading(true);
    const currentDataBycode = customTaskList?.filter(({ code }) => param.includes(code));
    if (!variablesChanged) {
      setVariables(currentDataBycode);
    }
    setEditVaribleVisible(true);
    setLoading(false);
  }

  function updateVariable(outVariables) {
    setVariablesChanged(true);
    setVariables(outVariables);
  }

  function submit() {
    form.validateFields().then(async (values) => {
      // 总下发次数 结束时间 要填一个
      if (isNull(values.endTime) && isNull(values.totalCount)) {
        message.error(formatMessage({ id: 'taskTrigger.taskTrigger.totaTimes.required' }));
        return;
      }
      values.endTime = values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null;
      if (updateItem) {
        values.id = updateItem.id;
        values.status = updateItem.status;
      } else {
        values.status = 'end'; // 新增默认结束状态 前端or后端默认
      }

      // 判断下 variables 值是否存在，不存在的话要获取下变量信息
      if (isNull(variables)) {
        // TODO: 默认的
        const { codes } = values;
        const currentDataBycode = customTaskList?.filter(({ code }) => codes.includes(code));
        values.fixedVariable = currentDataBycode;
      }

      // 只有变量被编辑了再重新赋值
      if (variablesChanged) {
        values.fixedVariable = variables;
      }

      // 如果是随机变量，fixedVariable就为null
      if (values.variable === 'random') {
        values.fixedVariable = null;
      }
      onSubmit(values);
    });
  }

  return (
    <Modal
      destroyOnClose
      title={title}
      visible={visible}
      closable={false}
      maskClosable={false}
      width={600}
      style={{ top: 30 }}
      footer={
        <div>
          <Button
            onClick={() => {
              form.resetFields();
              onCancel();
            }}
          >
            <FormattedMessage id={'app.button.cancel'} />
          </Button>
          <Button
            onClick={editVariable}
            style={{ marginLeft: 13 }}
            disabled={editVariableDisabled}
            loading={loading}
          >
            <FormattedMessage id={'taskTrigger.editVariable'} />
          </Button>
          <Button type="primary" onClick={submit} style={{ marginLeft: 13 }}>
            <FormattedMessage id={'app.button.save'} />
          </Button>
        </div>
      }
    >
      <Form form={form} {...formItemLayout}>
        {/* 触发器名称 */}
        <FormItem
          name="name"
          label={formatMessage({ id: 'app.common.name' })}
          rules={[{ required: true }]}
        >
          <Input />
        </FormItem>
        {/* 触发器描述 */}
        <FormItem name="describe" label={formatMessage({ id: 'app.common.description' })}>
          <Input />
        </FormItem>
        {/* 触发的任务 */}
        <FormItem
          name="codes"
          label={formatMessage({ id: 'taskTrigger.triggerTasks' })}
          rules={[{ required: true }]}
          getValueFromEvent={(value) => {
            setVariables(null); // 触发任务变了就清空变量信息
            setVariablesChanged(null);
            return value;
          }}
        >
          <Select allowClear mode="multiple" maxTagCount={4}>
            {customTaskList.map((element) => (
              <Select.Option key={element.code} value={element.code}>
                {element.name}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        {/* 支持变量 */}
        <FormItem
          name="variable"
          initialValue={'random'}
          label={formatMessage({ id: 'taskTrigger.variable' })}
          getValueFromEvent={(ev) => {
            setEditVariableDisabled(ev.target.value !== 'fixed');
            return ev.target.value;
          }}
        >
          <Radio.Group>
            <Radio.Button value="random">
              {formatMessage({ id: 'taskTrigger.randomVariable' })}
            </Radio.Button>
            <Radio.Button value="fixed">
              {formatMessage({ id: 'taskTrigger.fixedVariable' })}
            </Radio.Button>
          </Radio.Group>
        </FormItem>
        {/* 时间间隔 */}
        <FormItem
          name="timeInterval"
          label={`${formatMessage({ id: 'app.trigger.timeInterval' })}(s)`}
          rules={[
            { required: true },
            {
              pattern: /^[0-9]*$/,
              message: formatMessage({ id: 'app.taskTrigger.timeRulesMessage' }),
            },
          ]}
        >
          <InputNumber min={0} />
        </FormItem>
        {/* 总下发次数 */}
        <FormItem
          name="totalCount"
          label={formatMessage({ id: 'taskTrigger.totaTimes' })}
          rules={[
            {
              pattern: /^[0-9]*$/,
              message: formatMessage({ id: 'app.taskTrigger.timeRulesMessage' }),
            },
          ]}
        >
          <InputNumber min={0} />
        </FormItem>
        {/* 结束时间 */}
        <FormItem name="endTime" label={formatMessage({ id: 'app.common.endTime' })}>
          <DatePicker format="YYYY-MM-DD HH:mm" showTime={{ format: 'HH:mm' }} />
        </FormItem>
        {/* 基于事件触发 */}
        {/* <FormItem
          name="basedOnEvents"
          label={formatMessage({ id: 'app.taskTrigger.basedOnEvents' })}
        >
          <Select mode="tags" options={eventModel} maxTagCount={4} allowClear />
        </FormItem> */}
      </Form>

      {/* 编辑变量 */}
      <EditVaribleModal
        data={variables}
        visible={editVaribleVisible}
        onCancel={() => {
          setEditVaribleVisible(false);
        }}
        onSubmit={(output) => {
          updateVariable(output);
          setEditVaribleVisible(false);
        }}
      />
    </Modal>
  );
};
export default connect(({ taskTriger }) => ({
  customTaskList: taskTriger.customTaskList,
}))(memo(TaskTriggerModal));

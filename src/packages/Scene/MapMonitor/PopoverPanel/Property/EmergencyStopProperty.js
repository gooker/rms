import React, { memo, useEffect, useRef, useState } from 'react';
import { Button, Divider, Form, Input, InputNumber, Popconfirm, Switch, Tag } from 'antd';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import {
  deleteEmergencyStop,
  getEmergencyStopByCode,
  changeEmergencyStopStatus,
  saveEmergencyStop,
} from '@/services/XIHE';

const { formItemLayout } = getFormLayout(7, 17);
const { formItemLayout: formItemLayout2 } = getFormLayout(9, 15);

const descriptionStyle = {};
const EmergencyStopProperty = (props) => {
  const { dispatch, data, mapId, mapContext } = props;

  const formData = useRef();
  const [editMode, setEditMode] = useState(false);
  const [dataReal, setDataReal] = useState({});
  const [status, setStatus] = useState(false);

  useEffect(() => {
    refreshData();
  }, [data]);

  function refreshData() {
    const { code } = data;
    getEmergencyStopByCode(code).then((response) => {
      if (!dealResponse(response)) {
        setDataReal(response);
        setStatus(response.activated);
      }
    });
  }

  function generateTitle() {
    if (dataReal) {
      const { group, code, name: _name } = dataReal;
      if (isNull(_name)) {
        return group ? `${group}:${code}` : code;
      }
      return _name;
    }
    return <FormattedMessage id={'app.common.loading'} />;
  }

  // 启用禁用
  async function changeEStopStatus() {
    const params = { activated: !status, mapId };
    // 如果有group 就传group. 否则就传code--不能都传
    if (!isStrictNull(dataReal.group)) {
      params.group = dataReal.group;
    } else {
      params.code = dataReal.code;
    }
    const result = await changeEmergencyStopStatus(params);
    if (!dealResponse(result, 1)) {
      refreshData();
    }
  }

  async function remove() {
    const response = await deleteEmergencyStop({ code: dataReal.code });
    if (!dealResponse(response, 1)) {
      mapContext.removeCurrentEmergencyFunction(dataReal.code);
      dispatch({ type: 'monitor/updateSelections', payload: [] });
    }
  }

  async function saveUpdate() {
    setEditMode(false);
    if (!isNull(formData.current)) {
      const response = await saveEmergencyStop(formData.current);
      if (!dealResponse(response, true)) {
        formData.current = null;
        setEditMode(false);
      }
    } else {
      setEditMode(false);
    }
  }

  function onFormValuesChange(values) {
    formData.current = values;
  }

  return (
    <>
      <div>
        <FormattedMessage id={'app.map.emergencyStop'} /> [{generateTitle()}]
      </div>
      <div>
        {dataReal && (
          <>
            <Form labelWrap {...formItemLayout2}>
              <Form.Item label={formatMessage({ id: 'app.common.status' })}>
                <Popconfirm
                  title={formatMessage({ id: 'app.message.doubleConfirm' })}
                  onConfirm={changeEStopStatus}
                >
                  <Switch
                    disabled={editMode}
                    checked={status}
                    checkedChildren={formatMessage({ id: 'app.agv.on' })}
                    unCheckedChildren={formatMessage({ id: 'app.agv.off' })}
                  />
                </Popconfirm>
              </Form.Item>
              {!dataReal.isFixed && (
                <Form.Item label={formatMessage({ id: 'monitor.estop.delete' })}>
                  <Popconfirm
                    title={formatMessage({ id: 'app.message.doubleConfirm' })}
                    onConfirm={remove}
                  >
                    <Button danger size="small" disabled={editMode}>
                      <FormattedMessage id="app.button.delete" />
                    </Button>
                  </Popconfirm>
                </Form.Item>
              )}
              <Form.Item label={formatMessage({ id: 'monitor.estop.isSafe' })}>
                {dataReal.isSafe && dataReal.activated ? (
                  <Tag color="red">
                    <FormattedMessage id="monitor.estop.safe" />
                  </Tag>
                ) : (
                  <Tag color="lime">
                    <FormattedMessage id="monitor.estop.unsafe" />
                  </Tag>
                )}
              </Form.Item>
            </Form>
            <Divider style={{ margin: '10px 0', background: '#888888' }} />
            <div style={{ textAlign: 'end' }}>
              {editMode ? (
                <Button type={'link'} icon={<CheckOutlined />} onClick={saveUpdate}>
                  <FormattedMessage id={'app.button.confirm'} />
                </Button>
              ) : (
                <Button
                  type={'link'}
                  icon={<EditOutlined />}
                  disabled={!!dataReal?.activated}
                  onClick={() => {
                    setEditMode(true);
                  }}
                >
                  <FormattedMessage id={'app.button.edit'} />
                </Button>
              )}
            </div>

            {editMode ? (
              <EStopForm data={dataReal} mapContext={mapContext} update={onFormValuesChange} />
            ) : (
              <>
                <Form.Item label={formatMessage({ id: 'app.common.name' })} {...formItemLayout}>
                  <span style={descriptionStyle}>{dataReal.name}</span>
                </Form.Item>
                <Form.Item
                  label={formatMessage({ id: 'app.common.groupName' })}
                  {...formItemLayout}
                >
                  <span style={descriptionStyle}>{dataReal.group}</span>
                </Form.Item>
                <Form.Item label={'x'} {...formItemLayout}>
                  <span style={descriptionStyle}>{dataReal.x}</span>
                </Form.Item>
                <Form.Item label={'y'} {...formItemLayout}>
                  <span style={descriptionStyle}>{dataReal.y}</span>
                </Form.Item>

                {dataReal.xlength && dataReal.ylength ? (
                  <>
                    <Form.Item
                      label={formatMessage({ id: 'app.common.width' })}
                      {...formItemLayout}
                    >
                      <span style={descriptionStyle}>{dataReal.xlength}</span>
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({ id: 'app.common.height' })}
                      {...formItemLayout}
                    >
                      <span style={descriptionStyle}>{dataReal.ylength}</span>
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({ id: 'app.common.angle' })}
                      {...formItemLayout}
                    >
                      <span style={descriptionStyle}>{dataReal.angle}</span>
                    </Form.Item>
                  </>
                ) : (
                  <Form.Item label={formatMessage({ id: 'app.common.radius' })} {...formItemLayout}>
                    <span>{dataReal.r}</span>
                  </Form.Item>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default connect(({ monitor }) => ({
  mapContext: monitor.mapContext,
  mapId: monitor.currentMap?.id,
}))(memo(EmergencyStopProperty));

const EStopForm = (props) => {
  const { data, mapContext, update } = props;
  const [formRef] = Form.useForm();

  function onValuesChange(changedValue, values) {
    const mergeData = { ...data, ...values };
    update(mergeData);
    mapContext.renderEmergencyStopArea([mergeData]);
  }

  return (
    <Form form={formRef} onValuesChange={onValuesChange} {...formItemLayout}>
      <Form.Item
        name={'name'}
        label={formatMessage({ id: 'app.common.name' })}
        initialValue={data.name}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'group'}
        label={formatMessage({ id: 'app.common.groupName' })}
        initialValue={data.group}
      >
        <Input />
      </Form.Item>
      <Form.Item name={'x'} label={'x'} initialValue={data.x}>
        <InputNumber />
      </Form.Item>
      <Form.Item name={'y'} label={'y'} initialValue={data.y}>
        <InputNumber />
      </Form.Item>
      <Form.Item
        name={'xlength'}
        label={formatMessage({ id: 'app.common.width' })}
        initialValue={data.xlength}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        name={'ylength'}
        label={formatMessage({ id: 'app.common.height' })}
        initialValue={data.ylength}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        name={'angle'}
        label={formatMessage({ id: 'app.common.angle' })}
        initialValue={data.angle}
      >
        <InputNumber min={0} max={359} />
      </Form.Item>
    </Form>
  );
};

import React, { memo, useEffect, useState } from 'react';
import { Button, Form, Popconfirm, Switch, Tag } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, getFormLayout, isNull, isStrictNull } from '@/utils/util';
import {
  changeEmergencyStopStatus,
  deleteEmergencyStop,
  getEmergencyStopByCode,
} from '@/services/XIHE';

const textSpan = { fontSize: '1.3vh', color: 'rgb(24, 144, 255)' };
const { formItemLayout } = getFormLayout(7, 16);

const EmergencyStopProperty = (props) => {
  const { data, mapId, mapContext } = props;

  const [dataReal, setDataReal] = useState(null);
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
    }
  }

  return (
    <>
      <div>
        <FormattedMessage id={'app.map.emergencyStop'} /> [{generateTitle()}]
      </div>
      <div>
        {dataReal && (
          <Form labelWrap {...formItemLayout}>
            <Form.Item label={formatMessage({ id: 'app.common.status' })}>
              <Popconfirm
                title={formatMessage({ id: 'app.message.doubleConfirm' })}
                onConfirm={changeEStopStatus}
              >
                <Switch
                  checked={status}
                  checkedChildren={formatMessage({ id: 'app.common.enabled' })}
                  unCheckedChildren={formatMessage({ id: 'app.common.disabled' })}
                />
              </Popconfirm>
            </Form.Item>
            {!dataReal.isFixed && (
              <Form.Item label={'删除急停区'}>
                <Popconfirm
                  title={formatMessage({ id: 'app.message.doubleConfirm' })}
                  onConfirm={remove}
                >
                  <Button danger size="small">
                    <FormattedMessage id="app.button.delete" />
                  </Button>
                </Popconfirm>
              </Form.Item>
            )}

            <Form.Item label={formatMessage({ id: 'app.common.name' })}>
              <span style={textSpan}>{dataReal.name}</span>
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'app.common.groupName' })}>
              <span style={textSpan}>{dataReal.group}</span>
            </Form.Item>
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

            <Form.Item label={'x'}>
              <span style={textSpan}>{dataReal.x}</span>
            </Form.Item>
            <Form.Item label={'y'}>
              <span style={textSpan}>{dataReal.y}</span>
            </Form.Item>
            {dataReal.xlength && dataReal.ylength ? (
              <>
                <Form.Item label={formatMessage({ id: 'app.common.width' })}>
                  <span style={textSpan}>{dataReal.xlength}</span>
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'app.common.height' })}>
                  <span style={textSpan}>{dataReal.ylength}</span>
                </Form.Item>
                <Form.Item label={formatMessage({ id: 'app.common.angle' })}>
                  <span style={textSpan}>{dataReal.angle}</span>
                </Form.Item>
              </>
            ) : (
              <Form.Item label={formatMessage({ id: 'app.common.radius' })}>
                <span style={textSpan}>{dataReal.r}</span>
              </Form.Item>
            )}
          </Form>
        )}
      </div>
    </>
  );
};
export default connect(({ monitor }) => ({
  mapContext: monitor.mapContext,
  mapId: monitor.currentMap?.id,
}))(memo(EmergencyStopProperty));

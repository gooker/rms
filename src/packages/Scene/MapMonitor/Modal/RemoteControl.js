import React, { memo } from 'react';
import { Form, Button, Input, Select, InputNumber, message } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { agvRemoteControl } from '@/services/monitor';
import { connect } from '@/utils/RmsDva';
import {
  dealResponse,
  formatMessage,
  getFormLayout,
  getMapModalPosition,
  isStrictNull,
} from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { Category } from '../enums';
import styles from '../monitorLayout.module.less';

const { formItemLayout } = getFormLayout(4, 20);

const RemoteControl = (props) => {
  const { dispatch, allAGVs, categoryPanel } = props;
  const [formRef] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function prefabricatedCommand(code, value) {
    let params = null;
    const robotId = formRef.getFieldValue('robotId');
    if (isStrictNull(robotId)) {
      formRef.validateFields(['robotId'], { force: true });
      return;
    }
    switch (code) {
      // 小车直行
      case 0x02:
      case 0x03: {
        const distance = formRef.getFieldValue('distance');
        params = {
          robotId,
          commandCode: code,
          commandParameter: distance,
          rawCommandHex: null,
        };
        break;
      }
      // 小车转向 & 托盘旋转
      case 0x10:
      case 0x11: {
        params = {
          robotId,
          commandCode: code,
          commandParameter: value,
          rawCommandHex: null,
        };
        break;
      }
      // 升降货架
      case 0x20:
      case 0x21: {
        const podId = formRef.getFieldValue('podId');
        params = {
          robotId,
          commandCode: code,
          commandParameter: podId,
          rawCommandHex: null,
        };
        break;
      }
      default:
        break;
    }
    const agv = find(allAGVs, { robotId });
    if (agv) {
      agvRemoteControl(agv.robotType, params).then((response) => {
        if (dealResponse(response)) {
          message.error(formatMessage({ id: 'app.message.operateFailed' }));
        } else {
          message.success(formatMessage({ id: 'app.message.sendCommandSuccess' }));
        }
      });
    } else {
      console.error('小车id不存在');
    }
  }

  function sendCustomCommand() {
    const robotId = formRef.getFieldValue('robotId');
    if (isStrictNull(robotId)) {
      formRef.validateFields(['robotId'], { force: true });
      return;
    }
    const agv = find(allAGVs, { robotId });
    const hexCommand = formRef.getFieldValue('hexCommand');
    const params = {
      robotId,
      commandCode: null,
      commandParameter: null,
      rawCommandHex: hexCommand,
    };
    if (agv) {
      agvRemoteControl(agv.robotType, params).then((response) => {
        if (dealResponse(response)) {
          message.error(formatMessage({ id: 'app.message.operateFailed' }));
        } else {
          message.success(formatMessage({ id: 'app.message.sendCommandSuccess' }));
        }
      });
    } else {
      console.error('小车id不存在');
    }
  }

  return (
    <div style={getMapModalPosition(600, 600)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.remoteControl'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        <Form form={formRef} {...formItemLayout}>
          <Form.Item
            name={'robotId'}
            label={formatMessage({ id: 'app.agv.id' })}
            rules={[{ required: true }]}
          >
            <Select mode={'tags'} style={{ width: 400 }} />
          </Form.Item>

          {/* 小车直行 */}
          <Form.Item label={formatMessage({ id: 'monitor.remoteControl.agvStraight' })}>
            <div style={{ marginBottom: 5 }}>
              <Button
                onClick={() => {
                  prefabricatedCommand(0x02);
                }}
              >
                <FormattedMessage id={'app.hardWareStatus.straightLine'} />
              </Button>
              <Button
                style={{ marginLeft: 15 }}
                onClick={() => {
                  prefabricatedCommand(0x03);
                }}
              >
                <FormattedMessage id="monitor.remoteControl.followStraight" />
              </Button>
            </div>
            <Form.Item noStyle name={'distance'}>
              <InputNumber
                suffix={'mm'}
                style={{ width: 120 }}
                placeholder={formatMessage({ id: 'editor.config.distance' })}
              />
            </Form.Item>
          </Form.Item>

          {/* 小车转向 */}
          <Form.Item label={formatMessage({ id: 'monitor.remoteControl.agvTurn' })}>
            <div>
              <Button
                onClick={() => {
                  prefabricatedCommand(0x10, 0);
                }}
              >
                <FormattedMessage id={'app.direction.toTop'} />
              </Button>
              <Button
                style={{ margin: '0 15px' }}
                onClick={() => {
                  prefabricatedCommand(0x10, 180);
                }}
              >
                <FormattedMessage id={'app.direction.toBottom'} />
              </Button>
              <Button
                onClick={() => {
                  prefabricatedCommand(0x10, 270);
                }}
              >
                <FormattedMessage id={'app.direction.toLeft'} />
              </Button>
              <Button
                style={{ margin: '0 15px' }}
                onClick={() => {
                  prefabricatedCommand(0x10, 90);
                }}
              >
                <FormattedMessage id={'app.direction.toRight'} />
              </Button>
            </div>
          </Form.Item>
          {categoryPanel !== Category.SorterAGV ? (
            <>
              {/* 托盘旋转 */}
              <Form.Item label={formatMessage({ id: 'monitor.remoteControl.palletRotation' })}>
                <div className={styles.formRowPallet}>
                  <Button
                    onClick={() => {
                      prefabricatedCommand(0x11, 0);
                    }}
                  >
                    <FormattedMessage id={'monitor.remoteControl.asideToTop'} />
                  </Button>
                  <Button
                    style={{ margin: '0 15px' }}
                    onClick={() => {
                      prefabricatedCommand(0x11, 180);
                    }}
                  >
                    <FormattedMessage id={'monitor.remoteControl.asideToBottom'} />
                  </Button>
                  <Button
                    onClick={() => {
                      prefabricatedCommand(0x11, 270);
                    }}
                  >
                    <FormattedMessage id={'monitor.remoteControl.asideToLeft'} />
                  </Button>
                  <Button
                    style={{ margin: '0 15px' }}
                    onClick={() => {
                      prefabricatedCommand(0x11, 90);
                    }}
                  >
                    <FormattedMessage id={'monitor.remoteControl.asideToRight'} />
                  </Button>
                </div>
              </Form.Item>

              {/* 升降货架 */}
              <Form.Item label={formatMessage({ id: 'monitor.remoteControl.liftingShelf' })}>
                <div style={{ marginBottom: 5 }}>
                  <Button
                    onClick={() => {
                      prefabricatedCommand(0x20);
                    }}
                  >
                    <FormattedMessage id={'app.activity.jackingUp'} />
                  </Button>
                  <Button
                    style={{ marginLeft: 15 }}
                    onClick={() => {
                      prefabricatedCommand(0x21);
                    }}
                  >
                    <FormattedMessage id={'app.hardWareStatus.decline'} />
                  </Button>
                </div>
                <Form.Item noStyle name={'podId'}>
                  <InputNumber
                    style={{ width: 120 }}
                    placeholder={formatMessage({ id: 'app.pod.id' })}
                  />
                </Form.Item>
              </Form.Item>
            </>
          ) : null}

          {/* 自定义命令 */}
          <Form.Item label={formatMessage({ id: 'app.agv.batchCommand.Modal.Title' })}>
            <div>
              <Form.Item name={'hexCommand'}>
                <Input.TextArea style={{ width: 400, height: 95 }} />
              </Form.Item>
              <div style={{ marginTop: 10 }}>
                <Button onClick={sendCustomCommand}>
                  <SendOutlined /> <FormattedMessage id={'app.agv.batchCommand.Modal.confirm'} />
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  allAGVs: monitor.allAGVs,
  categoryPanel: monitor.categoryPanel,
}))(memo(RemoteControl));

import React, { memo } from 'react';
import { Button, Form, Input, InputNumber, message, Select } from 'antd';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { vehicleRemoteControl } from '@/services/monitorService';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, getFormLayout, getMapModalPosition, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { Category } from '../enums';
import styles from '../monitorLayout.module.less';

const { formItemLayout } = getFormLayout(4, 20);

const RemoteControl = (props) => {
  const { dispatch, allVehicles, categoryPanel } = props;
  const [formRef] = Form.useForm();

  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function prefabricatedCommand(code, value) {
    let params = null;
    const uniqueIds = formRef.getFieldValue('uniqueIds');
    if (isStrictNull(uniqueIds)) {
      formRef.validateFields(['uniqueIds'], { force: true });
      return;
    }
    switch (code) {
      // 小车直行
      case 0x02:
      case 0x03: {
        const distance = formRef.getFieldValue('distance');
        params = {
          uniqueIds,
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
          uniqueIds,
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
          uniqueIds,
          commandCode: code,
          commandParameter: podId,
          rawCommandHex: null,
        };
        break;
      }
      default:
        break;
    }
    const vehicle = true; // TODO:到底是多选还是单选//find(allVehicles, { uniqueId:uniqueIds });
    if (vehicle) {
      vehicleRemoteControl(vehicle.vehicleType, params).then((response) => {
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
    const uniqueIds = formRef.getFieldValue('uniqueIds');
    if (isStrictNull(uniqueIds)) {
      formRef.validateFields(['uniqueIds'], { force: true });
      return;
    }
    const vehicle = true; // TODO:find(allVehicles, { vehicleId: uniqueIds });
    const hexCommand = formRef.getFieldValue('hexCommand');
    const params = {
      uniqueIds,
      commandCode: null,
      commandParameter: null,
      rawCommandHex: hexCommand,
    };
    if (vehicle) {
      vehicleRemoteControl(vehicle.vehicleType, params).then((response) => {
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
            name={'uniqueIds'}
            label={formatMessage({ id: 'vehicle.id' })}
            rules={[{ required: true }]}
          >
            <Select
              allowClear
              showSearch
              size="small"
              maxTagCount={5}
              mode="multiple"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allVehicles.map((element) => (
                <Select.Option key={element.vehicleId} value={element.uniqueId}>
                  {`${element.vehicleId}-${element.vehicleType}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* 小车直行 */}
          <Form.Item label={formatMessage({ id: 'monitor.remoteControl.vehicleStraight' })}>
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
          <Form.Item label={formatMessage({ id: 'monitor.remoteControl.vehicleTurn' })}>
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
          {categoryPanel !== Category.SorterVehicle ? (
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
          <Form.Item label={formatMessage({ id: 'app.vehicle.batchCommand.Modal.Title' })}>
            <Form.Item name={'hexCommand'}>
              <Input.TextArea style={{ width: 400, height: 95 }} />
            </Form.Item>
            <Button onClick={sendCustomCommand}>
              <SendOutlined /> <FormattedMessage id={'app.vehicle.batchCommand.Modal.confirm'} />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ monitor }) => ({
  allVehicles: monitor.allVehicles,
  categoryPanel: monitor.categoryPanel,
}))(memo(RemoteControl));

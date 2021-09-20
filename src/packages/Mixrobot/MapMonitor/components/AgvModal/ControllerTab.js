import React, { memo } from 'react';
import { Button, Row, Form, InputNumber, Input, message } from 'antd';
import { FormattedMessage, formatMessage } from '@/utils/Lang';
import { fetchSendAgvHexCommand, fetchAgvEmptyRun } from './AgvModalApi';
import { dealResponse } from '@/utils/utils';
import styles from './ControllerTab.less';
import Config from '@/config';

const { AgvApiNameSpace } = Config;
const { Item: FormItem } = Form;

const FormItemLayout = { labelCol: { span: 5 }, wrapperCol: { span: 19 } };

const ControllerTab = (props) => {
  const { agv, sectionId } = props;
  const { agvId, agvType } = JSON.parse(agv);

  const [form] = Form.useForm();

  function prefabricatedCommand(code, value) {
    let params = null;
    switch (code) {
      // 小车直行
      case 0x02:
      case 0x03: {
        const distance = form.getFieldValue('distance');
        params = {
          sectionId,
          robotId: agvId,
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
          sectionId,
          robotId: agvId,
          commandCode: code,
          commandParameter: value,
          rawCommandHex: null,
        };
        break;
      }
      // 升降货架
      case 0x20:
      case 0x21: {
        const podId = form.getFieldValue('podId');
        params = {
          sectionId,
          robotId: agvId,
          commandCode: code,
          commandParameter: podId,
          rawCommandHex: null,
        };
        break;
      }
      default:
        break;
    }
    fetchSendAgvHexCommand(params, AgvApiNameSpace[agvType]).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.monitor.modal.controller.sendCommand.fail' }));
      } else {
        message.success(formatMessage({ id: 'app.monitor.modal.controller.sendCommand.success' }));
      }
    });
  }

  function sendCustomCommand() {
    const hexCommand = form.getFieldValue('hexCommand');
    const params = {
      sectionId,
      robotId: agvId,
      commandCode: null,
      commandParameter: null,
      rawCommandHex: hexCommand,
    };
    fetchSendAgvHexCommand(params, AgvApiNameSpace[agvType]).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.monitor.modal.controller.sendCommand.fail' }));
      } else {
        message.success(formatMessage({ id: 'app.monitor.modal.controller.sendCommand.success' }));
      }
    });
  }

  function emptyRun() {
    const targetCellId = form.getFieldValue('targetCellId');
    const params = { sectionId, targetCellId, robotId: agvId };
    fetchAgvEmptyRun(params, AgvApiNameSpace[agvType]).then((response) => {
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.monitor.modal.controller.empty.fail' }));
      } else {
        message.success(formatMessage({ id: 'app.monitor.modal.controller.empty.success' }));
      }
    });
  }

  return (
    <Form {...FormItemLayout} form={form}>
      {/* 小车空跑 */}
      <FormItem label={formatMessage({ id: 'app.monitor.modal.controller.emptyRun' })}>
        <Row>
          <FormItem noStyle name={'targetCellId'}>
            <InputNumber style={{ width: 120 }} />
          </FormItem>
          <Button onClick={emptyRun} style={{ marginLeft: 15 }}>
            <FormattedMessage id={'app.monitorOperation.emptyRun'} />
          </Button>
        </Row>
      </FormItem>
      {/* 小车直行 */}
      <FormItem label={formatMessage({ id: 'app.monitor.modal.controller.agvStraight' })}>
        <div className={styles.formRow} style={{ height: 80 }}>
          <div>
            <Button
              onClick={() => {
                prefabricatedCommand(0x02);
              }}
            >
              <FormattedMessage id={'app.monitor.modal.controller.straight'} />
            </Button>
            <Button
              style={{ marginLeft: 15 }}
              onClick={() => {
                prefabricatedCommand(0x03);
              }}
            >
              <FormattedMessage id={'app.monitor.modal.controller.followStraight'} />
            </Button>
          </div>
          <FormItem
            name={'distance'}
            initialValue={1350}
            label={formatMessage({ id: 'app.monitor.modal.controller.straight.inputLabel' })}
          >
            <InputNumber style={{ width: 120 }} />
          </FormItem>
        </div>
      </FormItem>
      {/* 小车转向 */}
      <FormItem label={formatMessage({ id: 'app.monitor.modal.controller.agvTurn' })}>
        <div className={styles.formRowTurn}>
          <Button
            onClick={() => {
              prefabricatedCommand(0x10, 0);
            }}
          >
            <FormattedMessage id={'app.activity.AVGTop'} />
          </Button>
          <Button
            onClick={() => {
              prefabricatedCommand(0x10, 180);
            }}
          >
            <FormattedMessage id={'app.activity.AVGBottom'} />
          </Button>
          <Button
            onClick={() => {
              prefabricatedCommand(0x10, 270);
            }}
          >
            <FormattedMessage id={'app.activity.AVGLeft'} />
          </Button>
          <Button
            onClick={() => {
              prefabricatedCommand(0x10, 90);
            }}
          >
            <FormattedMessage id={'app.activity.AVGRight'} />
          </Button>
        </div>
      </FormItem>
      {/* 托盘旋转 */}
      <FormItem label={formatMessage({ id: 'app.monitor.modal.controller.palletRotation' })}>
        <div className={styles.formRowPallet}>
          <Button
            onClick={() => {
              prefabricatedCommand(0x11, 0);
            }}
          >
            <FormattedMessage id={'app.monitor.modal.controller.AsideToTop'} />
          </Button>
          <Button
            onClick={() => {
              prefabricatedCommand(0x11, 180);
            }}
          >
            <FormattedMessage id={'app.monitor.modal.controller.AsideToBottom'} />
          </Button>
          <Button
            onClick={() => {
              prefabricatedCommand(0x11, 270);
            }}
          >
            <FormattedMessage id={'app.monitor.modal.controller.AsideToLeft'} />
          </Button>
          <Button
            onClick={() => {
              prefabricatedCommand(0x11, 90);
            }}
          >
            <FormattedMessage id={'app.monitor.modal.controller.AsideToRight'} />
          </Button>
        </div>
      </FormItem>
      {/* 升降货架 */}
      <FormItem label={formatMessage({ id: 'app.monitor.modal.controller.liftingShelf' })}>
        <div className={styles.formRow} style={{ height: 80 }}>
          <div>
            <Button
              onClick={() => {
                prefabricatedCommand(0x20);
              }}
            >
              <FormattedMessage id={'app.monitor.modal.controller.lifting'} />
            </Button>
            <Button
              style={{ marginLeft: 15 }}
              onClick={() => {
                prefabricatedCommand(0x21);
              }}
            >
              <FormattedMessage id={'app.monitor.modal.controller.down'} />
            </Button>
          </div>
          <FormItem name={'podId'} label={formatMessage({ id: 'app.common.podId' })}>
            <InputNumber style={{ width: 120 }} />
          </FormItem>
        </div>
      </FormItem>
      {/* 自定义命令 */}
      <FormItem label={formatMessage({ id: 'app.monitor.modal.controller.hexCommand' })}>
        <div className={styles.formRow}>
          <FormItem name={'hexCommand'}>
            <Input.TextArea style={{ width: 400, height: 95 }} />
          </FormItem>
          <div style={{ marginTop: 10 }}>
            <Button onClick={sendCustomCommand}>
              <FormattedMessage id={'app.monitorOperation.agvCommand.sendAgvCommand'} />
            </Button>
          </div>
        </div>
      </FormItem>
    </Form>
  );
};

export default memo(ControllerTab);

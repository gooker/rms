import React, { PureComponent } from 'react';
import { Form, InputNumber, Select, Button, message } from 'antd';
import { connect } from '@/utils/dva';
import { dealResponse, GMT2UserTimeZone, formatMessage } from '@/utils/utils';
import { autoReleaseToteTask, autoCallToteTask } from '@/services/monitor';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };
@connect(({ monitor }) => ({ monitor }))
class ToteAutomaticWorkstationTask extends PureComponent {
  formRef = React.createRef();

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/fetchAutomaticToteWorkstationTaskStatus',
    });
  };

  updateAutoReleaseWorkstationTask = () => {
    const {
      monitor: { automaticToteWorkstationTaskStatus },
    } = this.props;
    const { getFieldValue } = this.formRef.current;
    const delayReleaseSecondMill = getFieldValue('delayReleaseSecondMill');
    if (automaticToteWorkstationTaskStatus.isAutoRelease) {
      const params = { delayReleaseSecondMill, isAutoRelease: false };
      autoReleaseToteTask(params).then((res) => {
        if (
          !dealResponse(
            res,
            1,
            formatMessage({
              id: 'app.monitorOperation.automaticToteWorkstationTask.fetchAutoReleaseClose',
            }),
          )
        ) {
          this.getData();
        }
      });
    } else {
      if (delayReleaseSecondMill != null) {
        const params = { delayReleaseSecondMill, isAutoRelease: true };
        autoReleaseToteTask(params).then((res) => {
          if (
            !dealResponse(
              res,
              1,
              formatMessage({
                id: 'app.monitorOperation.automaticToteWorkstationTask.fetchAutoReleaseOpen',
              }),
            )
          ) {
            this.getData();
          }
        });
      } else {
        message.error(
          formatMessage({
            id: 'app.monitorOperation.automaticToteWorkstationTask.delayReleaseMassage',
          }),
        );
      }
    }
  };

  updateAutoCallPodToWorkstation = () => {
    const {
      monitor: { automaticToteWorkstationTaskStatus },
    } = this.props;
    const { validateFields } = this.formRef.current;
    if (automaticToteWorkstationTaskStatus?.isAutoCall) {
      const params = {
        isAutoCall: false,
      };
      autoCallToteTask(params).then((res) => {
        if (
          !dealResponse(
            res,
            1,
            formatMessage({
              id: 'app.monitorOperation.automaticToteWorkstationTask.fetchAutoCallOpen',
            }),
          )
        ) {
          this.getData();
          return false;
        }
      });
    } else {
      validateFields().then((value) => {
        const { workstationArray, maxTaskNum, maxToteNum } = value;
        const params = {
          workstationArray,
          maxTaskNum,
          isAutoCall: true,
          maxToteNum,
        };
        autoCallToteTask(params).then((res) => {
          if (
            !dealResponse(
              res,
              1,
              formatMessage({
                id: 'app.monitorOperation.automaticToteWorkstationTask.fetchAutoCallClose',
              }),
            )
          ) {
            this.getData();
            return false;
          }
        });
      });
    }
  };

  render() {
    const {
      workstationList,
      monitor: { automaticToteWorkstationTaskStatus },
    } = this.props;
    const locale = window.localStorage.getItem('umi_locale') || 'zh-CN';
    return (
      <Form ref={this.formRef}>
        <Form.Item
          {...layout}
          name={'workstationArray'}
          initialValue={automaticToteWorkstationTaskStatus?.autoCallWorkStationFilterArray}
          label={formatMessage({ id: 'app.monitorOperation.workstation' })}
        >
          <Select
            mode="multiple"
            placeholder={formatMessage({
              id: 'app.monitorOperation.automaticLatentWorkStationTask.defaultAllStation',
            })}
            style={{ width: '80%' }}
          >
            {workstationList.map((record) => {
              return (
                <Select.Option value={`${record.stopCellId}-${record.direction}`} key={record}>
                  {record.stopCellId}-{record.angle}°
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          {...layout}
          name={'maxTaskNum'}
          initialValue={automaticToteWorkstationTaskStatus?.maxTaskNum}
          label={formatMessage({
            id: 'app.monitorOperation.automaticLatentWorkStationTask.maxPodNum',
          })}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          {...layout}
          name={'maxToteNum'}
          initialValue={automaticToteWorkstationTaskStatus?.maxToteNum}
          label={formatMessage({
            id: 'app.monitorOperation.automaticToteWorkstationTask.toteUpperLimit',
          })}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item {...noLabelLayout}>
          <Button
            type={automaticToteWorkstationTaskStatus?.isAutoCall ? 'danger' : 'default'}
            onClick={this.updateAutoCallPodToWorkstation}
          >
            {automaticToteWorkstationTaskStatus.isAutoCall
              ? formatMessage({
                  id: 'app.monitorOperation.automaticToteWorkstationTask.cancelFetchAutoCall',
                })
              : formatMessage({
                  id: 'app.monitorOperation.automaticToteWorkstationTask.fetchAutoCall',
                })}
          </Button>
        </Form.Item>

        <Form.Item
          {...(locale === 'zh-CN'
            ? layout
            : {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
              })}
          name={'delayReleaseSecondMill'}
          initialValue={automaticToteWorkstationTaskStatus?.delayReleaseSecondMill || 3000}
          label={formatMessage({
            id: 'app.monitorOperation.automaticToteWorkstationTask.delayRelease',
          })}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item {...noLabelLayout}>
          <Button
            type={automaticToteWorkstationTaskStatus?.isAutoRelease ? 'danger' : 'default'}
            onClick={this.updateAutoReleaseWorkstationTask}
          >
            {automaticToteWorkstationTaskStatus?.isAutoRelease
              ? formatMessage({
                  id: 'app.monitorOperation.automaticToteWorkstationTask.cancelFetchAutoRelease',
                })
              : formatMessage({
                  id: 'app.monitorOperation.automaticToteWorkstationTask.fetchAutoRelease',
                })}
          </Button>
        </Form.Item>

        <Form.Item
          {...layout}
          label={formatMessage({
            id: 'app.monitorOperation.automaticToteWorkstationTask.lastOperator',
          })}
        >
          {automaticToteWorkstationTaskStatus?.updatedByUser}
        </Form.Item>
        <Form.Item
          {...layout}
          label={formatMessage({
            id: 'app.monitorOperation.automaticToteWorkstationTask.lastOperateDate',
          })}
        >
          {GMT2UserTimeZone(automaticToteWorkstationTaskStatus?.updateTime).format(
            'YYYY-MM-DD HH:mm',
          )}
        </Form.Item>
      </Form>
    );
  }
}
export default ToteAutomaticWorkstationTask;
